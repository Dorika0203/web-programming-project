const express = require('express')
const app = express()
const path = require('path')
const maria = require('./database/connect/maria')
const bodyParser = require('body-parser')
const { response } = require('express')

app.use(bodyParser.json())
app.use(express.static(
    path.join(__dirname, '../client/build')
))
maria.connect()

const id_pw_Regex = new RegExp(
    '^[a-zA-Z0-9._:$!%-]{1,4}$'
)
const emailRegex = new RegExp(
    '^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$'
)
const phoneRegex = new RegExp(
    '^01[01]-[0-9]{4,4}-[0-9]{4,4}$'
)

app.post("/api/signup", (req, res) => {
    console.log('/api/register called!!')
    let data = req.body

    if (
        data.pw !== data.pwcheck ||
        !id_pw_Regex.test(data.id)
        ||
        !emailRegex.test(data.email)
        || data.email.length > 30
        || !phoneRegex.test(data.phone)) {
        return res.status(400).json({ message: "NOT PROPER REGISTER VALUE." }).send()
    }
    maria.query(
        'select * from users where id=? or email=? or phone=?',
        [data.id, data.email, data.phone],
        function(err, rows) {
            if(err) {
                console.log(err)
                return res.status(500).send()
            }
            else if(rows.length) {
                console.log("HI2")
                return res.status(400).json({message: "CONFLICT! ID | EMAIL | PHONE"}).send()
            }
        }
    )
    maria.query(
        'insert into users (id, pw, email, phone) values (?, ?, ?, ?)'
        ,[data.id, data.pw, data.email, data.phone],
        function(err) {
            if(err, result) {
                console.log(err)
                return res.status(500).send()
            }
            console.log("HI3")
            return res.status(200).json({message:"OK"}).send()
        }
    )
})


app.get("/api", (req, res) => {
    console.log('/api called!!')
    res.json({ "users": ["user1, user2, user3"] })
})

app.get("/", function (request, response) {
    response.sendFile(path.join(__dirname, '../client/build/index.html'))
})

app.listen(5000, () => { console.log("Server started on port 5000") })