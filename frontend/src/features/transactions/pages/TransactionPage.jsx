import { useTransaction } from "../hooks/useTransaction";
import LoadingComponent from "../../../components/LoadingComponent";
import TransactionCard from "../components/TransactionCard";
import Pagination from "../../../components/Pagination";
import { useSelector } from "react-redux";

const TransactionPage = () => {
  const { page, setPage, limit, error, total, loading, transactions } =
    useTransaction();
  const user = useSelector((state) => state.auth.user);

  if (loading) {
    return <LoadingComponent />;
  }
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-12">
      {error && (
        <div className="w-full bg-red-200 text-red-800 p-4 text-center font-semibold">
          {error}
        </div>
      )}
      <Pagination
        totalPages={total}
        page={page}
        limit={limit}
        siblingCount={1}
        onPageChange={(page) => setPage(page)}
      />
      {transactions &&
        transactions.map((transaction, index) => (
          <TransactionCard
            key={index}
            transaction={transaction}
            showGateway={
              transaction.status !== "VALID" && user.userType === "student"
            }
          />
        ))}
    </div>
  );
};

export default TransactionPage;
