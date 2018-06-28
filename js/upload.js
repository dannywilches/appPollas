/*function viewUpload(actions){
	if(actions.indexOf(actions_sections['Read']) != -1){
		$("#content").load("views/formUploadFile.html", function(){
			$("#file").change(function(e){
				var file = $(this).prop('files')[0];
				var data = new FormData();
				data.append('archivo',file);
				$.ajax({
			        type:'POST',
			        url:'controller/test.php',
			        dataType: 'json',
			        contentType:false,
					data:data,
					processData:false,
					cache:false
			    }).done(function(response){
			       console.log(response);
			    }).fail(function(response){
			       console.log(response); 
			    });
			});
		});
	}
	else{
		denyRead();
	}
}*/
function viewUpload(actions){
	if(actions.indexOf(actions_sections['Read']) != -1){
		$("#content").load("views/formUploadFile.html", function(){
			//$("#file").attr("disabled","disabled");
			$(".service").change(function(event) {
				var type_report = $("input[name='options']:checked").data("val");
				if (type_report != "") {
					$("#file").removeAttr("disabled");
				}
			});
			$("#file").change(function(e){
				var file = $(this).prop('files')[0];
				var data = new FormData();
				var report = $('.service .active').children().data('val');
				data.append('archivo',file);
				console.log(report);
				$.ajax({
			        type:'POST',
			        url:'controller/test.php',
			        dataType: 'json',
			        contentType:false,
					data:data,
					base:'comunidad',
					processData:false,
					cache:false
					
			    }).done(function(response){
			       console.log(response);
			    }).fail(function(response){
			       console.log(response); 
			    });
			});
		});
	}
	else{
		denyRead();
	}
}