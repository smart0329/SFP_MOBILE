// Copyright (c) 2019-present Smart.Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import initialState from 'app/initial_state';
import configureAppStore from './store';

const store = configureAppStore(initialState);

export default store;
