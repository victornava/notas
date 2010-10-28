<?php
require_once 'html_common.php';
require_once 'view.php';
$view = new View();
?>
<?= Html::docType() ?>
<html>
    <head>
        <?= Html::head() ?>
        <link rel="stylesheet" href="../lib/css/blueprint/screen.css" type="text/css" media="screen, projection">
        <title>Notas</title>
    </head>
    <body>
        <div style="margin:8px">
            <h1>Notas</h1>
            <h3>Stikie notes on the web...</h3>
            <div class="formWraper" style="float: left">
                <form action="login_controller.php" method="post" accept-charset="utf-8">
                    <input type="hidden" name="action" value="login">
                    <h2 style="alignCenter">Login</h2>
                    <table border="0">
                        <tr>
                            <td class="alignRight">
                                E-mail
                            </td>
                            <td>
                                <input type="text" name="email">
                            </td>
                        </tr>
                        <tr>
                            <td class="alignRight">
                                Password 
                            </td>
                            <td>
                                <input type="password" name="pass">
                            </td>
                        </tr>
                        <tr>
                            <td>
                            </td>
                            <td class="alignRight">
                                <input type="submit" value="Go">
                            </td>
                        </tr>
                    </table>
                </form>
            </div>
            <div class="formWraper" style="float: left">
                <form action="signup_controller.php" method="post" accept-charset="utf-8">
                    <input type="hidden" name="action" value="signup">
                    <h2 style="alignCenter">Signup</h2>
                    <table border="0">
                        <tr>
                            <td class="alignRight">
                                Full Name
                            </td>
                            <td>
                                <input type="text" name="name">
                            </td>
                        </tr>
                        <tr>
                            <td class="alignRight">
                                Nick Name
                            </td>
                            <td>
                                <input type="text" name="screenName">
                            </td>
                        </tr>
                        <tr>
                            <td class="alignRight">
                                E-mail
                            </td>
                            <td>
                                <input type="text" name="email">
                            </td>
                        </tr>
                        <tr>
                            <td class="alignRight">
                                Password
                            </td>
                            <td>
                                <input type="password" name="pass">
                            </td>
                        </tr>
                        <tr>
                            <td>
                            </td>
                            <td class="alignRight">
                                <input type="submit" value="Go">
                            </td>
                        </tr>
                    </table>
                </form>
            </div>
            <!--<div class="formWraper" style="float: left">
            <form action="" method="post" accept-charset="utf-8">
            <input type="hidden" name="action" value="testDrive">
            <h2 style="alignCenter">Give it a Test Drive!</h2>
            <input type="submit" value="Go">
            </form>
            </div>-->
        </div>
    </body>
</html>
