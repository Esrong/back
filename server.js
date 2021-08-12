require('rootpath')();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require('./_middleware/error-handler');
const Pusher = require('pusher');
const ERROR_CONTROLLER = require('./controllers/error');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
// "connectionString": "mongodb://localhost:27017/crvs",
// mongodb+srv://crvs:ABrmjg1M95mxWW3j@cluster0.609uw.mongodb.net/crvs?retryWrites=true&w=majority


// allow cors requests from any origin and with credentials
app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));

// api routes
app.use('/accounts', require('./accounts/accounts.controller'));
app.use('/accounts', require('./accounts/refresh-token.model'));
app.use('/civil',require('./controllers/civil'));
app.use('/marriage',require('./controllers/marriage'));
app.use('/divorce', require('./controllers/divorce'));
app.use('/birth',require('./controllers/birth'));
app.use('/death',require('./controllers/death'));
app.use('/image',require('./controllers/images'));
app.all('*', ERROR_CONTROLLER.error);



// swagger docs route
// app.use('/api-docs', require('./_helpers/swagger'));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: 'eu',
  });
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  });
  
app.listen(port, () => {
    console.log('Server listening on port ' + port);
});
////
