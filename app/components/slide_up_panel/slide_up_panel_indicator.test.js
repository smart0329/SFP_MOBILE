// Copyright (c) 2019-present Smart.Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {shallow} from 'enzyme';

import SlideUpPanelIndicator from './slide_up_panel_indicator';

describe('SlideUpPanelIndicator', () => {
    const baseProps = {
        dragIndicatorColor: '#fff',
    };

    test('should match snapshot', () => {
        const wrapper = shallow(
            <SlideUpPanelIndicator {...baseProps}/>,
        );

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
