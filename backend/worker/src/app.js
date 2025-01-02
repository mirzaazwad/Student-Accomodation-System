const dotenv = require("dotenv");
const { SocketClient } = require("./providers/socket");
dotenv.config();

SocketClient.getInstance();


