
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")
const fs=require('fs')

router.get("/skachat_pridlachenu", (req, res) => {   
    pool.query("SELECT * FROM skachat_pridlachenu", (err, result) => {
        if (!err) {
        for (let i = 0; i < result.rows.length; i++) {
        if(i%2==1){
            result.rows[i].bol=true
         }else{
            result.rows[i].bol=false  
         }
         }
            res.status(200).send(result.rows)
        } else {
            res.send(err)
        }
    })
})  

router.get('/skachat_pridlachenu/:id', (req, res) => {
    
    pool.query("SELECT * FROM skachat_pridlachenu where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/skachat_pridlachenu", (req, res) => {
    const body = req.body;
    var imgName="";
    if(req.files){
    var imgFile = req.files.image
    imgName = req.hostname+Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
     }else{
      imgName=req.body.image
     }
    pool.query('INSERT INTO skachat_pridlachenu (image,title,deskription) VALUES ($1,$2,$3) RETURNING *',
        [imgName,body.title,body.deskription],
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

router.delete("/skachat_pridlachenu/:id", (req, res) => {
    const id = req.params.id
    pool.query("SELECT * FROM skachat_pridlachenu where id=$1", [req.params.id], (err, result1) => {
   
     if (!err && result1.rows.length>0) {
            if(result1.rows[0] && result1.rows[0].image){
              fs.unlink(`./media/${result1.rows[0].image}`,()=>{})   
            }
            pool.query('DELETE FROM skachat_pridlachenu WHERE id = $1', [id], (err, result) => {
                if (err) {
                    res.status(400).send(
                        {err:err,message:"skachat_pridlachenu id topilmadi "}
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
router.put("/skachat_pridlachenu/:id", (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query("SELECT * FROM skachat_pridlachenu where id=$1", [req.params.id], (err, result1) => {
        if (!err) {
            if(result1.rows[0].image){
                fs.unlink(`../media/${result1.rows[0].image}`,()=>{})   
              }
              if(req.files){
                const imgFile = req.files.image
                 imgName = req.hostname+Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
            }else{
                imgName=req.body.image
            }
     pool.query(
        'UPDATE skachat_pridlachenu SET title=$1,image=$2,deskription=$3,time_update=$4 WHERE id = $5',
         [body.title,imgName,body.deskription,new Date(),id],
          (err, result) => {
            if (err) {

                res.status(400).send(err)
            } else {
                if(req.files){
                    const imgFile = req.files.image
                   imgFile.mv(`${__dirname}/../media/${imgName}`)
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