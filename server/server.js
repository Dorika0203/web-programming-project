const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const { response, application } = require('express')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
const options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'webpdb'
}

const maria = require('mysql2')
const pool = maria.createPool(options)
const promisePool = pool.promise()
var sessionStore = new MySQLStore({}, promisePool)

app.use(bodyParser.json())

app.use(express.static(
    path.join(__dirname, '../client/build')
))

const id_pw_Regex = new RegExp(
    '^[a-zA-Z0-9._:$!%-]{1,4}$'
)
const emailRegex = new RegExp(
    '^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$'
)
const phoneRegex = new RegExp(
    '^01[01]-[0-9]{4,4}-[0-9]{4,4}$'
)

app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: true,
    // cookie: {secure:true}
}))



app.get("/", async (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'))
    return
})

app.get("/api/session", async (req, res) => {

    if (req.session.userId) {
        res.status(200).json({ message: 'login OK', usertype: req.session.usertype})
        return
    }
    else {
        res.status(400).json({ message: 'Not available cookie' })
    }
    return
}
)





app.post("/api/signup", async (req, res) => {

    let data = req.body

    if (data.pw !== data.pwcheck || !id_pw_Regex.test(data.id) || !emailRegex.test(data.email) || data.email.length > 30 || !phoneRegex.test(data.phone)) {
        res.status(400).json({ message: "NOT PROPER REGISTER VALUE." }).send()
        return
    }
    try {
        const queryResult = await promisePool.query(
            'select * from users where id=? or email=? or phone=?',
            [data.id, data.email, data.phone]
        )
        if (queryResult[0].length) {
            console.log(queryResult)
            res.status(400).json({ message: "CONFLICT! ID | EMAIL | PHONE" }).send()
            return
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).send()
        return
    }

    try {
        const queryResult2 = await promisePool.query(
            'insert into users (id, pw, email, phone, usertype) values (?, ?, ?, ?, ?)'
            , [data.id, data.pw, data.email, data.phone, data.usertype])
        res.json({ message: "OK" }).send()
        return
    }
    catch (err) {
        console.log(err)
        res.status(500).send()
        return
    }
})

app.post("/api/login", async (req, res) => {

    let data = req.body

    try {
        const queryResult = await promisePool.query(
            'select * from users where id=?',
            [data.id]
        )
        if (queryResult[0].length === 0) {
            // console.log(queryResult)
            res.status(400).json({ message: "ID Not exist" }).send()
            return
        }
        let row = queryResult[0][0]
        if (row.pw !== data.pw) {
            res.status(400).json({ message: "PW wrong" }).send()
            return
        }
        req.session.userId = row.id
        req.session.userCode = row.usercode
        req.session.usertype = row.usertype
        req.session.save()
        res.json({ message: "login OK" })
        console.log("LOGIN Accepted by ID/PW")
        return
    }
    catch (err) {
        console.log(err)
        res.status(500).send()
        return
    }
})




app.get("/api/admin/read", async (req, res) => {
    try {
        const queryResult = await promisePool.query(
            'select * from users'
        )
        res.status(200).json(queryResult).send()
        return
    }
    catch (err) {
        console.log(err)
        res.status(500).send()
        return
    }
})



app.post("/api/admin/remove", async (req, res) => {
    
    let data = req.body

    if (!req.session.userId) {
        res.status(500).send()
        return
    }

    try {
        const queryResult = await promisePool.query(
            'delete from users where usercode=?', [data.usercode]
        )
        res.status(200).send()
        return
    }
    catch (err) {
        console.log(err)
        res.status(500).send()
        return
    }
})



app.listen(5000, () => { console.log("Server started on port 5000") })