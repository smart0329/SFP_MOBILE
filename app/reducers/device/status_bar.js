// Copyright (c) 2019-present Smart.Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {DeviceTypes} from 'app/constants';

export default function height(state = 0, action) {
    switch (action.type) {
    case DeviceTypes.STATUSBAR_HEIGHT_CHANGED:
        return action.data;
    default:
        return state;
    }
}

