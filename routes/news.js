
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")
const fs =require('fs')

router.get("/news", (req, res) => {   
    pool.query("SELECT * FROM news", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.send(err)
        }
    })
})  

router.get('/news/:id', (req, res) => {
    
    pool.query("SELECT * FROM news where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/news", (req, res) => {
    const body = req.body;
    var imgName="";
    if(req.files){
    var imgFile = req.files.image
    imgName = Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
     }else{
      imgName=req.body.image
     }
    pool.query('INSERT INTO news (title,image,description,min_description) VALUES ($1,$2,$3,$4) RETURNING *',
        [body.title,imgName.length<19?req.protocol+"://"+req.hostname+"/"+imgName:imgName,body.description,body.min_description],
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

router.delete("/news/:id", (req, res) => {
    const id = req.params.id
    pool.query("SELECT * FROM news where id=$1", [req.params.id], (err, result1) => {
       
     if (!err && result1.rows.length>0) {
            if(result1.rows[0] && result1.rows[0].image){
                fs.unlink(`${__dirname}/../media/${(result1.rows[0].image).slice(result1.rows[0].image.lastIndexOf('/')+1)}`,()=>{})   
            }
            pool.query('DELETE FROM news WHERE id = $1', [id], (err, result) => {
                if (err) {
                    res.status(400).send(
                        {err:err,message:"news id topilmadi "}
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
router.put("/news/:id", (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query("SELECT * FROM news where id=$1", [req.params.id], (err, result1) => {
        if (!err) {
          
              if(req.files){
               
                 imgName = result1.rows[0].image
            }else{
                imgName=req.body.image
            }
    pool.query(
        'UPDATE news SET title=$1,description=$2,image=$3,min_description=$4,time_update=$6 WHERE id = $5',
        [body.title,body.description,imgName,body.min_description,id,new Date() ],
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