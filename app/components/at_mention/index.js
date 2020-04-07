// Copyright (c) 2019-present Smart.Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';

import {getUsersByUsername, getCurrentUserMentionKeys} from 'mattermost-redux/selectors/entities/users';

import {getTeammateNameDisplaySetting, getTheme} from 'mattermost-redux/selectors/entities/preferences';

import AtMention from './at_mention';

function mapStateToProps(state) {
    return {
        theme: getTheme(state),
        usersByUsername: getUsersByUsername(state),
        mentionKeys: getCurrentUserMentionKeys(state),
        teammateNameDisplay: getTeammateNameDisplaySetting(state),
    };
}

export default connect(mapStateToProps)(AtMention);
