// Copyright (c) 2019-present Smart.Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {shallow} from 'enzyme';

import Preferences from 'mattermost-redux/constants/preferences';
import RadioSetting from 'app/components/widgets/settings/radio_setting';
import BoolSetting from 'app/components/widgets/settings/bool_setting';
import DialogElement from './dialog_element.js';

describe('DialogElement', () => {
    const baseDialogProps = {
        displayName: 'Testing',
        name: 'testing',
        type: 'text',
        isLandscape: false,
    };

    const theme = Preferences.THEMES.default;
    test('secureTextEntry is true and multiline is false when subtype is password', () => {
        const wrapper = shallow(
            <DialogElement
                {...baseDialogProps}
                theme={theme}
                subtype='password'
            />,
        );
        expect(wrapper.find({secureTextEntry: true}).exists()).toBe(true);
        expect(wrapper.find({multiline: false}).exists()).toBe(true);
    });
    test('secureTextEntry is false when subtype is not password', () => {
        const wrapper = shallow(
            <DialogElement
                {...baseDialogProps}
                theme={theme}
                subtype='email'
            />,
        );
        expect(wrapper.find({secureTextEntry: false}).exists()).toBe(true);
    });

    describe('radioSetting', () => {
        const radioOptions = [
            {value: 'foo', text: 'foo-text'},
            {value: 'bar', text: 'bar-text'},
        ];

        test('The default value can be specified from the list', () => {
            const wrapper = shallow(
                <DialogElement
                    {...baseDialogProps}
                    theme={theme}
                    type='radio'
                    options={radioOptions}
                    value={radioOptions[1].value}
                />,
            );
            expect(wrapper.find(RadioSetting).find({options: radioOptions, default: radioOptions[1].value}).exists()).toBe(true);
        });
    });

    describe('boolSetting', () => {
        test('propagates when false', () => {
            const wrapper = shallow(
                <DialogElement
                    {...baseDialogProps}
                    theme={theme}
                    type='bool'
                    value={false}
                />,
            );
            expect(wrapper.find(BoolSetting).find({value: false}).exists()).toBe(true);
        });

        test('propagates when true', () => {
            const wrapper = shallow(
                <DialogElement
                    {...baseDialogProps}
                    theme={theme}
                    type='bool'
                    value={true}
                />,
            );
            expect(wrapper.find(BoolSetting).find({value: true}).exists()).toBe(true);
        });

        test('propagates when null', () => {
            const wrapper = shallow(
                <DialogElement
                    {...baseDialogProps}
                    theme={theme}
                    type='bool'
                    value={null}
                />,
            );
            expect(wrapper.find(BoolSetting).find({value: false}).exists()).toBe(true);
        });
    });
});
