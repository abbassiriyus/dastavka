
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")


router.get("/sena", (req, res) => {   
    pool.query("SELECT * FROM sena", (err, result) => {
        if (!err) {

            res.status(200).send(result.rows)

        } else {
            res.send(err)
        }
    })
})

router.get('/sena/:id', (req, res) => {
    
    pool.query("SELECT * FROM sena where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/sena", (req, res) => {
    const body = req.body;
        pool.query('INSERT INTO sena (usluga,suv_bilan,pustoy_smena) VALUES ($1,$2,$3) RETURNING *',
        [body.usluga,body.suv_bilan,body.pustoy_smena,],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(201).send("Created");
            }
        });
});

router.delete("/sena/:id", (req, res) => {
    const id = req.params.id
    pool.query('DELETE FROM sena WHERE id = $1', [id], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send("Deleted")
        }
    })
})
router.put("/sena/:id", (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query(
        'UPDATE sena SET sena_name=$1,time_update=$3 WHERE id = $2',
        [body.sena_name,id,new Date()],
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