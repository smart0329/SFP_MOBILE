// Copyright (c) 2019-present Smart.Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Client4} from 'mattermost-redux/client';
import {HEADER_X_VERSION_ID} from 'mattermost-redux/client/client4';
import EventEmitter from 'mattermost-redux/utils/event_emitter';
import {General} from 'mattermost-redux/constants';

import {
    HEADER_X_CLUSTER_ID,
    HEADER_TOKEN,
} from 'app/init/fetch';

describe('Fetch', () => {
    test('doFetchWithResponse handles empty headers', async () => {
        const setToken = jest.spyOn(Client4, 'setToken');
        const response = {
            json: () => Promise.resolve('data'),
            headers: {},
            ok: true,
        };
        global.fetch.mockReturnValueOnce(response);
        await Client4.doFetchWithResponse('https://mattermost.com', {method: 'GET'});
        expect(Client4.serverVersion).toEqual('');
        expect(Client4.clusterId).toEqual('');
        expect(setToken).not.toHaveBeenCalled();
    });

    test('doFetchWithResponse handles title case headers', async () => {
        const setToken = jest.spyOn(Client4, 'setToken');
        const headers = {
            [HEADER_X_VERSION_ID]: 'VersionId',
            [HEADER_X_CLUSTER_ID]: 'ClusterId',
            [HEADER_TOKEN]: 'Token',
        };
        const response = {
            json: () => Promise.resolve('data'),
            ok: true,
            headers,
        };
        global.fetch.mockReturnValueOnce(response);
        await Client4.doFetchWithResponse('https://mattermost.com', {method: 'GET'});
        expect(Client4.serverVersion).toEqual(headers[HEADER_X_VERSION_ID]);
        expect(Client4.clusterId).toEqual(headers[HEADER_X_CLUSTER_ID]);
        expect(setToken).toHaveBeenCalledWith(headers[HEADER_TOKEN]);
    });

    test('doFetchWithResponse handles lower case headers', async () => {
        const setToken = jest.spyOn(Client4, 'setToken');
        const headers = {
            [HEADER_X_VERSION_ID.toLowerCase()]: 'versionid',
            [HEADER_X_CLUSTER_ID.toLowerCase()]: 'clusterid',
            [HEADER_TOKEN.toLowerCase()]: 'token',
        };
        const response = {
            json: () => Promise.resolve('data'),
            ok: true,
            headers,
        };
        global.fetch.mockReturnValueOnce(response);
        await Client4.doFetchWithResponse('https://mattermost.com', {method: 'GET'});
        expect(Client4.serverVersion).toEqual(headers[HEADER_X_VERSION_ID.toLowerCase()]);
        expect(Client4.clusterId).toEqual(headers[HEADER_X_CLUSTER_ID.toLowerCase()]);
        expect(setToken).toHaveBeenCalledWith(headers[HEADER_TOKEN.toLowerCase()]);
    });

    test('doFetchWithResponse handles server version change', async () => {
        const emit = jest.spyOn(EventEmitter, 'emit');
        const serverVersion1 = 'version1';
        const response = {
            json: () => Promise.resolve('data'),
            ok: true,
            headers: {
                [HEADER_X_VERSION_ID]: serverVersion1,
            },
        };
        global.fetch.mockReturnValueOnce(response);

        expect(Client4.serverVersion).not.toEqual(serverVersion1);
        await Client4.doFetchWithResponse('https://mattermost.com', {method: 'GET'});
        expect(Client4.serverVersion).toEqual(serverVersion1);
        expect(emit).toHaveBeenCalledWith(General.SERVER_VERSION_CHANGED, serverVersion1);
    });
});