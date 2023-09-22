
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")
const fs=require('fs')

router.get("/compony", (req, res) => {   
    pool.query("SELECT * FROM compony", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.send(err)
        }
    })
})  

router.get('/compony/:id', (req, res) => {
    
    pool.query("SELECT * FROM compony where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/compony", (req, res) => {
    const body = req.body;
    var imgName="";
    if(req.files){
    var imgFile = req.files.logo
    imgName = Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
     }else{
      imgName=req.body.logo
     }
    pool.query('INSERT INTO compony (phone,logo,telegram,email,whatsapp) VALUES ($1,$2,$3,$4,$5) RETURNING *',
        [body.phone,req.protocol+"://"+req.hostname+"/"+imgName,body.telegram,body.email,body.whatsapp],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                if(req.files){
                    const imgFile = req.files.logo
                   imgFile.mv(`${__dirname}/../media/${imgName}`)
                    }
                res.status(201).send("Created");
            }
        });
});

router.delete("/compony/:id", (req, res) => {
    const id = req.params.id
    pool.query("SELECT * FROM compony where id=$1", [req.params.id], (err, result1) => {
  
     if (!err && result1.rows.length>0) {
            if(result1.rows[0] && result1.rows[0].logo){
                fs.unlink(`${__dirname}/../media/${(result1.rows[0].logo).slice(result1.rows[0].logo.lastIndexOf('/')+1)}`,()=>{}) 
            }
            pool.query('DELETE FROM compony WHERE id = $1', [id], (err, result) => {
                if (err) {
                    res.status(400).send(
                        {err:err,message:"compony id topilmadi "}
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
router.put("/compony/:id", (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query("SELECT * FROM compony where id=$1", [req.params.id], (err, result1) => {
        if (!err) {
           
              if(req.files){
                 imgName=result1.rows[0].logo
            }else{
                imgName=req.body.logo
            }
    pool.query(
        'UPDATE compony SET phone=$1,telegram=$2,logo=$3,email=$4,whatsapp=$5,time_update=$7 WHERE id = $6',
        [body.phone,body.telegram,imgName,body.email,body.whatsapp,id,new Date()],
        (err, result) => {
            if (err) {
                res.status(400).send(err)
            } else {
                if(req.files){
                    const imgFile = req.files.logo
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