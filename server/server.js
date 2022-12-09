const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const { response, application } = require('express')
const session = require('express-session')
const multer = require('multer')
const MySQLStore = require('express-mysql-session')(session)
const maria = require('mysql2')
const fs = require('fs')


// DB
const options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'webpdb'
}
const pool = maria.createPool(options)
const promisePool = pool.promise()
var sessionStore = new MySQLStore({}, promisePool)

// multer, bodyParser setting
const imageDiskStorage = multer.diskStorage({
    destination: './images',
    filename: function (req, file, cb) {
        file.filename = Date.now()
        cb(null, file.filename + '.jpg')
    }
})
const upload = multer({ storage: imageDiskStorage })

app.use(bodyParser.json())

// Static
app.use(express.static(path.join(__dirname, '../client/build')))
app.use('/api/images/', express.static(__dirname + '/images'));

// Session
app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: true,
    // cookie: {secure:true}
}))


const id_pw_name_Regex = new RegExp('^[a-zA-Z0-9._:$!%-]{1,4}$')
const emailRegex = new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$')
const phoneRegex = new RegExp('^01[01]-[0-9]{4,4}-[0-9]{4,4}$')


// GENERAL
app.get("/", async (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'))
    return
})

app.get("/api/session", async (req, res) => {

    if (req.session.userId) {
        res.status(200).json({ message: 'login OK', usertype: req.session.userType })
        return
    }
    res.status(400).json({ message: 'Not available cookie' })
    return
})

app.get("/api/logout", async (req, res) => {
    if (!req.session.userId) {
        res.status(400).send()
    }
    try {
        const queryResult = await promisePool.query(
            'delete from sessions where session_id=?', [req.session.id]
        )
        res.status(200).send()
    }
    catch(err) {
        console.log(err)
        res.status(500).send()
    }
})

app.post("/api/signup", async (req, res) => {

    let data = req.body

    if (!id_pw_name_Regex.test(data.id) || !id_pw_name_Regex.test(data.pw) || !id_pw_name_Regex.test(data.name) || !emailRegex.test(data.email) || data.email.length > 30 || !phoneRegex.test(data.phone)) {
        res.status(400).json({ message: "NOT PROPER REGISTER VALUE." })
        return
    }
    try {
        const queryResult = await promisePool.query(
            'select * from users where id=?',
            [data.id, data.email, data.phone]
        )
        if (queryResult[0].length) {
            // console.log(queryResult)
            res.status(400).json({ message: "CONFLICT! SAME ID EXIST" })
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
            'insert into users (id, pw, email, phone, name, usertype) values (?, ?, ?, ?, ?, ?)'
            , [data.id, data.pw, data.email, data.phone, data.name, data.usertype])
        res.json({ message: "OK" })
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
            res.status(400).json({ message: "ID Not exist" })
            return
        }
        let row = queryResult[0][0]
        if (row.pw !== data.pw) {
            res.status(400).json({ message: "PW wrong" })
            return
        }
        req.session.userId = row.id
        req.session.userCode = row.usercode
        req.session.userType = row.usertype
        req.session.save()
        res.status(200).json({ message: "login OK" })
        return
    }
    catch (err) {
        console.log(err)
        res.status(500).send()
        return
    }
})



