
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")
var fs=require('fs')

router.get("/homeiy", (req, res) => {   
    pool.query("SELECT * FROM homeiy", (err, result) => {
        if (!err) {
            pool.query("SELECT * FROM homiy_image", (err, result1) => {
                if (!err) {
              for (let i = 0; i < result.rows.length; i++) {
                result.rows[i].imageall=[]
                for (let j = 0; j < result1.rows.length; j++) {
          if(result.rows[i].id==result1.rows[j].homeiy_id){
            result.rows[i].imageall.push(result1.rows[j])
          }
                }   
              }
                    res.status(200).send(result.rows)
                } else {
                    res.status(400).send(err)
                }
            })
        } else {
            res.send(err)
        }
    })
})  

router.get('/homeiy/:id', (req, res) => {
    pool.query("SELECT * FROM homeiy where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/homeiy", (req, res) => {
    const body = req.body;
    var imgName="";
    if(req.files){
    var imgFile = req.files.image
    imgName =req.hostname+Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
     }else{
      imgName=req.body.image
     }
    pool.query('INSERT INTO homeiy (image,link,title,gis_mark,betomtaxi_mark,email,phone) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
        [imgName,body.link,body.title,body.gis_mark,body.betomtaxi_mark,body.description,body.email,body.phone],
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

router.delete("/homeiy/:id", (req, res) => {
    const id = req.params.id
    pool.query("SELECT * FROM homeiy where id=$1", [req.params.id], (err, result1) => {
     
     if (!err && result1.rows.length>0) {
            if(result1.rows[0] && result1.rows[0].image){
              fs.unlink(`./media/${result1.rows[0].image}`,()=>{})   
            }
            pool.query('DELETE FROM homeiy WHERE id = $1', [id], (err, result) => {
                if (err) {
                    res.status(400).send(
                        {err:err,message:"homeiy id topilmadi "}
                    )
                } else {
                    if(req.files){
                        const imgFile = req.files.image
                       imgFile.mv(`${__dirname}/media/${imgName}`)
                     }
                    res.status(200).send("Deleted")
                }
            })
        } else {
            res.status(400).send(err)
        }
    })
   
})

router.put("/homeiy/:id", (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query("SELECT * FROM homeiy where id=$1", [req.params.id], (err, result1) => {
        if (!err) {
              if(req.files){
                const imgFile = req.files.image
                 imgName =result1.rows[0].image
            }else{
                imgName=req.body.image
            }
     pool.query(
        'UPDATE homeiy SET title=$1,image=$2,link=$3,gis_mark=$4,betomtaxi_mark=$5,description=$6,email=$7,phone=$8,time_update=$9 WHERE id = $10',
         [body.title,imgName,body.link,body.gis_mark,body.betomtaxi_mark,body.description,body.email,body.phone,new Date(),id],
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