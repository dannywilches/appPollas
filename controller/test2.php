<?php
/**
 * Created by PhpStorm.
 * User: Felipe García
 * Date: 12/09/2017
 * Time: 12:02 PM
 */

$root = realpath($_SERVER["DOCUMENT_ROOT"]);
include("$root/funciones.php");
include("$root/includes/sesion.inc");
include("dataxml.php");
header('Content-type: application/json');

if($_GET['param'] == 'a'){
    $a = getItem('0010000121');
    print_r($a['response']['Row']);
}
elseif($_GET['param'] == 'b'){
    $b = getAlumn('0010000121','93062');
        
    
    $link = conectar_db("caa".date("Y"));
    $query = mysql_query("select * from fotos  where id=93062",$link);
    
    while($img=mysql_fetch_array($query)){
        $image = $img['foto'];
    }
   
    $array = array("cabeza"=>$b['response']['Cabeza']['Row'], "linea"=>$b['response']['Lineas']['Row'], "image"=>base64_encode($image));
    echo json_encode($array);
}
elseif($_GET['param'] == 'c'){
    $c = get_sn('0010000121','c98383396');
    print_r($c['response']);

}
elseif($_GET['param'] == 'd'){
    $d =post_contep('0010000121',93062,26,60013,'SERVICIO MONITOREO DE RUTA','40.500,00 $',2017,10,98383396,0,'N','N',0,'N',1,0);
    print_r(json_encode($d['response'],JSON_PRETTY_PRINT));
}
elseif($_GET['param'] == 'e'){
    $e =act_concep('0010000121',93062,26,27001,'PRUEBAS APTITUDINALES','23.000,00 $',2017,10,98383396,0,'N','N',0,'N',1,0);
    print_r(json_encode($e['response'],JSON_PRETTY_PRINT));
}
else
{
    echo "<h1>not param given</h1>";
}
?>