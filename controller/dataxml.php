<?php
/**
 * Created by Sublime Text.
 * User: Danny Wilches
 * Date: 17/06/2018
 * Time: 10:00 AM
 */

header('Content-Type: text/html; charset=UTF-8');
$root = realpath($_SERVER["DOCUMENT_ROOT"]);


function response($result){
    /**
     * this function return an array with status code and response of action
     *
     * params:
     * $result: array returned by database actions
     * $client: object that contain all information of request response
     */
    if (!isset($result)){
        return array('code'=>500, 'response' => "error request");
    } else if (empty(array_values($result))) {
        return array('code'=>400, 'response' => "response empty");
    } else {
        return array('code'=>200,'response' => $result);
    }
}

function InfoMatches($base,$user,$date_start,$date_end){
    try {
        $link = conectar_db($base);
        $result =array();
        //$arrayMatchs = array('ID' => array());
        $matches_inf = "SELECT P.id as Id_Partido, L.descripcion as Local, V.descripcion as Visitante, P.fecha as Fecha, P.hora as Hora
                        FROM partido as P INNER JOIN equipo as L ON P.id_equipoL = L.id_equipo INNER JOIN equipo as V ON P.id_equipoV = V.id_equipo
                        WHERE P.fecha BETWEEN '$date_start' AND '$date_end'
                        ORDER BY Fecha, Hora"; 
        $query_matches = mysql_query($matches_inf,$link);
        if(mysql_num_rows($query_matches)>0){
            while($data = mysql_fetch_assoc($query_matches)){
                $id_partido = $data['Id_Partido'];
                $team_local = $data['Local'];
                $team_vist = $data['Visitante'];
                $fecha_match = $data['Fecha'];
                $hour_match = $data['Hora'];
                $available_values = array();
                $values_bet = "SELECT id_valor, descripcion 
                                FROM valor 
                                WHERE id_valor NOT IN (SELECT id_valor FROM apuesta WHERE id_usuario = '$user' AND id_partido = '$id_partido')";
                $query_values = mysql_query($values_bet,$link);
                if(mysql_num_rows($query_values)>0){
                    while($data_values = mysql_fetch_assoc($query_values)){
                        $id_valor = $data_values['id_valor'];
                        $descripcion = $data_values['descripcion'];
                        $available_values[$id_valor] = $descripcion;
                    }
                }
                array_push($result, array('id_partido' => $id_partido, 'local' => $team_local, 'visitante' => $team_vist, 'fecha' => $fecha_match, 'hora' => $hour_match, 'valores' => $available_values));
                //$result[$id_partido] = array('local' => $team_local, 'visitante' => $team_vist, 'fecha' => $fecha_match, 'hora' => $hour_match);
            }
        }
        mysql_close($link);
        return response($result);
    }
    catch (Exception $e) {
        $error = $e->getMessage();
        return array('code'=>500,'response'=>$error);
    }
}

function getInfo_Bets($base,$id_match,$value_bet){
    try {
        $link = conectar_db($base);
        $result =array();
        //$arrayMatchs = array('ID' => array());
        $matches_bets = "SELECT L.descripcion as Local, A.marcador_L as Local_Score, A.marcador_V as Visitante_Score , V.descripcion as Visitante, COUNT(*) as Num_Bets
            FROM apuesta as A 
            INNER JOIN partido as P ON A.id_partido = P.id 
            INNER JOIN equipo as L ON P.id_equipoL = L.id_equipo
            INNER JOIN equipo as V ON P.id_equipoV = V.id_equipo
            WHERE A.id_valor = '$value_bet' AND A.id_partido = '$id_match'
            GROUP BY Local_Score, Visitante_Score"; 
        $query_bets = mysql_query($matches_bets,$link);
        if(mysql_num_rows($query_bets)>0){
            while($data = mysql_fetch_assoc($query_bets)){
                $score_Local = $data['Local_Score'];
                $score_Visit = $data['Visitante_Score'];
                $count_bets = $data['Num_Bets'];
                array_push($result, array('Score_L' => $score_Local, 'Score_V' => $score_Visit, 'Num_Bets' => $count_bets));
            }
        }
        mysql_close($link);
        return response($result);
    }
    catch (Exception $e) {
        $error = $e->getMessage();
        return array('code'=>500,'response'=>$error);
    }
}

function insert_NewBet($base,$id_user,$id_match,$val_local,$val_visit,$value_bet){
    try {
        $link = conectar_db($base);
        $result =array();
        $insert_Bet = "INSERT INTO apuesta(id_partido, id_usuario, id_valor, marcador_L, marcador_V) 
                        VALUES ($id_match,$id_user,$value_bet,$val_local,$val_visit)"; 
        $query_insert_Bet = mysql_query($insert_Bet,$link);
        $affected_rows = mysql_affected_rows();
        if(!$affected_rows or $affected_rows == 0){
            $result["register"]=false;
        }
        else{
            $result["register"]=true;
        }
        mysql_close($link);
        return response($result);
    }
    catch (Exception $e) {
        $error = $e->getMessage();
        return array('code'=>500,'response'=>$error);
    }
}

function Login_User($base,$user){
    global $_SESSION;
    try{
        $link = conectar_db($base);
        $logeo_user = "SELECT U.id_usuario as User, CONCAT(U.apellido,' ', U.nombre) as Nombres
                       FROM usuario as U
                       WHERE U.cedula = '$user'";
        $query_user = mysql_query($logeo_user,$link);
        $exist_user = mysql_num_rows($query_user);
        if(mysql_num_rows($query_user)>0){
            while ($data = mysql_fetch_assoc($query_user)) {
                $name_complet = $data['Nombres'];
                $usuario = $data['User'];
            }
            $_SESSION['auth'] = "yes";
            $_SESSION['id'] = $usuario;
        }
        //array_push($result, $string);
        $result = array("usuario"=>$usuario, "nombres"=>$name_complet, "exist"=>$exist_user);
        mysql_close($link);
        return response($result);
    }catch(Exception $e) {
        $error = $e->getMessage();
        return array('error'=>'Hubo un error en el servidor','descripcion'=>$error);
    }
}
?>