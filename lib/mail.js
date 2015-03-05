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
  , to      : '<342782880@qq.com>'
  , subject : 'Node.JS通过SMTP协议从QQ邮箱发送邮件'
  , html    : '这是一封测试邮件 <br> '
}, function(err, res) {
    console.log(err, res);
});



//var nodemailer = require("nodemailer");
//// 开启一个 SMTP 连接池
//var smtpTransport = nodemailer.createTransport("SMTP",{
//  host: "smtp.qq.com", // 主机
//  secureConnection: true, // 使用 SSL
//  port: 465, // SMTP 端口
//  auth: {
//    user: "2757753371@qq.com", // 账号
//    pass: "a64540614" // 密码
//  }
//});
//// 设置邮件内容
//var mailOptions = {
//  from: "Fred Foo <342782880@qq.com>", // 发件地址
//  to: "342782880@qq.com", // 收件列表
//  subject: "Hello world", // 标题
//  html: "<b>thanks a for visiting!</b> 世界，你好！" // html 内容
//}
//// 发送邮件
//smtpTransport.sendMail(mailOptions, function(error, response){
//  if(error){
//    console.log(error);
//  }else{
//    console.log("Message sent: " + response.message);
//  }
//  smtpTransport.close(); // 如果没用，关闭连接池
//});