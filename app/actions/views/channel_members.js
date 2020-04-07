// Copyright (c) 2019-present Smart.Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {removeChannelMember} from 'mattermost-redux/actions/channels';

export function handleRemoveChannelMembers(channelId, members) {
    return async (dispatch, getState) => {
        try {
            const requests = members.map((m) => dispatch(removeChannelMember(channelId, m, getState)));

            return await Promise.all(requests);
        } catch (error) {
            return error;
        }
    };
}
