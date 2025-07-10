import { useNavigate } from "react-router-dom";
import { userService } from "../services/userService";

export const Dashboard = () => {
    const { username, firstname, lastname, email, phone, accounts, id } =
      userService();
      console.log("my data:", username)

      const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-4xl mx-auto py-10 px-4 animate-fade">
        <div className="bg-gray-800 rounded-xl shadow-lg p-8 flex flex-col md:flex-row gap-8 animate-pop">
          <div className="flex-1 flex flex-col gap-2 justify-center">
            <h2 className="text-2xl font-bold mb-2">
              Welcome, {firstname} {lastname}!
            </h2>
            <div className="text-gray-300">
              Username: <span className="font-mono">{username}</span>
            </div>
            <div className="text-gray-300">
              Email: <span className="font-mono">{email}</span>
            </div>
            <div className="text-gray-300">
              Phone: <span className="font-mono">{phone}</span>
            </div>
            <div className="text-gray-300">
              User ID: <span className="font-mono">{id}</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-4">Your Accounts</h3>
            {accounts.length === 0 ? (
              <div className="text-gray-400">No accounts found.</div>
            ) : (
              <div className="space-y-4">
                {accounts.map((acc) => (
                  <div
                    key={acc.id}
                    className="bg-gray-700 rounded-lg p-4 shadow flex flex-col gap-1 animate-fade"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-lg">
                        Account #{acc.accountNumber}
                      </span>
                      <span className="text-green-400 font-bold text-lg">
                        ₹ {acc.balance}
                      </span>
                    </div>
                    <div className="text-gray-300 text-sm">
                      Bank: {acc.bankName}
                    </div>
                    <div className="text-gray-300 text-sm">
                      IFSC: {acc.ifsc}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mt-10 flex flex-col md:flex-row gap-4 justify-center">
          <button
            className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold shadow transition button-press"
            onClick={() => navigate("/user/transactions")}
          >
            View Transactions
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold shadow transition button-press"
            onClick={() => navigate("/user/transferfunds")}
          >
            Transfer Funds
          </button>
        </div>
      </div>
    </div>
  );
};
