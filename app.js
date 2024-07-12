const express = require('express');
const path = require('path');
const favicon = require('static-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');


const routes = require('./routes/index');

const app = express();


app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler for 404 - render 404.jade
app.use((err, req, res, next) => {
  if (err.status === 404) {
    res.status(404);
    res.render('404');
  } else {
    // Development error handler - will print stacktrace
    if (app.get('env') === 'development') {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
      });
    } else {
      // Production error handler - no stacktraces leaked to user
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {},
      });
    }
  }
});




module.exports = app;
