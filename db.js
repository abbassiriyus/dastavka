const { Client } = require("pg")

const pool = new Client({
    user: "postgres",
    host: "containers-us-west-94.railway.app",
    database: "railway",
    password: "MElWKbwCc89F4Qr4KsXx",
    port: 6061
})
pool.connect(err => {
    if(err) {
        console.log("Connect Error");
    } else {
        console.log("Connect To PostgreSql");
    }
})

module.exports = pool