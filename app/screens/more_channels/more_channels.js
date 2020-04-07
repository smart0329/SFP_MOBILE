// Copyright (c) 2019-present Smart.Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {intlShape} from 'react-intl';
import {Platform, View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Navigation} from 'react-native-navigation';

import {debounce} from 'mattermost-redux/actions/helpers';
import {General} from 'mattermost-redux/constants';
import EventEmitter from 'mattermost-redux/utils/event_emitter';

import {paddingHorizontal as padding} from 'app/components/safe_area_view/iphone_x_spacing';
import BottomSheet from 'app/utils/bottom_sheet';
import CustomList from 'app/components/custom_list';
import ChannelListRow from 'app/components/custom_list/channel_list_row';
import FormattedText from 'app/components/formatted_text';
import KeyboardLayout from 'app/components/layout/keyboard_layout';
import Loading from 'app/components/loading';
import SearchBar from 'app/components/search_bar';
import StatusBar from 'app/components/status_bar';
import {NavigationTypes} from 'app/constants';
import {alertErrorWithFallback, emptyFunction} from 'app/utils/general';
import {goToScreen, dismissModal, setButtons} from 'app/actions/navigation';
import {
    changeOpacity,
    makeStyleSheetFromTheme,
    setNavigatorStyles,
    getKeyboardAppearanceFromTheme,
} from 'app/utils/theme';

export default class MoreChannels extends PureComponent {
    static propTypes = {
        actions: PropTypes.shape({
            getArchivedChannels: PropTypes.func.isRequired,
            getChannels: PropTypes.func.isRequired,
            handleSelectChannel: PropTypes.func.isRequired,
            joinChannel: PropTypes.func.isRequired,
            searchChannels: PropTypes.func.isRequired,
            setChannelDisplayName: PropTypes.func.isRequired,
        }).isRequired,
        componentId: PropTypes.string,
        canCreateChannels: PropTypes.bool.isRequired,
        channels: PropTypes.array,
        archivedChannels: PropTypes.array,
        closeButton: PropTypes.object,
        currentUserId: PropTypes.string.isRequired,
        currentTeamId: PropTypes.string.isRequired,
        theme: PropTypes.object.isRequired,
        isLandscape: PropTypes.bool.isRequired,
        canShowArchivedChannels: PropTypes.bool.isRequired,
    };

    static defaultProps = {
        channels: [],
    };

    static contextTypes = {
        intl: intlShape.isRequired,
    };

    constructor(props, context) {
        super(props, context);

        this.searchTimeoutId = 0;
        this.publicPage = -1;
        this.archivedPage = -1;
        this.nextPublic = true;
        this.nextArchived = true;
        this.mounted = false;

        this.state = {
            channels: props.channels.slice(0, General.CHANNELS_CHUNK_SIZE),
            archivedChannels: props.archivedChannels.slice(0, General.CHANNELS_CHUNK_SIZE),
            typeOfChannels: 'public',
            loading: false,
            adding: false,
            term: '',
        };

        this.rightButton = {
            color: props.theme.sidebarHeaderTextColor,
            id: 'create-pub-channel',
            text: context.intl.formatMessage({id: 'mobile.create_channel', defaultMessage: 'Create'}),
            showAsAction: 'always',
        };

        this.leftButton = {
            id: 'close-more-channels',
            icon: props.closeButton,
        };
    }

