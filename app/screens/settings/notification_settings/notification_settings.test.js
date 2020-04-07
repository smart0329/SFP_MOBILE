// Copyright (c) 2019-present Smart.Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import Preferences from 'mattermost-redux/constants/preferences';

import {shallowWithIntl} from 'test/intl-test-helper';

import NotificationSettings from './notification_settings.js';

import {getNotificationProps} from 'app/utils/notify_props';

describe('NotificationSettings', () => {
    const currentUser = {id: 'current_user_id'};
    const baseProps = {
        actions: {
            updateMe: jest.fn(),
        },
        componentId: 'component-id',
        currentUser,
        theme: Preferences.THEMES.default,
        updateMeRequest: {},
        currentUserStatus: 'status',
        enableAutoResponder: false,
        isLandscape: false,
    };

    test('should match snapshot', () => {
        const wrapper = shallowWithIntl(
            <NotificationSettings {...baseProps}/>,
        );

        expect(wrapper.instance()).toMatchSnapshot();
    });

    test('should include previous notification props when saving new ones', () => {
        const wrapper = shallowWithIntl(
            <NotificationSettings {...baseProps}/>,
        );

        const instance = wrapper.instance();

        const defaultNotifyProps = getNotificationProps(currentUser);
        instance.saveNotificationProps(defaultNotifyProps);
        expect(baseProps.actions.updateMe).toHaveBeenCalledTimes(0);

        const newProps = {new: 'new'};
        instance.saveNotificationProps(newProps);
        expect(baseProps.actions.updateMe).toHaveBeenCalledTimes(1);
        expect(baseProps.actions.updateMe).toHaveBeenCalledWith({
            notify_props: {
                ...defaultNotifyProps,
                ...newProps,
            },
        });
    });
});
