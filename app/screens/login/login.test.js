// Copyright (c) 2019-present Smart.Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import FormattedText from 'app/components/formatted_text';

import {shallowWithIntl} from 'test/intl-test-helper';

import * as NavigationActions from 'app/actions/navigation';

import {mfaExpectedErrors} from 'app/screens/login/login';
import Login from './login';

describe('Login', () => {
    const baseProps = {
        config: {
            EnableSignInWithEmail: 'true',
            EnableSignInWithUsername: 'true',
        },
        license: {
            IsLicensed: 'false',
        },
        loginId: '',
        password: '',
        loginRequest: {},
        actions: {
            handleLoginIdChanged: jest.fn(),
            handlePasswordChanged: jest.fn(),
            handleSuccessfulLogin: jest.fn(),
            scheduleExpiredNotification: jest.fn(),
            login: jest.fn(),
        },
        isLandscape: false,
    };

    test('should show "I forgot my password" with only email login enabled', () => {
        const props = {
            ...baseProps,
            config: {
                ...baseProps.config,
                EnableSignInWithUsername: 'false',
            },
        };

        const wrapper = shallowWithIntl(<Login {...props}/>);

        expect(wrapper.find(FormattedText).find({id: 'login.forgot'}).exists()).toBe(true);
    });

    test('should show "I forgot my password" with only username login enabled', () => {
        const props = {
            ...baseProps,
            config: {
                ...baseProps.config,
                EnableSignInWithEmail: 'false',
            },
        };

        const wrapper = shallowWithIntl(<Login {...props}/>);

        expect(wrapper.find(FormattedText).find({id: 'login.forgot'}).exists()).toBe(true);
    });

    test('should not show "I forgot my password" without email or username login enabled', () => {
        const props = {
            ...baseProps,
            config: {
                ...baseProps.config,
                EnableSignInWithEmail: 'false',
                EnableSignInWithUsername: 'false',
            },
        };

        const wrapper = shallowWithIntl(<Login {...props}/>);

        expect(wrapper.find(FormattedText).find({id: 'login.forgot'}).exists()).toBe(false);
    });

    test('should go to MFA screen when login response returns MFA error', () => {
        const goToScreen = jest.spyOn(NavigationActions, 'goToScreen');

        const mfaError = {
            error: {
                server_error_id: mfaExpectedErrors[0],
            },
        };

        const wrapper = shallowWithIntl(<Login {...baseProps}/>);
        wrapper.instance().checkLoginResponse(mfaError);

        expect(goToScreen).
            toHaveBeenCalledWith(
                'MFA',
                'Multi-factor Authentication',
                {onMfaComplete: wrapper.instance().checkLoginResponse},
            );
    });

    test('should go to ForgotPassword screen when forgotPassword is called', () => {
        const goToScreen = jest.spyOn(NavigationActions, 'goToScreen');

        const wrapper = shallowWithIntl(<Login {...baseProps}/>);
        wrapper.instance().forgotPassword();

        expect(goToScreen).
            toHaveBeenCalledWith(
                'ForgotPassword',
                'Password Reset',
            );
    });
});
