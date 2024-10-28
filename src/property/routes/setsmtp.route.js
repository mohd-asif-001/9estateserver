const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const Setsmtp = require("../../models/setsmtp");
router.get('/smtp', async (req, res, next) => {
    try {
        const data = await Setsmtp.find()
        const total_smtp = await Setsmtp.countDocuments();
        res.send({
            total: total_smtp,
            smtp: data,
        });
    }
    catch (error) {
        next(error)
    }
})

router.get("/getallsmtp", async (req, res, next) => {
    try {
        const smtp = await Setsmtp.find();
        res.send(smtp);
    } catch (error) {
        next(error);
    }
});
router.get("/getsmtpsearch", async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit);
        const offset = parseInt(req.query.offset);
        const search = String(req.query.searchdata);
        const skips = limit * offset;

        var sortObject = {};
        var sort_col = String(req.query.sort_col);
        var sort_order = String(req.query.sort_order);
        sortObject[sort_col] = sort_order;
        if (search) {
            const colName = search;
            const smtpCollection = await Setsmtp.find({
                $or: [
                    { email: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
                ],
            })
                .skip(skips)
                .limit(limit)
                .sort(sortObject);
            const total_pages = await Setsmtp.countDocuments({
                $or: [
                    { email: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
                ],
            });
            res.send({
                total: total_pages,
                data: smtpCollection,
            });
        } else {
            const smtpCollection = await Setsmtp.find()
                .skip(skips)
                .limit(limit)
                .sort(sortObject);
            const total_pages = await Setsmtp.countDocuments();
            res.send({
                total: total_pages,
                data: smtpCollection,
            });
        }
    } catch (error) {
        next(error);
    }
});
//get smtp by ID
router.get('/smtp/:id', async (req, res, next) => {
    try {
        const data = await Setsmtp.find({ _id: req.params.id })
        res.send({ data: data })
    }
    catch (error) {
        next(error)
    }
})
//Create smtp
router.post("/smtp", async (req, res, next) => {
    try {
        console.log(req.body);
        const {
            edriver,
            host,
            port,
            emailencryption,
            email,
            password,
            status,
            created_at,
            updated_at
        } = req.body;

        const smtp = new Setsmtp({
            edriver,
            host,
            port,
            emailencryption,
            email,
            password,
            status,
            created_at,
            updated_at
        });
        const addsmtp = await smtp.save();
        res.send(addsmtp);
    } catch (error) {
        next(error);
    }
});
//Update smtp
router.patch("/smtp/:id", async (req, res, next) => {
    try {
        const update = req.body;
        const id = req.params.id;
        const option = { new: true };
        const updatedDetails = await Setsmtp.findByIdAndUpdate(id, update, option);
        res.send(updatedDetails);
    } catch (error) {
        next(error);
    }
});
//Update allsmtp
// router.patch("/allsmtp", async (req, res, next) => {
//     try {
//         const update = req.body;
//         console.log("hello Asif=>",update.req.body);
//         const option = { new: true };
//         const updatedDetails = await Setsmtp.findByIdAndUpdate(update, option);
//         res.send(updatedDetails);
//     } catch (error) {
//         next(error);
//     }
// });
//Delete smtp
router.delete("/smtp/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        const find = await Setsmtp.findOne({ _id: id });
        if (find) {
            const deleted = await Setsmtp.findByIdAndDelete({ _id: id });
            res.send(deleted);
        } else {
            res.send("Id does not exist");
        }
    } catch (error) {
        next(error)
    }
});
module.exports = router;