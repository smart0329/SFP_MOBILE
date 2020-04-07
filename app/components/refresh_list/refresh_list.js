// Copyright (c) 2019-present Smart.Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {PureComponent} from 'react';
import {RefreshControl} from 'react-native';

export default class RefreshList extends PureComponent {
    static propTypes = {
        ...RefreshControl.propTypes,
    };

    render() {
        return (
            <RefreshControl
                {...this.props}
            />
        );
    }
}
