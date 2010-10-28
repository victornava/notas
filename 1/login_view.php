<?php
//require_once 'core.php';
require_once 'html_common.php';
require_once 'view.php';
$view = new View();
?>
<?= Html::docType() ?>
<html>
    <head>
        <?= Html::head() ?>
        <link rel="stylesheet" href="../lib/css/blueprint/screen.css" type="text/css" media="screen, projection">
        <link rel="stylesheet" href="../lib/css/blueprint/print.css" type="text/css" media="print">
        <title>Welcome to Notas</title>
    </head>
    <body>
        <h2>Welcome to Notas</h2>
        <form action="<?=$view->controllerName?>" method="post" accept-charset="utf-8">
            <input type="hidden" name="action" value="login">
            <input type="text" name="email">
            &nbsp&nbsp e-mail 
            <br/>
            <input type="password" name="pass">
            &nbsp&nbsp password
            <br/>
            <input type="submit" value="Login">
        </form>
        <br/>
        Or
        <br/>
        <br/>
        <h3><a href="signup_view.php">Sign Up</a></h3>
        <!--<?= page_footer() ?>-->
    </body>
</html>
