const axios = require('axios');
const UserController = {};

UserController.verifyUser = async function(email, discordID) {
    let usersInfo = (await axios({
        url: process.env.GOOSE_CONTACT_POINT + '/users',
        method: 'POST',
        headers: {
            'x-access-token': process.env.GOOSE_ACCESS_TOKEN
        },
        data: {
            "page":1,
            "size":1,
            "text":"",
            "filters": {
                "$and": [
                    {
                        "permissions.checkin": "false",
                        "permissions.verified": "true",
                        "status.rejected": "false",
                        "status.declined": "false"
                    },
                    {
                        "email":{
                            "$eq":email.toLowerCase()
                        }
                    }
                    ]
            }
        }
    })).data;
    if(usersInfo.users.length < 1){
        throw Error('User not found.');
    }

    let userInfo = usersInfo.users[0];
    if(userInfo.discordID){
        throw Error('User is already associated with a Discord account.');
    }

    return userInfo;
}

UserController.admitUser = async function(userID) {
    let response = (await axios({
        url: process.env.GOOSE_CONTACT_POINT + '/forceAccept',
        method: 'POST',
        headers: {
            'x-access-token': process.env.GOOSE_ACCESS_TOKEN
        },
        data: {
            "userID": userID
        }
    })).data;

    return response;
}

UserController.confirmUser = async function(userID) {
    let response = (await axios({
        url: process.env.GOOSE_CONTACT_POINT + '/adminAcceptInvitation',
        method: 'POST',
        headers: {
            'x-access-token': process.env.GOOSE_ACCESS_TOKEN
        },
        data: {
            "userID": userID,
            "confirmation": {
                "additionalNotes": "Autoconfirmed by bot."
            }
        }
    })).data;

    return response;
}

UserController.waiverIn = async function(userID){
    let response = (await axios({
        url: process.env.GOOSE_CONTACT_POINT + '/waiverIn',
        method: 'POST',
        headers: {
            'x-access-token': process.env.GOOSE_ACCESS_TOKEN
        },
        data: {
            "userID": userID
        }
    })).data;

    return response;
}

UserController.checkIn = async function(userID) {
    let response = (await axios({
        url: process.env.GOOSE_CONTACT_POINT + '/checkIn',
        method: 'POST',
        headers: {
            'x-access-token': process.env.GOOSE_ACCESS_TOKEN
        },
        data: {
            "userID": userID
        }
    })).data;

    return response;
}

module.exports = UserController;