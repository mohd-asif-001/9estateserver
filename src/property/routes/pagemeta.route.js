const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const Pagemeta = require("../../models/pagesmeta");

//get 
router.get('/admin/pagemeta', async (req, res, next) => {

    try {
        const data = await Pagemeta.find();
        res.send(data);
    }
    catch (error) {
        next(error)
    }
})
//Get data by id
router.get("/pagemetabyid/:id", async (req, res, next) => {
  try {
    const data = await Pagemeta.findOne({ _id: req.params.id })
    res.send(data)
  }
  catch (error) {
    next(error)
  }
});

router.get('/pagemeta', async (req, res, next) => {
    try {
        const data = await Pagemeta.find()
        const total_pagemetadatas = await Pagemeta.countDocuments();
        res.send({
            total: total_pagemetadatas,
            pagemetadatas: data,
        });
    }
    catch (error) {
        next(error)
    }
})
router.get("/getpagemetasearch", async (req, res, next) => {
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
            const pageCollection = await Pagemeta.find({
                $or: [
                    { name: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } },
                ],
            })
                .skip(skips)
                .limit(limit)
                .sort(sortObject);
            const total_pages = await Pagemeta.countDocuments({
                $or: [
                    { name: { $regex: new RegExp("^" + colName.toLowerCase(), "i") } }
                ],
            });
            res.send({
                total: total_pages,
                data: pageCollection,
            });
        } else {
            const pageCollection = await Pagemeta.find()
                .skip(skips)
                .limit(limit)
                .sort(sortObject);
            const total_pages = await Pagemeta.countDocuments();
            res.send({
                total: total_pages,
                data: pageCollection,
            });
        }
    } catch (error) {
        next(error);
    }
});
//get City by ID
router.get('/pagemeta/:id', async (req, res, next) => {

    try {
        const data = await Pagemeta.find({ _id: req.params.id })
        res.send({ data: data })
    }
    catch (error) {
        next(error)
    }
})
//Create City
router.post("/pagemeta", async (req, res, next) => {
    try {
        const {
            pageurl,
            pagemeta,
            pagedescription,
            pagekeyword,
            created_at,
            updated_at,
        } = req.body;
        const pagemetadatas = new Pagemeta({
            pageurl,
            pagemeta,
            pagedescription,
            pagekeyword,
            created_at,
            updated_at,
        });
        const addpagemeta = await pagemetadatas.save();
        res.send(addpagemeta);
    } catch (error) {
        next(error);
    }
});
//Update City
router.patch("/pagemeta/:id", async (req, res, next) => {
    try {
        const update = req.body;
        const id = req.params.id;
        const option = { new: true };
        const updatedDetails = await Pagemeta.findByIdAndUpdate(id, update, option);
        res.send(updatedDetails);
    } catch (error) {
        next(error);
    }
});
//Delete City
router.delete("/pagemeta/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        const find = await Pagemeta.findOne({ _id: id });
        if (find) {
            const deleted = await Pagemeta.findByIdAndDelete({ _id: id });
            res.send(deleted);
        } else {
            res.send("Id does not exist");
        }
    } catch (error) {
        next(error)
    }
});
module.exports = router;

