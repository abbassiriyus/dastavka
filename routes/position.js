
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")


router.get("/position", (req, res) => {   
    pool.query("SELECT * FROM position", (err, result) => {
        if (!err) {

            res.status(200).send(result.rows)

        } else {
            res.send(err)
        }
    })
})

router.get('/position/:id', (req, res) => {
    
    pool.query("SELECT * FROM position where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/position", (req, res) => {
    const body = req.body;
        pool.query('INSERT INTO position (position_name) VALUES ($1) RETURNING *',
        [body.position_name],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(201).send("Created");
            }
        });
});

router.delete("/position/:id", (req, res) => {
    const id = req.params.id
    pool.query('DELETE FROM position WHERE id = $1', [id], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send("Deleted")
        }
    })
})
router.put("/position/:id", (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query(
        'UPDATE position SET position_name=$1,time_update=$3 WHERE id = $2',
        [body.position_name,id,new Date()],
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