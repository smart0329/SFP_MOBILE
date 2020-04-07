// Copyright (c) 2019-present Smart.Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React from 'react';
import {shallow} from 'enzyme';

import CustomTextInput from './custom_text_input';

describe('CustomTextInput', () => {
    test('should render custom text input', () => {
        const onPaste = jest.fn();
        const text = 'My Text';
        const component = shallow(
            <CustomTextInput onPaste={onPaste}>{text}</CustomTextInput>,
        );
        expect(component).toMatchSnapshot();
    });
});
