import { useLocation, useNavigate } from "react-router-dom";

export const TransferDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const transferResult = location.state?.transferResult;
  const senderAccountNumber =
    location.state?.senderAccountNumber ||
    transferResult?.senderAccount?.accountNumber ||
    transferResult?.sender?.accountNumber;
  const receiverAccountNumber =
    location.state?.receiverAccountNumber ||
    transferResult?.receiverAccount?.accountNumber ||
    transferResult?.receiver?.accountNumber;
  const referenceId =
    location.state?.referenceId ||
    transferResult?.referenceId ||
    transferResult?.reference;
  const date =
    location.state?.date || transferResult?.createdAt || transferResult?.date;

  if (!transferResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center">
          <div className="text-2xl font-bold mb-2">
            No transfer details found.
          </div>
          <button
            className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-semibold"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const sender = transferResult.senderAccount || transferResult.sender;
  const receiver = transferResult.receiverAccount || transferResult.receiver;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white px-2">
      <div className="bg-white text-gray-900 p-10 rounded-3xl shadow-2xl max-w-lg w-full border border-gray-200 relative">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-green-100 text-green-600 rounded-full p-4 mb-3 shadow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div className="text-2xl font-bold mb-1 text-center">
            Transaction Successful
          </div>
          <div className="text-gray-500 text-center">
            Your funds have been transferred successfully.
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          <div className="py-4 flex items-center justify-between">
            <span className="font-semibold text-gray-600">Status</span>
            <span className="text-green-600 font-bold capitalize">
              {transferResult.status}
            </span>
          </div>
          <div className="py-4 flex items-center justify-between">
            <span className="font-semibold text-gray-600">Reference ID</span>
            <span className="font-mono text-gray-800">{referenceId}</span>
          </div>
          <div className="py-4 flex items-center justify-between">
            <span className="font-semibold text-gray-600">Date</span>
            <span className="text-gray-800">
              {date ? new Date(date).toLocaleString() : "-"}
            </span>
          </div>
          <div className="py-4 flex items-center justify-between">
            <span className="font-semibold text-gray-600">Amount</span>
            <span className="font-bold text-blue-700 text-lg">
              ₹ {transferResult.amount}
            </span>
          </div>
          <div className="py-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-600">Sender</span>
            </div>
            <div className="ml-6 text-sm text-gray-500">
              {sender?.bankName} &middot; {senderAccountNumber}
            </div>
          </div>
          <div className="py-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-600">Receiver</span>
            </div>
            <div className="ml-6 text-sm text-gray-500">
              {receiver?.bankName} &middot; {receiverAccountNumber}
            </div>
          </div>
          <div className="py-4 flex items-center justify-between">
            <span className="font-semibold text-gray-600">Description</span>
            <span className="text-gray-800">{transferResult.description}</span>
          </div>
        </div>
        <button
          className="mt-8 w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold shadow text-white transition text-lg cursor-pointer"
          onClick={() => navigate("/user/dashboard")}
        >
          Back to Dashboard
        </button>
        <button
          className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-blue-700 px-4 py-2 rounded-lg font-semibold shadow transition text-lg border border-gray-300 flex items-center justify-center gap-2"
          onClick={() => navigate("/user/transactions")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 7h18M3 12h18M3 17h18"
            />
          </svg>
          See all transactions
        </button>
      </div>
    </div>
  );
};
