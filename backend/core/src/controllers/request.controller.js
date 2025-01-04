const Apartment = require("../models/appartment.model");
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

const approveRoommateRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const request = await Requests.findOne({ _id: requestId });
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    if (request.requestee.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized request" });
    }
    request.status = "Accepted";
    await request.save();
    const apartmentId = request.apartment;
    const apartment = await Apartment.findOne({
      _id: apartmentId,
    });
    const booking = apartment.bookings.find((booking) => {
      return booking._id.toString() === request.booking.toString();
    });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    const roommate = booking.roommates.find(
      (roommate) => roommate.id.toString() === req.user.id
    );
    if (!roommate) {
      return res.status(404).json({ message: "Roommate not found" });
    }
    roommate.status = "Accepted";
    await apartment.save();
    return res.status(200).json({
      message: "Request accepted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to accept request: " + error.message,
    });
  }
};

const rejectRoommateRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const request = await Requests.findOne({ _id: requestId });
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    if (request.requestee.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized request" });
    }
    request.status = "Rejected";
    await request.save();
    const apartmentId = request.apartment;
    const apartment = await Apartment.findOne({
      _id: apartmentId,
    });
    const booking = apartment.bookings.find(
      (booking) => booking._id.toString() === request.booking.toString()
    );
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    const roommates = booking.roommates.filter(
      (roommate) => roommate.id.toString() !== req.user.id
    );
    booking.roommates = roommates;
    await apartment.save();
    return res.status(200).json({
      message: "Request accepted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to accept request: " + error.message,
    });
  }
};

const cancelRoommateRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const request = await Requests.findOne({ _id: requestId });
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    console.log(request.requester.toString(), req.user.id);
    if (request.requester.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized request" });
    }
    request.status = "Cancelled";
    await request.save();
    const apartmentId = request.apartment;
    const apartment = await Apartment.findOne({
      _id: apartmentId,
    });
    const booking = apartment.bookings.find(
      (booking) => booking._id.toString() === request.booking.toString()
    );
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    const roommates = booking.roommates.filter(
      (roommate) => roommate.id.toString() !== request.requestee.toString()
    );
    booking.roommates = roommates;
    await apartment.save();
    return res.status(200).json({
      message: "Request accepted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to accept request: " + error.message,
    });
  }
};

module.exports = {
  fetchPendingRequests,
  fetchAcceptedRequests,
  fetchMyRequests,
  approveRoommateRequest,
  rejectRoommateRequest,
  cancelRoommateRequest,
};
