// Copyright (c) 2019-present Smart.Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import PropTypes from 'prop-types';

import {
    Image,
    Text,
    View,
} from 'react-native';

import {Client4} from 'mattermost-redux/client';

import {makeStyleSheetFromTheme} from 'app/utils/theme';

export default class TeamIcon extends React.PureComponent {
    static propTypes = {
        displayName: PropTypes.string,
        lastIconUpdate: PropTypes.number,
        teamId: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
        styleContainer: PropTypes.any,
        styleText: PropTypes.any,
        styleImage: PropTypes.any,
        theme: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            teamIcon: null,
            imageError: false,
        };
    }

    componentDidMount() {
        const {lastIconUpdate, teamId} = this.props;
        this.mounted = true;

        if (lastIconUpdate) {
            this.setImageURL(Client4.getTeamIconUrl(teamId, lastIconUpdate));
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.teamId !== prevProps.teamId) {
            this.setImageURL(null);
        } else if (this.props.lastIconUpdate && this.props.lastIconUpdate !== prevProps.lastIconUpdate) {
            const {lastIconUpdate, teamId} = this.props;
            this.setImageURL(Client4.getTeamIconUrl(teamId, lastIconUpdate));
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    setImageURL = (teamIcon) => {
        if (this.mounted) {
            this.setState({imageError: false, teamIcon});
        }
    };

    render() {
        const {
            displayName,
            theme,
            styleContainer,
            styleText,
            styleImage,
        } = this.props;

        const styles = getStyleSheet(theme);

        let teamIconContent;
        if (this.state.teamIcon) {
            teamIconContent = (
                <Image
                    style={[styles.image, styleImage]}
                    source={{uri: this.state.teamIcon}}
                    onError={() => this.setState({imageError: true})}
                />
            );
        } else {
            teamIconContent = (
                <Text style={[styles.text, styleText]}>
                    {displayName.substr(0, 2).toUpperCase()}
                </Text>
            );
        }

        return (
            <View style={[styles.container, styleContainer]}>
                {teamIconContent}
            </View>
        );
    }
}

const getStyleSheet = makeStyleSheetFromTheme((theme) => {
    return {
        container: {
            width: 30,
            height: 30,
            borderRadius: 2,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.sidebarText,
        },
        text: {
            color: theme.sidebarBg,
            fontFamily: 'OpenSans',
            fontWeight: '600',
            fontSize: 15,
        },
        image: {
            borderRadius: 2,
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        },
    };
});
