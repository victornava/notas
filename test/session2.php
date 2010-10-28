<?php
// Starting the session
session_start();

if ( isset ($_SESSION['user'])) {

    $user = $_SESSION['user'];

    echo "<h1>logging successful</h1>";
}
else {

    echo '<h1>Not logged</h1>';
}
?>
