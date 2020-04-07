// Copyright (c) 2019-present Smart.Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {addChannelMember} from 'mattermost-redux/actions/channels';

export function handleAddChannelMembers(channelId, members) {
    return async (dispatch) => {
        try {
            const requests = members.map((m) => dispatch(addChannelMember(channelId, m)));

            return await Promise.all(requests);
        } catch (error) {
            return error;
        }
    };
}
