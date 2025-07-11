import { User } from "../models/user.model.js";
import { Account } from "../models/account.model.js";

export const getUserDetails = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID not found in request" });
    }
    const user = await User.findById(userId).populate("account").lean();
    if (!user) {
      return res.status(404).json({ message: `User not found` });
    }
    const payload = {
      id: user._id,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
    };
    if (user.account && user.account.length > 0) {
      payload.account = user.account.map((acc) => ({
        id: acc._id,
        accountNumber: acc.accountNumber,
        ifsc: acc.ifsc,
        bankName: acc.bankName,
        balance: acc.balance,
      }));
    }
    res.status(200).json(payload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Internal Server Error: ${err.message}` });
  }
};
