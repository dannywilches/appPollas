<?php

#session_start(['cookie_lifetime' => 86400]);
session_start(['cookie_lifetime' => 324000]);

function login() {
  
  if ($_SESSION['auth'] != "yes" || $_SESSION['id'] == NULL)
  {
    ?>
        <script>
    location.href="localhost/appPollas/";
    </script>
        <?php  
    
  }
} 


 ?>