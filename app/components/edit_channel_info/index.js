// Copyright (c) 2019-present Smart.Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';

import {isLandscape} from 'app/selectors/device';
import EditChannelInfo from './edit_channel_info';

function mapStateToProps(state) {
    return {
        isLandscape: isLandscape(state),
    };
}

export default connect(mapStateToProps)(EditChannelInfo);
