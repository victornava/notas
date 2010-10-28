<?php

//TODO store pass in a file not in code

/**
 * Opens a Connection to mysql DB
 * @return PDO Object (Connection)
 */
function openConnection() {
    try {
        $lines = file("../.dbinfo");
        $address = $lines[0];
        $dbName = $lines[1];
        $user = $lines[2];
        $pass = $lines[3];
        $attr = array (PDO::ATTR_PERSISTENT=>true, PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION);
        $cnn_mw = new PDO("mysql: host=$address; dbname=$dbName", $user, $pass, $attr);
        return $cnn_mw;
    }
    catch(Exception $e) {
        throw $e;
    }
}
?>
