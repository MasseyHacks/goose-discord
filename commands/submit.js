const UserController = require('../controllers/UserController');
module.exports = {
    slash: true,
    testOnly: true,
    description: 'Start a submission for a 7WC challenge.',
    category: 'Submission',
    callback: async ({ args, text, member, channel, client }) => {
        const userID = member.user.id;

        try {
            let discordUser = await channel.guild.members.fetch(userID);
            let userInfo = await UserController.getByDiscordID(userID)
            await discordUser.send(`Your submission link:  ${process.env.SUBMISSION_FORM_URL.replace("{{EMAIL}}", userInfo.email).replace("{{USERID}}", userInfo.id)}`)
            return "Your submission link has been sent via private message.";
        }
        catch (e) {
            return e.message ?? 'There was an error verifying you. Please contact an organizer.';
        }
    }
}