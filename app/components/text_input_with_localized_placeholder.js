// Copyright (c) 2019-present Smart.Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {intlShape} from 'react-intl';
import {TextInput} from 'react-native';

import {changeOpacity} from 'app/utils/theme';

export default class TextInputWithLocalizedPlaceholder extends PureComponent {
    static propTypes = {
        ...TextInput.propTypes,
        placeholder: PropTypes.object.isRequired,
    };

    static defaultProps = {
        placeholderTextColor: changeOpacity('#000', 0.5),
    };

    static contextTypes = {
        intl: intlShape.isRequired,
    };

    setInputRef = (ref) => {
        this.inputRef = ref;
    }

    blur = () => {
        this.inputRef.blur();
    };

    focus = () => {
        this.inputRef.focus();
    };

    render() {
        const {formatMessage} = this.context.intl;
        const {placeholder, ...otherProps} = this.props;
        let placeholderString = '';
        if (placeholder.id) {
            placeholderString = formatMessage(placeholder);
        }

        return (
            <TextInput
                ref={this.setInputRef}
                {...otherProps}
                placeholder={placeholderString}
                disableFullscreenUI={true}
            />
        );
    }
}
