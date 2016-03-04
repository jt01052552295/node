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


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect('/board/list/1');
});

router.get('/list/:page', function(req,res,next){

    pool.getConnection(function (err, connection) {
        // Use the connection
        var sqlForSelectList = "SELECT idx, userid, name, address FROM test ORDER BY idx DESC";
        connection.query(sqlForSelectList, function (err, rows) {
            if (err) console.error("err : " + err);
            console.log("rows : " + JSON.stringify(rows));

            res.render('list', {title: ' 게시판 전체 글 조회', rows: rows});
            connection.release();

            // Don't use the connection here, it has been returned to the pool.
        });
    });
});

router.get('/read/:idx',function(req,res,next)
{
    var idx = req.params.idx;

    pool.getConnection(function(err,connection)
    {
        var sql = "select * from test where idx=?";
        connection.query(sql,[idx], function(err,row)
        {
            if(err) console.error(err);
            console.log("1개 글 조회 결과 확인 : ",row);
            res.render('read', {title:"글 조회", row:row[0]});
            connection.release();
        });

    });
});

router.get('/update',function(req,res,next)
{
    var idx = req.query.idx;

    pool.getConnection(function(err,connection)
    {
        if(err) console.error("커넥션 객체 얻어오기 에러 : ",err);

        var sql = "select * from test where idx=?";
        connection.query(sql, [idx], function(err,rows)
        {
            if(err) console.error(err);
            console.log("update에서 1개 글 조회 결과 확인 : ",rows);
            res.render('update', {title:"글 수정", row:rows[0]});
            connection.release();
        });
    });

});

router.post('/update',function(req,res,next)
{
    var idx = req.body.idx;
    var userid = req.body.userid;
    var name = req.body.name;
    var address = req.body.address;
   
    var datas = [userid,name,address,idx];

    pool.getConnection(function(err,connection)
    {
        var sql = "update test set userid=?, name=?, address=? where idx=? ";
        connection.query(sql,[userid,name,address,idx],function(err,result)
        {
            console.log(result);
            if(err) console.error("글 수정 중 에러 발생 err : ",err);

            if(result.affectedRows == 0)
            {
                res.send("<script>alert('패스워드가 일치하지 않거나, 잘못된 요청으로 인해 값이 변경되지 않았습니다.');history.back();</script>");
            }
            else
            {
                res.redirect('/board/read/'+idx);
            }
            connection.release();
        });
    });
});



router.get('/write',function(req,res,next)
{
    res.render('write', {title: ' 글작성 '});
});

router.post('/write',function(req,res,next)
{
    var userid = req.body.userid;
    var name = req.body.name;
    var address = req.body.address;

    pool.getConnection(function(err,connection)
    {
        var sql = "insert test set userid=?, name=?, address=? ";
        connection.query(sql,[userid,name,address],function(err,result)
        {
            console.log(result);
            if(err) console.error("글 작성 중 에러 발생 err : ",err);

            if(result.affectedRows == 0)
            {
                res.send("<script>alert('뭔가 에러.');history.back();</script>");
            }
            else
            {
                res.redirect('/board');
            }
            connection.release();
        });
    });
});


router.post('/delete',function(req,res,next)
{
    var idx = req.body.idx;

    pool.getConnection(function(err,connection)
    {
        var sql = "delete from test where idx=? ";
        connection.query(sql,[idx],function(err,result)
        {
            console.log(result);
            if(err) console.error("글 삭제 중 에러 발생 err : ",err);

            if(result.affectedRows == 0)
            {
                res.send("<script>alert('잘못된 요청으로 인해 값이 변경되지 않았습니다.');history.back();</script>");
            }
            else
            {
                res.redirect('/board');
            }
            connection.release();
        });
    });
});

module.exports = router;
