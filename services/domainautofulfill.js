const axios = require('axios');
const UserController = require('../controllers/UserController');

module.exports = async function(client) {
    let response = (await axios({
        url: process.env.GOOSE_CONTACT_POINT + '/getOrdersOfItem',
        method: 'GET',
        headers: {
            'x-access-token': process.env.GOOSE_ACCESS_TOKEN
        },
        params: {
            itemID: process.env.ORDER_WATCH_ID
        }
    })).data;

    for(const order of response){
        if(order.status === "Open"){
            try {
                const userInfo = await UserController.getUserInfo(order.purchaseUser);
                const discordID = userInfo.discordID;

                const discordUser = await (await client.guilds.fetch(process.env.GUILD_ID)).members.fetch(discordID);

                discordUser.send(process.env.ORDER_REPLY_CONTENT);

                await axios({
                    url: process.env.GOOSE_CONTACT_POINT + '/setOrderFulfilled',
                    method: 'POST',
                    headers: {
                        'x-access-token': process.env.GOOSE_ACCESS_TOKEN
                    },
                    data: {
                        orderID: order._id
                    }
                });
            }
            catch(e){
                const discordUser = await (await client.guilds.fetch(process.env.GUILD_ID)).members.fetch(process.env.ADMIN_USER_ID);

                discordUser.send("There was an error fulfilling order "+ order._id);
            }
        }
    }
}