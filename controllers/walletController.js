const Wallet = require('./../models/walletsModel');

exports.createWallet = async (req, res) => {
  try {
    const wallet = req.body;
    const checkName = await Wallet.findOne({ name: wallet.name });
    if (checkName) {
      return res.status(400).json({
        status: 'fail',
        message: 'Duplicate wallet name',
      });
    }
    const newWallet = await Wallet.create(wallet);

    res.status(201).json({
      status: 'success',
      data: {
        wallet: newWallet,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.deleteWallet = async (req, res) => {
  try {
    // find wallet by id and delete
    await Wallet.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      message: 'Successfully deleted wallet',
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getAllWallets = async (req, res) => {
  try {
    const wallets = await Wallet.find();

    res.status(200).json({
      status: 'success',
      result: wallets.length,
      data: {
        wallets,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.editWallet = async (req, res) => {
  try {
    const walletId = req.params.id;
    const wallets = await Wallet.findByIdAndUpdate(walletId, {
      name: req.body.name,
      address: req.body.address,
    });

    res.status(201).json({
      status: 'success',
      data: {
        wallets,
      },
    });
  } catch (err) {}
};

exports.getWallet = async (req, res) => {
  try {
    const walletId = req.params.id;
    const wallet = await Wallet.findById({ _id: walletId });

    res.status(200).json({
      status: 'success',
      data: {
        wallet,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
