// Copyright (c) 2019-present Smart.Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {scheduleExpiredNotification} from 'app/actions/views/login';
import {ssoLogin} from 'app/actions/views/user';
import {getTheme} from 'mattermost-redux/selectors/entities/preferences';
import {isLandscape} from 'app/selectors/device';

import SSO from './sso';

function mapStateToProps(state) {
    return {
        ...state.views.selectServer,
        theme: getTheme(state),
        isLandscape: isLandscape(state),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            scheduleExpiredNotification,
            ssoLogin,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SSO);
