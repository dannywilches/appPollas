function addServiceView(){

	addService=true;
	$("#BillNum").text("00");
	
	$(".form2").each(function(){
		$(this).val("");
		
	});
	$(".errorForm2").each(function(){
		$(this).text("");
		
	});
	
	$("#modalTitlle").text("Agregar concepto al estudiante.");
    $("#idT").text();
    $("#Lineid").text(Math.max.apply(null, arrayLineId)+1); 
	
	$("#titularAdd").css("display","block");
	$("#insertTitular").removeAttr("disabled");
    $("#titularUpdate").css("display","none");
	$("#titular").css("display","block");
    $("#idT").css("display","none");
    $("#Billdiv").css("display","none");
    $("#Billndiv").css("display","none");
    $("#addConcept").css("display","block");
    $("#FinalBill").attr("disabled","disabled");
    $("#BillNum").attr("disabled","disabled");
    $("#servicios").html(optionsItem);    
    isValid();
}

function createConcept(){
	var db = $("#selectDb").val();
    var concept = $("#concepts").val();
    var nConcept = $("#concepts option:selected").text();
    var alumn = $("#code").text();
    var idT = $("#insertTitular").val();
    var lineid = $("#Lineid").text(); 
    var price = $("#price").val();
    var project = $("#project").val();
    var period = $("#period").val();
    var tfam = $("#tfam").val();
    var ten = $("#ten").val();
    var tipoCuenta = $("#tipoCuenta").val();
    var descem = $("#descem").val();
    var descSman = $("#descSman").val();
    var payWay = $("#payWay").val();
    var pDescEm = $("#pde").val();
    var pPay = $("#ppay").val();
    var DayP = $("#DayP").val();
    var actDate = $("#actDate").val();
    console.log(db+'  '+concept+'  '+nConcept+'  '+alumn+'  '+idT+'  '+lineid+'  '+price+'  '+project+'  '+period+'  '+tfam+'  '+ten+'  '+tipoCuenta+'  '+descem+'  '+descSman+'  '+payWay+'  '+pDescEm+'  '+pPay+'  '+DayP+'  '+actDate);
    
    $.ajax({
            type:'POST',
            url:'controller/test.php',
            dataType: 'json',
            data:{param:'d', database:db, code:alumn, line:lineid, idConc:concept,nConcept:nConcept, price:price, project:project, period:period, holder:idT, tFamiliar: tfam, ten:ten, descen:descem, pdescen:pDescEm, descStaff: descSman, payway:payWay, ppay:pPay, dateAct: actDate, daysPer: DayP, tCuenta:tipoCuenta}
        }).done(function(response){
            if(response['code'] == 200){
            	console.log(response);
            	var newLine = parseInt(lineid);
                arr = {'U_SEIConc':concept,'U_SEINConc':nConcept, 'LineId':newLine ,'U_SEIPrCoT':price ,'U_SEIProj':project ,'U_SEI_Peri':period ,'U_SEITitul':idT ,'U_SEITariF':tfam ,'U_SEITariE':ten ,'U_SEIDEMan':descem ,'U_SEIDSMan':descSman ,'U_SEIViaPa':pPay ,'U_SEI_DiasPrFact':DayP, 'U_SEINumFC':''};
                arrayLineId.push(newLine);
                $('#contentServices').append(conceptCard(arr));
            }
            else{
                 $("#content").load("views/error.html",function(){
                        $("#imageAnglo").addClass("animated infinite pulse");
                        $("#content_error").html("<h1 class='text-danger'>Hubo un error en el sistema, intenta nuevamente.</h1>");
                        $("#content_error").addClass("animated infinite pulse");
                    });
            }
            $('#actService').modal("hide");
            $(".form2").each(function(){
                $(this).removeAttr('disabled');
            });
            $("#btnsaveText").html("Guardar");
            $('#btnSave').removeAttr("disabled");
            
        }).fail(function(response){
            console.log("fail");
            console.log(response);
            $(".form2").each(function(){
                $(this).removeAttr('disabled');
            });
            $("#btnsaveText").html("Guardar");
            $('#btnSave').removeAttr("disabled");
        });
}
