const SSLCommerzPayment = require("sslcommerz").SslCommerzPayment;
const Apartment = require("../models/appartment.model");
const Transaction = require("../models/transaction.model");
const { User } = require("../models/user.model");

class SSLCommerzService {
  sslCommerzInstance = null;
  constructor({ user, transaction }) {
    this.user = {
      cus_name: user.username,
      cus_email: user.email,
      cus_add1: user.location.address,
      cus_city: user.location.address,
      cus_state: user.location.address,
      cus_postcode: user.location.address,
      cus_country: user.location.address,
      cus_phone: "01991581338",
    };
    this.order = {
      tran_id: transaction._id.toString(),
      currency: "BDT",
      total_amount: transaction.amount,
      multi_card_name: "mastercard",
    };
    const port = process.env.PORT || 5000;
    const api = process.env.API_URL || `http://localhost:${port}`;
    this.routes = {
      success_url: `${api}/transaction/success?transaction_id=${transaction._id}&hash=${transaction.hash}`,
      fail_url: `${api}/transaction/fail?transaction_id=${transaction._id}&hash=${transaction.hash}`,
      cancel_url: `${api}/transaction/cancel?transaction_id=${transaction._id}&hash=${transaction.hash}`,
      ipn_url: `${api}/transaction/ipn?transaction_id=${transaction._id}&hash=${transaction.hash}`,
    };
    this.product = {
      product_name: transaction.apartment.title,
      product_category: "Rent",
      product_profile: "general",
    };
  }

  static async init(transactionId, bookingId) {
    const transaction = await Transaction.findById(transactionId);
    const user = await User.findById(transaction.from._id);
    if (!transaction) {
      throw Error("Transaction not found");
    }
    const apartment = await Apartment.findById(transaction.apartment.id);
    if (!apartment) {
      throw Error("Apartment not found");
    }
    const booking = apartment.bookings.find(
      (booking) => booking._id.toString() === bookingId
    );
    if (!booking) {
      throw Error("Booking not found");
    }
    if (booking.status === "Paid") {
      throw Error("Booking already paid");
    }
    if (transaction.status === "VALID") {
      throw Error("Transaction already paid");
    }
    const sslcommerz = new SSLCommerzService({
      user,
      transaction,
    });
    this.sslCommerzInstance = sslcommerz;
    return this.sslCommerzInstance;
  }

  async makePaymentRequest() {
    try {
      const paymentData = {
        ...this.user,
        ...this.order,
        ...this.product,
        ...this.routes,
        shipping_method: "NO",
      };
      const sslcommerz = new SSLCommerzPayment(
        process.env.SSL_COMMERZ_USERNAME,
        process.env.SSL_COMMERZ_PASSWORD,
        false
      );
      const result = await sslcommerz.init(paymentData);
      if (result?.GatewayPageURL) {
        return result.GatewayPageURL;
      } else {
        throw Error(
          "Could not retrieve Gateway Page URL, due to:  " + result.failedreason
        );
      }
    } catch (err) {
      console.log(err);
      throw Error(err.message);
    }
  }
}

module.exports = { SSLCommerzService };
