// Copyright (c) 2019-present Smart.Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import RNFetchBlob from 'rn-fetch-blob';
import urlParse from 'url-parse';

import {Client4} from 'mattermost-redux/client';
import {ClientError, HEADER_X_VERSION_ID} from 'mattermost-redux/client/client4';
import EventEmitter from 'mattermost-redux/utils/event_emitter';
import {General} from 'mattermost-redux/constants';

import mattermostBucket from 'app/mattermost_bucket';
import mattermostManaged from 'app/mattermost_managed';
import LocalConfig from 'assets/config';

import {t} from 'app/utils/i18n';

/* eslint-disable no-throw-literal */

export const HEADER_X_CLUSTER_ID = 'X-Cluster-Id';
export const HEADER_TOKEN = 'Token';

let managedConfig;

mattermostManaged.addEventListener('managedConfigDidChange', (config) => {
    managedConfig = config;
});

const handleRedirectProtocol = (url, response) => {
    const serverUrl = Client4.getUrl();
    const parsed = urlParse(url);
    const {redirects} = response.rnfbRespInfo;
    if (redirects) {
        const redirectUrl = urlParse(redirects[redirects.length - 1]);

        if (serverUrl === parsed.origin && parsed.host === redirectUrl.host && parsed.protocol !== redirectUrl.protocol) {
            Client4.setUrl(serverUrl.replace(parsed.protocol, redirectUrl.protocol));
        }
    }
};

Client4.doFetchWithResponse = async (url, options) => {
    const customHeaders = LocalConfig.CustomRequestHeaders;
    let waitsForConnectivity = false;
    let timeoutIntervalForResource = 30;

    if (managedConfig?.useVPN === 'true') {
        waitsForConnectivity = true;
    }

    if (managedConfig?.timeoutVPN) {
        timeoutIntervalForResource = parseInt(managedConfig.timeoutVPN, 10);
    }

    let requestOptions = {
        ...Client4.getOptions(options),
        waitsForConnectivity,
        timeoutIntervalForResource,
    };

    if (customHeaders && Object.keys(customHeaders).length > 0) {
        requestOptions = {
            ...requestOptions,
            headers: {
                ...requestOptions.headers,
                ...LocalConfig.CustomRequestHeaders,
            },
        };
    }

    let response;
    let headers;

    let data;
    try {
        response = await fetch(url, requestOptions);
        headers = response.headers;
        if (!url.startsWith('https') && response.rnfbRespInfo && response.rnfbRespInfo.redirects && response.rnfbRespInfo.redirects.length > 1) {
            handleRedirectProtocol(url, response);
        }

        data = await response.json();
    } catch (err) {
        if (response && response.resp && response.resp.data && response.resp.data.includes('SSL certificate')) {
            throw new ClientError(Client4.getUrl(), {
                message: 'You need to use a valid client certificate in order to connect to this Mattermost server',
                status_code: 401,
                url,
            });
        }

        throw new ClientError(Client4.getUrl(), {
            message: 'Received invalid response from the server.',
            intl: {
                id: t('mobile.request.invalid_response'),
                defaultMessage: 'Received invalid response from the server.',
            },
            url,
        });
    }

    const clusterId = headers[HEADER_X_CLUSTER_ID] || headers[HEADER_X_CLUSTER_ID.toLowerCase()];
    if (clusterId && Client4.clusterId !== clusterId) {
        Client4.clusterId = clusterId; /* eslint-disable-line require-atomic-updates */
    }

    const token = headers[HEADER_TOKEN] || headers[HEADER_TOKEN.toLowerCase()];
    if (token) {
        Client4.setToken(token);
    }

    const serverVersion = headers[HEADER_X_VERSION_ID] || headers[HEADER_X_VERSION_ID.toLowerCase()];
    if (serverVersion && !headers['Cache-Control'] && Client4.serverVersion !== serverVersion) {
        Client4.serverVersion = serverVersion; /* eslint-disable-line require-atomic-updates */
        EventEmitter.emit(General.SERVER_VERSION_CHANGED, serverVersion);
    }

    if (response.ok) {
        const headersMap = new Map();
        Object.keys(headers).forEach((key) => {
            headersMap.set(key, headers[key]);
        });

        return {
            response,
            headers: headersMap,
            data,
        };
    }

    const msg = data.message || '';

    if (Client4.logToConsole) {
        console.error(msg); // eslint-disable-line no-console
    }

    throw new ClientError(Client4.getUrl(), {
        message: msg,
        server_error_id: data.id,
        status_code: data.status_code,
        url,
    });
};

const initFetchConfig = async () => {
    const fetchConfig = {
        auto: true,
        timeout: 5000, // Set the base timeout for every request to 5s
    };

    try {
        managedConfig = await mattermostManaged.getConfig();
    } catch {
        // no managed config
    }

    const userAgent = await DeviceInfo.getUserAgent();
    Client4.setUserAgent(userAgent);

    if (Platform.OS === 'ios') {
        fetchConfig.certificate = await mattermostBucket.getPreference('cert');
    }

    window.fetch = new RNFetchBlob.polyfill.Fetch(fetchConfig).build();

    return true;
};

initFetchConfig();

export default initFetchConfig;
