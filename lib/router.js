var fs = require("fs"),
	session = require('./session')
	,server=require('./server')
	,handle=require('./handle');
var url = require("url");
var urlForbidden='/upload,index.html';
   
function router(response,request,pathname){
	
	if(pathname.slice(1)=="off"){
		asd();
	}
	
	if(pathname.slice(1)=="close"){
		server.closeServer(router);
		return false;
	}
	var session_detail=handle.fn_session_detail();
	var Cookies=session.getSession(request);
	var timeNow=new Date();
	if(Cookies["HAJUID"]!=""&&Cookies["HAJUID"]!=null){
		if(session_detail[Cookies["HAJUID"]]){
			if((timeNow.getTime()-session_detail[Cookies["HAJUID"]].timestamp)<60*20*1000){
			 	session_detail[Cookies["HAJUID"]].timestamp=timeNow;//更新session时间
			}else{
				delete session_detail[Cookies["HAJUID"]];
				handle.fn_redirect("./html/login.html",response);
				return false;
			}
		}
	}
	
	 console.log("Request handler '"+pathname+"' was called.");
		//if(pathname=="/"){
//			pathname="./html/index.html";
//			fs.readFile(pathname, "binary", function(error, file) {
//				if(error) {
//					console.log("No request handler found for /html/login.html");
//					response.writeHead(404, {"Content-Type": "text/html"});
//					response.write("404 Not found");
//					response.end();
//				} else {
//					response.writeHead(200, {"Content-Type": "text/html"});
//					response.write(file, "binary");
//					response.end();
//				}
//			});
//		}else if(pathname.indexOf(".html")!=-1){
//			pathname="./html"+pathname;
//			fs.readFile(pathname, "binary", function(error, file) {
//				if(error) {
//					console.log("No request handler found for " + pathname);
//					response.writeHead(404, {"Content-Type": "text/html"});
//					response.write("404 Not found");
//					response.end();
//				} else {
//					response.writeHead(200, {"Content-Type": "text/html"});
//					response.write(file, "binary");
//					response.end();
//				}
//			});
//		}else if(pathname.indexOf(".js")!=-1){
//			pathname="./script"+pathname;
//			fs.readFile(pathname, "binary", function(error, file) {
//				if(error) {
//					console.log("No request handler found for " + pathname);
//					response.writeHead(404, {"Content-Type": "text/html"});
//					response.write("404 Not found");
//					response.end();
//				} else {
//					 response.writeHead(200, {"Content-Type": "text/javascript"});
//					  response.write(file, "binary");
//					  response.end();
//				}
//			});
//		}else if(pathname.indexOf("/tmp")!=-1){
//			pathname="."+pathname;
//			fs.readFile(pathname, "binary", function(error, file) {
//				if(error) {
//					console.log("No request handler found for " + pathname);
//					response.writeHead(404, {"Content-Type": "text/html"});
//					response.write("404 Not found");
//					response.end();
//				} else {
//					pathname=pathname.slice(pathname.indexOf(".")+1,pathname.length);
//					//response.writeHead(200, {"Content-Type": "text/"+pathname});
//					response.writeHead(200, {"Content-Type": "text/plain"});
//					response.write(file, "binary");
//					response.end();
//				}
//			});
//		}else if(pathname.indexOf(".css")!=-1){
//			pathname="./css"+pathname;
//			fs.readFile(pathname, "binary", function(error, file) {
//				if(error) {
//					console.log("No request handler found for " + pathname);
//					response.writeHead(404, {"Content-Type": "text/html"});
//					response.write("404 Not found");
//					response.end();
//				} else {
//					response.writeHead(200, {"Content-Type": "text/css"});
//					response.write(file, "binary");
//					response.end();
//				}
//			});
//		}else{
//			
//			try{
//				pathname=pathname.slice(1);
//				console.log("Request handler "+pathname+"()  was called.");
//				var newFn=eval(handle[pathname]);
//				newFn(response,request);
//				//handle[pathname](response,request);
//			}
//			catch(err){
//				console.log(err);
//				response.writeHead(501, {"Content-Type": "text/html"});
//				response.write("501 Not found");
//				response.end();
//			}
//		}
			if(pathname.indexOf(".do")!=-1){
				try{
					pathname=pathname.slice(1);
					console.log("Request handler "+pathname+"()  was called.");
					var newFn=eval(handle[pathname]);
					newFn(response,request);
					//handle[pathname](response,request);
				}
				catch(err){
					console.log(err);
					response.writeHead(501, {"Content-Type": "text/html"});
					response.write("501 Not found");
					response.end();
				}
			}else{
				pathname="./"+pathname;
				fs.readFile(pathname, "binary", function(error, file) {
					if(error) {
						console.log("No request handler found for " + pathname);
						response.writeHead(404, {"Content-Type": "text/html"});
						response.write("404 Not found");
						response.end();
					} else {
						 response.writeHead(200, {"Content-Type": "text/javascript"});
						  response.write(file, "binary");
						  response.end();
					}
				});
			}
		//路由结束
}



exports.router=router;