
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")
const fs=require('fs')

router.get("/aksiya", (req, res) => {   
    pool.query("SELECT * FROM aksiya", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.send(err)
        }
    })
})  

router.get('/aksiya/:id', (req, res) => {
    
    pool.query("SELECT * FROM aksiya where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/aksiya", (req, res) => {
    const body = req.body;
    var imgName="";
    if(req.files && req.files.image){
    var imgFile = req.files.image
    imgName=Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
     }else{
      imgName=req.body.image
     }
    pool.query('INSERT INTO aksiya (title,image,description,start_day,end_day,min_description) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
        [body.title,imgName.length<21?imgName.length<19?req.protocol+"://"+req.hostname+"/"+imgName:imgName:imgName,body.description,body.start_day,body.end_day,body.min_description],
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

router.delete("/aksiya/:id", (req, res) => {
    const id = req.params.id
    pool.query("SELECT * FROM aksiya where id=$1", [req.params.id], (err, result1) => {
   
     if (!err && result1.rows.length>0) {
            if(result1.rows[0] && result1.rows[0].image){
              fs.unlink(`${__dirname}/../media/${(result1.rows[0].image).slice(imgName.lastIndexOf('/')+1)}`,()=>{})   
            }
            pool.query('DELETE FROM aksiya WHERE id = $1', [id], (err, result) => {
                if (err) {
                    res.status(400).send(
                        {err:err,message:"aksiya id topilmadi "}
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
router.put("/aksiya/:id", (req, res) => {
    const id = req.params.id
    const body = req.body
    var  imgName 
    pool.query("SELECT * FROM aksiya where id=$1", [req.params.id], (err, result1) => {
        if (!err) {
           
         if(req.files){
                 imgName = result1.rows[0].image
            }else{
                imgName=req.body.image
            }
    pool.query(
        'UPDATE aksiya SET title=$1,description=$2,image=$3,min_description=$4, start_day=$5,end_day=$6,time_update=$8 WHERE id = $7',
        [body.title,body.description,imgName,body.min_description,body.start_day,body.end_day,id,new Date()],
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