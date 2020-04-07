// Copyright (c) 2019-present Smart.Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';

import {getTheme} from 'mattermost-redux/selectors/entities/preferences';
import {isLandscape} from 'app/selectors/device';

import NotificationSettingsMentionsKeywords from './notification_settings_mentions_keywords';

function mapStateToProps(state) {
    return {
        theme: getTheme(state),
        isLandscape: isLandscape(state),
    };
}

export default connect(mapStateToProps)(NotificationSettingsMentionsKeywords);
