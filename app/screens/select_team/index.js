// Copyright (c) 2019-present Smart.Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {getTeams, addUserToTeam, joinTeam} from 'mattermost-redux/actions/teams';
import {logout} from 'mattermost-redux/actions/users';
import {getJoinableTeams} from 'mattermost-redux/selectors/entities/teams';
import {getCurrentUser} from 'mattermost-redux/selectors/entities/users';

import {handleTeamChange} from 'app/actions/views/select_team';
import {isLandscape} from 'app/selectors/device';
import {isGuest} from 'app/utils/users';

import SelectTeam from './select_team.js';

function mapStateToProps(state) {
    const currentUser = getCurrentUser(state);
    const currentUserIsGuest = isGuest(currentUser);
    return {
        teamsRequest: state.requests.teams.getTeams,
        teams: getJoinableTeams(state),
        isLandscape: isLandscape(state),
        currentUserId: currentUser && currentUser.id,
        currentUserIsGuest,
        serverVersion: state.entities.general.serverVersion,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            getTeams,
            handleTeamChange,
            joinTeam,
            addUserToTeam,
            logout,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectTeam);
