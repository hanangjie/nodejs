
//加密
var secret={	
};

for(var i=0;i<10;i++){
	secret[i]=""
}

//发送邮件
function sendMail(email){
	var nodemailer  = require("nodemailer");
	var user = '2757753371@qq.com'
	  , pass = 'smtp64540614'
	  ;
	var smtpTransport = nodemailer.createTransport("SMTP", {
		  service: "QQ"
		, auth: {
			user: user,
			pass: pass
		}
	  });
	smtpTransport.sendMail({
		from    : 'Img_Home<' + user + '>'
	  , to      : '<'+email+'>'
	  , subject :'图床--账号激活 <br> '
	  , html    :  '	亲爱的用户：'+
	'您好！'+
	'您于'+new Date().toLocaleString()+' 注册图床帐号 '+email+'，点击以下链接，即可激活该帐号：'+
	'<a href="http://http://localhost:8888/activ.haj?vstr=">http://passport.baidu.com/v2/?regverify&vstr=750683508b83245763802f2dbe1e654c&tpl=mn&u=https%3A%2F%2Fwww.baidu.com%2F&regmerge=1&subpro=</a><br>'+
	'(如果您无法点击此链接，请将它复制到浏览器地址栏后访问)<br>'+
	'1、为了保障您帐号的安全性，请在 48小时内完成激活，此链接将在您激活过一次后失效！<br>'+
	'2、请尽快完成激活，否则过期。<br>'+
	'图床帐号团队<br>'+
	new Date().toLocaleString()
	}, function(err, res) {
		console.log(err, res);
	});	
}

exports.sendMail=sendMail;