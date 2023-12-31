
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")
const fs =require('fs')

router.get("/category", (req, res) => {   
    pool.query("SELECT * FROM category", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.send(err)
        }
    })
})  

router.get('/category/:id', (req, res) => { 
    pool.query("SELECT * FROM product where category=$1", [req.params.id], (err, result) => {
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
            res.status(400).send(err)
        }
    })
})


router.post("/category", (req, res) => {
    const body = req.body;
    var imgName="";
    if(req.files){
    var imgFile = req.files.image
    imgName=Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
     }else{
      imgName=req.body.image
     }
    pool.query('INSERT INTO category (image,title,description) VALUES ($1,$2,$3) RETURNING *',
        [imgName.length<19?req.protocol+"://"+req.hostname+"/"+imgName:imgName,body.title,body.description],
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

router.delete("/category/:id", (req, res) => {
    const id = req.params.id
    pool.query("SELECT * FROM category where id=$1", [req.params.id], (err, result1) => {
     if (!err && result1.rows.length>0) {
            if(result1.rows[0] && result1.rows[0].image){
              fs.unlink(`${__dirname}/../media/${(result1.rows[0].image).slice(result1.rows[0].image.lastIndexOf('/')+1)}`,()=>{})   
            }
            pool.query('DELETE FROM category WHERE id = $1', [id], (err, result) => {
                if (err) {
                    res.status(400).send(
                        {err:err,message:"category id topilmadi "}
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
router.put("/category/:id", (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query("SELECT * FROM category where id=$1", [req.params.id], (err, result1) => {
        if (!err) {
              if(req.files && req.files.image){
                 imgName =result1.rows[0].image
            }else{
                imgName=req.body.image
            }
     pool.query(
        'UPDATE category SET title=$1,image=$2,description=$3,time_update=$4 WHERE id = $5',
         [body.title,imgName,body.description,new Date(),id],
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