
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")


router.get("/product", (req, res) => {   
    pool.query("SELECT * FROM product", (err, result) => {
        if (!err) {
            pool.query("SELECT * FROM marka", (err, result1) => {
                if (!err) {
        
                    pool.query("SELECT * FROM homeiy", (err, result2) => {
                        if (!err) {
                
for (let i = 0; i < result.rows.length; i++) {
    result.rows[i].allmarka={}
  for (let j = 0; j < result1.rows.length; j++) {
if(result.rows[i].marka==result1.rows[j].id){
    result.rows[i].allmarka=result1.rows[j]
} }}
for (let i = 0; i < result.rows.length; i++) {
    result.rows[i].allhomeiy={}
    for (let j = 0; j < result2.rows.length; j++) {
        if(result.rows[i].homiy_id==result2.rows[j].id){
            result.rows[i].allhomeiy=result2.rows[j]
        }
    }
  }
                            res.status(200).send(result.rows)
                
                        } else {
                            res.send(err)
                        }
                    })
        
                } else {
                    res.send(err)
                }
            })

        } else {
            res.send(err)
        }
    })
})

router.get('/product/:id', (req, res) => {
    
    pool.query("SELECT * FROM product where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/product", (req, res) => {
    const body = req.body;
        pool.query('INSERT INTO product (description,s3_sena,s4_sena,marka,hydrophobic_additive_sena,fiber_fiber,homiy_id,category) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
        [body.description,body.s3_sena,body.s4_sena,body.marka,body.hydrophobic_additive_sena,body.fiber_fiber,body.homiy_id,body.category],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(201).send("Created");
            }
        });
});

router.delete("/product/:id", (req, res) => {
    const id = req.params.id
    pool.query('DELETE FROM product WHERE id = $1', [id], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send("Deleted")
        }
    })
})
router.put("/product/:id", (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query(
        'UPDATE product SET description=$1,time_update=$3,s3_sena=$4,s4_sena=$5,marka=$6,hydrophobic_additive_sena=$7,fiber_fiber=$8,homiy_id=$9,category=$10 WHERE id = $2',
        [body.description,id,new Date(),body.s3_sena,body.s4_sena,body.marka,body.hydrophobic_additive_sena,body.fiber_fiber,body.homiy_id,body.category],
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