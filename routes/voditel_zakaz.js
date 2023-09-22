
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")


router.get("/voditel_zakaz", (req, res) => {   
    pool.query("SELECT * FROM voditel_zakaz", (err, result) => {
        if (!err) {

            res.status(200).send(result.rows)

        } else {
            res.send(err)
        }
    })
})

router.get('/voditel_zakaz/:id', (req, res) => {
    
    pool.query("SELECT * FROM voditel_zakaz where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/voditel_zakaz", (req, res) => {
    const body = req.body;
        pool.query('INSERT INTO voditel_zakaz (zakaz_id,car_id,operator_id) VALUES ($1,$2,$3) RETURNING *',
        [body.zakaz_id,body.car_id,body.operator_id],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(201).send("Created");
            }
        });
});
router.post("/voditel_zakaz/mark", (req, res) => {
    const body = req.body;
        pool.query('INSERT INTO voditel_zakaz (mark,comment) VALUES ($1,$2) RETURNING *',
        [body.mark,body.comment],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(201).send("Created");
            }
        });
});
router.get("/voditel_zakaz/finishing", (req, res) => {
    const body = req.body;
        pool.query('INSERT INTO voditel_zakaz (finishing) VALUES ($1) RETURNING *',
        [true],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(201).send("Created");
            }
        });
});

router.delete("/voditel_zakaz/:id", (req, res) => {
    const id = req.params.id
    pool.query('DELETE FROM voditel_zakaz WHERE id = $1', [id], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send("Deleted")
        }
    })
})
router.put("/voditel_zakaz/:id", (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query(
        'UPDATE voditel_zakaz SET finishing=$1,car_id=$2,time_update=$4 WHERE id = $3',
        [body.finishing,body.car_id,id,new Date()],
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