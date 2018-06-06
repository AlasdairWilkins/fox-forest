const express = require('express')
const app = express()
const zulip = require('zulip-js')

// Download zuliprc-dev from your dev server
const config = {
    username: 'fox-forest-bot@recurse.zulipchat.com',
    apiKey: 'kl6KFFbIhrE6Sg8y9E4oXVJ8gC2SUvbV',
    realm: 'https://recurse.zulipchat.com'
};

app.listen(8000, () => {
    console.log('Express server started on port 8000');
});

// app.get('/', (req, res) => {
//     zulip(config)
//         .then(function(client) {
//             //     const params = {
//             //         to: 'alasdair.wilkins@gmail.com',
//             //         type: 'private',
//             //         content: "You've been invited to play a game of The Fox in the Forest!"
//             //     }
//             //     return client.messages.send(params)
//             // })
//             // .then(function(result) {
//             //     console.log(result)
//             // })
//             //
//             //
//             return client.users.retrieve()
//         })
//         .then(function(results) {
//             let users = results.members
//             let names = []
//             let addresses = {}
//             for (let user = 0; user < users.length; user++) {
//                 if (!users[user]['is_bot']) {
//                     addresses[users[user].full_name] = users[user].email
//                 }
//             }
//             names = Object.keys(addresses)
//             names.sort()
//             console.log("Names:", names)
//             console.log("Addresses:", addresses)
//             res.sendFile(__dirname + '/zulip.html')
//         })
//         .catch(function (err) {
//             console.log("Error:", err)
//             return res.status(500).json('Authentication failed')
//         })
// })

app.get('/', (req, res) => {
    zulip(config)
        .then(function(client) {
            const params = {
                to: 'alasdair.wilkins@gmail.com',
                type: 'private',
                content: "You've been invited to play a game of The Fox in the Forest!"
            }
            return client.messages.send(params)
        })
        .then(function(result) {
            console.log(result)
        })


        //     return client.users.retrieve()
        // })
        // .then(function(results) {
        //     let users = results.members
        //     let names = []
        //     let addresses = {}
        //     for (let user = 0; user < users.length; user++) {
        //         if (!users[user]['is_bot']) {
        //             addresses[users[user].full_name] = users[user].email
        //         }
        //     }
        //     names = Object.keys(addresses)
        //     names.sort()
        //     console.log("Names:", names)
        //     console.log("Addresses:", addresses)
        //     res.sendFile(__dirname + '/zulip.html')
        // })
        // .catch(function (err) {
        //     console.log("Error:", err)
        //     return res.status(500).json('Authentication failed')
        // })
})










    // // You may pass the `client_gravatar` query parameter as follows:
    // client.users.retrieve({client_gravatar: true}).then(console.log);


