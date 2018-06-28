var body_;
var regexpNum = /^([0-9])+$/;
var regexpProject =/^([0-9]{4})+$/;
var regexpPrice = /^(\d{1,3}(((\.(\d{3})))*(\.(\d{1,3})))?([^\S][\$]))$/
var arrayLineId = [];

var title_match = "title_match";
var local = "local";
var visit = "visit";
var selector_value = "Seleccione el valor de la apuesta";
var errorMark = "Seleccione un valor valido";


function sleep(milliseconds) {
  console.log("sleeping");
  var start = new Date().getTime();
  for (var i = 0; i < 17; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}



function createRadio(array_, class_, name_){
    
    var cont = 1;
    var radio = "<div class='btn-group radioBtn' data-toggle='buttons'>";
    $.each(array_,function(key,value){

        radio = radio + "<label class='btn btn-outline-info btn-sm "+class_+"' id='opt"+cont+"'><input class='form-control' type='radio' data-val='"+key+"' name='"+name_+"' id='option"+cont+"'  autocomplete='off'>"+value+"</label>";
        cont += 1;
    });
    var radio =radio + "</div>";

    return radio;
}

function createSelect(array_, type, id){
    var cont = 1;
    var select = "";
    if(type == 1){
        var select = "<select class='form-control novelty form-control-sm' id='"+id+"'><option value='--'>Curso</option>";
        $.each(array_,function(key,value){
            for (var i = 1; i <= value.length; i++) {
                select = select + '<option class="temp" value="'+key+'-'+i+'">'+value[i-1]+'</option>';
            }   
        });
        var select =select + "</select>";
    }
    else if(type == 2){
        var select = "<select class='form-control novelty form-control-sm' id='"+id+"'><option value='--'>--</option>";
        $.each(array_, function(key, value) {
            select = select + '<option class="temp" value="'+key+'">'+value+'</option>';
        });
    }

    return select;
}

function loadReasons(item_div, type_reason){
    $.ajax({
        type:'POST',
        url:'controller/test.php',
        dataType: 'json',
        data:{param:'load_reasons',base:'caa', type_reason:type_reason}
    }).done(function(response){
        var select = createSelect(response['response'], 2, selectReasons)
        $("#"+item_div).append(select);
    }).fail(function(response){
        console.log(response);
    });
}

function createTable(id,array_,sections=false){
    /*
    this function create a dinamyc table with array object specified
    PARAMS: 
    array_ : it´s an object type JSON like this array_ = {key:{key_:value_},...}

    */
   
    var th = (sections)?"SECCIÓN":"#"
    var table = "<table class = 'table table-responsive table-sm table-hover table-bordered table-striped animated fadeIn' id='table_"+id+"'><thead class='thead-default'><tr><th>"+th+"</th>"
    var cont = 1;
    $.each(array_['keys'],function(index,value){
        table = table + "<th id='title"+index+"'>"+value+"</th>";
    });
    table = table+ "</tr></thead><tbody>"
    $.each(array_,function(key,value){
        if(key != 'keys'){
            var data = (typeof(value['DATA_VAL'])!=='undefined')?btoa(value['DATA_VAL']):btoa(key);
            var dataTr = (sections)?sections_array[cont]:cont;
            table = table +"<tr><td class='number_'>"+dataTr+"</td>";
            $.each(value,function(key_,value_){
                table = (key_ != 'DATA_VAL')? table+"<td class = 'celValue' data-val='"+data+"' data-item='"+key_+"'>"+value_+"</td>":table ;
            })
            table = table + "</tr>";
            cont +=1;
        }
    });
    var table = table+"</tbody></table>";
    return table;
}

function createAccordion(id, array_){
    var accordion = "<div id='"+id+"' role='tablist' aria-multiselectable='true' class='accordion'>";
    var card = 0;
    $.each(array_,function(key,value){
        accordion = accordion +"<div class='card'><div class='card-header' role='tab' id='heading"+card+"'>";
        accordion = accordion +"<h5 class='mb-0'>";
        accordion = accordion +"<button class='btn btn-link' data-toggle='collapse'  data-target='#collapse"+card+id+"' aria-expanded='true'>"+key+"</button></h5></div>";
        accordion = accordion +"<div id='collapse"+card+id+"' class='collapse show' role ='tabpanel' aria-labelledby='heading"+card+"'>";        
        accordion = accordion +"<div class='card-block' id='block_"+key+"'><div class='p-3'>"+value+"</div></div></div>";
        accordion = accordion +"</div>";
        card += 1;
    });
    accordion = accordion + "</div>";
    return accordion;   
}

function getDate() {
    var date = new Date();
    var year = String(date.getUTCFullYear());
    var month = ((date.getUTCMonth()+1)<10)?"0"+(date.getUTCMonth()+1):String(date.getUTCMonth()+1);
    var day = ((date.getUTCDate())<10)?"0"+(date.getUTCDate()):String(date.getUTCDate());
    var nDate = year+'-'+month+'-'+day;
    return nDate;
}

function createGraph(data, width, heigth, id){
    /*
    //Regular pie chart example
    nv.addGraph(function() {
        var chart = nv.models.pieChart()
        .x(function(d) { return d.label })
        .y(function(d) { return d.value })
        .showLabels(true);

        d3.select("#"+id)
        .datum(data)
        .transition().duration(350)
        .call(chart);

        console.log(chart);
        return chart;
    });*/
    
    //Donut chart example
    nv.addGraph(function() {
      var chart = nv.models.pieChart()
          .x(function(d) { return d.label })
          .y(function(d) { return d.value })
          .showLabels(true)     //Display pie labels
          .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
          .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
          .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
          .donutRatio(0.35)     //Configure how big you want the donut hole size to be.
          .valueFormat(d3.format(".0f"))
          .width(width)
          .height(heigth)
          ;

        d3.select("#"+id)
            .datum(data)
            .transition().duration(350)
            .call(chart);

      return chart;
    });
}

function printJson(header){
    return {
                importCSS: false,
                importStyle: false,
                loadCSS:["mod_asistencia2/css/printThis.css"],
                header:"<div class='row'><h3>"+header+"</h3></div>"
            };
}