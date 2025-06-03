const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})
let urlDB = [];
app.post('/api/shorturl', (req, res) => {
    
    const original_url = req.body.url;
    try {
        const urlObj = new URL(original_url);
        const short_url = urlDB.length + 1;
        urlDB.push({original_url, short_url})
        res.json({original_url, short_url})
    } 
    catch (err) {
        res.json({ error: 'invalid url' });
    }
       
})

app.get('/api/shorturl/:shorturl', (req, res) => {
    const shortUrl = Number(req.params.shorturl);
    const found = urlDB.find((entry) => entry.short_url === shortUrl);
    if (found) {
        res.redirect(found.original_url)
    }
    else {
        res.json("error: No short URL found for the given input")
    }
    
})
app.listen(3000, ()=>{
    console.log('Your server is listening on port 3000')
})