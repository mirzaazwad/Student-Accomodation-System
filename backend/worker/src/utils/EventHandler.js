const { handleChatMessage } = require("../events/message.events");

/**
 * Event handlers for the socket server
 * @type {Array}
 * @property {string} event - The event name
 * @property {Function} consumer - The event handler function
 */
const EventHandler = [
  {
    event: "chat",
    consumer: handleChatMessage,
  },
  // Add more event handlers here
];

module.exports = { EventHandler };
