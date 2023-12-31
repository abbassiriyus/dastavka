
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")
const fs =require("fs")



// get alluser
router.get('/users', function(req, res) {
       pool.query("SELECT * FROM users", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)  
        } else {
            res.send(err)
        } 
    })  
});

// get user position
router.get('/users/:id', function(req, res) {
    pool.query("SELECT * FROM users where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
});
    
//register
router.post("/users", (req, res) => {
    const body = req.body;
var document_mashina_file=""
var prava_file=""
var fomo_file=""
var document_mashina_name=""
var prava_name=""
var fomo_name=""
var demoName=Date.now()+document_mashina_file.name.slice(document_mashina_file.name.lastIndexOf('.'))
if(req.files && req.files.document_mashina){
    document_mashina_file=req.files.document_mashina
    document_mashina_name=Date.now()+document_mashina_file.name.slice(document_mashina_file.name.lastIndexOf('.'))
}else{
    document_mashina_name=req.body.document_mashina
}
if(req.files && req.files.prava){
    prava_file=req.files.prava
    prava_name="1a"+Date.now()+prava_file.name.slice(prava_file.name.lastIndexOf('.'))
}else{
    prava_name=req.body.prava
}
if(req.files && req.files.fomo){
    fomo_file=req.files.fomo
    fomo_name="2a"+Date.now()+fomo_file.name.slice(fomo_file.name.lastIndexOf('.'))
}else{
    fomo_name=req.body.fomo
}
pool.query('INSERT INTO users (position_id,patronymic,surname,username,phone,email,inn,recvizit,document_mashina,prava,fomo,login,password,skitka) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *',
[body.position_id,body.patronymic,body.surname,body.username,body.phone,body.email,body.inn,body.recvizit,document_mashina_name.length<19?req.protocol+"://"+req.hostname+"/"+document_mashina_name:document_mashina_name,prava_name.length<19?req.protocol+"://"+req.hostname+"/"+prava_name:prava_name,fomo_name.length<19?req.protocol+"://"+req.hostname+"/"+fomo_name:fomo_name,body.login,body.password,body.skitka],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                if(req.files){
                if(req.files.document_mashina){
                    document_mashina_file.mv(`${__dirname}/media/${document_mashina_name}`)  
                }
                if(req.files.prava){
                    prava_file.mv(`${__dirname}/media/${prava_name}`)  
                }
                if(req.files){
                    fomo_file.mv(`${__dirname}/media/${fomo_name}`)  
                }
                    }
                    token = jwt.sign({"password":req.body.password,"login":req.body.login}, 'secret');
                    position=req.body.position_id   
                res.status(201).send({access:token,"position":position});
            }
        });
  
})


// login in user_password email username
router.post('/login', function(req, res) {
    var body=req.body
    if(body){
        var datatime=new Date()
    pool.query("SELECT * FROM users", (err, result) => {
        if (!err) {
          var token
          var position
          var a=false
        result.rows.map(item=>{
        if(item.password==body.password && item.login==body.login){
        token = jwt.sign({"password":item.password,"login":item.login}, 'secret');
        position=item.position_id
                 a=true}
           })
       if(!a){res.status(500).send("Royhatdan o`tmagan") }else{
        res.status(200).send({"access":token,"position":position}) 
       }
        } else {
            res.status(401).send(err)
        }
    })}else{
        res.status(441).send("post metodida hech qanday data yuborilmadi")
    }
    
});

// one token user
router.get('/oneuser', function(req, res) {
   var body=req.body
   const bearerHeader=req.headers['authorization']
   const bearer=bearerHeader.split(" ")
   const bearerToken=bearer[1]
   req.token=bearerToken

   jwt.verify(bearerToken,'secret',((require1,result1)=>{
       if(result1==undefined){
           res.status(502).send("token failed")
       }else{   
     pool.query("SELECT * FROM users", (err, result) => {
        if (!err) {
        var a=result.rows.filter(item=>(item.login===result1.login ))
        var a2=a.filter(item=>item.user_password===result1.user_password)
            res.status(200).send(a2) 
        } else {
            res.send(err)
        }
    }) 
    }}))
  
      
});




// delete user
router.delete("/users/:id", (req, res) => {
    const id = req.params.id
    pool.query("SELECT * FROM users where id=$1", [req.params.id], (err, result1) => {
    if(result1.rows.length==1){
        fs.unlink(`${__dirname}/../media/${(result1.rows[0].fomo).slice((result1.rows[0].fomo).lastIndexOf('/')+1)}`,()=>{})   
        fs.unlink(`${__dirname}/../media/${(result1.rows[0].prava).slice((result1.rows[0].prava).lastIndexOf('/')+1)}`,()=>{})   
        fs.unlink(`${__dirname}/../media/${(result1.rows[0].document_mashina).slice((result1.rows[0].document_mashina).lastIndexOf('/')+1)}`,()=>{})   
    }  
        if (!err) { 
             pool.query('DELETE FROM users WHERE id = $1', [id], (err, result2) => {
        if (err) {
            res.status(400).send({err:err,"message":'not deleting'})
        } else {
            res.status(200).send("Deleted")
        }
    })
        } else {
            res.status(400).send({err:err,"message":'not user'})
        }
    })
  

  
})




// put user
router.put("/users/:id", (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query("SELECT * FROM users", (err, result) => {
        if (!err) {
            var a=result.rows.filter(item=>item.id==req.params.id) 
        var famo_name=a[0].famo
        var prava_name=a[0].prava
        var document_mashina_name=a[0].document_mashina
    pool.query(
    'UPDATE users SET position_id = $1,patronymic=$2,surname=$3, username=$4,phone=$5,email=$6,inn=$7,recvizit=$8,login=$9,password=$10,skitka=$11,bonus=$12 WHERE id = $13',
        [body.position_id, body.patronymic, body.surname,body.username,body.phone,body.email,body.inn,body.recvizit,body.login,body.password,body.skitka,body.bonus,id],
        (err, result) => {
            if (err) {
                res.status(400).send(err)
            } else {
             if(req.files && req.files.fomo){
                const imgFile = req.files.fomo
                imgFile.mv(`${__dirname}/../media/${fomo_name.slice(fomo_name.lastIndexOf('/'))}`)
                }
                if(req.files && req.files.prava){
                    const imgFile = req.files.prava
                    imgFile.mv(`${__dirname}/../media/${prava_name.slice(prava_name.lastIndexOf('/'))}`)
                }
                if(req.files && req.files.document_mashina){
                    const imgFile = req.files.document_mashina
                    imgFile.mv(`${__dirname}/../media/${document_mashina_name.slice(document_mashina_name.lastIndexOf('/'))}`)
                }
                res.status(200).send("Updated")
            }
        }
    )} 
        })
})


// put user
router.put("/users/header/:id", (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query(
        'UPDATE users SET surname=$1,username=$2,phone=$3,email=$4,time_update=$6 WHERE id = $5',
        [body.surname,body.username,body.phone,body.email,id,new Date()],
        (err, result) => {
            if (err) {
                res.status(400).send(err)
            } else {
                res.status(200).send("Updated")
            }
        }
    )
   
})
router.put("/users/super/:id", (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query(
        'UPDATE users SET patronymic=$1,surname=$2,username=$3,phone=$4,email=$5,login=$6,password=$7,time_update=$9 WHERE id = $8',
        [body.patronymic,body.surname,body.username,body.phone,body.email,body.login,body.password,id,new Date()],
        (err, result) => {
            if (err) {
                res.status(400).send(err)
            } else {
                res.status(200).send("Updated")
            }
        }
    )
   
})



module.exports = router;

