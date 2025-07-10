import axios from "axios";
import { useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL;

const BANKS = [
  "State Bank of India",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Federal Bank",
  "Bank of Baroda",
  "Punjab National Bank",
  "Bank of America",
  "Chase Bank",
  "Wells Fargo",
];
const ACCOUNT_TYPES = ["Savings", "Current"];

function generateAccountNumber() {
  return Math.floor(1000000000 + Math.random() * 9000000000);
}
function generateIFSC() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";
  for (let i = 0; i < 4; i++)
    code += chars[Math.floor(Math.random() * chars.length)];
  return code + Math.floor(1000000 + Math.random() * 9000000).toString();
}

export const CreateAccountForm = () => {
  const [accountNumber] = useState(generateAccountNumber());
  const [ifsc] = useState(generateIFSC());
  const [bankName, setBankName] = useState(BANKS[0]);
  const [accountType, setAccountType] = useState(ACCOUNT_TYPES[0]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${apiUrl}/api/v1/account/create-account`,
        {
          accountNumber: Number(accountNumber),
          ifsc,
          bankName,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(data);
      setSuccess("Account created successfully!");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Account creation failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 animate-fade">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 rounded-3xl shadow-2xl p-8 max-w-md w-full border border-gray-800 flex flex-col gap-6 animate-pop transition-transform duration-300 hover:scale-101"
      >
        <h2 className="text-2xl font-bold text-blue-400 mb-2 text-center">
          Create New Account
        </h2>
        <div>
          <label className="block text-sm font-medium mb-1 text-blue-200">
            Account Number
          </label>
          <input
            type="text"
            value={accountNumber}
            readOnly
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-blue-400 focus:outline-none text-lg shadow cursor-not-allowed opacity-80"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-blue-200">
            IFSC Code
          </label>
          <input
            type="text"
            value={ifsc}
            readOnly
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-blue-400 focus:outline-none text-lg shadow cursor-not-allowed opacity-80"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-blue-200">
            Bank Name
          </label>
          <select
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-blue-400 focus:outline-none text-lg shadow"
            required
          >
            {BANKS.map((bank) => (
              <option key={bank} value={bank}>
                {bank}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-blue-200">
            Account Type
          </label>
          <select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-blue-400 focus:outline-none text-lg shadow"
          >
            {ACCOUNT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        {error && (
          <div className="text-red-400 text-center text-sm">{error}</div>
        )}
        {success && (
          <div className="text-green-400 text-center text-sm">{success}</div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-3 shadow text-lg transition button-press"
          disabled={submitting}
        >
          {submitting ? "Creating..." : "Create Account"}
        </button>
      </form>
    </div>
  );
};
