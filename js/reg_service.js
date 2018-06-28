function hourService(){
    var tiempo = new Date();
    var hora = tiempo.getHours();
    var minuto = tiempo.getMinutes();
    var service = "";
    var tag = "";
    if (hora >= 0 && hora < 11) {
        $("#opt1").addClass("active");
        $("#option1").prop("checked",true);
        tag =  'opt1';
    }
    if (hora >= 11 && hora < 23) {
        $("#opt2").addClass('active');
        $("#option2").prop("checked",true);
        tag =  'opt2';
    }
    service =  $('#'+tag).data("val");
    current_service = $('#'+tag).text();
    return [service, current_service];
}

function loadCourse(){
    $.ajax({
        type:'POST',
        url:'controller/test.php',
        dataType: 'json',
        data:{param:'load_courses',base:'caa'}
    }).done(function(response){
        var select = createSelect(response['response'], 1, selectCourse);
        $("#item_one").append(select);
        $("#"+selectCourse).change(function(){
            var course = ($(this).val()).split("-");
            $("#"+selectStudents).remove();
            if ($(this).val() !="--") {
                $("#"+selectCourse).prop('disabled', true);
                loadEstudents(service, course[0],course[1]);
            }
            $(".nov-Rest").select();
        });
        $(".nov-Rest").select();
    }).fail(function(response){
        console.log(response);
    });
}

function loadEstudents(service,gr,cr){
    
    $.ajax({
        type:'POST',
        url:'controller/test.php',
        dataType: 'json',
        data:{param:'load_students',base:'caa', serv:service, grade:gr, course:cr, rest:true}
    }).done(function(response){
        console.log(response);
        var select = createSelect(response['response'], 2, selectStudents)
        $("#item_two").append(select);
        $("#"+selectCourse).prop('disabled', false);
        $("#"+selectStudents).change(function() {
            $(".nov-Rest").select();
            //$("#"+selectReasons).removeAttr('disabled');
        });
    }).fail(function(response){
        console.log(response);
    });   
}

function entryNovelty(code,service,reason,obs_text, state=1,date=""){
    var p = {param:'reg_obs',base:'caa', code:code, serv:service,  type:reason, obs:obs_text, state_:state,date_:date};
    console.log(p);
    $.ajax({
        type:'POST',
        url:'controller/test.php',
        dataType: 'json',
        data:{param:'reg_obs',base:'caa', code:code, serv:service,  type:reason, obs:obs_text, state_:state,date_:date}
    }).done(function(response){
        console.log(response);
        toastr.success(successEntryNovelty, 'Notificación', {timeOut: 5000});
        $("#ModalObs").modal("hide");
    }).fail(function(response){
        console.log('fail');
        console.log(response);
        toastr.error(errorEntryNovelty, 'Notificación', {timeOut: 5000});
    });   
}

function loadAlumn(codeA,service){
    var image = new Image();
    console.log(codeA+" "+service);
    $.ajax({
        type:'POST',
        url:'controller/test.php',
        dataType: 'json',
        data:{param:'reg_service',base:'caa', code:codeA, type:service, status:1, date_:''}
    }).done(function(response){
        $("#codeAlumn").val("");
        console.log(response);
        if(response['code'] == 200){
            
            var medias_nueves = (response['response']['medias_nueves'] == 1)?'SI':'NO';
            var almuerzo = (response['response']['almuerzo'] == 1)?'SI':'NO';
            
            if(response['response']['image']){
                image = "data:image/jpeg;base64,"+response['response']['image'];
                $("#alumnPhoto").attr("src",image);
            }
            else{
                $("#alumnPhoto").attr("src","images/escudo.png");
            }
            $("#AlumnName").text(response['response']['nombre']);
            $("#AlumnCurso").text(response['response']['curso']);
            $("#AlumnMn").text(medias_nueves);
            $("#AlumnA").text(almuerzo);
            
            if( typeof(response['register']) == 'undefined'){
                $("#alumnCard").addClass('border-danger');
            }
            else{
                if(response['register'] == 1){
                    $("#alumnCard").addClass('border-success');
                }
                else if(response['register'] == 0){
                    $("#alumnCard").addClass('border-primary');   
                }
            }
            
        }
        else if (response['code'] == 400){
                $("#errorSpan").text(errorCodeNonExist);   
                $("#errorSpan").css("color","red");
            }
        else{
                console.log(response);
                var message = (response['error'])?response['error']: errorServer;
                $("#content").load("views/error.html",function(){
                    $("#imageAnglo").addClass("animated infinite pulse");
                    $("#content_error").html("<h1 class='text-danger'>"+response['code']+"<br>"+message+"</h1>");
                    $("#content_error").addClass("animated infinite pulse");
                });
            }
    }).fail(function(response){
        console.log("fail");
        console.log(response);
    });
    
};

