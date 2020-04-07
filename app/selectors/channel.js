// Copyright (c) 2019-present Smart.Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {createSelector} from 'reselect';

import {getCurrentUserId, getUser} from 'mattermost-redux/selectors/entities/users';
import {getChannelByName} from 'mattermost-redux/selectors/entities/channels';
import {getTeamByName} from 'mattermost-redux/selectors/entities/teams';

const getOtherUserIdForDm = createSelector(
    (state, channel) => channel,
    getCurrentUserId,
    (channel, currentUserId) => {
        if (!channel) {
            return '';
        }

        return channel.name.split('__').find((m) => m !== currentUserId) || currentUserId;
    },
);

export const getChannelMembersForDm = createSelector(
    (state, channel) => getUser(state, getOtherUserIdForDm(state, channel)),
    (otherUser) => {
        if (!otherUser) {
            return [];
        }

        return [otherUser];
    },
);

export const getChannelNameForSearchAutocomplete = createSelector(
    (state, channelId) => state.entities.channels.channels[channelId],
    (channel) => {
        if (channel && channel.display_name) {
            return channel.display_name;
        }
        return '';
    },
);

const getTeam = (state, channelName, teamName) => getTeamByName(state, teamName);
const getChannel = (state, channelName) => getChannelByName(state, channelName);

export const getChannelReachable = createSelector(
    getTeam,
    getChannel,
    (team, channel) => team && channel,
);
