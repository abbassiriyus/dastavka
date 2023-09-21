
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")
const fs=require('fs')

router.get("/shving", (req, res) => {   
    pool.query("SELECT * FROM shving", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.send(err)
        }
    })
})  

router.get('/shving/:id', (req, res) => {
    
    pool.query("SELECT * FROM shving where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/shving", (req, res) => {
    const body = req.body;
    var imgName="";
    if(req.files){
    var imgFile = req.files.image
    imgName = Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
     }else{
      imgName=req.body.image
     }
    pool.query('INSERT INTO shving (image,m,sena,description) VALUES ($1,$2,$3,$4) RETURNING *',
        [req.protocol+"://"+req.hostname+"/"+imgName,body.m,body.sena,body.description],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                if(req.files){
                    const imgFile = req.files.image
                   imgFile.mv(`${__dirname}/../media/${imgName}`)
                    }
                res.status(201).send("Created");
            }
        });
});

router.delete("/shving/:id", (req, res) => {
    const id = req.params.id
    pool.query("SELECT * FROM shving where id=$1", [req.params.id], (err, result1) => {
     
     if (!err && result1.rows.length>0) {
            if(result1.rows[0] && result1.rows[0].image){
              fs.unlink(`./media/${(result1.rows[0].image).slice(imgName.lastIndexOf('/'))}`,()=>{})   
            }
            pool.query('DELETE FROM shving WHERE id = $1', [id], (err, result) => {
                if (err) {
                    res.status(400).send(
                        {err:err,message:"shving id topilmadi "}
                    )
                } else {
                    res.status(200).send("Deleted")
                }
            })
        } else {
            res.status(400).send(err)
        }
    })
   
})
router.put("/shving/:id", (req, res) => {
    const id = req.params.id
    const body = req.body

    pool.query("SELECT * FROM shving where id=$1", [req.params.id], (err, result1) => {
        if (!err) {
           
              if(req.files){
                 imgName = result1.rows[0].image
            }else{
                imgName=req.body.image
            }
     pool.query(
        'UPDATE shving SET m=$1,image=$2,sena=$3,time_update=$4,description=$6 WHERE id = $5',
         [body.m,imgName,body.sena,new Date(),id,body.description],
          (err, result) => {
            if (err) {
                res.status(400).send(err)
            } else {
                if(req.files){
                    const imgFile = req.files.image
                   imgFile.mv(`${__dirname}/../media/${imgName.slice(imgName.lastIndexOf('/'))}`)
                    }
                res.status(200).send("Updated")
            }
        }
    )
} else {
    res.status(400).send(err)
}
    })
})

module.exports = router;