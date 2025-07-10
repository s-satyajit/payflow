import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { transactionService } from "../services/transactionService";

export const TransactionHistory = () => {
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterAccount, setFilterAccount] = useState("");

  const { transactions } = transactionService();
  const navigate = useNavigate();

  useEffect(() => {
    setFilteredTransactions(transactions);
  }, [transactions]);

  const handleFilter = () => {
    if (!filterAccount) {
      setFilteredTransactions(transactions);
      setFilterOpen(false);
      return;
    }
    const filtered = transactions.filter(
      (txn) =>
        txn.sender?.accountNumber === filterAccount ||
        txn.receiver?.accountNumber === filterAccount
    );
    setFilteredTransactions(filtered);
    setFilterOpen(true);
  };

  const handleRowClick = (txn) => {
    navigate("/user/transferfunds/details", {
      state: {
        transferResult: txn,
        senderAccountNumber: txn.sender?.accountNumber,
        receiverAccountNumber: txn.receiver?.accountNumber,
        referenceId: txn.reference,
        date: txn.date,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white py-10 px-4 animate-fade">
      <div className="max-w-5xl mx-auto animate-pop">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              className="p-2 rounded-full bg-gray-800 hover:bg-blue-800 text-blue-300 hover:text-white shadow transition button-press"
              onClick={() => navigate('/user/dashboard')}
              aria-label="Back to Dashboard"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Transaction History
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-semibold shadow transition text-white cursor-pointer"
              onClick={() => setFilterOpen((open) => !open)}
            >
              Filter
            </button>
          </div>
        </div>
        <div
          className={`transition-all duration-300 ease-in-out ${filterOpen ? 'filter-drawer-open' : 'filter-drawer-closed'}`}
          style={{ overflow: 'hidden', maxHeight: filterOpen ? '200px' : '0', opacity: filterOpen ? 1 : 0 }}
        >
          <div className="mb-6 flex items-center gap-2 bg-gray-800 p-4 rounded-lg shadow animate-filter-drawer">
            <input
              type="text"
              className="px-3 py-2 rounded bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-blue-400"
              placeholder="Enter account number to filter"
              value={filterAccount}
              onChange={(e) => setFilterAccount(e.target.value)}
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold shadow text-white cursor-pointer"
              onClick={handleFilter} 
            >
              Apply
            </button>
            <button
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded font-semibold shadow text-white cursor-pointer"
              onClick={() => {
                setFilterAccount("");
                setFilteredTransactions(transactions);
                setFilterOpen(false);
              }}
            >
              Reset
            </button>
          </div>
        </div>
        {filteredTransactions.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center text-gray-400 shadow-lg">
            No transactions found.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-2xl border border-gray-700">
            <table className="min-w-full bg-gray-900 rounded-xl">
              <thead>
                <tr className="text-blue-200 text-left text-sm">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Sender</th>
                  <th className="py-3 px-4">Receiver</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((txn) => (
                  <tr
                    key={txn.id}
                    className="border-b border-gray-800 transition group cursor-pointer table-row-animate"
                    onClick={() => handleRowClick(txn)}
                  >
                    <td className="py-2 px-4 whitespace-nowrap text-gray-200 group-hover:text-blue-300">
                      {txn.date ? new Date(txn.date).toLocaleString() : "N/A"}
                    </td>
                    <td className="py-2 px-4 font-mono text-xs text-blue-300 group-hover:text-blue-400">
                      {txn.reference}
                    </td>
                    <td className="py-2 px-4 text-gray-100">
                      {txn.description}
                    </td>
                    <td
                      className={`py-2 px-4 font-bold ${
                        txn.amount > 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      ₹ {txn.amount}
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex flex-col">
                        <span className="font-mono text-xs text-gray-300">
                          {txn.sender?.accountNumber}
                        </span>
                        <span className="text-gray-400 text-xs">
                          {txn.sender?.bankName}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex flex-col">
                        <span className="font-mono text-xs text-gray-300">
                          {txn.receiver?.accountNumber}
                        </span>
                        <span className="text-gray-400 text-xs">
                          {txn.receiver?.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          txn.status === "completed"
                            ? "bg-green-700 text-green-200"
                            : txn.status === "failed"
                            ? "bg-red-700 text-red-200"
                            : "bg-yellow-700 text-yellow-200"
                        }`}
                      >
                        {txn.status.charAt(0).toUpperCase() +
                          txn.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
