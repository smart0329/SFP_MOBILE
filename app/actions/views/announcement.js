// Copyright (c) 2019-present Smart.Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {ViewTypes} from 'app/constants';

export function dismissBanner(text) {
    return {
        type: ViewTypes.ANNOUNCEMENT_BANNER,
        data: text,
    };
}
