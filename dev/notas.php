<?php

/***
 * TODO:
 * • test type_cast_notes() some values like pos_x are strings "100px";
 */
//require_once 'db.php';
//require_once 'authenticate.php';
//$_POST['data'] = get_test_data(); //note: test only


global $NOTE_KEYS, $NOTE_COLS;

$NOTE_KEYS = array ('content', 'color', 'font_color','font_size', 'font_type', 'pos_x', 'pos_y', 'pos_z','width', 'height', 'is_private', 'state');

$NOTE_COLS = implode(', ', $NOTE_KEYS);

function get_notes($userId) {
    global $dbCon;

    $conds = "user_id = '$userId' and state = 'active'";
    $cols = 'id, content, color, font_color, font_size, font_type, pos_x, pos_y, pos_z, width, height, is_private, state';

    //$sql = "SELECT $cols FROM notes WHERE $conditions ORDER BY pos_z ASC";
    $sql = "SELECT $cols FROM notes WHERE $conds ORDER BY pos_z ASC";

    try {
        $notes = $dbCon->query($sql)->fetchAll(PDO::FETCH_ASSOC);
        $notes = _type_cast_notes($notes);
        $reply = array ("notas"=>$notes);
    }
    catch(Exception $e) {
        $reply = array ("errors"=>'Error in get_notes(): '.$e->getMessage()); //nota: simplify
    }
    replyJson($reply);
}

function save_notes($userId, $notes) {
    global $dbCon, $NOTE_KEYS;
    $updated = array ();
    $created = array ();
    $errors = array ();

    foreach ($notes as $note) {
        $note = _validate_note($note);
        //print_r($note);
        if ($note) {
            $noteId = $note['id'];
            $idHasAlphaChar = preg_match('/[\D]/', $noteId); //resturn 1 if finds a character that's not a number

            //todo: find a better way to distinguish between new and update notes
            if ($idHasAlphaChar) { //if id has alpha chars create note
                try {
                    $newNoteId = _create_note_in_db($userId, $note);
                    $created["$noteId"] = $newNoteId;
                }
                catch(Exception $e) {
                    $errors[] = $e->getMessage();
                }
            }
            else { //id has numbers only, so update note
                try {
                    $rowCount = _update_note_in_db($userId, $note);
                    if ($rowCount > 0) {
                        $updated[] = $noteId;
                    }
                    else {
                        $errors[] = "Error updating note $noteId > doesn't exist in DB or doesn't belong to user";
                    }
                }
                catch(Exception $e) {
                    $errors[] = $e->getMessage();
                }
            }
        }
        //note is invalid
        else {
            $errors[] = 'Found an invalid note';
        }
    }
    //print_r($resp);
    replyJson( array ('created'=>$created, 'updated'=>$updated, 'errors'=>$errors));
}

//private functions private functions private functions private functions
//private functions private functions private functions private functions
//private functions private functions private functions private functions

function _create_note_in_db($userId, $note) {
    global $dbCon, $NOTE_KEYS, $NOTE_COLS;
    $noteTempId = $note['id'];
    //echo ('<p>Create note:'.$noteTempId);
    //$note['user_id'] = $userId;

    foreach ($NOTE_KEYS as $key) {
        $sqlValues[] = $note[$key];
    }
    $sqlValues[] = $userId;
    $now = date('Y-m-d G:i:s');
    $sqlValues[] = "'$now'";

    $cols = $NOTE_KEYS; //todo: improve this
    $cols[] = 'user_id';
    $cols[] = 'last_modified';

    $cols = implode(', ', $cols);
    $sqlValues = implode(', ', $sqlValues); //convert to string ('v1, v1, v3...vn')
    $sqlCreate = "INSERT INTO notes ($cols) VALUES ($sqlValues)";
    //echo ("<p>sqlCreate:  $sqlCreate"); //note: debug only

    $sqlLastId = "SELECT MAX(id) FROM notes WHERE user_id='$userId'";

    try {
        $dbCon->exec($sqlCreate); //todo: find a better way to do this
        $newNoteId = $dbCon->query($sqlLastId)->fetch();
        return $newNoteId[0];
    }
    catch(Exception $e) {
        throw new Exception('Error creating note id: '.$noteTempId.' > '.$e->getMessage());
    }
}

/**
 * Updates a note in DB
 * @return int number of rows modified in DB
 * @param string $userId
 * @param array $note
 */
function _update_note_in_db($userId, $note) { //todo: insert user id!!!
    global $dbCon, $NOTE_KEYS;
    $noteId = $note['id'];
    //echo ('<p>Update note:'.$noteId);

    foreach ($NOTE_KEYS as $key) { //note: comienza en 1, para obviar el id. maybe ugly
        //echo ($key.': '.$note[$key]);
        $sqlValue = $note[$key];
        $colsAndVals[] = $key.'='.$sqlValue;
    }
    $now = date('Y-m-d G:i:s');
    $colsAndVals[] = "last_modified='$now'";

    $colsAndVals = implode(', ', $colsAndVals); //convert to string ('c1=v1, c2=v2, c3=v3...cn=vn')
	    $sql = "UPDATE notes SET $colsAndVals WHERE(id=$noteId and user_id=$userId)";
    //echo ("<p>$sql");
    try {
        $rowCount = $dbCon->exec($sql);
        return $rowCount;
    }
    catch(Exception $e) {
        throw new Exception('Error updating note id: '.$noteId.' > '.$e->getMessage());
    }
}


