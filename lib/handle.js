var fs = require("fs"),
	sqlIn=require("./sql"),
	session = require('./session'),
    formidable = require("formidable"),//图片上传第三方包
	querystring = require("querystring"),
	util = require('util');
     
   

var session_detail={};


function regist(response,request){
	try{
		request.setEncoding('utf-8');
		 request.addListener("data",function(postdata){
			var a="",params;
            a+=postdata;	//接收到的表单数据字符串，这里可以用两种方法将UTF-8编码转换为中文
            params = querystring.parse(a);		//转换成json对象
			sqlIn.sqlIn("insert into t_user(name,pwd) values('"+params['name']+"','"+params['pwd']+"')",call_return_sql,response);//数据库操作
        });
	}
	catch(err){
			console.log(err);
			response.writeHead(200, {"Content-Type": "text/html"});
			response.write("{success:false}");
			response.end();
	}
}

function call_return_sql(res,response){
	if(res!=null){
		response.writeHead(200, {"Content-Type": "text/html"});
		response.write("{success:true}");
		response.end();
	//	response.send({success:false});
	}else{
		response.writeHead(200, {"Content-Type": "text/html"});
		response.write("{success:false}");
		response.end();
	}
}


function login(response,request){
	try{
		request.setEncoding('utf-8');
        request.addListener("data",function(postdata){
			var a="",params;
            a+=postdata;	//接收到的表单数据字符串，这里可以用两种方法将UTF-8编码转换为中文
            params = querystring.parse(a);		//转换成json对象
			var selectSQL = 'select * from t_user where name=\''+params['name']+'\' and pwd=\''+params['pwd']+'\'';
			sqlIn.sqlIn(selectSQL,call_return_login,response,request);
        });
	}
	catch(err){
			console.log(err);
			response.writeHead(200, {"Content-Type": "text/html"});
			response.write("{success:false}");
			response.end();
	}
}

function call_return_login(res,response,request){
	if(res.length>0){
		res=JSON.stringify(res);
		eval("res="+res);
		var time = new Date().getTime() + '';
		var id = 'session_' + (time).substring(time.length - 6) + '_' + (Math.round(Math.random() * 1000));
		session.creatSession(session_detail,res[0]['name'],res[0]['id'],id);//简历session
		response.writeHead(200,{ 'Set-Cookie': ["HAJUID="+id], "Content-Type": "text/html"});
		response.write("{success:true}");
		response.end();
	}else{
		response.writeHead(200, {"Content-Type": "text/html"});
		response.write("{success:false}");
		response.end();
	}
}

function index(response,request){
		 var hassession=session.hasSession(request,session_detail);
		 if(!hassession){
			fn_redirect("./html/login.html",response);
			return false;
		 }
		 var Cookies=session.getSession(request);
		 var name="",id=0;
		 if(Cookies["HAJUID"]!=""&&Cookies["HAJUID"]!=null){
			 if(session_detail[Cookies["HAJUID"]]){
			 	name=session_detail[Cookies["HAJUID"]].sessionName;
				id=session_detail[Cookies["HAJUID"]].userId;
			 }
		 }
		 
		call_imgReturn=function(res,response,request){
			var img_html="";
			res=JSON.stringify(res);
			eval("res="+res);
			for(var i=0;i<res.length;i++){
				img_html+="<li><img src='"+res[i].url+"' id='"+res[i].id+"' /><span class='d'>删除</span></li>";
			}
			response.writeHead(200, {"Content-Type": "text/html"});
		var ls_html='<html xmlns="http://www.w3.org/1999/xhtml">'+
					'<head>'+
					'<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />'+
					'<meta content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0,user-scalable=no" name="viewport" id="viewport" />'+
					'<title>无标题文档</title>'+
					'</head>'+
					'<script '+
					'src="/jquery-1.11.1.min.js"></script'+
					'>'+
					'<script '+
					'src="/main.js"></script'+
					'>'+
					'<link href="/main.css" rel="stylesheet" />'+
					'<body>'+
					'<div class="top">'+
					'<a href="/loginOut">退出</a>'+
					'</div>'+
					'您好！'+name+
					'<form action="/upload"  method="post" target="uploadImgFrame" enctype="multipart/form-data" >'+
					'<input type="file" name="upload" multiple="multiple" id="up_img">'+
   					'<input type="submit" value="上传图片" id="upload" />'+
					'</form>'+
					'<iframe name="uploadImgFrame" style="display:none" id="uploadIframe">'+
					'</iframe>'+
					'<ul id="img_list" class="img_list">'+
					img_html+
					'</ul>'+
					'</body>'+
					'</html>';
		response.write(ls_html);
		response.end();
		};
		 //搜索数据库返回图片list
		 var selectSql="select * from user_img where userId='"+id+"'";
		 sqlIn.sqlIn(selectSql,call_imgReturn,response,request);//数据库操作
   		
		
		 
		
};

