const Apartment = require("../models/appartment.model");
const Transaction = require("../models/transaction.model");
const { User } = require("../models/user.model");
const { SSLCommerzService } = require("../providers/sslcommerz");
const bcrypt = require("bcrypt");
const { toMongoID } = require("../utils/Helper");
const { omit } = require("lodash");

const initiatePaymment = async (req, res) => {
  try {
    const { from, to, amount, appartmentId, bookingId } = req.body;
    const fromUser = await User.findById(from);
    const toUser = await User.findById(to);
    const appartment = await Apartment.findById(appartmentId);
    if (!fromUser) {
      return res.status(404).json({ message: "From user not found" });
    }
    if (!toUser) {
      return res.status(404).json({ message: "To user not found" });
    }
    if (!appartment) {
      return res.status(404).json({ message: "Appartment not found" });
    }

    const hash = await bcrypt.hash(`${from}${to}${amount}${appartmentId}`, 10);
    const transaction = new Transaction({
      from: fromUser,
      to: toUser,
      amount,
      apartment: {
        id: appartment._id,
        title: appartment.title,
        location: appartment.location,
      },
      hash,
      bookingId,
    });
    await transaction.save();
    const sslcommerz = await SSLCommerzService.init(transaction._id, bookingId);
    const gatewayUrl = await sslcommerz.makePaymentRequest();
    transaction.gatewayUrl = gatewayUrl;
    await transaction.save();
    return res.status(200).json({
      gatewayUrl,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const successfulPayment = async (req, res) => {
  try {
    const transactionId = req.query.transaction_id;
    const hash = req.query.hash;
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    if (transaction.hash !== hash) {
      return res.status(401).json({ message: "Unauthorized transaction" });
    }
    const apartment = await Apartment.findById(transaction.apartment.id);
    const booking = apartment.bookings.find(
      (booking) =>
        booking.student.id.toString() === transaction.to._id.toString()
    );
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    booking.status = "Paid";
    await apartment.save();
    transaction.transaction = {
      bankTransactionId: req.body.bank_tran_id,
      cardBrand: req.body.card_brand ?? "N/A",
      cardIssuer: req.body.card_issuer ?? "N/A",
      cardType: req.body.card_sub_brand ?? "N/A",
      cardCountryCode: req.body.card_issuer_country_code ?? "N/A",
    };
    transaction.status = req.body.status;
    await transaction.save();
    return res.redirect(`${process.env.CLIENT_URL}/transactions`);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const failedPayment = async (req, res) => {
  try {
    const transactionId = req.query.transaction_id;
    const hash = req.query.hash;
    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    if (transaction.hash !== hash) {
      return res.status(401).json({ message: "Unauthorized transaction" });
    }
    transaction.transaction = {
      bankTransactionId: req.body.bank_tran_id,
      cardBrand: req.body.card_brand ?? "N/A",
      cardIssuer: req.body.card_issuer ?? "N/A",
      cardType: req.body.card_sub_brand ?? "N/A",
      cardCountryCode: req.body.card_issuer_country_code ?? "N/A",
      failedReason: req.body.error ?? "N/A",
    };
    transaction.status = req.body.status;
    await transaction.save();
    return res.redirect(`${process.env.CLIENT_URL}/transactions`);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelPayment = async (req, res) => {
  try {
    const transactionId = req.query.transaction_id;
    const hash = req.query.hash;
    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    if (transaction.hash !== hash) {
      return res.status(401).json({ message: "Unauthorized transaction" });
    }
    transaction.transaction = {
      failedReason: req.body.error ?? "N/A",
    };
    transaction.status = req.body.status;
    await transaction.save();
    return res.redirect(`${process.env.CLIENT_URL}/transactions`);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const ipn = async (req, res) => {
  try {
    const transactionId = req.query.transaction_id;
    const hash = req.query.hash;
    const transaction = await Transaction.findById(transactionId);
    console.log(req.body);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    if (transaction.hash !== hash) {
      return res.status(401).json({ message: "Unauthorized transaction" });
    }
    throw Error("IPN not implemented");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;

    const skip = (pageNumber - 1) * limitNumber;
    const findOptions =
      req.user.userType === "student"
        ? { "from._id": toMongoID(req.user.id) }
        : { "to._id": toMongoID(req.user.id) };
    const rawTransactions = await Transaction.find(findOptions)
      .skip(skip)
      .limit(limitNumber);
    const transactions = rawTransactions.map((transaction) => {
      if (transaction.status === "VALID") {
        return omit(transaction.toJSON(), ["gatewayUrl"]);
      }
      return transaction.toJSON();
    });
    const total = await Transaction.countDocuments(findOptions);
    return res.status(200).json({ transactions, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  initiatePaymment,
  successfulPayment,
  failedPayment,
  cancelPayment,
  ipn,
  getTransactions,
};
