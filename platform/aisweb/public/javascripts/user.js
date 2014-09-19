window.onload = function(){
	$.ajax({
		url: '/users/list',
		type: 'GET',
		dataType: 'json',
		success: function(req) {
			console.log(req);
		}
	});

	$('#btn-saveUser').click(function(){
		var data = {'email':$('#inputEmail3').val(),'password':$('#inputPassword3').val()};
		$.ajax({
			url: '/users/add',
			type: 'POST',
			data:data,
			dataType: 'json',
			success: function(req) {
				console.log(req);
			}
		});
	});
}