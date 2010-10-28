<?php
require_once 'html_common.php';
require_once 'view.php';
$view = new View();

session_start();
/*
if ( isset ($_SESSION['userId'])) {
    header("Location: user_view.php");
    exit ;
}
*/
?>
<?= Html::docType() ?>
<html>
    <head>
        <?= Html::head() ?>
		<link rel="stylesheet" href="../lib/css/blueprint/screen.css" type="text/css" media="screen, projection">
        <link rel="stylesheet" href="../lib/css/blueprint/print.css" type="text/css" media="print">
        <title>Signup</title>
    </head>
    <body>
        <h2>Signup</h2>
        <form action="<?=$view->controllerName?>" method="post" accept-charset="utf-8">
            <input type="hidden" name="action" value="signup">
            Name
            <br/>
            <input type="text" name="name">
            <br/>
            Screen Name
            <br/>
            <input type="text" name="screenName">
            <br/>
            e-mail
            <br/>
            <input type="text" name="email">
            <br/>
            pass
            <br/>
            <input type="password" name="pass">
            <br/>
            <input type="submit" value="Login">
        </form>
        <?= page_footer() ?>
    </body>
</html>
