// Copyright (c) 2019-present Smart.Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {userTyping as wsUserTyping} from 'mattermost-redux/actions/websocket';

export function userTyping(channelId, rootId) {
    return async (dispatch, getState) => {
        const {websocket} = getState();
        if (websocket.connected) {
            wsUserTyping(channelId, rootId)(dispatch, getState);
        }
    };
}
