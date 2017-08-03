const http = require("http");

var express = require('express');

var app = express(); 

app.disable('x-powered-by');

var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');

//MORE IMPORTS HERE
app.use(require('body-parser').urlencoded({extended:true}));

var formidable = require('formidable');

var credentails = require('./credentials.js');
app.use(require('cookie-parser')(credentails.cookieSecret));


app.set('port',process.env.PORT ||  3000);

app.use(express.static(__dirname + "/public"));

//routes
app.get("/",function(req,res){
    res.render('home');
});

app.get("/about",function(req, res){
    res.render("about");
});

//middleware
app.use(function(req, res, next) {
    console.log("Looking for URL: " + req.url);
    next();
});

//another middleware 
app.get('/junk',function(req,res,next) {
    console.log("Tried to access /junk");
    throw new Error('/junk doesn\'t exist');
});

//catch the error
app.use(function(err, req, res, next) {
    console.log('Error: ' + err.message);
    next();
});

app.get('/contact',function(req,res){
    res.render('contact',{ csrf: 'CSRF token here'});
});

app.get('/thankyou',function(req,res){
    res.render('thankyou');
});

app.get('/chervu',function(req,res){
    res.write("Welcome Chervu");
    res.end();
});

//submit form
app.post('/process',function(req,res){
    console.log('Form: '+ req.query.form);
    console.log('CSRF toekn: ' + req.body._csrf);
    console.log('email: '+ req.body.email);
    console.log('Question: '+ req.body.question);
    res.redirect(303, '/thankyou');
});

//file upload
app.get('/file-upload', function(req,res){
    var now = new Date();
    res.render('file-upload',{
        year: now.getFullYear(), 
        month: now.getMonth()        
    })
});

app.post('/file-upload/:year/:month',function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req,function(err, fields, file){
        if(err)
            return res.redirect(303,'Error');        
        console.log('Received File');
        console.log(file);
        res.redirect(303,'/thankyou');
    });
});

//Cookies
//set  a cookie
app.get('/cookie',function(req,res){
res.cookie('username','tmpnc4',{expire:new Date() + 9999})
          .send('username has the value of tmpnc4');
});

//read all cookie
app.get('/listcookies',function(req,res){
console.log("Cookies: ", req.cookies);
res.send('Look in the console for all cookies');
});

//clear/delete cookie
app.get('/deletecookies', function(req, res){
 res.clearCookie('username');
 res.send("username cookie deleted");
});




//another middleware
app.use(function(req,res){
    res.type('text/html');
    res.status(404);
    res.render('404');    
});

app.use(function(err,req,res,next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});



app.listen(app.get('port'), function() {
    console.log("Expreess started on http:localhost:" + app.get('port') + '. Press Ctrl-C to terminate.');
});


