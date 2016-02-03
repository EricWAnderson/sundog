var express = require('express');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var zipCode = require('./routes/zipCode');

var app = express();

app.use(bodyParser.json());
app.use(express.static('server/public'));
app.use('/zipCode', zipCode);
app.use('/', index);

var server = app.listen(3000, function(){
   var port = server.address().port;
   console.log('listening on port', port);
});
