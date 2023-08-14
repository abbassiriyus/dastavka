const { Client } = require("pg")

const pool = new Client({
    user: "postgres",
    host: "containers-us-west-167.railway.app",
    database: "railway",
    password: "dJC6wGAMMeZ6eMNr09HS",
    port: 6820
})
pool.connect(err => {
    if(err) {
        console.log("Connect Error");
    } else {
        console.log("Connect To PostgreSql");
    }
})

module.exports = pool