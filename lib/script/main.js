$(function(){
	$("#submit").click(function(){
		$.ajax({
			type:'Post',
			url:'/regist',
			data:{
				name:$("#user").val(),
				pwd:$("#pwd").val()
			}
			}).done(function(msg){
				if(msg==null){
					return false;	
				}
				eval("var msg="+msg);
				if(msg.success){
				
				alert("注册成功");
				}else{
					alert("注册失败");
				}
			});
	});
	
	$("#login_submit").click(function(){
		var name=$("#user").val(),pwd=$("#pwd").val();
		fn_login(name,pwd);
	});
	
	$("#upload").click(function(){
		if(!($("#up_img").val().indexOf(".jpg")!=-1)&&!($("#up_img").val().indexOf(".png")!=-1)&&!($("#up_img").val().indexOf(".gif")!=-1))
		{alert("只支持jpg,png,gif!");return false;}
	});
	$("#uploadIframe").load(function(){
		var io = document.getElementById("uploadIframe");
		var xml = {};
		if(io.contentWindow)
				{
					 xml.responseText = io.contentWindow.document.body?io.contentWindow.document.body.innerHTML:null;
                	 xml.responseXML = io.contentWindow.document.XMLDocument?io.contentWindow.document.XMLDocument:io.contentWindow.document;
					 
				}else if(io.contentDocument)
				{
					 xml.responseText = io.contentDocument.document.body?io.contentDocument.document.body.innerHTML:null;
                	xml.responseXML = io.contentDocument.document.XMLDocument?io.contentDocument.document.XMLDocument:io.contentDocument.document;
				}		
		var html="<li><img src='"+xml.responseText.slice(xml.responseText.indexOf(">")+1,xml.responseText.indexOf("</"))+"' /></li>";
		$("#img_list").append(html);
		$("#up_img").val("");
	});
	
	//图片删除
	$("span.d").click(function(){
		var $this=$(this);
		$.ajax({
			type:'Post',
			url:'/deletImg',
			data:{
				id:$this.parent().find("img").attr("id")
			}
			}).done(function(msg){
				if(msg==null)return false;	
				eval("var msg="+msg);
				if(msg.success){
					$this.parent().remove();
				}else{
					alert("删除失败");
				}
			}).fail(function(msg){
					alert("网络连接失败！");
			});
	});
	
	//$.ajax({
//			type:'Post',
//			url:'/baidu'
//			}).done(function(msg){
//				if(msg==null){
//					return false;	
//				}
//				eval("var res="+msg);
//				var img_html="";
//				for(var i=0;i<res.items.length;i++){
//					img_html+="<li><img src='"+res.items[i].pic_url+"' alt='"+res.items[i].pic_url_noredirect+"' /></li>";
//				}
//				$("#img_list").append(img_html);
//			}).fail(function(msg){
//					alert("网络连接失败！");
//			});
	
	
});

function fn_login(name,pwd){
	$.ajax({
			type:'Post',
			url:'/login',
			data:{
				name:name,
				pwd:pwd
			}
			}).done(function(msg){
				if(msg==null){
					return false;	
				}
				eval("var msg="+msg);
				if(msg.success){
					location.href="/index";
				}else{
					alert("登入失败");
				}
			}).fail(function(msg){
					alert("网络连接失败！");
			});
}