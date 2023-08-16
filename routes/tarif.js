
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")


router.get("/tarif", (req, res) => {   
    pool.query("SELECT * FROM tarif", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.send(err)
        }
    })
})  

router.get('/tarif/:id', (req, res) => {
    
    pool.query("SELECT * FROM tarif where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/tarif", (req, res) => {
    const body = req.body;
    var imgName="";
    if(req.files){
    var imgFile = req.files.image
    imgName = Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
     }else{
      imgName=req.body.image
     }
    pool.query('INSERT INTO tarif (image,title,map_meter) VALUES ($1,$2,$3) RETURNING *',
        [imgName,body.title,body.map_meter],
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

router.delete("/tarif/:id", (req, res) => {
    const id = req.params.id
    pool.query("SELECT * FROM tarif where id=$1", [req.params.id], (err, result1) => {
        console.log(result1.rows);
     if (!err && result1.rows.length>0) {
            if(result1.rows[0] && result1.rows[0].image){
              fs.unlink(`./media/${result1.rows[0].image}`,()=>{})   
            }
            pool.query('DELETE FROM tarif WHERE id = $1', [id], (err, result) => {
                if (err) {
                    res.status(400).send(
                        {err:err,message:"tarif id topilmadi "}
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
router.put("/tarif/:id", (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query("SELECT * FROM tarif where id=$1", [req.params.id], (err, result1) => {
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
        'UPDATE tarif SET title=$1,image=$2,map_meter=$3,time_update=$4 WHERE id = $5',
         [body.title,imgName,body.map_meter,new Date(),id],
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