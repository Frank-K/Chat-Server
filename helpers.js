class Helpers {
    // A class for helper functions

    constructor() {
        this.commands = new Set(['/n', '/a', '/h']);
    }

    isCommand(s) {
        // Return true iff s is a commands
        return this.commands.has(s);
    }

    doCommand(s, users) {
        // Return the result of a command

        if (s === '/n') {
            return `There are ${Object.keys(users).length} user(s) online.`;
        
        } else if (s === '/a') {
            return `Online users: ${Object.values(users)}`;
        
        } else if (s === '/h') {
            return 'Type /a to see the number of online users and /n to see \
                    the usernames of the online users.';
        }
    }

    getCommands() {
        return this.commands;
    }
}

module.exports = Helpers;
