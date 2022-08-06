const express = require('express')
const axios = require('axios')
const https = require('https')
const cors = require('cors')
// json
const bodyParser = require('body-parser')
const res = require('express/lib/response')
const mysql = require('mysql')

const app = express()
const port = 3021
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
const agent = new https.Agent({ keepAlive: true,rejectUnauthorized: false })

app.use(cors())
app.use(bodyParser.json())


let connection = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '123456',
  database: 'quakeinfo'
})

connection.connect((err) => { if(err) throw err})

function sqlQuery(sql,callback) {
  connection.query(sql, (err,rows,fields) => {
    callback(err, rows)
    // connection.end()
  })
}

async function earthquake() { 
  let timestamp = Date.parse(new Date())
  const { data,status }= await axios.get(`https://news.ceic.ac.cn/ajax/google?rand=${timestamp}`, {
      responseType: 'json',
      httpsAgent: agent
  }).catch(err => console.log(err))
  return data
}

app.get('/earth', async (req, res) => {
  // console.log(req.url);
  // console.log(req.method);
  console.log(req.headers);
  try {
    const data = await earthquake()
    res.json({
      status: 200,
      result: data
    })
  }catch (error) {
    res.send(error)
    console.log(error)
  }

})

app.get('/info', (req, res) => {
  const queryData = req.query
  if (!queryData.date) {
    res.send({
      result: 'err'
    })
  } else {
    new Promise(() => {
      sqlQuery(`select id,DATE_FORMAT(quakedate,'%Y-%m-%d %h:%i:%s') as quakedate, class, lat,lng,depth,location FROM quake WHERE TO_DAYS(NOW()) - TO_DAYS(quakedate) <=${queryData.date}`, (err, rows, fields) => {
        // console.log(rows);
        res.send({
          "data": rows
        })
    })

    })
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})