


// Set the configuration settings
const express = require('express')
const app = express()
const request = require('request')
const Promise = require('bluebird')
const rp = require('request-promise')
const uniqid = require('uniqid')
const credentials = {
    client: {
        id: 'fe8bb8dba4ab9d66bfc19544d4fba61a453492c0c437ee1c6890996e9c9b26ac',
        secret: 'faa0e825b09c5a155115261a0fb81f97524b583f4c4413d0487799ac43088342'
    },
    auth: {
        tokenHost: 'https://www.recurse.com'
    }
};
const oauth2 = require('simple-oauth2').create(credentials);
const authorizationUri = oauth2.authorizationCode.authorizeURL({
    redirect_uri: 'http://localhost:8000/login',
});
const cookieParser = require('cookie-parser')

app.use(cookieParser())

app.get('/auth', (req, res) => {
    res.redirect(authorizationUri);
});

// Callback service parsing the authorization token and asking for the access token
app.get('/login',  (req, res) => {
    const code = req.query.code;
    let options = {
        code: code,
        redirect_uri: 'http://localhost:8000/login'
    };

    return oauth2.authorizationCode.getToken(options)
        .then(function(token) {
            console.log(token)
            let header = token.token_type + " " + token.access_token
            let options = {
                url: 'http://www.recurse.com/api/v1/profiles/me',
                headers: {'Authorization': header},
                json: true
            }
            return rp(options)
        })
        .then(function(response) {
            console.log("And here we are!", response.id, response.first_name, response.last_name, response.email)
            active[req.cookies.id] = {'id': response.id, 'first': response.first_name, 'last': response.last_name, 'email': response.email}

            res.redirect('/')
        })
        .catch(function (err) {
            console.log(err)
            return res.status(500).json('Authentication failed')
        })
});

app.get('/success', (req, res) => {
    res.send('');
});

app.get('/', (req, res) => {
    if (!req.cookies.id) {
        let cookie = uniqid()
        res.setHeader('Set-Cookie', 'id=' + cookie)
    }
    if (!active[req.cookies.id]) {
        res.send('Hello<br><a href="/auth">Log in with RC :)</a>');
    } else {
        res.send("You've logged in, " + active[req.cookies.id].first + "!")
    }

});

app.listen(8000, () => {
    console.log('Express server started on port 8000');
});

const active = {}
const users = {}

//
//
// // Get the access token object (the authorization code is given from the previous step).
// const tokenConfig = {
//     code: '<code>',
//     redirect_uri: 'http://localhost:3000/callback',
//     scope: '<scope>', // also can be an array of multiple scopes, ex. ['<scope1>, '<scope2>', '...']
// };
//
// // Save the access token
// try {
//     const result = await oauth2.authorizationCode.getToken(tokenConfig)
//     const accessToken = oauth2.accessToken.create(result);
// } catch (error) {
//     console.log('Access Token Error', error.message);
// }
// //
// // Sample of a JSON access token (you got it through previous steps)
// const tokenObject = {
//     'access_token': '<access-token>',
//     'refresh_token': '<refresh-token>',
//     'expires_in': '7200'
// };
//
// // Create the access token wrapper
// let accessToken = oauth2.accessToken.create(tokenObject);
//
// // Check if the token is expired. If expired it is refreshed.
// if (accessToken.expired()) {
//     try {
//         accessToken = await accessToken.refresh();
//     } catch (error) {
//         console.log('Error refreshing access token: ', error.message);
//     }
// }
//
// // Provide a window of time before the actual expiration to refresh the token
// const EXPIRATION_WINDOW_IN_SECONDS = 300;
//
// const { token } = accessToken;
// const expirationTimeInSeconds = token.expires_at.getTime() / 1000;
// const expirationWindowStart = expirationTimeInSeconds - EXPIRATION_WINDOW_IN_SECONDS;
//
// // If the start of the window has passed, refresh the token
// const nowInSeconds = (new Date()).getTime() / 1000;
// const shouldRefresh = nowInSeconds >= expirationWindowStart;
// if (shouldRefresh) {
//     try {
//         accessToken = await accessToken.refresh();
//     } catch (error) {
//         console.log('Error refreshing access token: ', error.message);
//     }
// }
//
// // Revoke both access and refresh tokens
// try {
//     // Revoke only the access token
//     await accessToken.revoke('access_token');
//
//     // Session ended. But the refresh_token is still valid.
//     // Revoke the refresh token
//     await accessToken.revoke('refresh_token');
// } catch (error) {
//     console.log('Error revoking token: ', error.message);
// }
//
// // Revoke both access and refresh tokens
// try {
//     // Revokes both tokens, refresh token is only revoked if the access_token is properly revoked
//     await accessToken.revokeAll();
// } catch (error) {
//     console.log('Error revoking token: ', error.message);
// }