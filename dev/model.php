<?php
/**
 * TODO:
 * • on signup add "date_added" to sql
 * • on login update "last_login" and login_count in DB
 *
 */
require_once 'core.php';
require_once 'notas.php';
require_once 'html_common.php';
require_once 'view.php';

define('INI_FILE_PATH', '../db.ini'); 

_disableMagicQuotes(); //TODO remove this
date_default_timezone_set('America/Caracas'); //php gives a notice if timezone not set
session_start();

try {
	$dbCon = PDOConnection();
} catch(Exception $e) {
	echo $e->getMessage();
	exit;
}	

function loginUser($email, $pass) {
	global $dbCon;
	$email = $email;
	$pass = $pass; //verify

	try {
		//$dbCon = openConnection();
		$sql = "SELECT user_id, screen_name FROM users WHERE email='$email' AND password='$pass'";
		$row = $dbCon->query($sql)->fetch(PDO::FETCH_ASSOC);
	}
	catch(Exception $e) {
		$response = $e->getMessage();
		echo $response;
		exit ;
	}

	$userId = $row['user_id'];
	$userScreenName = $row['screen_name'];

	if ($userId) {
		$_SESSION['userId'] = $userId;
		$_SESSION['userScreenName'] = $userScreenName;
		redirectTo('user_view.php');
	}
	else {
		echo 'wrong email or password';
	}
}

function logoutUser() {
	$_SESSION = array ();
	session_destroy();
	//redirectTo('login_view.php');
}

function signupUser($email, $password, $name, $screenName) {
	global $dbCon;
	if (!Verify::email($email)) {
		echo 'invalid email';
		return;
	}
	if (!Verify::password($password)) {
		echo 'invalid password';
		return;
	}
	if (!Verify::name($name)) {
		echo 'invalid name';
		return;
	}
	if (!Verify::name($screenName)) {
		echo 'invalid screen name';
		return;
	}

	$cols = "email, password, name, screen_name";
	$values = "'$email', '$password', '$name', '$screenName'";

	//$dbCon = openConnection();
	$sql = "SELECT user_id FROM users WHERE email='$email'";
	$row = $dbCon->query($sql)->fetch(PDO::FETCH_ASSOC);

	if (!$row) {
		//echo $sql;
		$sql = 'INSERT INTO users ('.$cols.') VALUES ('.$values.')';
		try {
			$rowCount = $dbCon->exec($sql);
			if ($rowCount > 0) {
				$sql = "SELECT user_id FROM users WHERE email='$email'";
				$row = $dbCon->query($sql)->fetch(PDO::FETCH_ASSOC);
				_setNewUserPrefs($row['user_id']);
				loginUser($email, $password);
			}
			else {
				echo 'Error registering user, plese try again';
			}
		}
		catch(Exception $e) {
			throw new Exception('DB error '.$e->getMessage());
		}
	}
	else {
		echo "e-mail already registered";
	}
}


function getUserPrefs($userId) {
	//global $dbCon;
	$cols = 'color, font_color, font_size, font_type , width, height, bg_color, bg_img';
	
//	try {
//		$dbCon = PDOConnection();
//		$sql = "SELECT $cols FROM user_prefs WHERE user_id = '$userId'";
//		$prefs = $dbCon->query($sql)->fetch(PDO::FETCH_ASSOC);
//		$reply = $prefs;
//	}
//	catch(Exception $e) {
//		$reply = array ('errors'=>$e->getMessage());
//	}
//	replyJson($reply);
	
	//FIXME make function work
	echo '{"color":"rgb(255, 192, 203)","font_color":"black","font_size":"26","font_type":"courier","width":"279","height":"175","bg_color":null,"bg_img":null}';
}

function setUserPrefs($userId, $prefs) {
	global $dbCon;
	$cols = array ('color', 'font_color', 'font_size', 'font_type', 'width', 'height', 'bg_color', 'bg_img');
	$cols_Vals = array ();

	foreach ($cols as $col) {
		if ( isset ($prefs[$col])) {
			$cols_Vals[] = $col.'='.to_sql_type($prefs[$col]);
		}
	}

	$cols_Vals = implode(', ', $cols_Vals);

	try {
		$sql = "UPDATE user_prefs SET $cols_Vals  WHERE(user_id=$userId)";
		//echo ($sql);
		$rowCount = $dbCon->exec($sql);
		if ($rowCount > 0) {
			$reply = array ('prefs_set'=>true);
		}
		else {
			$reply = array ('prefs_set'=>false);
		}
	}
	catch(Exception $e) {
		$reply = array ('errors'=>$e->getMessage());
	}
	replyJson($reply);
}


function _setNewUserPrefs($userId) {
	global $dbCon;
	$cols = 'user_id, color, font_color, font_size, font_type, width, height, bg_color, bg_img';
	$vals = "'$userId', '#FEF49C', '#000000', '24', 'arial', '320', '300', '', ''";
	$sql = "INSERT INTO user_prefs ($cols) VALUES ($vals)";
	try {
		$dbCon->exec($sql);
		return true;
	}
	catch(Exception $e) {
		return false;
	}
}

function redirectTo($link) {
	header("Location: $link");
}

function replyJson($data) {
	echo json_encode($data);
}

function requireAuth() {
	if (! isset ($_SESSION['userId'])) {
		redirectTo("login_view.php");
		exit ;
	}
}

function PDOConnection(){
	$iniFile = parse_ini_file(INI_FILE_PATH, true);
	if($iniFile){

		$server = $_SERVER['SERVER_NAME'];

		if ($server) {
			$host = $iniFile[$server]['host'];
			$dbName = $iniFile[$server]['dbName'];
			$dbPort = $iniFile[$server]['dbPort'];
			$dbUser = $iniFile[$server]['dbUser'];
			$dbPass = $iniFile[$server]['dbPass'];
		} else {
			throw new Exception("DB host not found in DB.ini file");
		}
		try{
			$dbInfo = "mysql:host=$host;port=$dbPort;dbname=$dbName";
			//echo $dbInfo, $dbUser, $dbPass;
			return new PDO($dbInfo, $dbUser, $dbPass, array(PDO::ERRMODE_EXCEPTION => true));
		} catch(PDOException $e){
			throw $e;
		}
	}
	else{
		throw new Exception(".ini file not found");
	}
}

//TODO remove this
function _disableMagicQuotes() {
	if (get_magic_quotes_gpc()) {
		function stripslashes_deep($value) {
			if (is_array($value)) {
				$value = array_map('stripslashes_deep', $value);
			}
			else {
				$value = stripslashes($value);
			}
			return $value;
		}
		$_POST = array_map('stripslashes_deep', $_POST);
		$_GET = array_map('stripslashes_deep', $_GET);
		$_COOKIE = array_map('stripslashes_deep', $_COOKIE);
		$_REQUEST = array_map('stripslashes_deep', $_REQUEST);
	}
}
?>
