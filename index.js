var express = require('express');

var app = express();

app.set('port', process.env.port||2000);

app.get('/',function(req,res) {
    res.send('This is home page and express works!');
});

app.get('/news',function(req,res) {
    res.write('<h1>You reached News Section</h1>');
    res.write("this is the url: " + req.url);
    res.write("<br> this is the Base url: " + req.baseUrl);
    res.write("<br> this is the Original Url: "+ req.originalUrl);
});


app.listen('2000',function(req, res) {
    console.log('Express started and listenting...');
    console.log("this is the URL:" );        
});