// ADMIN
app.get("/api/admin/read", async (req, res) => {

    if (req.session.userType !== 'R') {
        res.status(500).send()
        return
    }

    try {
        const queryResult = await promisePool.query(
            'select * from users'
        )
        res.status(200).json(queryResult)
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

    if (req.session.userType !== 'R') {
        res.status(500).send()
        return
    }

    try {
        const queryResult = await promisePool.query(
            'delete from users where usercode=?', [data.usercode]
        )
        // console.log(queryResult)
        res.status(200).send()
        return
    }
    catch (err) {
        console.log(err)
        res.status(500).send()
        return
    }
})


app.post("/api/admin/modify", async (req, res) => {

    let data = req.body
    // console.log(data)

    if (req.session.userType !== 'R') {
        res.status(500).send()
        return
    }
    if (!id_pw_name_Regex.test(data.id) || !id_pw_name_Regex.test(data.pw) || !id_pw_name_Regex.test(data.name) || !emailRegex.test(data.email) || data.email.length > 30 || !phoneRegex.test(data.phone)) {
        res.status(400).json({ message: "NOT PROPER REGISTER VALUE." })
        return
    }

    try {
        const queryResult = await promisePool.query(
            'update users set id=?,pw=?,email=?,phone=?,name=?,usertype=? where usercode=?'
            , [data.id, data.pw, data.email, data.phone, data.name, data.usertype, data.usercode]
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



// SELLER
app.get("/api/seller/read", async (req, res) => {

    if (req.session.userType !== 'S') {
        res.status(500).send()
        return
    }
    try {
        const queryResult = await promisePool.query(
            'select * from products where sellerid =?', [req.session.userId]
        )
        res.status(200).json(queryResult)
        return
    }
    catch (err) {
        console.log(err)
        res.status(500).send()
        return
    }
})

app.post("/api/seller/create", upload.single('pimage'), async (req, res) => {

    let data = req.body
    let imageFile = req.file

    if (req.session.userType !== 'S') {
        res.status(500).send()
        return
    }
    // console.log(data.name)
    // console.log(imageFile)

    // query
    try {
        const queryResult = await promisePool.query(
            'insert into products (sellerid, name, price, place, ptype, ptext, ptextdetail, pimage, pstatus) values (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [req.session.userId, data.name, data.price, data.place, data.ptype, data.ptext, data.ptextdetail, imageFile.filename, 'O']
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

app.post("/api/seller/modify", upload.single('pimage'), async (req, res) => {

    let data = req.body
    let imageFile = req.file

    if (req.session.userType !== 'S') {
        res.status(500).send()
        return
    }
    // console.log(data)
    // console.log(imageFile)

    // query
    try {
        const queryResult = await promisePool.query(
            'select pimage from products where pcode=?',
            [data.pcode]
        )
        const queryResult2 = await promisePool.query(
            'update products set name=?,price=?,place=?,ptype=?,ptext=?,ptextdetail=?,pimage=? where pcode=?',
            [data.name, data.price, data.place, data.ptype, data.ptext, data.ptextdetail, imageFile.filename, data.pcode]
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

app.post("/api/seller/remove", async (req, res) => {

    let data = req.body
    if (req.session.userType !== 'S') {
        res.status(500).send()
        return
    }
    console.log(data)

    // query
    try {
        const queryResult = await promisePool.query(
            'delete from products where pcode=?',
            [data.productcode]
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

app.get('/api/seller/bidlog', async(req, res) => {
    let data = req.query
    if(req.session.userType != 'S') {
        res.status(500).send()
        return
    }

    //query
    try {
        const queryResult = await promisePool.query(
            'select * from bidlogs where pcode=?',
            [data.pcode]
        )
        res.status(200).json(queryResult)
    }
    catch (err) {
        console.log(err)
        res.status(500).send()
        return
    }
})



// Buyer
app.get("/api/buyer/read", async (req, res) => {

    let data = req.body
    if(req.session.userType != 'B') {
        res.status(500).send()
        return
    }
    console.log(data)

    try {
        const queryResult = await promisePool.query(
            'select * from products where pstatus=?',
            ['O']
        )
        // console.log(queryResult)
        res.status(200).json(queryResult)
    }
    catch (err) {
        console.log(err)
        res.status(500).send()
    }
})

app.post("/api/buyer/buy", async (req, res) => {
    let data = req.body
    if(req.session.userType != 'B') {
        res.status(500).send()
        return
    }

    // 구매인 경우
    if(data.price === -1) {
        try {
            const queryResult = await promisePool.query(
                'select * from products where (pstatus=? and pcode=?)',
                ['O', data.pcode]
            )
            if(queryResult[0].length != 1) {
                res.status(500).send()
            }
            const queryResult2 = await promisePool.query(
                'update products set pstatus=?,pbuyer=? where pcode=?', ['S', req.session.userId,data.pcode]
            )
            res.status(200).send()
        }
        catch (err) {
            console.log(err)
            res.status(500).send()
        }
    }

    // 경매 가격 제안인 경우
    else {
        try {
            const queryResult = await promisePool.query(
                'select * from products where (pcode=? and ptype=?)',
                [data.pcode, 'B']
            )
            if(queryResult[0].length != 1) {res.status(500).send()}

            let prevPrice = queryResult[0][0].price
            if(prevPrice >= data.price) {
                res.status(400).json({message: '경매 제안 가격은 현재 가격보다 높아야 합니다.'})
                return
            }
            
            const queryResult2 = await promisePool.query(
                'insert into bidlogs (pcode, pbuyer, prevprice, updateprice) values (?, ?, ?, ?)',
                [data.pcode, req.session.userId, prevPrice, data.price]
            )

            const queryResult3 = await promisePool.query(
                'update products set price=? where pcode=?',
                [data.price, data.pcode]
            )

            res.status(200).send()
        }
        catch (err) {
            console.log(err)
            res.status(500).send()
        }
    }
})


app.listen(5000, () => { console.log("Server started on port 5000") })