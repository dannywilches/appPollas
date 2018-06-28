function get_Matches() {
    var start = $("#dateStart").val();
    var end = $("#dateEnd").val();
    var user = sessionStorage.id;
    $.ajax({
        url: 'controller/test.php',
        type: 'POST',
        dataType: 'json',
        data: {param: 'matches', base:'apst', date_start:start, date_end:end, id_user:user},
    })
    .done(function(response) {
        console.log(response);
        $("#contentReport").removeClass('d-none');
        var id_card = 0;
        $.each(response['response'], function(key, val) {
            var id_partido = val['id_partido'];
            $("#tableContent").append('<div class="row" id="match'+id_partido+'"></div>');
            var num = "selvalue_"+id_partido;
            $("#match"+id_partido).load('views/card.html',function(){
                var selector = createSelect(val['valores'], 2, num);
                $("#match"+id_partido+" .text_value").append(selector_value);
                $("#match"+id_partido+" .values").append(selector);
                $("#match"+id_partido+" .title_match").append(val['fecha']+ " - "+val['hora']);
                $("#match"+id_partido+" .local").append(val['local']).css('font-weight', 'bold');
                $("#match"+id_partido+" .visit").append(val['visitante']).css('font-weight', 'bold');
                $("#match"+id_partido+" .team-local").prop("data-match",val['id_partido']);
                $("#match"+id_partido+" .team-visit").prop("data-match",val['id_partido']);
                $("#match"+id_partido+" .btnModal").prop("data-match",val['id_partido']);
                $("#match"+id_partido+" .btnBet").prop("data-match",val['id_partido']);
                $("#match"+id_partido+" .btnBet").removeAttr("disabled");
                $("#match"+id_partido+" .btnBet").off("click");
                $("#match"+id_partido+" .btnBet").click(function(event) {
                    var num_match = $(this).prop('data-match');
                    var value_bet = $("#selvalue_"+num_match+" option:selected").val();
                    var mark_local = $("#match"+num_match+" .team-local").val();
                    var mark_visit = $("#match"+num_match+" .team-visit").val();
                    console.log(num_match+"-"+mark_local+"-"+mark_visit+"-"+value_bet);
                    $.ajax({
                        url: 'controller/test.php',
                        type: 'POST',
                        dataType: 'json',
                        data: {param: 'insert_bet', base:'apst', id_user:user, id_match:num_match, val_local:mark_local, val_visit:mark_visit, value_bet:value_bet},
                    })
                    .done(function(response) {
                        console.log("success");
                        console.log(response);
                        get_Matches();
                        toastr.success("Apuesta Realizada", 'Notificación', {timeOut: 5000});
                    })
                    .fail(function(response) {
                        console.log("error");
                        console.log(response);
                    })
                    
                    event.preventDefault();
                });
                $("#match"+id_partido+" .btnModal").off("click");
                $("#match"+id_partido+" .btnModal").click(function(event) {
                    var num_match = $(this).prop('data-match');
                    var value_bet = $("#selvalue_"+num_match).val();
                    var team_local = $("#match"+num_match+" .local").text();
                    var team_visit = $("#match"+num_match+" .visit").text();
                    if (value_bet != "--") {
                        $.ajax({
                            url: 'controller/test.php',
                            type: 'POST',
                            dataType: 'json',
                            data: {param: 'consult_bet', base:'apst', id_match:num_match, value_bet:value_bet},
                        })
                        .done(function(response) {
                            console.log("success");
                            console.log(response);
                            if (response["code"] == 200) {
                                response["response"]["keys"] = new Array(team_local, team_visit, "N° Apuestas");
                                var table = createTable(num_match,response["response"])
                                $("#titleModal").text("Apuestas "+team_local+" vs "+team_visit);
                                $("#btnModal").remove();
                                $("#bodyTag").load('views/modals/modalReports.html',function(){                
                                    $("#modal_content").html(table);
                                    $(".thead-default").css('text-align', 'center');
                                    $(".celValue").css('text-align', 'center');
                                    $("#ModalObs").on('hidden.bs.modal',function(){
                                       $("#bodyTag #modal_content").children().remove();
                                    });
                                });
                                $("#ModalObs").modal("show");
                            }
                            else if (response["code"] == 400) {
                                toastr.info("No se han realizado apuestas actualmente.", 'Notificación', {timeOut: 5000});
                            }
                        })
                        .fail(function(response) {
                            console.log("error");
                            console.log(response);
                        });
                    }
                    else {
                        alert("Selecciona un valor");
                    }
                    event.preventDefault();
                });
                /*$(".values").change(function() {
                    var number = $(this).val().trim();
                    var data_match = $(this).data('match');
                    var isNum = regexpNum.test(number);
                    if (number != "" && isNum) {
                        console.log("Entro");
                        $("#match"+data_match+" .btnModal").removeAttr("disabled");
                    }
                    else {
                        console.log("Salgo");
                        $("#match"+data_match+" .errorSpan").text(errorMark);   
                        $("#match"+data_match+" .errorSpan").css("color","red");
                    }
                });*/
            });
        });
    })
    .fail(function(response) {
        console.log("error");
        console.log(response);  
    });
}

function viewApuestas(){
    $("#content").load("views/formApuestas.html", function(){
    	var currentDate = getDate();
    	$("#dateStart").val(currentDate);
    	$("#dateEnd").val(currentDate);
        get_Matches();
        //eliminar en la validacion del formulario
        $("#btnGenerate").removeAttr('disabled');
        $("#btnGenerate").click(function(e) {
            $("#tableContent").html("")
            get_Matches();
            e.preventDefault();
        });

        $("#bodyTag").load('views/modals/modalReports.html',function(){                

            $("#ModalObs").on('hidden.bs.modal',function(){
               $("#bodyTag #modal_content").children().remove();
            });

            $("#form2").submit(function(e){
                
                if($("#bodyTag .accordion .card-block").children().length > 0){
                    var header = "Reporte Economato ";
                    $("#bodyTag .accordion .card-block").children().printThis(printJson(header));
                }
                else{
                    $("#bodyTag #modal_content").children().printThis(json);   
                }
                e.preventDefault();
            });
        });

    	$("#formApuesta").submit(function(e) {
    		$(".accordion").remove()
    		var startDate = $("#dateStart").val();
			var endDate = $("#dateEnd").val();
            e.preventDefault();
    	    
        });

    });
};
