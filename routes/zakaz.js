
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")

// res.status(200).send(result.rows)
router.get("/zakaz", (req, res) => {   
    pool.query("SELECT * FROM zakaz", (err, result) => {
        if (!err) {
            pool.query("SELECT * FROM voditel_zakaz", (err, result2) => {
                if (!err) {
      for (let i = 0; i < result.rows.length; i++) {
        if(result2.rows.length==0){
            result.rows[i].status=0 
        }
    for (let j = 0; j < result2.rows.length; j++) {
       if (result.rows[i].id===result2.rows[i].zakaz_id) {

     if (result2.rows[i].finishing) {
        result.rows[i].status=2
        }else{
        result.rows[i].status=1 
        }   
     }else{
     result.rows[i].status=0 
     }       
    }}

    res.status(200).send(result.rows)
                } else {
                    res.send(err)
                }
            })
       

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
   
        pool.query('INSERT INTO zakaz (address,day,category,positsiya,time,m3,description,payment,tarif,mashina,work_time_shving,price,status,shving,marka,bonus,user_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *',
        [body.address,body.day,body.category,body.positsiya,body.time,body.m3,body.description,body.payment,body.tarif,body.mashina,body.work_time_shving,body.price,body.status,body.shving,body.marka,body.bonus,body.user_id],
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
        'UPDATE zakaz SET address=$1,day=$2,time=$3,category=$4,positsiya=$5,m3=$6,description=$7,payment=$8,tarif=$9,mashina=$10,work_time_shving=$11,price=$12,status=$13, shving=$14, marka=$15, bonus=$16 WHERE id = $17',
        [body.address,body.day,body.time,body.category,body.positsiya,body.m3,body.description,body.payment,body.tarif,body.mashina,body.work_time_shving,body.price,body.status,body.shving,body.marka,body.bonus,id],
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