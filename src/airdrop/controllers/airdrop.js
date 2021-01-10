const AirdropModel = require("../models/Airdrop");

exports.fetchAllAirdrop = async(req, res, next) => {
    try {
        const fetchedAirdrop = await AirdropModel.fetchAll();
        res.status(200).json({
            msg: "Fetch successfully!",
            payload: fetchedAirdrop[0]
        });
    } catch (error) {
        res.status(500).json({
            msg: "Fetch all airdrop failed",
            payload: [],
            err: error,
        });
    };
};

exports.fetchAirdropById = (req, res, next) => {
    const id = +req.params.id;
    AirdropModel.findByAirdropId(id)
        .then(([rows, fieldData]) =>
            res.status(200).json({
                msg: "Fetch successfully!",
                payload: rows,
            })
        )
        .catch((err) =>
            res.status(500).json({
                msg: "Fetch failed",
                payload: [],
                err: err,
            })
        );
};

exports.createAirdrop = (req, res, next) => {
    const airdropData = req.body;
    const airdrop = new AirdropModel(
        airdropData.airdrop_name,
        airdropData.total_tokens,
        airdropData.tokens_per_claim,
        airdropData.remain_tokens,
        airdropData.token_name,
        airdropData.max_participants,
        airdropData.start_date,
        airdropData.end_date,
        airdropData.deliver_date
    );
    airdrop
        .save()
        .then((result) =>
            res.status(200).json({
                msg: "Save successfully!",
                payload: [],
            })
        )
        .catch((err) =>
            res.status(500).json({
                msg: "Save failed",
                payload: [],
                err: err,
            })
        );
};


exports.fetchWaitingAirdriop = async(req, res, next) => {
    const pageNumber = +req.params.page;
    const pageSize = +req.params.size;
    try {
        const waitingList = await AirdropModel.fetchWaitingAirdrop(pageNumber, pageSize)
        const waitingTotal = await AirdropModel.getWaitingTotal();
        res.status(200).json({
            msg: "Fetch waiting airdrop list successfully!",
            payload: waitingList[0],
            total: waitingTotal[0][0].total
        })
    } catch (error) {
        res.status(404).json({
            msg: "Fetch waiting airdrop list failed",
            payload: [],
            err: error,
        })
    }
};

exports.fetchOpeningAirdriop = async(req, res, next) => {
    const pageNumber = +req.params.page;
    const pageSize = +req.params.size;
    try {
        const openingList = await AirdropModel.fetchOpeningAirdrop(pageNumber, pageSize)
        const openingTotal = await AirdropModel.getOpeningTotal();
        res.status(200).json({
            msg: "Fetch opening airdrop list successfully!",
            payload: openingList[0],
            total: openingTotal[0][0].total
        })
    } catch (error) {
        res.status(404).json({
            msg: "Fetch waiting airdrop list failed",
            payload: [],
            err: error,
        })
    }
};

exports.fetchDeliveringAirdriop = async(req, res, next) => {
    const pageNumber = +req.params.page;
    const pageSize = +req.params.size;
    try {
        const deliveringList = await AirdropModel.fetchDelieveringAirdrop(pageNumber, pageSize)
        const deliveringTotal = await AirdropModel.getDeliveringTotal();
        res.status(200).json({
            msg: "Fetch delivering airdrop list successfully!",
            payload: deliveringList[0],
            total: deliveringTotal[0][0].total
        })
    } catch (error) {
        res.status(404).json({
            msg: "Fetch delivering airdrop list failed",
            payload: [],
            err: error,
        })
    }
};

exports.fetchDeliveredAirdriop = async(req, res, next) => {
    const pageNumber = +req.params.page;
    const pageSize = +req.params.size;
    try {
        const deliveredList = await AirdropModel.fetchDeliveredAirdrop(pageNumber, pageSize)
        const deliveredTotal = await AirdropModel.getDeliveredTotal();
        res.status(200).json({
            msg: "Fetch delivered airdrop list successfully!",
            payload: deliveredList[0],
            total: deliveredTotal[0][0].total
        })
    } catch (error) {
        res.status(404).json({
            msg: "Fetch delivered airdrop list failed",
            payload: [],
            err: error,
        })
    }
};