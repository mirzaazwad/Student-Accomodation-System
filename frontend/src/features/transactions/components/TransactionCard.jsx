import { FaCashRegister, FaHouseUser, FaRecycle } from "react-icons/fa";
import IconButton from "../../../components/input/IconButton";
import { useNavigate } from "react-router-dom";

const TransactionCard = ({ transaction, showGateway }) => {
  const navigate = useNavigate();
  const getStyle = (type) => {
    switch (type) {
      case "VALID":
        return "bg-green-500 text-white";
      case "FAILED":
        return "bg-red-500 text-white";
      case "CANCELLED":
        return "bg-yellow-500 text-black";
      case "PENDING":
        return "bg-primary text-white";
      default:
        return "bg-primary text-white";
    }
  };
  return (
    <div className="w-full p-4 bg-white mt-12">
      <div className="w-full rounded-lg shadow-lg flex flex-col">
        <div className="w-full flex flex-col justify-start items-start">
          <div className="w-full bg-primary text-white rounded-t-lg flex justify-between items-center font-semibold p-4">
            For the Booking of: {transaction.apartment.title}
          </div>
          <div className="w-full flex lg:flex-row flex-col justify-start items-start">
            <div
              className={`${getStyle(
                transaction.status
              )} w-fit px-4 py-2 mx-4 my-2 rounded-lg`}
            >
              {transaction.status}
            </div>
            {transaction.status === "FAILED" && (
              <div className="max-w-full w-fit mx-4 my-2 font-bold px-4 py-2 bg-red-200 text-red-800 border border-red-800 rounded-lg shadow-md">
                Failed Reason: {transaction.transaction.failedReason}
              </div>
            )}
          </div>
          <div className="w-full p-4">
            From: <p className="font-bold">{transaction.from.username}</p>
            To: <p className="font-bold">{transaction.to.username}</p>
            Amount: <p className="font-bold">{transaction.amount}</p>
            Date:
            <p className="font-bold">
              {new Date(transaction.createdAt).toLocaleDateString() +
                " " +
                new Date(transaction.createdAt).toLocaleTimeString()}
            </p>
            {(transaction.status === "VALID" ||
              transaction.status === "FAILED") && (
              <div className="w-full m-4 flex flex-col">
                <h1 className="text-lg font-semibold">Payment Details</h1>
                <p className="text-gray-600">
                  Transaction ID: {transaction.transaction.bankTransactionId}
                </p>
                <p className="text-gray-600">
                  Method: {transaction.transaction.cardBrand}
                </p>
                <p className="text-gray-600">
                  Method: {transaction.transaction.cardIssuer}
                </p>
                <p className="text-gray-600">
                  Type: {transaction.transaction.cardType}
                </p>
                <p className="text-gray-600">
                  Country Code: {transaction.transaction.cardCountryCode}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="w-full flex flex-row justify-end items-end px-4 py-2">
          {showGateway && (
            <IconButton
              label={
                transaction.status === "PENDING"
                  ? "Make Payment"
                  : "Retry Payment"
              }
              className="mr-2"
              onClick={() => window.location.replace(transaction.gatewayUrl)}
            >
              {transaction.status === "PENDING" ? (
                <FaCashRegister />
              ) : (
                <FaRecycle />
              )}
            </IconButton>
          )}
          <IconButton
            label="View Apartment"
            className="mr-2"
            onClick={() => navigate(`/appartments/${transaction.apartment.id}`)}
          >
            <FaHouseUser />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
