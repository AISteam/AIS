var data = null;
window.onload = function(){
	$.ajax({
		url: '/users/list',
		type: 'GET',
		dataType: 'json',
		success: function(req) {
			if(req.code==0){
				data = req.data;
				var compileText = $('#userItemTpl').text();
				var compile = jade.compile(compileText,{compileDebug:false});
				var outputText = compile(data);
				$('#userContainer').html(outputText);
				data = null;
			}
		}
	});

	$('#btn-saveUser').click(function(){
		var ajaxData = {'name':$('#inputName').val(),'email':$('#inputEmail3').val(),'password':$('#inputPassword3').val(),'regDate':new Date()};
		$.ajax({
			url: '/users/add',
			type: 'POST',
			data:ajaxData,
			dataType: 'json',
			success: function(req) {
				if(req.code==0){
					data = req.data;
					var compileText = $('#userItemTpl').text();
					var compile = jade.compile(compileText,{compileDebug:false});
					var outputText = compile(data);
					$('#userContainer').append(outputText);
					$('[data-dismiss="modal"]').click();
					$('#myModal input').each(function(key,val){
						$(val).val('');
					});
					data = null;
				}
			}
		});
	});

	$('#userContainer').click(function(evt){
		if(evt.target.tagName=='A'){
			var userId = $(evt.target).attr('userId');
			if($(evt.target).attr('type')=='edit')
				User.edit(userId);
			else
				User.delete(userId);
		}
	});
}

var User = (function(exports){
	return{
		delete:function(userId){
			alert('删除->'+userId);
		},
		edit:function(userId){
			alert('修改->'+userId);
		}
	}
})(window);