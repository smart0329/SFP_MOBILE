// Copyright (c) 2019-present Smart.Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {
    TouchableOpacity,
    View,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import Badge from 'app/components/badge';
import PushNotifications from 'app/push_notifications';
import {preventDoubleTap} from 'app/utils/tap';
import {makeStyleSheetFromTheme} from 'app/utils/theme';
import {t} from 'app/utils/i18n';
import {intlShape} from 'react-intl';

import telemetry from 'app/telemetry';

export default class ChannelDrawerButton extends PureComponent {
    static propTypes = {
        openSidebar: PropTypes.func.isRequired,
        badgeCount: PropTypes.number,
        theme: PropTypes.object,
        visible: PropTypes.bool,
    };

    static contextTypes = {
        intl: intlShape.isRequired,
    };

    static defaultProps = {
        badgeCount: 0,
        currentChannel: {},
        theme: {},
        visible: true,
    };

    componentDidMount() {
        if (this.props.badgeCount > 0) {
            // Only set the icon badge number if once the component mounts we have at least one mention
            // reason is to prevent the notification in the notification center to get cleared
            // while the app is retrieving unread mentions from the server
            PushNotifications.setApplicationIconBadgeNumber(this.props.badgeCount);
        }
    }

    componentDidUpdate(prevProps) {
        // Once the component updates we know for sure if there are or not mentions when it mounted
        // a) the app had mentions
        if (prevProps.badgeCount !== this.props.badgeCount) {
            PushNotifications.setApplicationIconBadgeNumber(this.props.badgeCount);
        }
    }

    handlePress = preventDoubleTap(() => {
        telemetry.start(['channel:open_drawer']);
        this.props.openSidebar();
    });

    render() {
        const {
            badgeCount,
            theme,
            visible,
        } = this.props;

        const {formatMessage} = this.context.intl;

        const buttonDescriptor = {
            id: t('navbar.channel_drawer.button'),
            defaultMessage: 'Channels and teams',
            description: 'Accessibility helper for channel drawer button.',
        };
        const accessibilityLabel = formatMessage(buttonDescriptor);

        const buttonHint = {
            id: t('navbar.channel_drawer.hint'),
            defaultMessage: 'Opens the channels and teams drawer',
            description: 'Accessibility helper for explaining what the channel drawer button will do.',
        };
        const accessibilityHint = formatMessage(buttonHint);

        const style = getStyleFromTheme(theme);

        let badge;
        if (badgeCount && visible) {
            badge = (
                <Badge
                    containerStyle={style.badgeContainer}
                    style={style.badge}
                    countStyle={style.mention}
                    count={badgeCount}
                    onPress={this.handlePress}
                    minWidth={19}
                />
            );
        }

        let icon;
        let containerStyle;
        if (visible) {
            icon = (
                <Icon
                    name='md-menu'
                    size={25}
                    color={theme.sidebarHeaderTextColor}
                />
            );
            containerStyle = style.container;
        } else {
            icon = (<View style={style.tabletIcon}/>);
            containerStyle = style.tabletContainer;
        }

        return (
            <TouchableOpacity
                accessible={true}
                accessibilityHint={accessibilityHint}
                accessibilityLabel={accessibilityLabel}
                accessibilityRole='button'
                onPress={this.handlePress}
                style={containerStyle}
            >
                <View style={[style.wrapper]}>
                    <View>
                        {icon}
                        {badge}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const getStyleFromTheme = makeStyleSheetFromTheme((theme) => {
    return {
        container: {
            width: 55,
        },
        tabletContainer: {
            width: 10,
        },
        tabletIcon: {
            height: 25,
        },
        wrapper: {
            alignItems: 'center',
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            paddingHorizontal: 10,
        },
        badge: {
            backgroundColor: theme.mentionBg,
            height: 19,
            padding: 3,
        },
        badgeContainer: {
            borderColor: theme.sidebarHeaderBg,
            borderRadius: 14,
            borderWidth: 2,
            position: 'absolute',
            right: -14,
            top: -7,
        },
        mention: {
            color: theme.mentionColor,
            fontSize: 10,
        },
    };
});
