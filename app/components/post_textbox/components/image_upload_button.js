// Copyright (c) 2019-present Smart.Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {intlShape} from 'react-intl';
import {
    Alert,
    Platform,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {ICON_SIZE} from 'app/constants/post_textbox';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-picker';
import Permissions from 'react-native-permissions';

import {changeOpacity} from 'app/utils/theme';

import TouchableWithFeedback from 'app/components/touchable_with_feedback';

export default class ImageUploadButton extends PureComponent {
    static propTypes = {
        blurTextBox: PropTypes.func.isRequired,
        fileCount: PropTypes.number,
        maxFileCount: PropTypes.number.isRequired,
        onShowFileMaxWarning: PropTypes.func,
        theme: PropTypes.object.isRequired,
        uploadFiles: PropTypes.func.isRequired,
        buttonContainerStyle: PropTypes.object,
    };

    static defaultProps = {
        browseFileTypes: Platform.OS === 'ios' ? 'public.item' : '*/*',
        validMimeTypes: [],
        canBrowseFiles: true,
        canBrowsePhotoLibrary: true,
        canBrowseVideoLibrary: true,
        canTakePhoto: true,
        canTakeVideo: true,
        maxFileCount: 5,
        extraOptions: null,
    };

    static contextTypes = {
        intl: intlShape.isRequired,
    };

    getPermissionDeniedMessage = () => {
        const {formatMessage} = this.context.intl;
        const applicationName = DeviceInfo.getApplicationName();
        if (Platform.OS === 'android') {
            return {
                title: formatMessage({
                    id: 'mobile.android.photos_permission_denied_title',
                    defaultMessage: '{applicationName} would like to access your photos',
                }, {applicationName}),
                text: formatMessage({
                    id: 'mobile.android.photos_permission_denied_description',
                    defaultMessage: 'Upload photos to your Mattermost instance or save them to your device. Open Settings to grant Mattermost Read and Write access to your photo library.',
                }),
            };
        }

        return {
            title: formatMessage({
                id: 'mobile.ios.photos_permission_denied_title',
                defaultMessage: '{applicationName} would like to access your photos',
            }, {applicationName}),
            text: formatMessage({
                id: 'mobile.ios.photos_permission_denied_description',
                defaultMessage: 'Upload photos and videos to your Mattermost instance or save them to your device. Open Settings to grant Mattermost Read and Write access to your photo and video library.',
            }),
        };
    }

    attachFileFromLibrary = async () => {
        const {formatMessage} = this.context.intl;
        const {title, text} = this.getPermissionDeniedMessage();
        const options = {
            quality: 0.8,
            mediaType: 'mixed',
            noData: true,
            permissionDenied: {
                title,
                text,
                reTryTitle: formatMessage({
                    id: 'mobile.permission_denied_retry',
                    defaultMessage: 'Settings',
                }),
                okTitle: formatMessage({id: 'mobile.permission_denied_dismiss', defaultMessage: 'Don\'t Allow'}),
            },
        };

        const hasPhotoPermission = await this.hasPhotoPermission();

        if (hasPhotoPermission) {
            ImagePicker.launchImageLibrary(options, (response) => {
                if (response.error || response.didCancel) {
                    return;
                }

                this.props.uploadFiles([response]);
            });
        }
    };

    hasPhotoPermission = async () => {
        const {formatMessage} = this.context.intl;
        const targetSource = Platform.OS === 'ios' ?
            Permissions.PERMISSIONS.IOS.PHOTO_LIBRARY :
            Permissions.PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
        const hasPermission = await Permissions.check(targetSource);

        switch (hasPermission) {
        case Permissions.RESULTS.DENIED:
        case Permissions.RESULTS.UNAVAILABLE: {
            const permissionRequest = await Permissions.request(targetSource);

            return permissionRequest === Permissions.RESULTS.GRANTED;
        }
        case Permissions.RESULTS.BLOCKED: {
            const grantOption = {
                text: formatMessage({
                    id: 'mobile.permission_denied_retry',
                    defaultMessage: 'Settings',
                }),
                onPress: () => Permissions.openSettings(),
            };

            const {title, text} = this.getPermissionDeniedMessage();

            Alert.alert(
                title,
                text,
                [
                    grantOption,
                    {
                        text: formatMessage({
                            id: 'mobile.permission_denied_dismiss',
                            defaultMessage: 'Don\'t Allow',
                        }),
                    },
                ],
            );
            return false;
        }
        }

        return true;
    };

    handleButtonPress = () => {
        const {
            fileCount,
            maxFileCount,
            onShowFileMaxWarning,
        } = this.props;

        if (fileCount === maxFileCount) {
            onShowFileMaxWarning();
            return;
        }

        this.props.blurTextBox();
        this.attachFileFromLibrary();
    };

    render() {
        const {theme, buttonContainerStyle} = this.props;
        return (
            <TouchableWithFeedback
                onPress={this.handleButtonPress}
                style={buttonContainerStyle}
                type={'opacity'}
            >
                <MaterialCommunityIcons
                    color={changeOpacity(theme.centerChannelColor, 0.64)}
                    name='image-outline'
                    size={ICON_SIZE}
                />
            </TouchableWithFeedback>
        );
    }
}
