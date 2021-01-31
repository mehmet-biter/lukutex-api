const BuyHistoryModel = require('../models/BuyHistory');

exports.getTotalBuyers = async(req, res, next) => {
    const ieoID = req.params.ieo_id;
    try {
        const totalBuyers = await BuyHistoryModel.getTotalBuyer(ieoID);
        res.status(200).json({
            msg: "Get total buyers successfully",
            totalBuyers: totalBuyers[0].length,
        })
    } catch (error) {
        res.status(400).json({
            msg: "Get total buyers failed",
            totalBuyers: 0,
            err: error,
        })
    }
}