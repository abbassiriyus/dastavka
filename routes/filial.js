
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")
const fs =require('fs')

router.get("/filial", (req, res) => {   
    pool.query("SELECT * FROM filial", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.send(err)
        }
    })
})  

router.get('/filial/:id', (req, res) => {
    
    pool.query("SELECT * FROM filial where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/filial", (req, res) => {
    const body = req.body;
    var imgName="";
    console.log(body);
    if(req.files){
    var imgFile = req.files.image
    imgName = req.hostname+Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
     }else{
      imgName=req.body.image
     }
    pool.query('INSERT INTO filial (image,title,latitude,longitude) VALUES ($1,$2,$3,$4) RETURNING *',
        [imgName,body.title,body.latitude,body.longitude],
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

router.delete("/filial/:id", (req, res) => {
    const id = req.params.id
    pool.query("SELECT * FROM filial where id=$1", [req.params.id], (err, result1) => {  
     if (!err && result1.rows.length>0) {
            if(result1.rows[0] && result1.rows[0].image){
              fs.unlink(`./media/${result1.rows[0].image}`,()=>{})   
            }
            pool.query('DELETE FROM filial WHERE id = $1', [id], (err, result) => {
                if (err) {
                    res.status(400).send(
                        {err:err,message:"filial id topilmadi "}
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
router.put("/filial/:id", (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query("SELECT * FROM filial where id=$1", [req.params.id], (err, result1) => {
        if (!err) {
           
              if(req.files){
                const imgFile = req.files.image
                 imgName =result1.rows[0].image
            }else{
                imgName=req.body.image
            }
     pool.query(
        'UPDATE filial SET title=$1,image=$2,latitude=$3,time_update=$4,longitude=$6 WHERE id = $5',
         [body.title,imgName,body.latitude,new Date(),id,body.longitude],
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