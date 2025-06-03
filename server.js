const express = require('express');
const app = express();
const cors = require('cors');
const dns = require('dns');
const urlParser = require('url'); 

const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})
let urlDB = [];

app.post('/api/shorturl', (req, res) => {
    
    const original_url = req.body.url;
    try {
        const urlObj = new URL(original_url);
        if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
            throw new Error('Invalid protocol');
        }

        const host = urlObj.hostname;

        dns.lookup(host, (err, address) => {
        if (err) {
            return res.json({ error: 'invalid url' });
        }

        const short_url = urlDB.length + 1;
        urlDB.push({original_url, short_url})
        res.json({original_url, short_url})
        })
    }

    catch (error) {
        res.json({ error: 'invalid url' });
    }
       
}

)

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