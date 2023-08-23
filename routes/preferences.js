
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")


router.get("/preferences", (req, res) => {   
    pool.query("SELECT * FROM preferences", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.send(err)
        }
    })
})  

router.get('/preferences/:id', (req, res) => {
    
    pool.query("SELECT * FROM preferences where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/preferences", (req, res) => {
    const body = req.body;
    var imgName="";
    if(req.files){
    var imgFile = req.files.image
    imgName = Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
     }else{
      imgName=req.body.image
     }
    pool.query('INSERT INTO preferences (title,image,description,liso) VALUES ($1,$2,$3,$4) RETURNING *',
        [body.title,imgName,body.description,body.liso],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                if(req.files){
                    const imgFile = req.files.image
                   imgFile.mv(`${__dirname}/media/${imgName}`)
                    }
                res.status(201).send("Created");
            }
        });
});

router.delete("/preferences/:id", (req, res) => {
    const id = req.params.id
    pool.query("SELECT * FROM preferences where id=$1", [req.params.id], (err, result1) => {
        console.log(result1.rows);
     if (!err && result1.rows.length>0) {
            if(result1.rows[0] && result1.rows[0].image){
              fs.unlink(`./media/${result1.rows[0].image}`,()=>{})   
            }
            pool.query('DELETE FROM preferences WHERE id = $1', [id], (err, result) => {
                if (err) {
                    res.status(400).send(
                        {err:err,message:"preferences id topilmadi "}
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
router.put("/preferences/:id", (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query("SELECT * FROM preferences where id=$1", [req.params.id], (err, result1) => {
        if (!err) {  
            if(result1.rows[0].image){
                fs.unlink(`./media/${result1.rows[0].image}`,()=>{})   
              }
              if(req.files){
                const imgFile = req.files.image
                 imgName = Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
            }else{
                imgName=req.body.image
            }
    pool.query(
        'UPDATE preferences SET title=$1,description=$2,image=$3,liso=$4,time_update=$6 WHERE id = $5',
        [body.title,body.description,imgName,body.liso,id,new Date() ],
        (err, result) => {
            if (err) {
                res.status(400).send(err)
            } else {
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