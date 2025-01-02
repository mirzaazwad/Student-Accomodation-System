const { Types } = require("mongoose");

const toMongoID = (id) => new Types.ObjectId(id);

module.exports = { toMongoID };
