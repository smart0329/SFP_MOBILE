// Copyright (c) 2019-present Smart.Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {intlShape} from 'react-intl';
import {Dimensions, Keyboard, View} from 'react-native';

import EventEmitter from 'mattermost-redux/utils/event_emitter';

import SafeAreaView from 'app/components/safe_area_view';
import DrawerLayout, {DRAWER_INITIAL_OFFSET, TABLET_WIDTH} from 'app/components/sidebars/drawer_layout';
import {DeviceTypes, NavigationTypes} from 'app/constants';
import {preventDoubleTap} from 'app/utils/tap';
import {changeOpacity, makeStyleSheetFromTheme} from 'app/utils/theme';

import SettingsSidebarBase from './settings_sidebar_base';

export default class SettingsDrawer extends SettingsSidebarBase {
    static contextTypes = {
        intl: intlShape,
    };

    constructor(props) {
        super(props);

        this.state = {
            deviceWidth: Dimensions.get('window').width,
            openDrawerOffset: DRAWER_INITIAL_OFFSET,
        };
    }

    componentDidMount() {
        super.componentDidMount();

        this.handleDimensions({window: Dimensions.get('window')});
        Dimensions.addEventListener('change', this.handleDimensions);
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        Dimensions.removeEventListener('change', this.handleDimensions);
    }

    setDrawerRef = (ref) => {
        this.drawerRef = ref;
    }

    confirmReset = (status) => {
        const {intl} = this.context;
        this.confirmResetBase(status, intl);
    };

    closeSettingsSidebar = () => {
        if (this.drawerRef && this.drawerOpened) {
            this.drawerRef.closeDrawer();
        }
    };

    open = () => {
        EventEmitter.emit(NavigationTypes.BLUR_POST_TEXTBOX);

        if (this.drawerRef && !this.drawerOpened) {
            this.drawerRef.openDrawer();
        }
    };

    handleDrawerClose = () => {
        this.drawerOpened = false;
        Keyboard.dismiss();
    };

    handleDrawerOpen = () => {
        this.drawerOpened = true;
        Keyboard.dismiss();
    };

    handleDimensions = ({window}) => {
        if (this.mounted) {
            if (this.state.openDrawerOffset !== 0) {
                let openDrawerOffset = DRAWER_INITIAL_OFFSET;
                if ((window.width > window.height) || DeviceTypes.IS_TABLET) {
                    openDrawerOffset = window.width * 0.5;
                }

                this.setState({openDrawerOffset, deviceWidth: window.width});
            }
        }
    };

    goToEditProfile = preventDoubleTap(() => {
        const {intl} = this.context;
        this.goToEditProfileScreen(intl);
    });

    goToFlagged = preventDoubleTap(() => {
        const {intl} = this.context;
        this.goToFlaggedScreen(intl);
    });

    goToMentions = preventDoubleTap(() => {
        const {intl} = this.context;
        this.goToMentionsScreen(intl);
    });

    goToUserProfile = preventDoubleTap(() => {
        const {intl} = this.context;
        this.goToUserProfileScreen(intl);
    });

    goToSettings = preventDoubleTap(() => {
        const {intl} = this.context;
        this.goToSettingsScreeen(intl);
    });

    renderNavigationView = () => {
        const {theme} = this.props;
        const style = getStyleSheet(theme);

        return (
            <SafeAreaView
                backgroundColor={theme.centerChannelBg}
                navBarBackgroundColor={theme.centerChannelBg}
                footerColor={theme.centerChannelBg}
                footerComponent={<View style={style.container}/>}
                headerComponent={<View style={style.container}/>}
                theme={theme}
            >
                {this.renderOptions(style)}
            </SafeAreaView>
        );
    };

    render() {
        const {children} = this.props;
        const {deviceWidth, openDrawerOffset} = this.state;
        const drawerWidth = DeviceTypes.IS_TABLET ? TABLET_WIDTH : (deviceWidth - openDrawerOffset);

        return (
            <DrawerLayout
                ref={this.setDrawerRef}
                renderNavigationView={this.renderNavigationView}
                onDrawerClose={this.handleDrawerClose}
                onDrawerOpen={this.handleDrawerOpen}
                drawerPosition='right'
                drawerWidth={drawerWidth}
                useNativeAnimations={true}
            >
                {children}
            </DrawerLayout>
        );
    }
}

const getStyleSheet = makeStyleSheetFromTheme((theme) => {
    return {
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