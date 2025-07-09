import { Account } from "../models/account.model.js";
import { accountSchema } from "../schemas/account.schema.js";

export const getAccount = async (req, res) => {
  const account = await Account.find({ accountNumber: req.body.accountNumber });
  if(!account) return res.status(404).json({message: `Account doesn't exist`})
  res.json({
    accountDetails: account.map((a) => ({
      accountNumber: a.accountNumber,
      ifsc: a.ifsc,
      bankName: a.bankName,
      balance: a.balance
    }))
  })
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
    });

    res.json({
      user: account.map((u) => ({
        id: u._id,
        user: u.user,
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
