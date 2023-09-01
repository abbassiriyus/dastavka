
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")


router.get("/zakaz", (req, res) => {   
    pool.query("SELECT * FROM zakaz", (err, result) => {
        if (!err) {

            res.status(200).send(result.rows)

        } else {
            res.send(err)
        }
    })
})

router.get('/zakaz/:id', (req, res) => {
    
    pool.query("SELECT * FROM zakaz where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/zakaz", (req, res) => {
    const body = req.body;
   
        pool.query('INSERT INTO product (address,day,time,marka,category,positsiya,m3,description,payment,tarif,mashina,work_time_shving,status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *',
        [body.address,body.day,body.time,body.marka,body.category,body.positsiya,body.m3,body.description.body,payment,body,tarif,body,mashina.body,work_time_shving,body,status],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(201).send("Created");
            }
        });
});

router.delete("/zakaz/:id", (req, res) => {
    const id = req.params.id
    pool.query('DELETE FROM zakaz WHERE id = $1', [id], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send("Deleted")
        }
    })
})
router.put("/zakaz/:id", (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query(
        'UPDATE product SET address=$1,day=$2,time=$3,category=$4,positsiya=$5,m3=$6,description=$7,payment=$8,tarif=$9,mashina=$10,work_time_shving=$11,price=$12,status=$13 WHERE id = $2',
        [body.address,id,new Date(),body.day,body.time,body.category,body.positsiya,body.m3,body.description,body.payment,body.tarif,body.mashina,body.work_time_shving,body.price,body.status],
        (err, result) => {
            if (err) {
                res.status(400).send(err)
            } else {
                res.status(200).send("Updated")
            }
        }
    )
})

module.exports = router;