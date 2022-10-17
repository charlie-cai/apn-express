import { Constant } from './constant.js';
import { ApnsPushType } from './enum.js';
import { post } from './http2.js';

export function getTimestamp() {
    return Math.floor(Date.now() / 1000);
}

export function send(device_token, jwt_token, title, body) {

    const headers = {
        ':path': `/3/device/${device_token}`,
        'apns-push-type': ApnsPushType.Alert,
        'authorization': `bearer ${jwt_token}`,
        'apns-topic': process.env.BUNDLE_ID
    };

    const params = {
        "aps": {
            "alert": {
                "title": title,
                "body": body
            },
        },
    }
    return post(`${Constant.APN_SERVER_DEVELOPMENT}:${Constant.APN_SERVER_PORT}`, headers, params);
}