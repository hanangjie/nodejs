var http = require("http");
var iconv = require('iconv-lite');
var sql=require('./sql');
 var fs = require("fs");

var optionArray=[{
	name:"百度",
    hostname: "pic.sogou.com",
    path: "/pics?query=%C5%AE%C5%AE%BB%A5%CC%F2&mood=0&picformat=0&mode=1&di=2&w=05002100&dr=1&start=48&reqType=ajax&tn=0&reqFrom=result",
	num:0
}]; 

var sqlin="";
var iq=1;
 
var req = http.request(optionArray[0], function(res) {
    res.on("data", function(chunk) {
							
		var q=iconv.decode(chunk, "utf8");
		
		q=q.replace(/\\/g,"$xiegan");
		q=q.replace(/\"/g,"$maohao");
		//var sqlSQL='insert into zhuaqu(domain,html,domainname,optionname) values("'+optionArray[0].hostname+'","'+q+'","'+optionArray[0].name+'","'+optionArray[0].path+'")';
//		sql.sqlGet(sqlSQL,call_returnHtml,optionArray[0]);
		a(q);
    });
	
	setTimeout(function(){
		var sqlSQL='insert into zhuaqu(domain,html,domainname,optionname) values("'+optionArray[0].hostname+'","'+sqlin+'","'+optionArray[0].name+'","'+optionArray[0].path+'")';
		sql.sqlGet(sqlSQL,call_returnHtml,optionArray[0]);
		//var sqlSQL='select html from zhuaqu where domain="'+optionArray[0].hostname+'"';
//		sql.sqlGet(sqlSQL,call_returnSelect,optionArray[0]);
	},3000);
}).on("error", function(e) {
    console.log(e.message);
});

function a(q){
	sqlin+=q;
}


function call_returnHtml(res,option){
	if(res!=null){
		console.log(res);
	}
	
}

function call_returnSelect(err1,res,option){
	res=JSON.stringify(res);
	eval("res="+res);
	var html="";
	for(var i=0;i<res.length;i++){
		html+=res[i].html;
	}
	fs.writeFile("./a.txt",html,function(){
		console.log("a");
	});
	
	var sqlSQL='insert into zqhtml(domain,html,name,optionname) values("'+option.hostname+'","'+html+'","'+option.name+'","'+option.path+'")';
	sql.sqlGet(sqlSQL,call_returnHtml_select);
}
function call_returnHtml_select(err){
	console.log(err);
	console.log("true");
	var sqlSQL='delete from html where domain="'+optionArray[0].hostname+'"';
		sql.sqlIn(sqlSQL,call_returnHtml);
}



req.end();
