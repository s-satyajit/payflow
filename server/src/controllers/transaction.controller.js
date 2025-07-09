import mongoose from "mongoose";
import { Account } from "../models/account.model.js";
import { Transaction } from "../models/transaction.model.js";
import { transactionSchema } from "../schemas/transaction.schema.js";
import { Notification } from "../models/notification.model.js";
import { User } from "../models/user.model.js";

export const transferFunds = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const transactionResult = transactionSchema.safeParse(req.body);
  if (!transactionResult.success)
    return res.status(500).json({ message: `Invalid input for transaction` });
  const { toAccountNumber, ifsc, firstname, lastname, amount, description } =
    transactionResult.data;
  const id = req.body.id;
  try {
    const senderAccount = await Account.findById(id).session(session);
    if (!senderAccount) {
      throw new Error("No primary account found for sender");
    }

    const numTo = Number(toAccountNumber);
    const code = ifsc.toUpperCase();

    console.log(`Querying receiver accountNumber: ${numTo} & ifsc: ${code}`);

    const receiverAccount = await Account.findOne({
      accountNumber: numTo,
      ifsc: code,
    }).session(session);
    // .populate('user')

    if (!receiverAccount) {
      throw new Error("Recipient not found or details mismatch");
    }

    const receiverUser = await User.findById(receiverAccount.user).session(
      session
    );
    const senderUser = await User.findById(senderAccount.user).session(session);
    if (
      !receiverUser ||
      receiverUser.firstname !== firstname ||
      receiverUser.lastname !== lastname
    ) {
      throw new Error("Receiver's name doesn't match account details");
    }

    if (senderAccount.balance < amount) {
      throw new Error("Insufficient Funds!");
    }

    senderAccount.balance -= amount;
    receiverAccount.balance += amount;

    const senderFullName = `${senderUser.firstname} ${senderUser.lastname}`;
    const receiverFullName = `${receiverUser.firstname} ${receiverUser.lastname}`;
    const transaction = await Transaction.create(
      [
        {
          sendorAccount: senderAccount._id,
          receiverAccount: receiverAccount._id,
          amount: amount,
          description:
            description ||
            `Transfer to ${receiverUser.firstname} ${receiverUser.lastname}`,
          status: "completed",
          referenceId: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          metadata: {
            senderName: senderFullName,
            receiverName: receiverFullName,
            senderAccountNumber: senderAccount.accountNumber,
            receiverAccountNumber: receiverAccount.accountNumber,
          },
        },
      ],
      { session, ordered: true }
    );

    await senderAccount.save({ session });
    await receiverAccount.save({ session });

    const notification = await Notification.create(
      [
        {
          user: senderUser,
          type: "transaction",
          title: "Funds Sent",
          message: `You sent ${amount} to ${receiverUser.firstname}  ${receiverUser.lastname}`,
        },
        {
          user: receiverUser,
          type: "transaction",
          title: "Funds Received",
          message: `Your received ${amount} from ${senderUser.firstname} ${senderUser.lastname}`,
        },
      ],
      { session, ordered: true }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      ...transaction[0].toObject(),
      senderAccount: {
        id: senderAccount.user,
        accountNumber: senderAccount.accountNumber,
        bankName: senderAccount.bankName,
        balance: senderAccount.balance,
      },
      receiverAccount: {
        id: receiverAccount.user,
        accountNumber: receiverAccount.accountNumber,
        bankName: receiverAccount.bankName,
        balance: receiverAccount.balance,
      },
      notification,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error(`Transaction Failed ${err}`);
    res.status(400).json({ message: `Internal Server Error, ${err}` });
  }
};

export const getUserTransactions = async (req, res) => {
  try {
    const { userId } = req.body;
    const accounts = await Account.find({
      user: userId,
    });
    console.log(accounts);
    const accountIds = accounts.map((acc) => acc._id);
    console.log(accountIds);

    const transactions = await Transaction.find({
      $or: [{ senderAccount: { $in: accountIds } }],
    })
      .sort({ createdAt: -1 })
      .populate("senderAccount", "accountNumber bankName")
      .populate("receiverAccount", "accountNumber bankName")
      .lean();

    console.log(transactions);

    const formattedTransactions = transactions.map((txn) => ({
      id: txn._id,
      amount: txn.amount,
      description: txn.description,
      date: txn.createdAt,
      reference: txn.referenceId,
      receiver: {
        accountNumber: txn.metadata.receiverAccountNumber,
        name: txn.metadata.receiverName || "Unknown",
      },
      sender: {
        accountNumber: txn.sendorAccount.accountNumber,
        bankName: txn.sendorAccount.bankName,
      },
      status: txn.status,
    }));

    res.json(formattedTransactions);
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .json({ error: "Failed to fetch transactions", details: err.message });
  }
};
