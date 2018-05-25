


// Set the configuration settings
const express = require('express')
const app = express()
const credentials = {
    client: {
        id: 'fe8bb8dba4ab9d66bfc19544d4fba61a453492c0c437ee1c6890996e9c9b26ac',
        secret: 'faa0e825b09c5a155115261a0fb81f97524b583f4c4413d0487799ac43088342'
    },
    auth: {
        tokenHost: 'https://www.recurse.com'
    }
};

// Initialize the OAuth2 Library
const oauth2 = require('simple-oauth2').create(credentials);

// Authorization oauth2 URI
const authorizationUri = oauth2.authorizationCode.authorizeURL({
    redirect_uri: 'http://localhost:8000/login',
});

app.get('/auth', (req, res) => {
    console.log('ahoy hoy')
    console.log(authorizationUri);
    res.redirect(authorizationUri);
});

// Callback service parsing the authorization token and asking for the access token
app.get('/login', async (req, res) => {
    console.log("Made it here!")
    debugger
    const code = req.query.code;
    const options = {
        code: code,
        redirect_uri: 'http://localhost:8000/login'
    };
    console.log("What is being sent: ", options)

    try {
        const result = await oauth2.authorizationCode.getToken(options);

        // console.log('The resulting token: ', result);

        const token = oauth2.accessToken.create(result);
        // console.log("What's about to appear on the page", res.status(200).json(token))

        // return res.status(200).json(token)
        console.log('ze stuff', token)
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