function loginOut(response,request){
		
		 var Cookies=session.getSession(request);
		 if(Cookies["HAJUID"]!=""&&Cookies["HAJUID"]!=null){
			 if(session_detail[Cookies["HAJUID"]]){
			 	delete session_detail[Cookies["HAJUID"]];
			 }
		 }
		 
		 fn_redirect("./html/login.html",response);
		 
		 
		//response.writeHead(200, {"Content-Type": "text/html"});
//		var ls_html='<html xmlns="http://www.w3.org/1999/xhtml">'+
//					'<head>'+
//					'<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />'+
//					'<title>无标题文档</title>'+
//					'</head>'+
//					'<body>'+
//					'<div class="top">'+
//					'<a href="/login.html" target="_blank">登录</a>'+
//					'</div>'+
//					'您好！'+
//					'</body>'+
//					'</html>';
//		response.write(ls_html);
//		response.end();
};

function upload(response, request) {
	var hassession=session.hasSession(request,session_detail);
		 if(!hassession){
			fn_redirect("./html/login.html",response);
			return false;
		 }
	var Cookies=session.getSession(request);
	var userid="";
	if(Cookies["HAJUID"]!=""&&Cookies["HAJUID"]!=null){
		if(session_detail[Cookies["HAJUID"]]){
		userid=session_detail[Cookies["HAJUID"]].userId;
		}
	}
	var form = new formidable.IncomingForm();
	console.log("about to parse");
	form.parse(request, function(error, fields, files) {
		console.log("parsing done");
		var time=new Date();
		var img_rand=parseInt(Math.random()*1000);
		img=time.getFullYear()+"0"+time.getMonth()+"0"+time.getDay()+"0"+time.getHours()+"0"+time.getMinutes()+"0"+time.getSeconds()+"0"+img_rand;
		console.log(files);
		var readStream = fs.createReadStream(files.upload.path);
		var geshi=files.upload.name.slice(files.upload.name.indexOf("."),files.upload.name.length);
		var imgName="tmp/"+img+geshi;
		var writeStream = fs.createWriteStream(imgName);
		util.pump(readStream, writeStream, function(){
			fs.unlinkSync(files.upload.path);
		});
		sqlIn.sqlInImg("insert into user_img(userid,url,size) values('"+userid+"','/tmp/"+img+geshi+"','"+files.upload.size+"')",call_uploadReturn,response,request,imgName);//数据库操作
	});
}

function call_uploadReturn(res,response,request,imgName){
	 response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("/"+imgName);
    response.end();
}


function fn_redirect(pathname,response){
	fs.readFile(pathname, "binary", function(error, file) {
				if(error) {
					console.log("No request handler found for /html/login.html");
					response.writeHead(404, {"Content-Type": "text/html"});
					response.write("404 Not found");
					response.end();
				} else {
					 response.writeHead(200, {"Content-Type": "text/html"});
					 response.write(file, "binary");
					 response.end();
				}
			});
}


function deletImg(response, request){
		var hassession=session.hasSession(request,session_detail);
		 if(!hassession){
			fn_redirect("./html/login.html",response);
			return false;
		 }
		 var Cookies=session.getSession(request);
		var userid="";
		if(Cookies["HAJUID"]!=""&&Cookies["HAJUID"]!=null){
		 if(session_detail[Cookies["HAJUID"]]){
			userid=session_detail[Cookies["HAJUID"]].userId;
		 }
		}
		
		call_deletImg=function(res,response,request){
			console.log(res);
			if(res!=null){
				 response.writeHead(200, {"Content-Type": "text/html"});
					 response.write("{success:true}");
					 response.end();
			}else{
			 response.writeHead(200, {"Content-Type": "text/html"});
					 response.write("{success:false}");
					 response.end();
			}
		};
		
		request.setEncoding('utf-8');
        request.addListener("data",function(postdata){
			var a="",params;
            a+=postdata;	//接收到的表单数据字符串，这里可以用两种方法将UTF-8编码转换为中文
            params = querystring.parse(a);		//转换成json对象
			var selectSQL = 'delete from user_img where id="'+params["id"]+'" and userid="'+userid+'"';
			sqlIn.sqlIn(selectSQL,call_deletImg,response,request);
        });
}

function imgList(response, request){
	var selectSQL = 'select * from user_img';
	sqlIn.sqlIn(selectSQL,call_imgList,response,request);
}

function call_imgList(res,response, request){
	res=JSON.stringify(res);
	 response.writeHead(200, {"Content-Type": "text/plain"});
	 response.write(res.toString());
	 response.end();
}

function baidu(response, request){
	var selectSQL = 'select html from zhuaqu where domainname="百度"';
	sqlIn.sqlIn(selectSQL,call_baidu,response,request);
}

function call_baidu(res,response, request){
	res=JSON.stringify(res);
	eval("res="+res);
	var html=res[0].html;
	html=html.replace(/\$xiegan\$maohao/g,"'");
	html=html.replace(/\$maohao/g,"\"");
	html=html.replace(/\&amp;/g,"\&");
	
	//html=JSON.stringify(html);
	//var html=encodeURIComponent(res[0].html);
	

	 response.writeHead(200, {"Content-Type": "text/plain"});
	 response.write(html);
	 response.end();
}







function fn_session_detail(){
	return session_detail;
}

exports.regist=regist;
exports.login=login;
exports.index=index;
exports.loginOut=loginOut;
exports.upload=upload;
exports.deletImg=deletImg;
exports.fn_session_detail=fn_session_detail;
exports.fn_redirect=fn_redirect;
exports.imgList=imgList;
exports.baidu=baidu;