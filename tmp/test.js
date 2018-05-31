'use strict';

const express = require('express');
const simpleOauthModule = require('simple-oauth2');

const app = express();
const oauth2 = simpleOauthModule.create({
    client: {
        id: 'fe8bb8dba4ab9d66bfc19544d4fba61a453492c0c437ee1c6890996e9c9b26ac',
        secret: 'faa0e825b09c5a155115261a0fb81f97524b583f4c4413d0487799ac43088342'
    },
    auth: {
        tokenHost: 'https://recurse.com',
        tokenPath: '/oauth/token',
        authorizePath: '/oauth/authorize',
    }
    //
    // },
});

// Authorization uri definition
const authorizationUri = oauth2.authorizationCode.authorizeURL({
    redirect_uri: 'http://localhost:8000/login',
    // scope: 'notifications',
    state: '3(#0/!~',
});

// Initial page redirecting to Github
app.get('/auth', (req, res) => {
    console.log(authorizationUri);
    res.redirect(authorizationUri);
});

// Callback service parsing the authorization token and asking for the access token
app.get('/login', async (req, res) => {
    const code = req.query.code;
    const options = {
        code,
    };

    try {
        const result = await oauth2.authorizationCode.getToken(options);

        console.log('The resulting token: ', result);

        const token = oauth2.accessToken.create(result);

        return res.status(200).json(token)
    } catch(error) {
        console.error('Access Token Error', error.message);
        return res.status(500).json('Authentication failed');
    }
});

app.get('/success', (req, res) => {
    res.send('');
});

app.get('/', (req, res) => {
    res.send('Hello<br><a href="/auth">Log in with RC :)</a>');
});

app.listen(8000, () => {
    console.log('Express server started on port 8000');
});


// Credits to [@lazybean](https://github.com/lazybean)