<?php
error_reporting(E_ALL | E_STRICT); //note: debug only
ini_set('display_errors', 1); //note: debug only

/**
 * add quotes to strings, converts true to 1, false to 0 to send values to DB
 * @return
 * @param object $value
 */
function to_sql_type($value) {
    $type = gettype($value);
    switch($type) {
        case 'string':
            //$sqlValue = "'".$value."'";
            $sqlValue = "'$value'";
            break;
        case 'boolean':
            $sqlValue = (int)$value;
            break;
        default:
            $sqlValue = $value;
    }
    return $sqlValue;
}

class Verify
{
    public static function email($email) {
        $l = strlen($email);
        if ($l >= 8 && $l <= 40) {
            return true;
        }
        else {
            return false;
        }
        return true;
    }
    public static function password($pass) {
        $l = strlen($pass);
        if ($l >= 6 && $l <= 50) {
            return true;
        }
        else {
            return false;
        }
        return true;
    }

    public static function name($name) {
        $l = strlen($name);
        if ($l >= 1 && $l <= 32) {
            return true;
        }
        else {
            return false;
        }
        return true;
    }
}
?>
