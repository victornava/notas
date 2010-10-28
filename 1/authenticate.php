<?php
session_start();
if (! isset ($_SESSION['userId'])) {
	header("Location: login_view.php");
    exit ;
}
?>
