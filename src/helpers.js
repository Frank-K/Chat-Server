class Helpers {
  // A class for helper functions

  constructor() {
    this.commands = new Set(["/n", "/a", "/h"]);
  }

  isCommand(s) {
    // Return true iff s is a commands
    return this.commands.has(s);
  }

  doCommand(s, users) {
    // Return the result of a command

    if (!this.isCommand(s)) {
      return "";
    }

    if (s === "/n") {
      return `There are ${Object.keys(users).length} user(s) online.`;
    }
    if (s === "/a") {
      return `Online users: ${Object.values(users)}`;
    }
    if (s === "/h") {
      return (
        "Type /a to see the number of online users and /n to see " +
        "the usernames of the online users."
      );
    }

    // Should never get here
    return "";
  }

  getCommands() {
    return this.commands;
  }
}

module.exports = Helpers;
