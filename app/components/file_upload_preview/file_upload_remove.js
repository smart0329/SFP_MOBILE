// Copyright (c) 2019-present Smart.Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {View, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {makeStyleSheetFromTheme, changeOpacity} from 'app/utils/theme';

import TouchableWithFeedback from 'app/components/touchable_with_feedback';

export default class FileUploadRemove extends PureComponent {
    static propTypes = {
        channelId: PropTypes.string,
        clientId: PropTypes.string,
        onPress: PropTypes.func.isRequired,
        rootId: PropTypes.string,
        theme: PropTypes.object.isRequired,
    };

    handleOnPress = () => {
        const {channelId, clientId, onPress, rootId} = this.props;

        onPress(clientId, channelId, rootId);
    };

    render() {
        const {theme} = this.props;
        const style = getStyleSheet(theme);
        return (
            <TouchableWithFeedback
                style={style.tappableContainer}
                onPress={this.handleOnPress}
                type={'opacity'}
            >
                <View style={style.removeButton}>
                    <Icon
                        name='close-circle'
                        color={changeOpacity(theme.centerChannelColor, 0.64)}
                        size={21}
                        style={style.removeIcon}
                    />
                </View>
            </TouchableWithFeedback>
        );
    }
}

const getStyleSheet = makeStyleSheetFromTheme((theme) => {
    return {
        tappableContainer: {
            position: 'absolute',
            elevation: 11,
            top: -5,
            right: -10,
            width: 32,
            height: 32,
        },
        removeButton: {
            borderRadius: 12,
            alignSelf: 'center',
            marginTop: Platform.select({
                ios: 5.4,
                android: 4.75,
            }),
            backgroundColor: theme.centerChannelBg,
        },
        removeIcon: {
            position: 'relative',
            top: Platform.select({
                ios: 1,
                android: 0,
            }),
        },
    };
});
