function loadAssistanceType(div_inside, sub_service, class_, name_){
	$.ajax({
        type:'POST',
        url:'controller/test.php',
        dataType: 'json',
        data:{param:'load_TypeService',base:'caa', sub_service:sub_service}
    }).done(function(response){
        console.log(response);
        var radio = createRadio(response['response'], class_ ,name_);
        $("#"+div_inside).append(radio);
    }).fail(function(response){
        console.log(response);
    });
}

function loadCourse_report(){
    $.ajax({
        type:'POST',
        url:'controller/test.php',
        dataType: 'json',
        data:{param:'load_courses',base:'caa'}
    }).done(function(response){
        var select = createSelect(response['response'], 1, selectCourse);
        $("#course").append(select);
        var nDate =  getDate();
        $('#dateValue').attr("value",nDate);
        $('#dateValue').attr("max",nDate);
    }).fail(function(response){
        console.log(response);
    });
}

function get_inGeneral_nov(array){
    console.log(array);
    $.ajax({
        url: 'controller/test.php',
        type: 'POST',
        dataType: 'json',
        data: {param:'post_novCourse', base:'caa', course:array[0], date_:array[1], service:array[2], take_:array[3]},
    })
    .done(function(response) {
        if(response['code'] == 200){
            toastr.success("Registros correctamente insertados", 'Notificación', {timeOut: 5000});
        }
        else{
            toastr.error("No fue posible ingresar los registros, verifique que los estudiantes no hayan pasado aún al servicio o que tomen el servicio.", 'Notificación', {timeOut: 5000})
        }
        $("#ModalObs").modal("hide");
        var course = $("#selectCourse").val();
        var type_report = $("input[name='"+nameRadio_mainR+"']:checked").data("val");
        var date = $("#dateValue").val();
        $('.table').remove();
        getReport(course,type_report,date);
        console.log("success");
    })
    .fail(function(response) {
        console.log(response);
        toastr.error("error", 'Notificación', {timeOut: 5000})    
        console.log("error");
    });
}

function modalNovelty(course, parent_service, date){
    $("#titleModal").text("Novedad "+course['text']);
    $("#text_one").text("Servicio:");
    $("#text_two").text("Ingresar:");
    $("#text_two").text("Fecha:");
    loadAssistanceType("item_one",parent_service,'modalG','servicesG');
    $("#item_two").append(createRadio(radio_confirm,'modalG','confirmMG'));
    $("#item_tree").append(date);
    $("#ModalObs").modal("show");
    $("#form2").off('change');
    $("#form2").change(function(){
        if($("#modal_content .radioBtn").length == $(".modalG input[type=radio]:checked").length){
            $("#btnModal").attr('disabled',false);
            $("#errorModal").text("");   
        }
        else{
            $("#btnModal").attr("disabled","disabled");
            $("#errorModal").text(validateOptions);   
            $("#errorModal").css({"color":"red", "text-align": "center"});
        }
    });
    $("#form2").off("submit");
    $("#form2").submit(function(ev){
        var array = [course['ABREV'],date];
        $.each($(".modalG.active").children(),function(){
            array.push($(this).data('val'));
        });

        get_inGeneral_nov(array);
        
        ev.preventDefault();
    }).trigger("change");
}

