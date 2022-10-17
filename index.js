
// imports
import { send, getTimestamp } from './util.js';
import { Algorithm } from './enum.js';
import jwt from 'jsonwebtoken';
import fs from 'fs';

// config env variables
import dotenv from 'dotenv';
dotenv.config();

// express setup
import express from 'express';
const app = express();
const port = 5000;

// router start
app.get('/push', async (req, res) => {
    const device_token = req.query.device_token;
    const title = req.query.title;
    const body = req.query.body;

    try {
        console.log('device_token', device_token);
        console.log('title', title);
        console.log('body', body);

        console.log('iss', process.env.TEAM_ID);
        console.log('iat', getTimestamp());
        console.log('alg', Algorithm.ES256);
        console.log('kid', process.env.KEY_ID);
        console.log('bundle_id', process.env.BUNDLE_ID);

        const private_key = fs.readFileSync('private.key');
        const jwt_token = jwt.sign(
            {
                "iss": process.env.TEAM_ID,
                "iat": getTimestamp()
            }, private_key,
            {
                header: {
                    alg: Algorithm.ES256,
                    kid: process.env.KEY_ID
                }
            });
        // const jwt_token = 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ikw2OVA3NjI4NlYifQ.eyJpc3MiOiJaVVFXQjhHR0E4IiwiaWF0IjoxNjY1OTcyNTAxfQ.e8937wkldVrPx2bAHSSipxWhg-fCVZ2mZfOgrXcJouDWf1Qy7NPNb1dHCd3vKW7TEdRl61JDHTMhzusZzIfQkw';
        console.log('jwt_token', jwt_token);
        const response = await send(device_token, jwt_token, title, body);

        console.log('response', response);
        res.send('OK');
    } catch (e) {
        console.error(e);
        res.send('ERROR');
    }
})

// start server
app.listen(port, () => {
    console.log(`push notification server listening on port ${port}`)
})

// Test Get Request
// http://localhost:5000/push?device_token=dde6a9696269ef0591df7f6196115652454b651b75dbd652e188693bdbd5d5eb&title=TITLE&body=BODY