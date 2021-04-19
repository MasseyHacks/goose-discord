require('dotenv').config();
const discord = require('discord.js');
const WOKCommands = require('wokcommands');

const client = new discord.Client({
    // Use recommended partials for the built-in help menu
    partials: ['MESSAGE', 'REACTION']
})

client.on('ready', async () => {
    // The client object is required as the first argument.
    // The second argument is the options object.
    // All properties of this object are optional.

    new WOKCommands(client, {
        // The name of the local folder for your command files
        commandsDir: 'commands',

        // If your commands should not be ran by a bot, default false
        ignoreBots: true,

        // What server/guild IDs are used for testing only commands & features
        // Can be a single string if there is only 1 ID
        testServers: [process.env.GUILD_ID],

        // What built-in commands should be disabled.
        // Note that you can overwrite a command as well by using
        // the same name as the command file name.
        disabledDefaultCommands: [
            // 'help',
            // 'command',
            // 'language',
            // 'prefix',
            // 'requiredrole'
        ]
    })
        // Here are some additional methods that you can chain
        // onto the contrustor call. These will eventually be
        // merged into the above object, but for now you can
        // use them:

        // The default is !
        .setDefaultPrefix('-')
})

client.login(process.env.DISCORD_BOT_TOKEN)