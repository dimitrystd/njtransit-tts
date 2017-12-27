const express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

let routes = require('./api/routes/busRoutes');
routes(app);
routes = require('./api/routes/pollyRoutes');
routes(app);

global.mediaDir = __dirname + '/cache';
global.staticRoute = '/static';
app.use(global.staticRoute, express.static(global.mediaDir));

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port);

console.log('Server started on: ' + port);