function modal_restaurant(){
    $("#titleModal").text('Ingreso Novedad');
    $("#item_four").append("<p class='h6' id='text_item' ></p>");
    var form2Success=false;
    

    $("#ModalObs").on('hidden.bs.modal',function(){
        $("#"+selectCourse).remove();
        $("#"+selectReasons).remove();  
        $("#"+selectStudents).remove();
        $("#errorModal").text("");
        $("#obsModal").val('');
        $(".temp").remove();
    });

    $("#alumnObs").click(function() {
        $("#"+selectCourse).remove();
        $("#"+selectReasons).remove();
        $("#"+selectStudents).remove();
        loadReasons('item_three', reasons_id['restaurant']);
        loadCourse();
        
        $("#"+selectStudents).attr('disabled','disabled');
        $("#"+selectReasons).attr('disabled','disabled');
        $("#text_one").text("Curso:");
        $("#text_two").text("Estudiante:");
        $("#text_three").text("Tipo:");
        $("#text_four").text("Servicio:");
        $("#text_item").attr('data-val',service);
        $("#text_item").text(current_service);
        $("#ModalObs").modal("show");
        $("#form2").focus();

        $(".nov-Rest").select(function(){
            var code = $("#"+selectStudents).val();
            var isNum = regexpNum.test(code);
            console.log($("#"+selectCourse).val()+"-"+code+"-"+$("#"+selectReasons).val());
            if($("#"+selectCourse).val() !="--" && (code !="" && isNum) && $("#"+selectReasons).val() !="--"){
                console.log($("#btnModal"));
                console.log($("#errorModal"));
                $("#btnModal").removeAttr("disabled");
                $("#errorModal").text("");
                form2Success=true;
            }
            else{
                $("#btnModal").attr("disabled","disabled");
                $("#errorModal").text(validateOptions);   
                $("#errorModal").css({"color":"red", "text-align": "center"});
                form2Success=false;
            }
            console.log(form2Success);
        });
 
        $(".nov-Rest").change(function() {
            $(".nov-Rest").select();
        });

        $("#form2").off("submit");
        $("#form2").submit(function(e){
         
            if(form2Success){
                var code_student = $("#"+selectStudents).val();
                var reason = $("#"+selectReasons).val();
                var service = $("#text_item").attr('data-val');
                var obs_text = $("#obsModal").val();
                console.log(code_student, service, reason, obs_text);
                entryNovelty(code_student, service, reason, obs_text);

            }   
            e.preventDefault();
            
        }).trigger('select');           
    });


}

function viewCard(actions){
    if(actions.indexOf(actions_sections['Read']) != -1){
        $("#content").load("views/formEconomato.html", function(){
            $("#bodyTag").load('views/modals/modalRestaurant.html',function(){
                modal_restaurant();
            });
            $('#codeAlumn').focus();
            $(".alumnText").css({ 'font-size': '13px'});
            var formSuccess=false;
            
            var service_array = hourService();
            service = service_array[0];
            current_service = service_array[1];
            $(".service").click(function(){
                service=$(this).data('val');
                current_service=$(this).text();
            });

            $("#codeAlumn").keyup(function(){
                var value = $("#codeAlumn").val().trim();
                var isNum = regexpNum.test(value);
                

                if(value !="" && isNum){
                    if ($("#option1").prop('checked') == true || $("#option2").prop('checked') == true) {
                        $("#btnCalumn").removeAttr("disabled");
                        $("#errorSpan").text("");
                        formSuccess=true;
                    }
                    else{
                        $("#btnCalumn").attr("disabled","disabled");
                        $("#errorSpan").text("Seleccione el tipo de asistencia.");   
                        $("#errorSpan").css("color","red");
                        formSuccess=false;
                    }
                }
                else{
                    $("#btnCalumn").attr("disabled","disabled");
                    $("#errorSpan").text(message_numeric);   
                    $("#errorSpan").css("color","red");
                    formSuccess=false;
                }
            });

            $("#codeAlumn").change(function(){
                $("#codeAlumn").keyup();
            });

            $(".service").change(function(){
                $("#codeAlumn").keyup();
            });

            $("#form1").submit(function(e){
                 
                if(formSuccess){
                    //$('#codeAlumn').attr("disabled","disabled");
                    //$("#btnCtext").html("Ingresando   <i class='fa fa-spinner fa-spin' style='font-size:24px'></i>");
                    //$('#btnCalumn').attr("disabled","disabled");
                    //var dataBase = $("#selectDb").val();
                    var codeA = $("#codeAlumn").val();
                    $("#obsSpan").attr('hidden',true);
                    $("#alumnCard").removeClass('border-success');
                    $("#alumnCard").removeClass('border-primary');
                    $("#alumnCard").removeClass('border-danger');
                    loadAlumn(codeA,service);
                       
                }   
                e.preventDefault();
                
            }).trigger('keyup');
            
            //adaptacion a dispositivos moviles touch
            //var codeAlumn = document.getElementById('codeAlumn');
            //codeAlumn.addEventListener('touchstart');
        });
    }
    else{
        denyRead();
    }
}
