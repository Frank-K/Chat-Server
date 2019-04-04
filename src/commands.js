/** Class representing a set of commands. */
class Commands {
  /**
   * Create a new commands object.
   */
  constructor() {
    this.commands = new Set(["/n", "/a", "/h"]);
  }

  /**
   * Get the x value.
   * @param {string} s - a string that might be a command
   * @return {boolean} true if the string is a command
   */
  isCommand(s) {
    return this.commands.has(s);
  }

  /**
   * Return the result of the command
   * @param {string} s - a string that might be a command
   * @param {Object} users - the global users object
   * @return {string} the result of the command s
   */
  doCommand(s, users) {
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

  /**
   * Return all the commands
   * @return {Object} an array of all valid commands
   */
  getCommands() {
    return this.commands;
  }
}

module.exports = Commands;
