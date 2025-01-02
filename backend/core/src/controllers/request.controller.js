const Requests = require("../models/requests.model");

const fetchPendingRequests = async (req, res) => {
  try {
    const requests = await Requests.find({
      requestee: req.user.id,
      status: "Pending",
    }).populate("requester requestee");
    return res.status(200).json({
      requests,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to fetch pending requests: " + error.message,
    });
  }
};

const fetchMyRequests = async (req, res) => {
  try {
    const requests = await Requests.find({
      requester: req.user.id,
    }).populate("requester requestee");
    return res.status(200).json({
      requests,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to fetch requests: " + error.message,
    });
  }
};

const fetchAcceptedRequests = async (req, res) => {
  try {
    const requests = await Requests.find({
      requestee: req.user.id,
      status: "Accepted",
    }).populate("requester requestee");
    return res.status(200).json({
      requests,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to fetch accepted requests: " + error.message,
    });
  }
};

module.exports = {
  fetchPendingRequests,
  fetchAcceptedRequests,
  fetchMyRequests,
};
