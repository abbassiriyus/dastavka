const { Client } = require("pg")

const pool = new Client({
    user: "postgres",
    host: "containers-us-west-181.railway.app",
    database: "railway",
    password: "WQ9HrcgYUC5WWBWK8xap",
    port: 6917
})
pool.connect(err => {
    if(err) {
        console.log("Connect Error");
    } else {
        console.log("Connect To PostgreSql");
    }
})

module.exports = pool