
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")


router.get("/marka", (req, res) => {   
    pool.query("SELECT * FROM marka", (err, result) => {
        if (!err) {

            res.status(200).send(result.rows)

        } else {
            res.send(err)
        }
    })
})

router.get('/marka/:id', (req, res) => {
    
    pool.query("SELECT * FROM marka where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/marka", (req, res) => {
    const body = req.body;
        pool.query('INSERT INTO marka (title) VALUES ($1) RETURNING *',
        [body.title],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(201).send("Created");
            }
        });
});

router.delete("/marka/:id", (req, res) => {
    const id = req.params.id
    pool.query('DELETE FROM marka WHERE id = $1', [id], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send("Deleted")
        }
    })
})
router.put("/marka/:id", (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query(
        'UPDATE marka SET title=$1,time_update=$3 WHERE id = $2',
        [body.title,id,new Date()],
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