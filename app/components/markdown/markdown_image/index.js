// Copyright (c) 2019-present Smart.Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';

import {getCurrentUrl} from 'mattermost-redux/selectors/entities/general';

import {getDimensions} from 'app/selectors/device';

import MarkdownImage from './markdown_image';

function mapStateToProps(state) {
    return {
        ...getDimensions(state),
        serverURL: getCurrentUrl(state),
    };
}

export default connect(mapStateToProps)(MarkdownImage);
