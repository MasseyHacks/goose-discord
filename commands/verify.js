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

            await discordUser.roles.add(process.env.VERIFIED_ROLE_ID);
            await discordUser.roles.add(process.env.PARTICIPANT_ROLE_ID);
            await discordUser.setNickname(userInfo.fullName);
            return "Successfully verified!"
        }
        catch (e) {
            return e.message ?? 'There was an error verifying you. Please contact an organizer.';
        }
    }
}