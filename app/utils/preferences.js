// Copyright (c) 2019-present Smart.Inc. All Rights Reserved.
// See LICENSE.txt for license information.

export function buildPreference(category, userId, name, value = 'true') {
    return {
        user_id: userId,
        category,
        name,
        value,
    };
}