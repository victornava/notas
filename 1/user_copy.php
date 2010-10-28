<?php

require_once 'core.php';
require_once 'common.php';
require_once 'verify.php';

//session_start();

class User
{
    public static function login($email, $pass) {

        if ( isset ($_SESSION['userId'])) {
            header('Location: user_view.php');
            exit ;
        }

        $email = $email; //verify
        $pass = $pass; //verify

        try {
            $dbCon = open_connection();
            $sql = "SELECT user_id, screen_name FROM users WHERE email='$email' AND password='$pass'";
            $row = $dbCon->query($sql)->fetch(PDO::FETCH_ASSOC);
        }
        catch(Exception $e) {
            $response = $e->getMessage();
            break;
        }

        $userId = $row['user_id'];
        $userScreenName = $row['screen_name'];

        if ($userId) {
            $_SESSION['userId'] = $userId;
            $_SESSION['userScreenName'] = $userScreenName;
            header('Location: user_view.php');
            //$data = array('redirectTo' => 'user_page.php', 'userScreenName' => $userScreenName);
            //$response = new AjaxResponse(1, $data);
        }
        else {
            echo 'wrong email or password';
        }
    }

    public static function logout() {
        $_SESSION = array ();
        session_destroy();
        header('Location: login_view.php');
    }

    public static function signup($email, $password, $name, $screenName) {
        //todo: all verifications
		
		if(!Verify::email($email)){
			echo 'invalid email';
			return;
		}
		if(!Verify::password($password)){
			echo 'invalid password';
			return;
		}
		if(!Verify::name($name)){
			echo 'invalid name';
			return;
		}
		if(!Verify::name($screenName)){
			echo 'invalid screen name';
			return;
		}
		
		$cols =  "email, password, name, screen_name";
		$values = "'$email', '$password', '$name', '$screenName'";

        $dbCon = open_connection();
        $sql = "SELECT user_id FROM users WHERE email='$email'";
        $row = $dbCon->query($sql)->fetch(PDO::FETCH_ASSOC);
        
		if (!$row) {
        	//echo $sql;
            $sql = 'INSERT INTO users ('.$cols.') VALUES ('.$values.')';
            try {
                $rowCount = $dbCon->exec($sql);
                if($rowCount > 0){
                	//echo "welcome $screenName";
					User::login($email, $password);
                }
				else{
					echo 'Error registering user, plese try again';
				}
            }
            catch(Exception $e) {
                throw new Exception('Error registering user, plese try again '. $e->getMessage());
            }
        }
        else {
            echo "e-mail already registered";
        }
    }
	
	public static function getInfo(){
	}
}
?>
