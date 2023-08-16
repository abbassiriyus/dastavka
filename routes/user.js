
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")
const fs =require("fs")



// registratsiya
router.post("/register", (req, res) => {
    const body = req.body
    if(body){
    var code =Math.floor(Math.random() * 900000)+100000;
    var a=0
    pool.query("SELECT * FROM users", (err, result) => {
        if (!err) {
            var d2=result.rows.filter(item=>{item.email===req.body.email})
            var d3=result.rows.filter(item=>{item.password===req.body.password})
        if(d2.length>0 || d3.length>0){
            a=1
        }
        }
})
    if(body.password.length>7 && body.email.includes('@') && a!==1){
    pool.query('INSERT INTO verify (password,email,username,code) VALUES ($1,$2,$3,$4) RETURNING *',
        [body.password,body.email,body.username,code], (err, result) => {
            if (err) {
                res.status(400).send("malumot To`liq emas")
            } else {
                var mailOptions = {
                    from: "webabbas9@gmail.com",
                    to: body.email,
                    subject: "Verification Code",
                    html: `Your activation code:${code}`
                 };
                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                       console.log(error,"error");
                    }else{
                       console.log("your code: "+code);
                 
                    }
                 });
                res.status(201).send("send message your email")
            }
        })}else{
            if(body.password.length<8){
            res.status(420).send("parol kam kiritildi")
            }
            if(!(body.email.includes('@'))){
                res.status(421).send("email xato kiritildi")
            }}
            if(a==1){
                res.status(422).send("siz kiritgan malumotlar bizni bazamizda oldindan saqlangan")  
            }}else{
                res.status(441).send("malumotni yubormadingiz")
            }
})

router.post("/change/password", (req, res) => {
    const body = req.body
    if(body){
    var code =Math.floor(Math.random() * 900000)+100000;
    var a=0
    pool.query("SELECT * FROM users", (err, result) => {
        if (!err) {
         var d2=result.rows.filter(item=>item.email===req.body.email)
        if(d2.length>0){
         a=d2[0].id
        }else{
         res.status(400).send("email topilmadi")
        }
        console.log(a);
    if(body.email.includes('@') && a!==0){
    pool.query('UPDATE users SET verify=$1 WHERE id=$2',
    [code,a], (err, result) => {
            if (err) {
                res.status(400).send("malumot To`liq emas")
            } else {
                var mailOptions = {
                    from: "webabbas9@gmail.com",
                    to: body.email,
                    subject: "Verification Code",
                    html: `Your activation code:${code}`
                 };
                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                       console.log(error,"error");
                    }else{
                       console.log("your code: "+code);
                    }
                 });
                res.status(201).send("send message your email")
            }
        })}else{
            if(!(body.email.includes('@'))){
                res.status(421).send("email xato kiritildi")
            }}
            if(a==1){
                res.status(422).send("siz kiritgan malumotlar bizni bazamizda oldindan saqlangan")  
            }}else{
                res.status(441).send("malumotni yubormadingiz")
            }
})
   }
})

router.put("/reset/", (req, res) => {
    const body = req.body
    pool.query("SELECT * FROM users", (err, result1) => {
        if (!err) {
            console.log(result1.rows);
            console.log(body.code);
            var s=result1.rows.filter(item=>item.verify==body.code)
            console.log(s);
            pool.query('UPDATE users SET password=$1 WHERE id=$2',
            [body.password,s[0].id],
            (err, result) => {
                if (err) {
                    res.status(400).send({err:err,message:'parol oldin ishlatilgan'})
                } else {
                    res.status(200).send("Updated")
                }})
        } else {
            res.status(400).send(err)
        } 
    }) 
  
})

    
// verifikatsiya
router.post("/users", (req, res) => {
    const body = req.body;
var document_mashina_file
var prava_file
var fomo_file
var document_mashina_name
var prava_name
var fomo_name
    if(req.files){
    document_mashina_file = req.files.document_mashina
    document_mashina_name = Date.now()+document_mashina_file.name.slice(document_mashina_file.name.lastIndexOf('.'))

    prava_file = req.files.prava
    prava_name ="1a"+Date.now()+prava_file.name.slice(prava_file.name.lastIndexOf('.'))

    fomo_file = req.files.fomo
    fomo_name = "2a"+Date.now()+fomo_file.name.slice(fomo_file.name.lastIndexOf('.'))
     }
    pool.query('INSERT INTO tarif (position_id,patronymic,surname,username,phone,email,inn,recvizit,document_mashina,prava,fomo,login,password) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *',
        [body.position_id,body.patronymic,body.surname,body.username,body.phone,body.email,body.inn,body.recvizit,document_mashina_name,prava_name,fomo_name,body.login,body.password],
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
                res.status(201).send("Created");
            }
        });
  
})

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
    pool.query("SELECT * FROM users", (err, result) => {
        if (!err) {
            var a=result.rows.filter(item=>item.id==req.params.id)
            res.status(200).send(a)
        } else {
            res.send(err)
        }
    })
});

// one token user
router.get('/oneuser', function(req, res) {
   var body=req.body
   var result1
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
    pool.query('DELETE FROM users WHERE id = $1', [id], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send("Deleted")
        }
    }) 

  
})


// login in user_password email username
router.post('/login', function(req, res) {
    var body=req.body
    if(body){var datatime=new Date()
    pool.query("SELECT * FROM users", (err, result) => {
        if (!err) {
            var token
            var position
          var a=false
        result.rows.map(item=>{
        if(item.password==body.password && item.login==body.login){
        token = jwt.sign({"password":item.password,"login":item.login}, 'secret');
            position=item.position
                 a=true}
           })
       if(!a){res.status(500).send("Royhatdan o`tmagan") }else{
        res.status(200).send({access:token,position}) 
       }
        } else {
            res.status(401).send(err)
        }
    })}else{
        res.status(441).send("post metodida hech qanday data yuborilmadi")
    }
    
});


// put user
router.put("/oneuser/:id",ensureToken, (req, res) => {
    const id = req.params.id
    const body = req.body
    if(req.files){
   const imgFile = req.files.image
   var imgName = Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
 pool.query("SELECT * FROM users", (err, result) => {
        if (!err) {
            var a=result.rows.filter(item=>item.id==req.params.id) 
            if(a.length>0 && a[0].image){
                fs.unlink(`./Images/${a[0].image}`,()=>{})
            }
    pool.query(
    'UPDATE users SET address = $1,description=$2,email=$3, image=$4,last_name=$5,phone_number=$6,username=$7 WHERE id = $8',
        [body.address, body.description, body.email,imgName,body.last_name,body.phone_number,body.username,id],
        (err, result) => {
            if (err) {
                res.status(400).send(err)
            } else {
                imgFile.mv(`${__dirname}/Images/${imgName}`)
                res.status(200).send("Updated")
            }
        }
    )} 
        })
    }else{
      pool.query("SELECT * FROM users", (err, result) => {
             if (!err) {
                 var a=result.rows.filter(item=>item.id==req.params.id) 
               if(a[0].image){ fs.unlink(`./Images/${a[0].image}`,()=>{})}
                
         pool.query(
         'UPDATE users SET address = $1,description=$2,email=$3, image=$4,last_name=$5,phone_number=$6,username=$7 WHERE id = $8',
             [body.address, body.description, body.email,body.image,body.last_name,body.phone_number,body.username,id],
             (err, result) => {
                 if (err) {
                     res.status(400).send(err)
                 } else {
                     res.status(200).send("Updated")
                 }
             }
         )}
             })
    }
    
   
   
})




module.exports = router;

