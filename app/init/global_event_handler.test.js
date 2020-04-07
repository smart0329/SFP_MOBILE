// Copyright (c) 2019-present Smart.Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Alert} from 'react-native';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import semver from 'semver/preload';

import intitialState from 'app/initial_state';
import PushNotification from 'app/push_notifications';
import mattermostBucket from 'app/mattermost_bucket';
import * as I18n from 'app/i18n';

import {MinServerVersion} from 'assets/config';

import GlobalEventHandler from './global_event_handler';

jest.mock('app/init/credentials', () => ({
    getCurrentServerUrl: jest.fn().mockResolvedValue(''),
    getAppCredentials: jest.fn(),
    removeAppCredentials: jest.fn(),
}));

jest.mock('app/utils/error_handling', () => ({
    default: {
        initializeErrorHandling: jest.fn(),
    },
}));

jest.mock('react-native-notifications', () => ({
    addEventListener: jest.fn(),
    cancelAllLocalNotifications: jest.fn(),
    setBadgesCount: jest.fn(),
    NotificationAction: jest.fn(),
    NotificationCategory: jest.fn(),
}));

jest.mock('react-native-status-bar-size', () => ({
    addEventListener: jest.fn(),
}));

jest.mock('mattermost-redux/actions/general', () => ({
    setAppState: jest.fn(),
    setServerVersion: jest.fn().mockReturnValue('setServerVersion'),
}));

jest.mock('app/actions/views/root', () => ({
    startDataCleanup: jest.fn(),
    loadConfigAndLicense: jest.fn().mockReturnValue('loadConfigAndLicense'),
}));

const mockStore = configureMockStore([thunk]);
const store = mockStore(intitialState);
GlobalEventHandler.store = store;

