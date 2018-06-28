<?php 

function conectar_db($db){ 
   //$db = $db;
   if (!($conexion=mysql_connect("localhost","root",""))) 
   { 
      echo "Error conectando!!! <br>a la base de datos."; 
      exit(); 
   } 

   if (!mysql_select_db($db,$conexion)) 
   { 
      echo "Error seleccionando la base de datos " . $db . ""; 
      exit(); 
   } 
   mysql_query("SET NAMES 'utf8'");
   return $conexion; 

} 

?>