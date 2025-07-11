import { Account } from "../models/account.model.js";
import { User } from "../models/user.model.js";
import { accountSchema } from "../schemas/account.schema.js";

export const getAccount = async (req, res) => {
  const account = await Account.find({ accountNumber: req.body.accountNumber });
  if (!account)
    return res.status(404).json({ message: `Account doesn't exist` });
  const payload = {
    id: account._id,
    accountNumber: account.accountNumber,
    ifsc: account.ifsc,
    bankName: account.bankName,
    balance: account.balance,
  };
  if (account.transactions && account.transactions.length > 0) {
    payload.transactions = account.transactions.map((txn) => ({
      id: txn._id,
      amount: txn.amount,
      description: txn.description,
      date: txn.createdAt,
      referenceId: txn.referenceId,
      senderAccount: {
        id: txn.senderAccount._id,
        accountNumber: txn.senderAccount.accountNumber,
        bankName: txn.senderAccount.bankName,
        balance: txn.senderAccount.balance,
      },
      receiverAccount: {
        id: txn.receiverAccount._id,
        accountNumber: txn.receiverAccount.accountNumber,
        bankName: txn.receiverAccount.bankName,
        balance: txn.receiverAccount.balance,
      },
      status: txn.status,
    }));
  }
  res.json({
    accountDetails: account.map((a) => ({
      accountNumber: a.accountNumber,
      ifsc: a.ifsc,
      bankName: a.bankName,
      balance: a.balance,
    })),
  });
};

export const createAccount = async (req, res) => {
  const accountResult = accountSchema.safeParse(req.body);
  if (!accountResult) {
    res.status(400).json({
      message: `Invalid Input`,
      error: accountResult.error.errors,
    });
  }

  const { accountNumber, ifsc, bankName } = accountResult.data;

  try {
    const existingAccount = await Account.findOne({ accountNumber });
    if (existingAccount) {
      return res.status(400).json({ error: `Account already exists` });
    }
    const account = await Account.create({
      user: req.userId,
      accountNumber,
      ifsc,
      bankName,
    });
    await User.findByIdAndUpdate(req.userId, {
      $push: { account: account._id },
    });
    res.status(201).json(account);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: `Internal Server error ${err.message}`,
    });
  }
};

export const searchAccounts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: `Search query not provided` });

    const account = await Account.find({
      $or: [{ accountNumber: q }, { ifsc: q }, { bankName: { $regex: q } }],
    }).populate('user', 'firstname lastname');

    res.json({
      user: account.map((u) => ({
        id: u._id,
        firstname: u.user?.firstname || "",
        lastname: u.user?.lastname || "",
        accountNumber: u.accountNumber,
        ifsc: u.ifsc,
        bankName: u.bankName,
      })),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: `Internal Server Error ${err.message}` });
  }
};
