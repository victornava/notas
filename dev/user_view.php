<?php
require_once 'model.php';
//require_once 'authenticate.php';

requireAuth();
$view = new View();
?>
<?= Html::docType() ?>
<html>
    <head>
        <?= Html::head() ?>
        <link type="text/css" href="../lib/css/ui-lightness/jquery-ui-1.7.2.custom.css" rel="Stylesheet" />
        <link type="text/css" href="css/user_view.css" rel="Stylesheet" />
        <script src="../lib/js/jquery-1.3.2.min.js">
        </script>
        <script src="../lib/js/jquery-ui-1.7.2.custom.min.js">
        </script>
        <script src="../lib/js/json2.js">
        </script>
        <script src="js/user.js">
        </script>
        <script src="js/action_bar.js">
        </script>
        <?
        echo '<script>';
        echo "NOTAS.prefs=";
        getUserPrefs($_SESSION['userId']);
        echo ";NOTAS.preloadedNotas=";
        get_notes($_SESSION['userId']);
        
        echo '</script>';
        ?>
        <title>
            <?= $_SESSION['userScreenName']."@Notas" ?>
        </title>
    </head>
    <body>
        <div id="topContainer">
            <div id="actionBar">
                <!--<span id="ajaxInProgress" style="float:right">ajax in progress...</span>--><span id="ajaxIcon" style="float:right">&nbsp</span>
            </div>
            <div id="notasContainer" style="float: left;">
            </div>
        </div>
    </body>
</html>
