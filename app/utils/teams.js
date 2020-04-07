// Copyright (c) 2019-present Smart.Inc. All Rights Reserved.
// See LICENSE.txt for license information.
// @flow

export function selectFirstAvailableTeam(teams, primaryTeam) {
    let defaultTeam;
    if (primaryTeam) {
        defaultTeam = teams.find((t) => t.name === primaryTeam.toLowerCase());
    }

    if (!defaultTeam) {
        defaultTeam = Object.values(teams).sort((a, b) => a.display_name.localeCompare(b.display_name))[0];
    }

    return defaultTeam;
}
