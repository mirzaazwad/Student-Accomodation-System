const Apartment = require("../models/appartment.model");
const Transaction = require("../models/transaction.model");
const { User } = require("../models/user.model");
const { SSLCommerzService } = require("../providers/sslcommerz");
const bcrypt = require("bcrypt");
const { toMongoID } = require("../utils/Helper");

const initiatePaymment = async (req, res) => {
  try {
    const { from, to, amount, appartmentId } = req.body;
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
    });
    await transaction.save();
    const sslcommerz = await SSLCommerzService.init(transaction._id);
    const gatewayUrl = await sslcommerz.makePaymentRequest();
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
    transaction.status = "Successful";
    await transaction.save();
    return res.status(200).json({ message: "Payment successful" });
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
    transaction.status = "Failed";
    await transaction.save();
    return res.status(200).json({ message: "Payment failed" });
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
    transaction.status = "Cancelled";
    await transaction.save();
    return res.status(200).json({ message: "Payment cancelled" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const ipn = async (req, res) => {
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
    throw Error("IPN not implemented");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTransactionsForLandlord = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      "to._id": toMongoID(req.user.id),
    });
    return res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTransactionsForStudent = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      "from._id": toMongoID(req.user.id),
    });
    return res.status(200).json(transactions);
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
  getTransactionsForLandlord,
  getTransactionsForStudent,
};
