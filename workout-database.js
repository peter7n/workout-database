/******************************************************
 ** Program Filename: workout-database.js
 ** Author: Peter Nguyen
 ** Date: 12/6/15
 ** Description: CS 290-400
 ** Database interaction assignment
 ******************************************************/

var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("public"));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

var mysql = require( 'mysql' );
var pool = mysql.createPool( {
  host  : 'localhost',
  user  : 'student',
  password: 'default',
  database: 'student'
} );


/******** Reset the table ********/
app.get('/reset-table',function(req,res,next){
  var context = {};
  pool.query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    })
  });
});

/******** GET handler ********/
app.get('/', function(req, res, next) {
  var context = {};
  pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if (err){
      next(err);
      return;
    }
    context.results = rows;
    res.render('home', context);
  });
});

/******** POST handler - insert, delete and update data *******/
app.post( "/", function(req, res, next) {
  var context = {};

  // Insert data
  if(req.body["add"]) {
    pool.query("INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?, ?, ?, ?, ?)", [ req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.lbs ], function(err, result) {
      if (err) {
        next(err);
        return;
      }
    });
  }

  // Delete data
  if(req.body["delete"]) {
    pool.query("DELETE FROM workouts WHERE id=?", [ req.body.id ], function(err, result) {
      if (err) {
        next(err);
        return;
      }
    });
  }

  // Edit data
  if(req.body["edit"]) {
    pool.query("SELECT * FROM workouts WHERE id=?", [ req.body.id ], function(err, result) {
      if (err) {
        next(err);
        return;
      }
      // Go to edit page
      context.results = result;
      res.render('edit', context);
    });
  }

  // Update data
  if(req.body["update"]) {
    pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=?", [ req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.lbs, req.body.id ], function(err, result) {
      if (err) {
        next(err);
        return;
      }

      // Select all rows and go back to home page
      pool.query('SELECT * FROM workouts', function(err, rows, fields){
        if (err){
          next(err);
          return;
        }
        context.results = rows;
        res.render('home', context);
      });

    });
  }

});


/******** Error handlers *******/
app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
