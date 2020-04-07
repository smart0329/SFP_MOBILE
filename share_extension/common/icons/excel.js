// Copyright (c) 2019-present Smart.Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';
import Svg, {
    G,
    Path,
} from 'react-native-svg';

function ExcelSvg({height, width}) {
    return (
        <View style={{height, width, alignItems: 'flex-start'}}>
            <Svg
                width={width}
                height={height}
                viewBox='0 0 24 32'
            >
                <G
                    stroke='none'
                    strokeWidth={1}
                    fillRule='evenodd'
                >
                    <G
                        transform='translate(-918.000000, -1991.000000)'
                        fillRule='nonzero'
                        fill='#1875F0'
                    >
                        <G transform='translate(78.000000, 1991.000000)'>
                            <G transform='translate(840.000000, 0.000000)'>
                                <G>
                                    <G>
                                        <Path d='M23.3333333,32 L0.666666667,32 C0.298666667,32 0,31.7013333 0,31.3333333 L0,8.66666667 C0,8.48933333 0.0706666667,8.32 0.194666667,8.19466667 L8.19466667,0.194666667 C8.32,0.0706666667 8.48933333,0 8.66666667,0 L23.3333333,0 C23.7013333,0 24,0.298666667 24,0.666666667 L24,31.3333333 C24,31.7013333 23.7013333,32 23.3333333,32 Z M1.33333333,30.6666667 L22.6666667,30.6666667 L22.6666667,1.33333333 L8.94266667,1.33333333 L1.33333333,8.94266667 L1.33333333,30.6666667 Z'/>
                                        <Path d='M8.66666667,9.33333333 L0.666666667,9.33333333 C0.298666667,9.33333333 0,9.03466667 0,8.66666667 C0,8.29866667 0.298666667,8 0.666666667,8 L8,8 L8,0.666666667 C8,0.298666667 8.29866667,0 8.66666667,0 C9.03466667,0 9.33333333,0.298666667 9.33333333,0.666666667 L9.33333333,8.66666667 C9.33333333,9.03466667 9.03466667,9.33333333 8.66666667,9.33333333 Z'/>
                                    </G>
                                </G>
                                <G transform='translate(5.000000, 14.000000)'>
                                    <Path d='M13.3636364,0 L0.636363636,0 C0.285090909,0 0,0.285090909 0,0.636363636 L0,12.0909091 C0,12.4421818 0.285090909,12.7272727 0.636363636,12.7272727 L13.3636364,12.7272727 C13.7149091,12.7272727 14,12.4421818 14,12.0909091 L14,0.636363636 C14,0.285090909 13.7149091,0 13.3636364,0 Z M1.27272727,5.09090909 L3.81818182,5.09090909 L3.81818182,7.63636364 L1.27272727,7.63636364 L1.27272727,5.09090909 Z M5.09090909,5.09090909 L12.7272727,5.09090909 L12.7272727,7.63636364 L5.09090909,7.63636364 L5.09090909,5.09090909 Z M12.7272727,3.81818182 L5.09090909,3.81818182 L5.09090909,1.27272727 L12.7272727,1.27272727 L12.7272727,3.81818182 Z M3.81818182,1.27272727 L3.81818182,3.81818182 L1.27272727,3.81818182 L1.27272727,1.27272727 L3.81818182,1.27272727 Z M1.27272727,8.90909091 L3.81818182,8.90909091 L3.81818182,11.4545455 L1.27272727,11.4545455 L1.27272727,8.90909091 Z M5.09090909,11.4545455 L5.09090909,8.90909091 L12.7272727,8.90909091 L12.7272727,11.4545455 L5.09090909,11.4545455 Z'/>
                                </G>
                            </G>
                        </G>
                    </G>
                </G>
            </Svg>
        </View>
    );
}

ExcelSvg.propTypes = {
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
};

export default ExcelSvg;
