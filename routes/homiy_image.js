
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")
const fs=require('fs')

router.get("/homiy_image", (req, res) => {   
    pool.query("SELECT * FROM homiy_image", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.send(err)
        }
    })
})  

router.get('/homiy_image/:id', (req, res) => {
    
    pool.query("SELECT * FROM homiy_image where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/homiy_image", (req, res) => {
    const body = req.body;
    var imgName="";
    if(req.files && req.files.image){
    var imgFile = req.files.image
    imgName = Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
     }else{
      imgName=req.body.image
     }
    pool.query('INSERT INTO homiy_image (image,homeiy_id) VALUES ($1,$2) RETURNING *',
        [imgName.length<19?req.protocol+"://"+req.hostname+"/"+imgName:imgName,body.homeiy_id],
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

router.delete("/homiy_image/:id", (req, res) => {
    const id = req.params.id
    pool.query("SELECT * FROM homiy_image where id=$1", [req.params.id], (err, result1) => {
   
     if (!err && result1.rows.length>0) {
            if(result1.rows[0] && result1.rows[0].image){
                fs.unlink(`${__dirname}/../media/${(result1.rows[0].image).slice(result1.rows[0].image.lastIndexOf('/')+1)}`,()=>{})   
            }
            pool.query('DELETE FROM homiy_image WHERE id = $1', [id], (err, result) => {
                if (err) {
                    res.status(400).send(
                        {err:err,message:"homiy_image id topilmadi "}
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
router.put("/homiy_image/:id", (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query("SELECT * FROM homiy_image where id=$1", [req.params.id], (err, result1) => {
        if (!err) {
        if(req.files){
                 imgName = result1.rows[0].image
            }else{
                imgName=req.body.image
            }
     pool.query(
        'UPDATE homiy_image SET homeiy_id=$1,image=$2,time_update=$3 WHERE id = $4',
         [body.homeiy_id,imgName,new Date(),id],
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