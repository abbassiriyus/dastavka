const { Client } = require("pg")

const pool = new Client({
    user: "postgres",
    host: "containers-us-west-76.railway.app",
    database: "railway",
    password: "jkqTVujoML9q8kAOgpDh",
    port: 7550
})
pool.connect(err => {
    if(err) {
        console.log("Connect Error");
    } else {
        console.log("Connect To PostgreSql");
    }
})

module.exports = pool