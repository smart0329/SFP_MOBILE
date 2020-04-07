// Copyright (c) 2019-present Smart.Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import Autocomplete from 'app/components/autocomplete';

import Typing from './components/typing';
import PostTextBoxBase from './post_textbox_base';

const AUTOCOMPLETE_MARGIN = 20;
const AUTOCOMPLETE_MAX_HEIGHT = 200;

export default class PostTextBoxAndroid extends PostTextBoxBase {
    render() {
        const {
            deactivatedChannel,
            rootId,
        } = this.props;

        if (deactivatedChannel) {
            return this.renderDeactivatedChannel();
        }

        const {cursorPosition, top} = this.state;

        return (
            <React.Fragment>
                <Typing/>
                <Autocomplete
                    cursorPosition={cursorPosition}
                    maxHeight={Math.min(top - AUTOCOMPLETE_MARGIN, AUTOCOMPLETE_MAX_HEIGHT)}
                    onChangeText={this.handleTextChange}
                    value={this.state.value}
                    rootId={rootId}
                />
                {this.renderTextBox()}
            </React.Fragment>
        );
    }
}
