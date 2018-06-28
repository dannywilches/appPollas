<?php
	define("role_", 2);
	$employee_dep=array(1=>array("profile"=>array(2,4,12), "user"=>array(1,3,4,8,9,10,13,16,17)), 
						2=>array("profile"=>array(1,5,6,7,9,10,11),"user"=>array(5,12,16,23,24)),
						3=>array("profile"=>array(18),"user"=>array(8)),
						4=>array("profile"=>array(1),"user"=>array(15)),
						5=>array("profile"=>array(1),"user"=>array(19)),
						6=>array("profile"=>array(13),"user"=>array(19))
						);
	$db = array('apst'=>'apuestas');
	$report_restEst =array("ACTIVOS","ENTRADAS","NO TIENE CARNÉ","NO ENTRO","CONVIVENCIA","NO REGISTRA","NO VINO","NO QUISO PASAR","SALIO DEL COLEGIO","OTRO");
	$report_restEmp =array(" ","ACTIVOS","ENTRADAS","DIFERENCIA");
	$mat_services =array(2=>1,3=>2);
	$reasonsRepEst =array('activos'=>0,'entradas'=>1,'no_entro'=>2,'convivencia'=>7,'no_registra'=>3,'no_carne'=>11,'no_vino'=>10,'no_quiso'=>8,'salio_colegio'=>9,'otro'=>12);
	$_SESSION['auth'] = '';
	$_SESSION['id'] = '';


?>