import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "../../../components/LoadingComponent";
import { axios } from "../../../utils/RequestHandler";
import IconButton from "../../../components/input/IconButton";
import { FaCashRegister, FaCheck, FaHouseUser } from "react-icons/fa";
import RoommateCard from "./RoommateCard";

const Bookings = () => {
  const getStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500 text-black";
      case "Approved":
        return "bg-indigo-600 text-white";
      case "Rejected":
        return "bg-red-500 text-white";
      case "Confirm":
        return "bg-primary text-white";
      case "Paid":
        return "bg-green-600 text-white";
      default:
        return "bg-primary text-white";
    }
  };
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`/apartment/fetch/bookings`);
      setBookings(response.data);
    } catch (error) {
      setError(error.response.data.message || "Failed to Retrieve Bookings");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status, bookingId, appartmentId) => {
    try {
      setLoading(true);
      await axios.patch(`/apartment/status/${appartmentId}/${bookingId}`, {
        status,
      });
      window.location.reload();
    } catch (error) {
      setError(error.response.data.message || "Failed to Retrieve Bookings");
    } finally {
      setLoading(false);
    }
  };

  const makePayment = async (booking) => {
    try {
      setLoading(true);
      const response = await axios.post(`/transaction/make-payment`, {
        from: user._id,
        to: booking.student.id,
        amount: 5000,
        appartmentId: booking.apartmentId,
        bookingId: booking._id,
      });
      window.location.replace(response.data.gatewayUrl);
    } catch (error) {
      setError(error.response.data.message || "Failed to Make Payment");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div className="w-full md:w-5/6 mx-4 px-4 py-2 bg-white rounded-lg shadow-md my-4 overflow-x-auto scrollbar-hide">
      <h1 className="text-2xl font-semibold">Bookings</h1>
      <div className="flex gap-4 flex-col justify-center items-center">
        {error && (
          <div className="w-full m-4 p-4 bg-red-200 text-red-800 border border-red-800 text-center">
            {error}
          </div>
        )}
        {!bookings ||
          (bookings.length === 0 && (
            <div className="w-full m-4 p-4 bg-red-200 text-red-800 border border-red-800 text-center">
              {user.userType === "student"
                ? "You have not made any bookings yet."
                : "You have not received any bookings yet."}
            </div>
          ))}
        {bookings &&
          bookings.map((booking, index) => (
            <div
              key={index}
              className="w-full m-2 p-4 flex-shrink-0 flex flex-col items-center gap-4 rounded-lg shadow-md justify-center items-start"
            >
              <div className="w-full flex flex-col items-start justify-start p-4">
                <div className="w-full flex rounded-t-lg bg-primary p-2 text-white my-2">
                  <h1 className="text-xl font-semibold">{booking.title}</h1>
                </div>
                <div className="w-full flex flex-col items-start justify-start p-4">
                  <div className="w-full flex flex-row justify-between items-start">
                    <h2 className="text-lg font-semibold px-2 py-1">
                      {booking.location.address}
                    </h2>
                    <div
                      className={`text-lg font-semibold px-2 py-1 rounded-lg mx-2 ${getStyle(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </div>
                  </div>
                  <p className="text-gray-600">{booking.description}</p>
                  <p className="text-gray-600">Rent: {booking.rent} BDT</p>
                  <p className="text-gray-600">
                    From: {new Date(booking.checkIn).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    To: {new Date(booking.checkOut).toLocaleDateString()}
                  </p>
                  <div className="w-full flex flex-row flex-wrap">
                    {booking.roommates &&
                      booking.roommates.map((roommate, index) => (
                        <RoommateCard key={index} roommate={roommate} />
                      ))}
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-row justify-end items-end gap-2">
                <IconButton
                  label="View Apartment"
                  onClick={() =>
                    navigate(`/appartments/${booking.apartmentId}`)
                  }
                >
                  <FaHouseUser />
                </IconButton>
                {booking.roomatesConfirmed &&
                  user.userType === "student" &&
                  booking.status === "Pending" && (
                    <IconButton
                      label="Confirm Booking"
                      onClick={() =>
                        updateStatus(
                          "Confirm",
                          booking._id,
                          booking.apartmentId
                        )
                      }
                    >
                      <FaCheck />
                    </IconButton>
                  )}
                {booking.roomatesConfirmed &&
                  user.userType === "landlord" &&
                  booking.status === "Confirm" && (
                    <IconButton
                      label="Approve Booking"
                      onClick={() =>
                        updateStatus(
                          "Approved",
                          booking._id,
                          booking.apartmentId
                        )
                      }
                    >
                      <FaCheck />
                    </IconButton>
                  )}
                {booking.status === "Approved" &&
                  user.userType === "student" && (
                    <IconButton
                      label="Make Payment"
                      onClick={() => makePayment(booking)}
                    >
                      <FaCashRegister />
                    </IconButton>
                  )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Bookings;
