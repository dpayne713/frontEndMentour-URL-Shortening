const express = require('express');
const hbs = require('hbs'); 
const path = require('path'); 
const shortUrl = require('node-url-shortener');
const bodyParser = require('body-parser'); 

const app = express(); 

const viewsPath = path.join(__dirname, '/templates/views'); 
const partialsPath = path.join(__dirname, '/templates/partials'); 

app.use(express.json()); 
// app.use(express.urlencoded({extended: true})); 
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'public'))); 

app.set('view engine', 'hbs'); 
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.get('/', (req,res)=> {
    res.render('index')
})

app.post('/shorten', (req,res)=> {
    
    let url = req.body.url

    shortUrl.short(url, function(err, url){
        res.json(url)
    });
})

app.listen(process.env.PORT || 3000, ()=> console.log('server started'));
