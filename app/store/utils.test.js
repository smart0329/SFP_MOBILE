// Copyright (c) 2019-present Smart.Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import initialState from 'app/initial_state';
import {getStateForReset} from 'app/store/utils';

/*
const {currentUserId} = currentState.entities.users;
    const currentUserProfile = currentState.entities.users.profiles[currentUserId];
    const {currentTeamId} = currentState.entities.teams;
    const myPreferences = {...currentState.entities.preferences.myPreferences};
    Object.keys(myPreferences).forEach((key) => {
        if (!key.startsWith('theme--')) {
            Reflect.deleteProperty(myPreferences, key);
        }
    });
*/
describe('getStateForReset', () => {
    const currentUserId = 'current-user-id';
    const otherUserId = 'other-user-id';
    const currentTeamId = 'current-team-id';
    const currentState = {
        entities: {
            users: {
                currentUserId,
                profiles: {
                    [currentUserId]: {},
                    [otherUserId]: {},
                },
            },
            teams: {
                currentTeamId,
            },
            preferences: {
                myPreferences: {
                    'channel_open_time--1': {},
                    'channel_open_time--2': {},
                    'direct_channel_show--1': {},
                    'direct_channel_show--2': {},
                    'display_settings--1': {},
                    'display_settings--2': {},
                    'favorite_channel--1': {},
                    'favorite_channel--2': {},
                    'flagged_post--1': {},
                    'flagged_post--2': {},
                    'group_channel_show--1': {},
                    'group_channel_show--2': {},
                    'tutorial_step--1': {},
                    'tutorial_step--2': {},
                    'theme--1': {},
                    'theme--2': {},
                },
            },
        },
    };

    it('should keep the current user\'s ID and profile', () => {
        const resetState = getStateForReset(initialState, currentState);
        const {users} = resetState.entities;
        expect(users.currentUserId).toEqual(currentUserId);
        expect(Object.keys(users.profiles).length).toEqual(1);
        expect(users.profiles[currentUserId]).toBeDefined();
    });

    it('should keep the current team ID', () => {
        const resetState = getStateForReset(initialState, currentState);
        const {teams} = resetState.entities;
        expect(teams.currentTeamId).toEqual(currentTeamId);
    });

    it('should keep theme preferences', () => {
        const resetState = getStateForReset(initialState, currentState);
        const {myPreferences} = resetState.entities.preferences;
        const preferenceKeys = Object.keys(myPreferences);
        const themeKeys = preferenceKeys.filter((key) => key.startsWith('theme--'));
        expect(themeKeys.length).not.toEqual(0);
        expect(themeKeys.length).toEqual(preferenceKeys.length);
    });
});
