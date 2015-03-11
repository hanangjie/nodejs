$(function(){
	var email=$("#inputEmail")
		,pwd=$("#inputPassword")
		,pwd_again=$("#inputPassword_1");
	var email_f=false,pwd_f=false;
	//验证用户名
	var objFocus=function(obj){
		obj.focus(function(){
			var that=$(this);
			that.closest(".control-group").removeClass("success").removeClass("error");
			that.next().html("");	
		});
	}
	
	objFocus(email);
	objFocus(pwd);
	objFocus(pwd_again);
	
	email.blur(function(){
		var that=$(this);
		var thisVal=that.val();
		
		if(thisVal==""){
			that.closest(".control-group").addClass("error");
			that.next().html("邮箱不能为空！");
			email_f=false;
			return false;
		}
		 var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
   	         if (!reg.test(thisVal)) {
				that.closest(".control-group").addClass("error");
				that.next().html("邮箱格式不对！");	
				email_f=false;
   	     		return false;
   	         }
		$.ajax({
			type:'Post',
			url:'/checkEmail.haj',
			data:{
				email:thisVal
			}
			}).done(function(msg){
				if(msg==null){
					email_f=false;
					return false;	
				}
				eval("var msg="+msg);
				if(msg.success){
					that.closest(".control-group").addClass("success");
					email_f=true;
					that.next().html('<i class="icon-ok icon-blue"></i>');	
				}else{
					that.closest(".control-group").addClass("error");
					that.next().html("邮箱已被注册！");	
					email_f=false;
				}
			}).fail(function(msg){
					that.closest(".control-group").addClass("error");
					that.next().html("网络错误！");	
					email_f=false;
			});		
	});
	
	
	
	pwd.blur(function(){
		var that=$(this);
		var thisVal=that.val();
		
		if(thisVal==""||thisVal.length<6){
			that.closest(".control-group").addClass("error");
			that.next().html("密码不能为空！且不能少于6位！");
			pwd_f=false;
			return false;
		}
		var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&mdash;—|{}【】‘；：”“'。，、？]")
		 if (pattern.test(thisVal)) {
				that.closest(".control-group").addClass("error");
				that.next().html("不能包含特殊字符@#$！");	
				pwd_f=false;
   	     		return false;
   	         }
		if($("#inputPassword_1").val()!=""&&$("#inputPassword_1").val()!=thisVal){
			that.closest(".control-group").addClass("error");
			that.next().html("密码不一致！");
			pwd_f=false;
			return false;
		}else{
			pwd_f=true;
		}
	});
	
	pwd_again.blur(function(){
		var that=$(this);
		var thisVal=that.val();
		
		if(thisVal!=pwd.val()){
			that.closest(".control-group").addClass("error");
			that.next().html("密码不一致！");
			pwd_f=false;
			return false;
		}else{
			pwd_f=true;
		}
	});
	
	//注册
	 $("#register").click(function(){
		 if(pwd_again.val()!=""&& email.val()!=""&&pwd.val()!=""&&pwd_f&&email_f){
			$.ajax({
			type:'Post',
			url:'/regist.haj',
			data:{
				name:email.val(),
				pwd:pwd_again.val()
			}
			}).done(function(msg){
				if(msg==null){
					return false;	
				}
				eval("var msg="+msg);
				if(msg.success){
					//location.href="/index.html";
					var success="";
					success='<p>还差一步即可完成注册<br/>'+
					'我们已经向您的邮箱'+msg.name+'发送了一封激活邮件，请点击邮件中的链接完成注册！</p><br/>';
					if(msg.name.indexOf("qq.com")!=-1||msg.name.indexOf("163.com")!=-1||msg.name.indexOf("126.com")!=-1||msg.name.indexOf("google.com")!=-1||msg.name.indexOf("foxmail.com")!=-1){
						success+='<a href="http://mail.'+msg.name.split("@")[1]+'" target="_blank"><button type="button" class="btn btn-primary">立即激活</button></a>';
					}else{
						success+='请进入您的邮箱查收激活邮件!';
					}
					$(".form-horizontal").html(success);
				}else{
					alert("注册失败");
				}
			}).fail(function(msg){
					alert("网络连接失败！");
			});		
		 }
	});
	
	
});

	