function modalReport(object, radio_obs){
    $("#text_one").text("Estudiante:");
    $("#text_two").text("Curso:");
    $("#text_three").text("Tomó el servicio:");
    $("#text_four").text("Tipo:");
    loadReasons("item_four", radio_obs);
    var form2Success = false;
    var student =$(object).parent("tr").children(".celValue").not(".obs_report");
    var radio = createRadio(radio_confirm, stringClassModalR, nameRadioR);
    $("#item_three").append("<p>"+radio+"</p>");

    if($(object).data('state') == 1 || $(object).data('state') == '1'){
        $("."+stringClassModalR+"#opt2").addClass("active");
    }
    else{
        $("."+stringClassModalR+"#opt1").addClass("active");
    }
    
    $.each($(student),function(){
        
        if($(this).data('item') == 'NOMBRE'){
            $("#item_one").append("<p id='est_name'>"+$(this).text()+"</p>");
            $("#est_name").attr("data-item",$(this).data('val'));
        }
        else if($(this).data('item') == 'CURSO'){
            $("#item_two").append("<p>"+$(this).text()+"</p>");
        }
    });
    
    $(function(){
        $("#btnModal").attr("disabled","disabled");
        $("#ModalObs").modal("show");
    });

    $("#form2").change(function(){
        
        if($("#"+selectReasons).val() !="--"){
            var validate = 1;
            if ($('.'+stringClassModalR+'.active').children().data('val') == 0 || $('.'+stringClassModalR+'.active').children().data('val') == 1) {
                validate = 1;
            }
            if (validate == 1){
                $("#btnModal").removeAttr("disabled");
                $("#errorModal").empty();
                form2Success=true;
            }
            else{
                $("#btnModal").attr("disabled","disabled");
                $("#errorModal").text(validateOptions);   
                $("#errorModal").css({"color":"red", "text-align": "center"});
                form2Success=false;
            }
        }
        else{
            $("#btnModal").attr("disabled","disabled");
            $("#errorModal").text(validateOptions);   
            $("#errorModal").css({"color":"red", "text-align": "center"});
            form2Success=false;
        }
    });
    $(".modal_service").click(function(){
        $("#form2").change();
    });
    $("#form2").off("submit");
    $("#form2").submit(function(ev){
       var state = $('.'+stringClassModalR+'.active').children().data('val');
       var student = $("#est_name").data('item');
       var reason = $("#selectReasons").val();
       var obs = $("#obsModal").val();
       var service_ = $("#titleModal").data('service');
       var date_report_ = $("#titleModal").data('date');
       entryNovelty(atob(student),service_,reason,obs, state,date_report_);
       var course = $("#selectCourse").val();
       var type_report = $("input[name='"+nameRadio_mainR+"']:checked").data("val");
       var date = $("#dateValue").val();
       sleep(500);
       $('.table').remove();
       getReport(course,type_report,date);
       ev.preventDefault(); 
    });
}

function fillTable(object){
    var text = [];
    $.each($(object),function(){
        text=$(this).text().split('-');
        //if($(this).text() == 'null' || $(this).text() == 0 || $(this).text() == '0'){
        if(text.length == 0 || text[0]=='0' ||text[0]== 0){
            var buttonFail = "<div class='btn btn-sm'><i class='fa fa-times-circle fa-sm' aria-hidden='true' ></i> "+text[1]+"</div>";
            $(this).addClass('obs_report');
            $(this).addClass('table-danger');
            $(this).attr('data-state',$(this).text());
            $(this).text("");
            $(this).append(buttonFail);
        }
        //else if($(this).text() == 1 || $(this).text() == '1'){
        else if(text[0]==1||text[0]=='1'){
            var buttonOk = "<div class='btn btn-sm'><i class='fa fa-check-circle fa-sm' aria-hidden='true' ></i> "+text[1]+"</div>";
            $(this).addClass('obs_report');
            $(this).addClass('table-success');   
            $(this).attr('data-state',$(this).text());
            $(this).text("");
            $(this).append(buttonOk);
        }
    });
}

