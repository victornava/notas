<?php
require_once 'model.php';

if ( isset ($_REQUEST['action'])) {
    $req = $_REQUEST; //sanitize;
    $action = $req['action'];

    switch($action) {
        case 'login':
            loginUser($req['email'], $req['pass']);
            break;
        case 'signup':
            signupUser($req['email'], $req['pass'], $req['name'], $req['screenName']);
            break;
        default:
            redirectTo('../index.php');
    }
}

else {
    redirectTo('../index.php');
}
?>
