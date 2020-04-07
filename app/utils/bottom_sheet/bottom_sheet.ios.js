// Copyright (c) 2019-present Smart.Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {ActionSheetIOS} from 'react-native';

export default {
    showBottomSheetWithOptions: (options, callback) => {
        return ActionSheetIOS.showActionSheetWithOptions(options, callback);
    },
};
