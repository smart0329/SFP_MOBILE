// Copyright (c) 2019-present Smart.Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {DeviceTypes} from 'app/constants';

export default function orientation(state = 'PORTRAIT', action) {
    switch (action.type) {
    case DeviceTypes.DEVICE_ORIENTATION_CHANGED:
        return action.data;
    }

    return state;
}

