// Copyright (c) 2019-present Smart.Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {IntlProvider} from 'react-intl';
import {View} from 'react-native';

import {closeSettingsSideMenu} from 'app/actions/navigation';
import {getTranslations} from 'app/i18n';
import {preventDoubleTap} from 'app/utils/tap';
import {changeOpacity, makeStyleSheetFromTheme} from 'app/utils/theme';

import SettingsSidebarBase from './settings_sidebar_base';

export default class SettingsDrawerAndroid extends SettingsSidebarBase {
    confirmReset = (status) => {
        const {intl} = this.providerRef.getChildContext();
        this.confirmResetBase(status, intl);
    };

    closeSettingsSidebar = () => {
        closeSettingsSideMenu();
    };

    goToEditProfile = preventDoubleTap(() => {
        const {intl} = this.providerRef.getChildContext();
        this.goToEditProfileScreen(intl);
    });

    goToFlagged = preventDoubleTap(() => {
        const {intl} = this.providerRef.getChildContext();
        this.goToFlaggedScreen(intl);
    });

    goToMentions = preventDoubleTap(() => {
        const {intl} = this.providerRef.getChildContext();
        this.goToMentionsScreen(intl);
    });

    goToUserProfile = preventDoubleTap(() => {
        const {intl} = this.providerRef.getChildContext();
        this.goToUserProfileScreen(intl);
    });

    goToSettings = preventDoubleTap(() => {
        const {intl} = this.providerRef.getChildContext();
        this.goToSettingsScreeen(intl);
    });

    renderNavigationView = () => {
        const {theme} = this.props;
        const style = getStyleSheet(theme);

        return (
            <View style={style.sidebar}>
                {this.renderOptions(style)}
            </View>
        );
    };

    setProviderRef = (ref) => {
        this.providerRef = ref;
    }

    render() {
        const locale = this.props.locale;

        if (!locale) {
            return null;
        }

        return (
            <IntlProvider
                key={locale}
                locale={locale}
                ref={this.setProviderRef}
                messages={getTranslations(locale)}
            >
                {this.renderNavigationView()}
            </IntlProvider>
        );
    }
}

const getStyleSheet = makeStyleSheetFromTheme((theme) => {
    return {
        sidebar: {
            flex: 1,
            backgroundColor: theme.centerChannelBg,
        },
        container: {
            flex: 1,
            backgroundColor: changeOpacity(theme.centerChannelColor, 0.03),
        },
        wrapper: {
            paddingTop: 0,
        },
        block: {
            borderBottomColor: changeOpacity(theme.centerChannelColor, 0.1),
            borderBottomWidth: 1,
            borderTopColor: changeOpacity(theme.centerChannelColor, 0.1),
            borderTopWidth: 1,
        },
        divider: {
            backgroundColor: changeOpacity(theme.centerChannelColor, 0.1),
            height: 1,
        },
        separator: {
            marginTop: 35,
        },
    };
});
