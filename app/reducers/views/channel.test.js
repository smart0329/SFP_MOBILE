// Copyright (c) 2019-present Smart.Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import channelReducer from './channel';

describe('Reducers.channel', () => {
    const initialState = {
        displayName: '',
        drafts: {},
        loading: false,
        refreshing: false,
        loadingPosts: {},
        lastGetPosts: {},
        retryFailed: false,
        loadMorePostsVisible: true,
        lastChannelViewTime: {},
        keepChannelIdAsUnread: null,
    };

    test('Initial state', () => {
        const nextState = channelReducer(
            {
                displayName: '',
                drafts: {},
                loading: false,
                refreshing: false,
                loadingPosts: {},
                lastGetPosts: {},
                retryFailed: false,
                loadMorePostsVisible: true,
                lastChannelViewTime: {},
                keepChannelIdAsUnread: null,
            },
            {},
        );

        expect(nextState).toEqual(initialState);
    });
});
