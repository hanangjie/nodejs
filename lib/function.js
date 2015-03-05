
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
		from    : 'Kris<' + user + '>'
	  , to      : '<'+email+'>'
	  , subject : 'Node.JS通过SMTP协议从QQ邮箱发送邮件'
	  , html    : '这是一封测试邮件 <br> '
	}, function(err, res) {
		console.log(err, res);
	});
}

exports.sendMail=sendMail;