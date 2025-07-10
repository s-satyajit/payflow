import { useLocation, useNavigate } from "react-router-dom";
import { TransferForm } from "../components/TransferForm";
import { userService } from "../services/userService";

export const TransferFunds = () => {
  const { accounts } = userService();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAccountClick = (account) => {
    navigate("/user/transferfunds/form", { state: { fromAccount: account } });
    console.log(account);
  };

  const isModalOpen = location.pathname.endsWith("/form");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white py-10 px-4 flex flex-col items-center relative animate-fade">
      <div
        className={`max-w-2xl w-full mx-auto transition-all duration-300 ${
          isModalOpen ? "filter blur-sm pointer-events-none select-none" : ""
        } animate-pop`}
      >
        <h2 className="text-3xl font-extrabold tracking-tight mb-8">
          <span className="flex items-center gap-3">
            <button
              className="p-2 rounded-full bg-gray-800 hover:bg-blue-800 text-blue-300 hover:text-white shadow transition button-press"
              onClick={() => navigate('/user/dashboard')}
              aria-label="Back to Dashboard"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span>Choose an account to transfer funds from</span>
          </span>
        </h2>
        <div className="w-full grid grid-cols-1 gap-4">
          {accounts && accounts.length > 0 ? (
            accounts.map((account) => (
              <div
                key={account._id || account.id}
                className="bg-gray-800 rounded-lg p-6 shadow-lg cursor-pointer hover:bg-blue-800 transition border border-gray-700 flex flex-col gap-2 animate-fade button-press"
                onClick={() => handleAccountClick(account)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">
                    {account.bankName}
                  </span>
                  <span className="font-mono text-sm text-gray-400">
                    {account.accountNumber}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span>Balance:</span>
                  <span className="font-bold text-green-400">
                    ₹ {account.balance}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-gray-900 rounded-lg p-8 text-center text-gray-400 shadow-lg">
              No accounts found. Please create an account first.
            </div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none animate-fade">
          <div className="backdrop-blur-md bg-black/40 rounded-xl shadow-2xl p-8 max-w-lg w-full relative pointer-events-auto animate-pop">
            <TransferForm />
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl font-bold cursor-pointer"
              onClick={() => navigate(-1)}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
