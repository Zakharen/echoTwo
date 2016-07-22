var express  = require('express');
var app      = express(); 

// added to echoOne login 
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

var Login = function (login, password) {  
    this.login = login;
    this.password = password;
};
// *** end


var port = process.env.PORT || 8077; 

    // login and get token
    app.post('/api/login', function(req, res, err) {
        
        if(req.body.login && req.body.password) {            
            // get login data, information comes from AJAX request from Angular
            var owner = new Login(req.body.login, req.body.password);
            console.log('login ' + owner.login);
            res.json(owner);
        } else {
            res.status(500);
            //res.render('error', { error: err });
        }
        
    });

app.get('*', function(req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

app.listen(port);
console.log('Server running on port >>> ' + port);