function get_user_notes_ids($userId) {
    global $dbCon;
    try {
        $sql = 'SELECT id FROM notes WHERE user_id = '.$userId.' ORDER BY id ASC';
        $notes = $dbCon->query($sql)->fetchAll(PDO::FETCH_NUM); //note: use $dbCon->query($sql)->fetchColumn()
        foreach ($notes as $index) {
            $simpleIds[] = $index[0];
        }
        return $simpleIds;
    }
    catch(Exception $e) {
        throw $e;
    }
}

/**
 * Mark notes as deleted in DB
 * @param int $userId
 * @param array $notesIds ;
 */
function delete_notes($userId, $notesIds) {
    global $dbCon;
    $deleted = array ();
    $errors = array ();
    foreach ($notesIds as $id) {
        $now = date('Y-m-d G:i:s');
        $sql = "UPDATE notes SET state='deleted', date_deleted='$now' WHERE (id='$id' and user_id='$userId' and state!='deleted')";
        //$sql = "UPDATE notes SET state='deleted', date_deleted='$now' WHERE (id=$id and state!='deleted')";
        try {
            $rowCount = $dbCon->exec($sql);
            if ($rowCount > 0) {
                $deleted[] = $id; //note: may not be necesary;
            }
            else {
                $errors[] = 'Error in delete_notes() > noteId: '.$id.' doesn\'t exist or doesn\'t belong to user';
            }
        }
        catch(Exception $e) {
            $errors[] = 'Error in delete_notes() with noteId: '.$id.' > '.$e->getMessage();
        }
    }
    replyJson( array ('deleted'=>$deleted, 'errors'=>$errors));
}


/**
 * Convert from string to int the values from notes that should be numeric
 * @return Array $notes
 * @param Array $notes
 */
function _type_cast_notes($notes) { //todo: this is dumb improve
    $noteCount = count($notes);
    for ($i = 0; $i < $noteCount; $i++) {
        foreach ($notes[$i] as $key=> & $value) {
            if (
            /*$key == 'id' |*/
            $key == 'user_id' |
            $key == 'font_size' |
            $key == 'pos_x' |
            $key == 'pos_y' |
            $key == 'pos_z' |
            $key == 'width' |
            $key == 'height' |
            $key == 'is_private'
            ) {
                $value = (int)$value;
            }
        }
    }
    return $notes;
}

//should check is the note has valid key and values
function _validate_note($note) {
    global $NOTE_KEYS;

    foreach ($NOTE_KEYS as $key) {
        if ( isset ($note[$key]) === false) {
            return false;
        }
        $note[$key] = to_sql_type($note[$key]); //prepare for sql
    }
    return $note;
}

//desde aqui es solo debug!!!desde aqui es solo debug!!!desde aqui es solo debug!!!desde aqui es solo debug!!!
//desde aqui es solo debug!!!desde aqui es solo debug!!!desde aqui es solo debug!!!desde aqui es solo debug!!!
//desde aqui es solo debug!!!desde aqui es solo debug!!!desde aqui es solo debug!!!desde aqui es solo debug!!!
//desde aqui es solo debug!!!desde aqui es solo debug!!!desde aqui es solo debug!!!desde aqui es solo debug!!!
//desde aqui es solo debug!!!desde aqui es solo debug!!!desde aqui es solo debug!!!desde aqui es solo debug!!!
//desde aqui es solo debug!!!desde aqui es solo debug!!!desde aqui es solo debug!!!desde aqui es solo debug!!!

function echo_db_tables($pdo) {
    $pdo = $pdo->query("show tables");
    foreach ($pdo as $v) {
        ////print_r($v);
        //echo ("<p>");
    }
}

function print_fr($fr) {
    //echo ("<p><b>functionResponce</b> <br> success: ");
    //echo ($fr->success.' <br> data: ');

    if (is_array($fr->data)) {
        //print_r($fr->data);
    }
    else {
        //echo ($fr->data);
    }
}

function new_note() {
    $note['id'] = 0;
    $note['content'] = 'nada';
    $note['color'] = "#0000ff";
    $note['font_color'] = "#0000cc";
    $note['font_size'] = 14;
    $note['font_type'] = "arial";
    $note['pos_x'] = 0;
    $note['pos_y'] = 0;
    $note['pos_z'] = 1000;
    $note['width'] = 300;
    $note['height'] = 300;
    $note['is_private'] = 1;
    $note['state'] = 'active';
    return $note;
}

function get_test_data() {
    $note2 = new_note();
    $note2['id'] = '150';
    $note2['content'] = time();

    $note3 = new_note();
    $note3['id'] = '146';
    $note3['content'] = time()+1;

    $notes = array ($note2, $note3);

    $data['action'] = "save_notes";
    $data['notes'] = $notes;

    return json_encode($data);
}

?>
