
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")


router.get("/work", (req, res) => {   
    pool.query("SELECT * FROM work", (err, result) => {
        if (!err) {

            res.status(200).send(result.rows)

        } else {
            res.send(err)
        }
    })
})

router.get('/work/:id', (req, res) => {
    
    pool.query("SELECT * FROM work where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/work", (req, res) => {
    const body = req.body;
        pool.query('INSERT INTO work (type,organizatsiya,phone,email,inn,liso_contact,sayt,mashina,shving) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
        [body.type,body.organizatsiya,body.phone,body.email,body.inn,body.liso_contact,body.sayt,body.mashina,body.shving],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(201).send("Created");
            }
        });
});

router.delete("/work/:id", (req, res) => {
    const id = req.params.id
    pool.query('DELETE FROM work WHERE id = $1', [id], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send("Deleted")
        }
    })
})
router.put("/work/:id", (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query(
        'UPDATE work SET type=$1,organizatsiya=$2,phone=$3,email=$4,inn=$5,liso_contact=$6,sayt=$7,mashina=$8,shving=$9,time_update=$11 WHERE id = $12',
        [body.type,body.organizatsiya,body.phone,body.email,body.inn,body.liso_contact,body.sayt,body.mashina,body.shving,id,new Date()],
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