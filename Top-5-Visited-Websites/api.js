const client = require('./connection.js')
const express = require('express');
const app = express();
var cors = require('cors');
app.use(cors())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Server is now listening at port ${PORT}`);
})

client.connect();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.get('/', (req, res)=>{
    client.query(`Select * from public.char`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        }
    });
    client.end;
})

const api_Key = '2CrAJ8oa1DAL1bIxw7oAwiEhnwm_7tLGF8UFiwphnadngm3mg';

app.get('/data/' + api_Key, (req, res)=>{
    client.query(`Select * from public.char`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        }
    });
    client.end;
})