    componentDidMount() {
        this.navigationEventListener = Navigation.events().bindComponent(this);
        this.mounted = true;
        this.setHeaderButtons(this.props.canCreateChannels);
        this.doGetChannels();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    componentWillReceiveProps(nextProps) {
        const {term} = this.state;
        let channels;
        let archivedChannels;

        if (this.props.theme !== nextProps.theme) {
            setNavigatorStyles(this.props.componentId, nextProps.theme);
        }

        if (nextProps.channels !== this.props.channels) {
            channels = nextProps.channels;
            if (term) {
                channels = this.filterChannels(nextProps.channels, term);
            }
        }

        if (nextProps.archivedChannels !== this.props.archivedChannels) {
            archivedChannels = nextProps.archivedChannels;
            if (term) {
                archivedChannels = this.filterChannels(nextProps.archivedChannels, term);
            }
        }

        const nextState = {};
        if (channels) {
            nextState.channels = channels;
        }

        if (archivedChannels) {
            nextState.archivedChannels = archivedChannels;
        }

        if (nextState.archivedChannels || nextState.channels) {
            this.setState(nextState);
        }
    }

    navigationButtonPressed({buttonId}) {
        switch (buttonId) {
        case 'close-more-channels':
            this.close();
            break;
        case 'create-pub-channel':
            this.onCreateChannel();
            break;
        }
    }

    setSearchBarRef = (ref) => {
        this.searchBarRef = ref;
    }

    cancelSearch = () => {
        const {channels, archivedChannels} = this.props;

        this.setState({
            channels,
            archivedChannels,
            term: '',
        });
    };

    close = () => {
        dismissModal();
    };

    doGetChannels = () => {
        const {actions, currentTeamId, canShowArchivedChannels} = this.props;
        const {loading, term, typeOfChannels} = this.state;

        if (!loading && !term && this.mounted) {
            this.setState({loading: true}, () => {
                switch (typeOfChannels) {
                case 'public':
                    if (this.nextPublic) {
                        actions.getChannels(
                            currentTeamId,
                            this.publicPage + 1,
                            General.CHANNELS_CHUNK_SIZE,
                        ).then(this.loadedChannels);
                    }
                    break;
                case 'archived':
                    if (canShowArchivedChannels && this.nextArchived) {
                        actions.getArchivedChannels(
                            currentTeamId,
                            this.archivedPage + 1,
                            General.CHANNELS_CHUNK_SIZE,
                        ).then(this.loadedChannels);
                    }
                    break;
                }
            });
        }
    };

    filterChannels = (channels, term) => {
        const lowerCasedTerm = term.toLowerCase();
        return channels.filter((c) => {
            return (c.name.toLowerCase().includes(lowerCasedTerm) || c.display_name.toLowerCase().includes(lowerCasedTerm));
        });
    };

    getChannels = debounce(this.doGetChannels, 100);

    setHeaderButtons = (createEnabled) => {
        const {canCreateChannels, componentId} = this.props;
        const buttons = {
            leftButtons: [this.leftButton],
        };

        if (canCreateChannels) {
            buttons.rightButtons = [{...this.rightButton, enabled: createEnabled}];
        }

        setButtons(componentId, buttons);
    };

    loadedChannels = ({data}) => {
        if (this.mounted) {
            const {typeOfChannels} = this.state;
            const isPublic = typeOfChannels === 'public';

            if (isPublic) {
                this.publicPage += 1;
                this.nextPublic = data?.length > 0;
            } else {
                this.archivedPage += 1;
                this.nextArchived = data?.length > 0;
            }

            this.setState({loading: false});
        }
    };

    onSelectChannel = async (id) => {
        const {intl} = this.context;
        const {actions, currentTeamId, currentUserId} = this.props;
        const {channels} = this.state;

        this.setHeaderButtons(false);
        this.setState({adding: true});

        const channel = channels.find((c) => c.id === id);
        const result = await actions.joinChannel(currentUserId, currentTeamId, id);

        if (result.error) {
            alertErrorWithFallback(
                intl,
                result.error,
                {
                    id: 'mobile.join_channel.error',
                    defaultMessage: "We couldn't join the channel {displayName}. Please check your connection and try again.",
                },
                {
                    displayName: channel ? channel.display_name : '',
                },
            );
            this.setHeaderButtons(true);
            this.setState({adding: false});
        } else {
            if (channel) {
                actions.setChannelDisplayName(channel.display_name);
            } else {
                actions.setChannelDisplayName('');
            }
            await actions.handleSelectChannel(id);

            EventEmitter.emit(NavigationTypes.CLOSE_MAIN_SIDEBAR);
            requestAnimationFrame(() => {
                this.close();
            });
        }
    };

    onCreateChannel = () => {
        const {formatMessage} = this.context.intl;

        const screen = 'CreateChannel';
        const title = formatMessage({id: 'mobile.create_channel.public', defaultMessage: 'New Public Channel'});
        const passProps = {
            channelType: General.OPEN_CHANNEL,
        };

        goToScreen(screen, title, passProps);
    };

    renderLoading = () => {
        const {theme} = this.props;
        const {typeOfChannels} = this.state;
        const style = getStyleFromTheme(theme);

        if ((typeOfChannels === 'public' && !this.nextPublic) ||
            (typeOfChannels === 'archived' && !this.nextArchived)) {
            return null;
        }

        return (
            <View style={style.loadingContainer}>
                <FormattedText
                    id='mobile.loading_channels'
                    defaultMessage='Loading Channels...'
                    style={style.loadingText}
                />
            </View>
        );
    };

    renderNoResults = () => {
        const {term, loading} = this.state;
        const {theme} = this.props;
        const style = getStyleFromTheme(theme);

        if (loading) {
            return null;
        }

        if (term) {
            return (
                <View style={style.noResultContainer}>
                    <FormattedText
                        id='mobile.custom_list.no_results'
                        defaultMessage='No Results'
                        style={style.noResultText}
                    />
                </View>
            );
        }

        return (
            <View style={style.noResultContainer}>
                <FormattedText
                    id='more_channels.noMore'
                    defaultMessage='No more channels to join'
                    style={style.noResultText}
                />
            </View>
        );
    };

    renderItem = (props) => {
        return (
            <ChannelListRow
                {...props}
                isArchived={this.state.typeOfChannels === 'archived'}
            />
        );
    }

    searchChannels = (text) => {
        const {actions, channels, archivedChannels, currentTeamId, canShowArchivedChannels} = this.props;
        const {typeOfChannels} = this.state;

        if (text) {
            if (typeOfChannels === 'public') {
                const filtered = this.filterChannels(channels, text);
                this.setState({
                    channels: filtered,
                    term: text,
                });
                clearTimeout(this.searchTimeoutId);
            } else if (typeOfChannels === 'archived' && canShowArchivedChannels) {
                const filtered = this.filterChannels(archivedChannels, text);
                this.setState({
                    archivedChannels: filtered,
                    term: text,
                });
                clearTimeout(this.searchTimeoutId);
            }
            this.searchTimeoutId = setTimeout(() => {
                actions.searchChannels(currentTeamId, text.toLowerCase(), typeOfChannels === 'archived');
            }, General.SEARCH_TIMEOUT_MILLISECONDS);
        } else {
            this.cancelSearch();
        }
    };

    handleDropdownClick = () => {
        const {formatMessage} = this.context.intl;
        const publicChannelsText = formatMessage({id: 'more_channels.publicChannels', defaultMessage: 'Public Channels'});
        const archivedChannelsText = formatMessage({id: 'more_channels.archivedChannels', defaultMessage: 'Archived Channels'});
        const titleText = formatMessage({id: 'more_channels.dropdownTitle', defaultMessage: 'Show'});
        const cancelText = 'Cancel';
        BottomSheet.showBottomSheetWithOptions({
            options: [publicChannelsText, archivedChannelsText, cancelText],
            cancelButtonIndex: 2,
            title: titleText,
        }, (value) => {
            let typeOfChannels;
            switch (value) {
            case 0:
                typeOfChannels = 'public';
                break;
            case 1:
                typeOfChannels = 'archived';
                break;
            default:
                typeOfChannels = this.state.typeOfChannels;
            }

            if (typeOfChannels !== this.state.typeOfChannels) {
                this.setState({typeOfChannels, loading: false}, this.doGetChannels);
            }
        });
    }

    render() {
        const {formatMessage} = this.context.intl;
        const {theme, isLandscape, canShowArchivedChannels} = this.props;
        const {adding, channels, archivedChannels, loading, term, typeOfChannels} = this.state;
        const more = term ? emptyFunction : this.getChannels;
        const style = getStyleFromTheme(theme);

        const publicChannelsText = formatMessage({id: 'more_channels.showPublicChannels', defaultMessage: 'Show: Public Channels'});
        const archivedChannelsText = formatMessage({id: 'more_channels.showArchivedChannels', defaultMessage: 'Show: Archived Channels'});

        let content;
        if (adding) {
            content = (<Loading color={theme.centerChannelColor}/>);
        } else {
            const searchBarInput = {
                backgroundColor: changeOpacity(theme.centerChannelColor, 0.2),
                color: theme.centerChannelColor,
                fontSize: 15,
                ...Platform.select({
                    android: {
                        marginBottom: -5,
                    },
                }),
            };

            let activeChannels = channels;

            if (canShowArchivedChannels && typeOfChannels === 'archived') {
                activeChannels = archivedChannels;
            }

            let channelDropdown;
            if (canShowArchivedChannels) {
                channelDropdown = (
                    <View style={[style.titleContainer, padding(isLandscape)]}>
                        <Text
                            accessibilityRole={'button'}
                            style={style.channelDropdown}
                            onPress={this.handleDropdownClick}
                        >
                            {typeOfChannels === 'public' ? publicChannelsText : archivedChannelsText}
                            {'  '}
                            <Icon
                                name={'caret-down'}
                            />
                        </Text>
                    </View>
                );
            }

            content = (
                <React.Fragment>
                    <View style={[style.searchBar, padding(isLandscape)]}>
                        <SearchBar
                            ref={this.setSearchBarRef}
                            placeholder={formatMessage({id: 'search_bar.search', defaultMessage: 'Search'})}
                            cancelTitle={formatMessage({id: 'mobile.post.cancel', defaultMessage: 'Cancel'})}
                            backgroundColor='transparent'
                            inputHeight={33}
                            inputStyle={searchBarInput}
                            placeholderTextColor={changeOpacity(theme.centerChannelColor, 0.5)}
                            tintColorSearch={changeOpacity(theme.centerChannelColor, 0.5)}
                            tintColorDelete={changeOpacity(theme.centerChannelColor, 0.5)}
                            titleCancelColor={theme.centerChannelColor}
                            onChangeText={this.searchChannels}
                            onSearchButtonPress={this.searchChannels}
                            onCancelButtonPress={this.cancelSearch}
                            autoCapitalize='none'
                            keyboardAppearance={getKeyboardAppearanceFromTheme(theme)}
                            value={term}
                        />
                    </View>
                    {channelDropdown}
                    <CustomList
                        canRefresh={false}
                        data={activeChannels}
                        extraData={loading}
                        key='custom_list'
                        loading={loading}
                        loadingComponent={this.renderLoading()}
                        noResults={this.renderNoResults()}
                        onLoadMore={more}
                        onRowPress={this.onSelectChannel}
                        renderItem={this.renderItem}
                        theme={theme}
                    />
                </React.Fragment>
            );
        }

        return (
            <KeyboardLayout>
                <StatusBar/>
                {content}
            </KeyboardLayout>
        );
    }
}

const getStyleFromTheme = makeStyleSheetFromTheme((theme) => {
    return {
        searchBar: {
            marginVertical: 5,
        },
        loadingContainer: {
            alignItems: 'center',
            backgroundColor: theme.centerChannelBg,
            height: 70,
            justifyContent: 'center',
        },
        loadingText: {
            color: changeOpacity(theme.centerChannelColor, 0.6),
        },
        noResultContainer: {
            flexGrow: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        noResultText: {
            fontSize: 26,
            color: changeOpacity(theme.centerChannelColor, 0.5),
        },
        channelDropdown: {
            color: theme.centerChannelColor,
            fontWeight: 'bold',
            marginLeft: 10,
            marginTop: 20,
            marginBottom: 10,
        },
    };
});
