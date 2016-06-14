//Set up express.
var express = require('express');
var jwt = require('express-jwt');
var cors = require('cors');
var morgan = require('morgan');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Set up mongoose
var mongoose = require('mongoose');
mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/restaurant';
mongoose.connect(mongoURI);

// Verify mongoose connection.
var db = mongoose.connection;
db.on('error', console.error.bind(console, "There's an error"));
db.once('open', function callback(){console.log('successfully logged into mongo');  });

// Middleware
var bodyParser = require('body-parser');
app.use(express.static(__dirname + '/../client'));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());

var authCheck = jwt({
  secret: new Buffer('0UpBbiHuBz0B45N27qKkqhZnJcOrgHvT6y5kVUQl-O1GSuWisuN3RKKrxjwgvqky', 'base64'),
  audience: 'VJw1CCaxKJ4FdkqPamlBxUUrjuGapt8e'
});

// Socket.io
io.on('connection', function(socket) {

  // once socket-client emit 'chat msg' event from client, chatHandler function will be invoked
  socket.on('chat msg', function chatHandler(msg) {

    // server emit 'chat msg' event back to every socket-client
    io.emit('chat msg', msg);
  });
});

// API endpoints
var handler = require('./handlers/handlers');

// CHANGED
app.get('/api/uberlogin', handler.loginUber);
app.get('/api/uberauthorize', handler.finalizeUberAuthorization);
app.post('/api/uberproducts', handler.getUberProducts); 
app.post('/api/uberorder', handler.orderUberRide); 
// app.post('/api/ubereta', handler,getUberETA); 

// use this route with review submit button
app.post('/api/restaurants', handler.addRestaurant);

app.post('/api/restaurants/yelp', handler.queryRestaurant);

app.get('/api/private', handler.getRestaurantsByUser);

app.get('/api/public', function(req, res) {
  res.json({ message: "Hello from a public endpoint! You don't need to be authenticated to see this." });
});

app.get('/api/private', authCheck, function(req, res) {
  res.json({ message: "Hello from a private endpoint! You DO need to be authenticated to see this." });
});

app.get('/api/restaurants', handler.getRestaurants);

app.get('/api/restaurants/:id', handler.getOneRestaurant);

app.put('/api/restaurants/:id', handler.updateRestaurantInfo);

app.delete('/api/users/:id', handler.deleteRestaurant);

// export http variable instead app for socket.io to work properly
module.exports = http;
