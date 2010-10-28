<?php
session_start();
//Username Stored for logging
define("USER", "user");

// Password Stored
define("PASS", "123456");

$request['username'] = USER;
$request['password'] = PASS;


// Normal user section - Not logged ------
if ( isset ($request['username']) && isset ($request['password'])) {
    // Section for logging process -----------
    $user = trim($request['username']);
    $pass = trim($request['password']);
    if ($user === USER && $pass === PASS) {
        // Successful login ------------------

        $_SESSION['user'] = USER;

        // Redirecting to the logged page.
        header("Location: session2.php");
    }
    else {
        echo '<h1>Wrong username or Password. Show error here</h>';
    }
}
else {
    echo '<h1>Parameters not found on $request</h>';
}
?>
