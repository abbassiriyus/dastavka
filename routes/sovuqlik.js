
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")


router.get("/sovuqlik", (req, res) => {   
    pool.query("SELECT * FROM sovuqlik", (err, result) => {
        if (!err) {

            res.status(200).send(result.rows)

        } else {
            res.send(err)
        }
    })
})

router.get('/sovuqlik/:id', (req, res) => {
    
    pool.query("SELECT * FROM sovuqlik where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/sovuqlik", (req, res) => {
    const body = req.body;
        pool.query('INSERT INTO sovuqlik (sena,gradus) VALUES ($1,$2) RETURNING *',
        [body.sena,body.gradus],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(201).send("Created");
            }
        });
});

router.delete("/sovuqlik/:id", (req, res) => {
    const id = req.params.id
    pool.query('DELETE FROM sovuqlik WHERE id = $1', [id], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send("Deleted")
        }
    })
})
router.put("/sovuqlik/:id", (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query(
        'UPDATE sovuqlik SET sena=$1,time_update=$3,gradus=$4 WHERE id = $2',
        [body.sena,id,new Date(),body.gradus],
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