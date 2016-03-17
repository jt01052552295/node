var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 3,
    host: 'localhost',
    database: 'yc5',
    user: 'root',
    password: 'autoset'
});

router.get('/', function(req, res, next) {
  	pool.getConnection(function (err, connection) {
        if (err) {
        	return console.log('CONNECTION error: ' + err);
    	} else {
            res.render('index', { title: 'Hello World' });
    		return console.log('CONNECTION');
    	}
    	
    });
});

module.exports = router;