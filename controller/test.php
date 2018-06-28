<?php
/**
 * Created by Sublime Text.
 * User: Danny Wilches
 * Date: 17/06/2018
 * Time: 10:00 AM
 */

$root = realpath($_SERVER["DOCUMENT_ROOT"]);
include("accesos.php");
include("sesion.inc");
include("constants.php");
include("dataxml.php");

//$_SESSION['auth'] = 'yes';
//$_SESSION['id'] = 2752;

//$_SESSION['auth'] = '';
//$_SESSION['id'] = '';

function isLoged($base_){
	try
	{
		global $db;
		if(isset($base_)){
			$base = $db[$base_];
			$return =array();
			if ($_SESSION['auth'] == "yes" || $_SESSION['id'] != NULL){
				$return['is_logged']=true;
				return $return; 
			}
			$return['is_logged']=true;
			return $return['is_logged'];
		}
		else{
			return array("code"=>400,"error"=>"Todos los datos son requeridos...", "is_logged"=>true);
		}
	}
	catch(Exception $e){
		return array("code"=>500,"error"=>$e, "is_logged"=>true);
	}
}

function load_Matches($base_,$id_user,$date_start, $date_end){
	try
	{
		global $db;
		if(isset($base_)){
			$base = $db[$base_];
			
			$matches = InfoMatches($base,$id_user,$date_start,$date_end);
			//print_r($matches);
		    return json_encode($matches);
		}
		else{
			return json_encode(array("code"=>400,"error"=>"Todos los datos son requeridos..."));
		}
	}
	catch(Exception $e){
		return json_encode(array("code"=>500,"error"=>$e));
	}
}
function valida_User($base,$user){
	try {
		if(isset($user)){
			$result = Login_User($base,$user); 
			return json_encode($result);
		}
		else{
			return json_encode(array("code"=>400,"error"=>"Todos los datos son requeridos..."));
		}
	} 
	catch (Exception $e) {
		return json_encode(array("code"=>500,"error"=>$e));
	}
}
function new_Bet($base_,$id_user,$id_match,$val_local,$val_visit,$value_bet){
	try
	{
		global $db;
		if(isset($base_) && isset($id_user) && isset($id_match) && isset($val_local) && isset($val_visit) && isset($value_bet)){
			$base = $db[$base_];
			
			$newBet_Match = insert_NewBet($base,$id_user,$id_match,$val_local,$val_visit,$value_bet);
			//print_r($matches);
		    return json_encode($newBet_Match);
		}
		else{
			return json_encode(array("code"=>400,"error"=>"Todos los datos son requeridos..."));
		}
	}
	catch(Exception $e){
		return json_encode(array("code"=>500,"error"=>$e));
	}
}
function consult_Bet($base_,$id_match,$value_bet){
	try
	{
		global $db;
		if(isset($base_) && isset($id_match) && isset($value_bet)){
			$base = $db[$base_];
			
			$newBet_Match = getInfo_Bets($base,$id_match,$value_bet);
			//print_r($matches);
		    return json_encode($newBet_Match);
		}
		else{
			return json_encode(array("code"=>400,"error"=>"Todos los datos son requeridos..."));
		}
	}
	catch(Exception $e){
		return json_encode(array("code"=>500,"error"=>$e));
	}
}

$base = $_POST['base'];
//$userLoged = isLoged($base);

if(true){
	switch ($_POST['param']) {
		case 'login_auth':
			$base = $db[$_POST['base']];
			echo valida_User($base,$_POST['id']);
			break;
		case 'matches':
			echo load_Matches($_POST['base'],$_POST['id_user'],$_POST['date_start'],$_POST['date_end']);
			break;
		case 'insert_bet':
			echo new_Bet($_POST['base'],$_POST['id_user'],$_POST['id_match'],$_POST['val_local'],$_POST['val_visit'],$_POST['value_bet']);
			break;
		case 'consult_bet':
			echo consult_Bet($_POST['base'],$_POST['id_match'],$_POST['value_bet']);
			break;
		default:
			echo $_POST['param'];
			break;
	}	
}
else{
	echo json_encode(array("response"=>array("code"=>400,"error"=>"no ha iniciado sesión o caduco")));
}

?>