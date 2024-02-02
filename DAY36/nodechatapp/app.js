var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const layout = require("express-ejs-layouts");
require("dotenv").config();
const webSocket = require("./socket.js");
var debug = require("debug")("nodechatapp:server");
//cors
const cors = require("cors");

var sequelize = require("./models/index.js").sequelize;

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var channelRouter = require("./routes/channel");
var channelAPIRouter = require("./routes/channelAPI");
var memberAPIRouter = require("./routes/memberAPI");
var commonAPIRouter = require("./routes/commonAPI");
var app = express();

sequelize.sync();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("layout", "layout/authLayout");
// app.set("layout extractScripts", true);
// app.set("layout extractStyles", true);
// app.set("layout extractMetas", true);

app.use(layout);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors({}));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/chat", channelRouter);
app.use("/api/channel", channelAPIRouter);
app.use("/api/member", memberAPIRouter);
app.use("/api/common", commonAPIRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

//module.exports = app;
app.set("port", process.env.PORT || 3000);

/**
 * Create HTTP server.
 */

var server = app.listen(app.get("port"), function () {});

/**
 * Listen on provided port, on all network interfaces.
 */

//server.listen(process.env.PORT || 3000);
webSocket(server);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}
