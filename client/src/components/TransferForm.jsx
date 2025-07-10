import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { userService } from "../services/userService";

const apiUrl = import.meta.env.VITE_API_URL;

export const TransferForm = () => {
  const location = useLocation();
  const fromAccount = location.state?.fromAccount;
  const toAccount = location.state?.toAccount;
  const { accounts } = userService();
  const [transferResult, setTransferResult] = useState(null);

  const [selectedAccount, setSelectedAccount] = useState(
    fromAccount || (accounts && accounts[0]) || null
  );
  const [form, setForm] = useState({
    toAccountNumber: toAccount?.accountNumber || "",
    ifsc: toAccount?.ifsc || "",
    firstname: toAccount?.firstname || toAccount?.firstName || "",
    lastname: toAccount?.lastname || toAccount?.lastName || "",
    amount: "",
    description: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const navigate = useNavigate();
  console.log("Transfer result:", transferResult);

  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      console.error("No token found, redirecting to sign-in page.");
      navigate("/signin");
      return;
    }
  }, [navigate, token]);

  const namesPrefilled = Boolean(
    toAccount?.firstname ||
      toAccount?.firstName ||
      toAccount?.lastname ||
      toAccount?.lastName
  );
  const accountPrefilled = Boolean(toAccount?.accountNumber || toAccount?.ifsc);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAccountChange = (e) => {
    const acc = accounts.find((a) => (a._id || a.id) === e.target.value);
    setSelectedAccount(acc);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    if (!selectedAccount) {
      setError("Please select a source account.");
      setSubmitting(false);
      return;
    }
    const payload = {
      toAccountNumber: Number(form.toAccountNumber),
      ifsc: form.ifsc,
      firstname: form.firstname,
      lastname: form.lastname,
      amount: Number(form.amount),
      description: form.description,
    };

    try {
      const { data } = await axios.post(
        `${apiUrl}/api/v1/transaction/transfer-funds`,
        {
          toAccountNumber: payload.toAccountNumber,
          ifsc: payload.ifsc,
          firstname: payload.firstname,
          lastname: payload.lastname,
          amount: payload.amount,
          description: payload.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "account-number": selectedAccount.accountNumber,
          },
        }
      );
      setTransferResult(data);
      setSuccess("Transaction successful!");
      setShowSuccessModal(true);
      console.log("Transfer Result:", data);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Transfer failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 animate-pop">
        <h3 className="text-2xl font-bold mb-2 text-center">Transfer Funds</h3>
        <div>
          <label className="block text-sm font-medium mb-1">From Account</label>
          <select
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-blue-400"
            value={
              selectedAccount ? selectedAccount._id || selectedAccount.id : ""
            }
            onChange={handleAccountChange}
            required
          >
            <option value="" disabled>
              Select account
            </option>
            {accounts &&
              accounts.map((acc) => (
                <option key={acc._id || acc.id} value={acc._id || acc.id}>
                  {acc.bankName} - {acc.accountNumber} (₹ {acc.balance})
                </option>
              ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              To Account Number
            </label>
            <input
              type="text"
              name="toAccountNumber"
              value={form.toAccountNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-blue-400"
              required
              readOnly={accountPrefilled}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">IFSC</label>
            <input
              type="text"
              name="ifsc"
              value={form.ifsc}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-blue-400"
              required
              readOnly={accountPrefilled}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              type="text"
              name="firstname"
              value={form.firstname}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-blue-400"
              required
              readOnly={namesPrefilled}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              type="text"
              name="lastname"
              value={form.lastname}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-blue-400"
              required
              readOnly={namesPrefilled}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-blue-400"
              required
              min={1}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-blue-400"
              required
            />
          </div>
        </div>
        {error && <div className="text-red-400 text-center">{error}</div>}
        {success && <div className="text-green-400 text-center">{success}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold shadow text-white transition disabled:opacity-60 button-press"
          disabled={submitting}
        >
          {submitting ? "Transferring..." : "Transfer"}
        </button>
      </form>
      {showSuccessModal && transferResult && (
        <>
          <div className="fixed inset-0 z-40 backdrop-blur-xs bg-black/50 rounded-2xl transition-all duration-300 animate-fade" />
          <div className="fixed inset-0 flex items-center justify-center z-50 animate-pop">
            <div className="bg-white rounded-2xl  shadow-2xl p-10 max-w-md w-full text-center relative border border-gray-200 animate-pop">
              <div className="text-4xl mb-4 text-green-500">✔️</div>
              <div className="text-2xl font-bold text-gray-800 mb-2">
                Transaction Successful!
              </div>
              <div className="text-gray-600 mb-6">
                Your transaction was successful.
              </div>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold shadow transition w-full button-press"
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate("/user/transferfunds/details", {
                    state: { transferResult },
                  });
                }}
              >
                View Details
              </button>
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold cursor-pointer button-press"
                onClick={() => setShowSuccessModal(false)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};
