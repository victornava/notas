<?php
require_once 'model.php';

//getUserPrefs(16);
//$p = $cols = array ('color'=>'blue', 'font_color'=>'black', 'font_size'=>'10px', 'font_type'=>'verdana', 'width'=>'400', 'height'=>'500');
//setUserPrefs(16, $p);
//exit ;


if ( isset ($_POST['data'])) { //note: remove 'data' from equation
    $reply = array ();
    $request = json_decode($_POST['data'], true); //note: clean up post before use
    //echo 'request > ', var_dump($request);
    if ( isset ($request['action'])) {
        $userId = $_SESSION['userId'];

        switch($request['action']) {
            case 'get_notes':
                get_notes($userId);
                break;
            case 'save_notes':
                save_notes($userId, $request['notas']);
                break;
            case 'delete_notes':
                delete_notes($userId, $request['ids']);
                break;
            case 'getUserPrefs':
                getUserPrefs($userId);
                break;
            case 'setUserPrefs':
                setUserPrefs($userId, $request['arg']);
                break;
            case 'logout':
                logoutUser();
                break;
            default:
                $reply['errors'] = array ('Invalid Action or no Action');
                replyJson($reply);
        }
    }
    else {
        $reply['errors'] = array ('Error decoding POST: no action'); //nota: simplify!
        replyJson($reply);
    }
}
else {
    $reply['errors'] = array ('Error decoding POST: no data'); //nota: simplify!
    replyJson($reply);
}
exit ;
?>
