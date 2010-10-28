<?php
require_once 'model.php';

if ( isset ($_REQUEST['action'])) {
    $request = $_REQUEST; //sanitize;
    $action = $request['action'];

    switch($action) {
        case 'signup':
            signupUser($request['email'], $request['pass'], $request['name'], $request['screenName']);
            break;
        default:
            redirectTo('login_view.php');
    }
}

else {
    redirectTo('login_view.php');
}
?>