// TODO: Add Android test as part of https://mattermost.atlassian.net/browse/MM-17110
describe('GlobalEventHandler', () => {
    it('should clear notifications and reset moment locale on logout', async () => {
        const clearNotifications = jest.spyOn(PushNotification, 'clearNotifications');
        const resetMomentLocale = jest.spyOn(I18n, 'resetMomentLocale');
        const removePreference = jest.spyOn(mattermostBucket, 'removePreference');
        const removeFile = jest.spyOn(mattermostBucket, 'removeFile');

        await GlobalEventHandler.onLogout();
        expect(clearNotifications).toHaveBeenCalled();
        expect(resetMomentLocale).toHaveBeenCalled();
        expect(removePreference).toHaveBeenCalledWith('cert');
        expect(removeFile).toHaveBeenCalledWith('entities');
    });

    it('should call onAppStateChange after configuration', () => {
        const onAppStateChange = jest.spyOn(GlobalEventHandler, 'onAppStateChange');

        GlobalEventHandler.configure({store});
        expect(GlobalEventHandler.store).not.toBeNull();
        expect(onAppStateChange).toHaveBeenCalledWith('active');
    });

    it('should handle onAppStateChange to active if the store set', () => {
        const appActive = jest.spyOn(GlobalEventHandler, 'appActive');
        const appInactive = jest.spyOn(GlobalEventHandler, 'appInactive');
        expect(GlobalEventHandler.store).not.toBeNull();

        GlobalEventHandler.onAppStateChange('active');
        expect(appActive).toHaveBeenCalled();
        expect(appInactive).not.toHaveBeenCalled();
    });

    it('should handle onAppStateChange to background if the store set', () => {
        const appActive = jest.spyOn(GlobalEventHandler, 'appActive');
        const appInactive = jest.spyOn(GlobalEventHandler, 'appInactive');
        expect(GlobalEventHandler.store).not.toBeNull();

        GlobalEventHandler.onAppStateChange('background');
        expect(appActive).not.toHaveBeenCalled();
        expect(appInactive).toHaveBeenCalled();
    });

    it('should not handle onAppStateChange if the store is not set', () => {
        const appActive = jest.spyOn(GlobalEventHandler, 'appActive');
        const appInactive = jest.spyOn(GlobalEventHandler, 'appInactive');
        GlobalEventHandler.store = null;

        GlobalEventHandler.onAppStateChange('active');
        expect(appActive).not.toHaveBeenCalled();
        expect(appInactive).not.toHaveBeenCalled();

        GlobalEventHandler.onAppStateChange('background');
        expect(appActive).not.toHaveBeenCalled();
        expect(appInactive).not.toHaveBeenCalled();
    });

    it('should set the user TimeZone when the app becomes active', () => {
        const onAppStateChange = jest.spyOn(GlobalEventHandler, 'onAppStateChange');
        const setUserTimezone = jest.spyOn(GlobalEventHandler, 'setUserTimezone');

        GlobalEventHandler.configure({store});
        expect(GlobalEventHandler.store).not.toBeNull();
        expect(onAppStateChange).toHaveBeenCalledWith('active');
        expect(setUserTimezone).toHaveBeenCalledTimes(1);
    });

    describe('onServerVersionChanged', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        const minVersion = semver.parse(MinServerVersion);
        const currentUserId = 'current-user-id';
        GlobalEventHandler.store.getState = jest.fn().mockReturnValue({
            entities: {
                users: {
                    currentUserId,
                    profiles: {
                        [currentUserId]: {},
                    },
                },
            },
        });
        GlobalEventHandler.store.dispatch = jest.fn().mockReturnValue({});

        const dispatch = jest.spyOn(GlobalEventHandler.store, 'dispatch');
        const configureAnalytics = jest.spyOn(GlobalEventHandler, 'configureAnalytics');
        const alert = jest.spyOn(Alert, 'alert');

        it('should dispatch on invalid version with currentUserId', async () => {
            const invalidVersion = 'a.b.c';
            await GlobalEventHandler.onServerVersionChanged(invalidVersion);

            expect(alert).not.toHaveBeenCalled();
            expect(dispatch).toHaveBeenCalledTimes(2);
            expect(dispatch).toHaveBeenCalledWith('setServerVersion');
            expect(dispatch).toHaveBeenCalledWith('loadConfigAndLicense');
            expect(configureAnalytics).toHaveBeenCalledTimes(1);
        });

        it('should dispatch on gte min server version  with currentUserId', async () => {
            let version = minVersion.version;
            await GlobalEventHandler.onServerVersionChanged(version);
            expect(alert).not.toHaveBeenCalled();
            expect(dispatch).toHaveBeenCalledTimes(2);
            expect(dispatch).toHaveBeenCalledWith('setServerVersion');
            expect(dispatch).toHaveBeenCalledWith('loadConfigAndLicense');
            expect(configureAnalytics).toHaveBeenCalledTimes(1);

            version = semver.coerce(minVersion.major + 1).version;
            await GlobalEventHandler.onServerVersionChanged(version);
            expect(alert).not.toHaveBeenCalled();
            expect(dispatch).toHaveBeenCalledTimes(4);
            expect(configureAnalytics).toHaveBeenCalledTimes(2);
        });

        it('should alert on lt min server version', async () => {
            const version = semver.coerce(minVersion.major - 1).version;
            await GlobalEventHandler.onServerVersionChanged(version);
            expect(alert).toHaveBeenCalled();
            expect(dispatch).not.toHaveBeenCalled();
            expect(configureAnalytics).not.toHaveBeenCalled();
        });

        it('should not alert nor dispatch on empty, null, undefined server version', async () => {
            let version;
            await GlobalEventHandler.onServerVersionChanged(version);
            expect(alert).not.toHaveBeenCalled();
            expect(dispatch).not.toHaveBeenCalled();
            expect(configureAnalytics).not.toHaveBeenCalled();

            version = '';
            await GlobalEventHandler.onServerVersionChanged(version);
            expect(alert).not.toHaveBeenCalled();
            expect(dispatch).not.toHaveBeenCalled();
            expect(configureAnalytics).not.toHaveBeenCalled();

            version = null;
            await GlobalEventHandler.onServerVersionChanged(version);
            expect(alert).not.toHaveBeenCalled();
            expect(dispatch).not.toHaveBeenCalled();
            expect(configureAnalytics).not.toHaveBeenCalled();
        });
    });
});
