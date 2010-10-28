<?php
require_once 'model.php';

/*
 $r = get_user_prefs(16);
 print_r($r);
 exit;
 */

if ( isset ($_POST['data'])) { //note: remove 'data' from equation
    $reply = array ();
    $request = json_decode($_POST['data'], true); //note: clean up post before use
    //echo 'request > ', var_dump($request);
    if ( isset ($request['action'])) {
        try {
            //$dbCon = openConnection(); //TODO: this shouldn't be here connections DB stuff shuld be handled by model
            $reply = function_switcher($request, $_SESSION['userId']);
        }
        catch(Exception $e) {
            $reply['errors'] = array ('Error in openConnection(): '.$e->getMessage()); //nota: simplify!
        }
    }
    else {
        $reply['errors'] = array ('Error decoding POST: no action'); //nota: simplify!
    }
}
else {
    $reply['errors'] = array ('Error decoding POST: no data'); //nota: simplify!
}
echo json_encode($reply);
exit ;

function function_switcher($request, $userId) {
    $function = strtolower($request['action']);

    switch($function) {
        case 'get_notes':
            $reply = get_notes($userId);
            break;
        case 'save_notes':
            $reply = save_notes($userId, $request['notas']);
            break;
        case 'delete_notes':
            $reply = delete_notes($userId, $request['ids']);
            break;
        case 'logout':
            $reply = logoutUser();
            break;
        default:
            $reply = array ('errors'=> array ('Invalid Action or no Action'));
            break;
    }
    return $reply;
}
?>
