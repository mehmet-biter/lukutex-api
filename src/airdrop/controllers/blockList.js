const BlockListModel = require("../models/BlockList");

exports.fetchAll = (req, res, next) => {
    BlockListModel.fetchAll()
        .then(([rows, fieldData]) =>
            res.status(200).json({
                msg: "Fetch block list successfully!",
                payload: rows,
            })
        )
        .catch((err) =>
            res.status(500).json({
                msg: "Fetch block list failed",
                err: err,
            })
        );
};

exports.findUserID = (req, res, next) => {
    const userID = req.params.userID;
    BlockListModel.findUserID(userID)
        .then(([rows, fieldData]) =>
            res.status(200).json({
                msg: "Find block userid successfully!",
                payload: rows,
            })
        )
        .catch((err) =>
            res.status(500).json({
                msg: "Fetch block userid failed",
                err: err,
            })
        );
};

exports.blockUser = (req, res, next) => {
    const userID = req.params.userID;
    const block = new BlockListModel(
        userID
    );

    block.save()
        .then((result) =>
            res.status(200).json({
                msg: "Block user successfully!",
            })
        )
        .catch((err) => {
            return err;
        });
}