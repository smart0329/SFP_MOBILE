// Copyright (c) 2019-present Smart.Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';

import LoadMorePosts from './load_more_posts';

function mapStateToProps(state, ownProps) {
    return {
        loading: Boolean(state.views.channel.loadingPosts[ownProps.channelId]),
    };
}

export default connect(mapStateToProps)(LoadMorePosts);