function getReport(course,type_report,date){
    var temp = course.split("-");
    var nDate =  getDate();
    if (date > nDate) {
        console.log("Date Error");
        return toastr.error(errorDateWrong, 'Notificación', {timeOut: 5000});
    }
    var param = {param:'getReport',base:'caa',course:temp[1],grade:temp[0],type_report:type_report,date:date};

    $.ajax({
        type:'POST',
        url:'controller/test.php',
        dataType: 'json',
        data: param
    }).done(function(response){
        $.each(response['response']['take_service'],function(key,value){
            if(value["t_mn"]==null || value["t_mn"]== 0 || value["t_mn"]== '0'){
                response['response']['table'][key]["MN"] = "No toma el servicio";
            }
            if(value["t_a"]==null || value["t_a"]== 0 || value["t_a"]== '0'){
                response['response']['table'][key]["A"] = "No toma el servicio";
            }
        });
        
        $("#tableContent").load("views/card.html",function(){
            $("#tittleIcon").append("<button type='button' class='btn btn-info btn-sm' id='novelty_g'> Novedad General <i class='fa fa-list-alt' aria-hidden='true'></i></button>");
            $(".bodyCard").append(createTable("assistance",response['response']['table']));
            $("#contentReport").removeClass("d-none");
            fillTable($(".celValue"));
            $(".obs_report").off("click");
            $(".obs_report").click(function(){
                var clicked = $(this);
                var service_ = $(this).data("item");
                var date_ = $("#dateValue").val();
                var radio_obs;
                $("#titleModal").data("service",service_);
                $("#titleModal").data("date",date_);   
                
                if(service_ == "MN"){
                    $("#titleModal").text("Medias Nueves");
                    radio_obs = reasons_id['restaurant'];
                }
                else if(service_ == "A"){
                    $("#titleModal").text("Almuerzo"); 
                    radio_obs = reasons_id['restaurant'];
                }
                else if(service_ == "C"){
                    $("#titleModal").text("Colegio"); 
                    radio_obs = reasons_id['school'];
                }
                $("#bodyTag").load('views/modals/modalReports.html',function(){                
                    modalReport(clicked, radio_obs);
                });
            });

            $("#novelty_g").off("click");
            $("#novelty_g").click(function(){
                var date_ = $("#dateValue").val();
                $("#modalCreate").addClass('modal-lg');
                $("#btnModal").attr("disabled","disabled");
                $("#bodyTag").load('views/modals/modalNoveltyG.html',function(){
                    modalNovelty(response['response']['course'], type_report, date_);
                });
            });

        });    
    }).fail(function(response){
        console.log(response);
    });
}

function viewReports(actions){
    if(actions.indexOf(actions_sections['Read']) != -1){
    
        $("#content").load("views/formReports.html", function(){
            loadAssistanceType("assistanceType",false, stringRadio_mainR,nameRadio_mainR);
            loadCourse_report();
            var formSuccess = false;
            $(".divReport").change(function(){
                if($("#"+selectCourse).val() !="--"){
                    var validate = 0;
                    $("input[name='"+ nameRadio_mainR +"'").each(function() {
                        if ($(this).prop('checked') == true) {
                            validate = 1;
                        }
                    });
                    if (validate == 1){
                        $("#btnGenerate").removeAttr("disabled");
                        $("#errorForm").empty();
                        formSuccess=true;
                    }
                    else{
                        $("#btnGenerate").attr("disabled","disabled");
                        $("#errorForm").text(validateOptions);   
                        $("#errorForm").css({"color":"red", "text-align": "center"});
                        formSuccess=false;
                    }
                }
                else{
                    $("#btnGenerate").attr("disabled","disabled");
                    $("#errorForm").text(validateOptions);   
                    $("#errorForm").css({"color":"red", "text-align": "center"});
                    formSuccess=false;
                }
            });
            
            $(function(){
                $("#ModalObs").on('hidden.bs.modal',function(){
                   $("#bodyTag").children().remove();
                   $("#titleModal").empty();
                   $("#modalCreate").removeClass('modal-lg');
                });
                $("#formReports").submit(function(e){
                    if(formSuccess){
                        $('.table').remove();
                        var course = $("#selectCourse").val();
                        var type_report = $("input[name='"+nameRadio_mainR+"']:checked").data("val");
                        var date = $("#dateValue").val();
                        getReport(course,type_report,date);
                    }
                    e.preventDefault();
                });

               
            })

            //adaptacion a dispositivos moviles touch
            //var codeAlumn = document.getElementById('codeAlumn');
            //codeAlumn.addEventListener('touchstart');
        });
    }
    else{
        denyRead();
    }
}
