function cleanView(){
    $("#titleModal").text("");
    $("#bodyTag").children().remove();
    $("#ModalObs").off('hidden.bs.modal');
    $("#form2").off('submit');
    $("#buttons_action").children().not(":first").remove();
    $("#modalCreate").removeClass('modal-lg');
}

function get_permission(section){
    return $.ajax({
        url:'controller/test.php',
        type: 'POST',
        dataType: 'json',
        data: {param: 'permission', base: 'r', section:section},
    });
}

function hide_modules(array){
    $.each(modules_index,function(key, value) {
        get_permission(value).done(function(response){
            console.log(response);
            if(array.indexOf(value) == -1 || response['response']['actions'].indexOf(actions_sections['Read']) == -1){
                $("#"+key).parent().remove();
            }
        })
        .fail(function(response) {
            console.log(response);
        });
    });
}

function denyRead(){
    $("#content").load("views/error.html",function(){
        $("#content_error").addClass('text-danger');
        $("#content_error").text("UPS!!! no tienes permisos para ver esta sección. No seas curioso...");
    });
}

function begin_sesion() {
    $(".body_").load("views/body.html",function(){
        $("#modalView").load("views/modalObs.html");
        $(".item").click(function(){
            $(".nav-item").removeClass("active animated flip");
            $(this).parent().addClass("active animated flip");    
            $("#content").addClass("bg-default");
            cleanView();
            switch ($(this).attr("id")){
                case 'apuestas':
                    viewApuestas();
                    break;
                case 'reg_ass':
                    viewCard();
                    break;
                case 'news':
                    viewReports();
                    break;
                case 'reports':
                    viewReports_acum();

                    break;
                default:
                    alert($(this).attr('id'));
            }    
        });
    });
}

document.oncontextmenu = function(){return false;}
$(document).ready(function(){
    $(".body_").load("views/login.html",function(){
        $("#formLogin").submit(function(e) {
            console.log("Logeo");
            var identify = $("#cedula").val();
            e.preventDefault();
            $.ajax({
                type:'POST',
                url:'controller/test.php',
                dataType: 'json',
                data:{param:'login_auth', base:'apst', id: identify}
            }).done(function (response){
                console.log(response);
                if(response["code"] == 200 && response["response"]["exist"] != 0){
                    session = "yes";
                    begin_sesion();
                    sessionStorage.setItem("id",response["response"]["usuario"]);
                }
                else {
                    alert("Usuario Incorrecto");
                }
            }).fail(function(response){
                console.log(response);
            });    
        });
    });  
});
