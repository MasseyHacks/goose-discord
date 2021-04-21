const UserController = require('../controllers/UserController');
module.exports = {
    slash: true,
    testOnly: true,
    description: 'Verify yourself and associate your Discord account with your 7WC account.',
    minArgs: 2,
    expectedArgs: '<Email>',
    category: 'Setup',
    callback: async ({ args, text, member, channel, client }) => {
        const [email] = args;

        const userID = member.user.id;

        try {
            let discordUser = await channel.guild.members.fetch(userID);

            if(discordUser.roles.cache.has(process.env.VERIFIED_ROLE_ID)){
                return "You are already verified!";
            }

            let userInfo = await UserController.verifyUser(email, userID);

            if(!userInfo.status.admitted){
                try {
                    await UserController.admitUser(userInfo.id);
                }
                catch(e){
                    console.log("error force admitting " + userInfo.id);
                    console.log(e);
                }
            }

            if(!userInfo.status.confirmed) {
                try {
                    await UserController.confirmUser(userInfo.id);
                }
                catch(e){
                    console.log("error auto confirming " + userInfo.id);
                    console.log(e);
                }
            }

            try {
                await UserController.waiverIn(userInfo.id);
            }
            catch(e){
                console.log("error setting user waiver in " + userInfo.id);
                console.log(e);
            }

            try {
                await UserController.checkIn(userInfo.id);
            }
            catch(e){
                console.log("error checking in " + userInfo.id);
                console.log(e);
            }

            await discordUser.roles.add(process.env.VERIFIED_ROLE_ID);
            await discordUser.roles.add(process.env.PARTICIPANT_ROLE_ID);
            await discordUser.setNickname(userInfo.firstName + " " + userInfo.lastName.charAt(0));
            return "Successfully verified!"
        }
        catch (e) {
            return e.message ?? 'There was an error verifying you. Please contact an organizer.';
        }
    }
}