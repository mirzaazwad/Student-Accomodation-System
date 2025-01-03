const SSLCommerzPayment = require("sslcommerz").SslCommerzPayment;
const Transaction = require("../models/transaction.model");
const { User } = require("../models/user.model");

class SSLCommerzService {
  sslCommerzInstance = null;
  constructor({ user, transaction }) {
    this.user = {
      cus_name: user.name,
      cus_email: user.email,
      cus_add1: user.location.address,
      cus_city: user.location.address,
      cus_state: user.location.address,
      cus_postcode: user.location.address,
      cus_country: user.location.address,
    };
    this.order = {
      tran_id: transaction._id,
      currency: "BDT",
      total_amount: user.amount,
      multi_card_name: "mastercard",
    };
    const port = process.env.PORT || 5000;
    this.routes = {
      success_url: `http://localhost:${port}/success?transaction_id=${transaction._id}&hash=${transaction.hash}`,
      fail_url: `http://localhost:${port}/fail?transaction_id=${transaction._id}&hash=${transaction.hash}`,
      cancel_url: `http://localhost:${port}/cancel?transaction_id=${transaction._id}&hash=${transaction.hash}`,
      ipn_url: `http://localhost:${port}/ipn?transaction_id=${transaction._id}&hash=${transaction.hash}`,
    };
    this.product = {
      product_name: transaction.appartment.title,
      product_category: "Rent",
      product_profile: "general",
    };
  }

  async init(transactionId) {
    const transaction = await Transaction.findById(transactionId);
    const user = await User.findById(transaction.from._id);
    if (!transaction) {
      throw Error("Transaction not found");
    }
    const sslcommerz = new SSLCommerzService({
      user,
      transaction,
    });
    this.sslCommerzInstance = sslcommerz;
    return this.sslCommerzInstance;
  }

  async makePaymentRequest() {
    const paymentData = {
      ...this.user,
      ...this.order,
      ...this.product,
      ...this.routes,
    };
    const sslcommer = new SSLCommerzPayment("testbox", "qwerty", false);
    const result = await sslcommer.init(paymentData);
    if (result?.GatewayPageURL) {
      return result.GatewayPageURL;
    } else {
      throw Error(
        "Could not retrieve Gateway Page URL, due to:  " + result.failedreason
      );
    }
  }
}

module.exports = { SSLCommerzService };
