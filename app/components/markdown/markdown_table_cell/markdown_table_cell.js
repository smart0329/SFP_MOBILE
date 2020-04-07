// Copyright (c) 2019-present Smart.Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import {Text, View} from 'react-native';

import {changeOpacity, makeStyleSheetFromTheme} from 'app/utils/theme';

export const CELL_MIN_WIDTH = 96;
export const CELL_MAX_WIDTH = 192;

export default class MarkdownTableCell extends React.PureComponent {
    static propTypes = {
        align: PropTypes.oneOf(['', 'left', 'center', 'right']),
        children: PropTypes.node,
        isLastCell: PropTypes.bool,
        theme: PropTypes.object.isRequired,
    };

    render() {
        const style = getStyleSheet(this.props.theme);

        const cellStyle = [style.cell];
        if (!this.props.isLastCell) {
            cellStyle.push(style.cellRightBorder);
        }

        let textStyle = null;
        if (this.props.align === 'center') {
            textStyle = style.alignCenter;
        } else if (this.props.align === 'right') {
            textStyle = style.alignRight;
        }

        return (
            <View style={cellStyle}>
                <Text style={textStyle}>
                    {this.props.children}
                </Text>
            </View>
        );
    }
}

const getStyleSheet = makeStyleSheetFromTheme((theme) => {
    return {
        cell: {
            flex: 1,
            borderColor: changeOpacity(theme.centerChannelColor, 0.2),
            justifyContent: 'flex-start',
            padding: 8,
        },
        cellRightBorder: {
            borderRightWidth: 1,
        },
        alignCenter: {
            textAlign: 'center',
        },
        alignRight: {
            textAlign: 'right',
        },
    };
});
