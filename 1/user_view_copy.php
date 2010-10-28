<?php
require_once 'html_common.php';
require_once 'view.php';
require_once 'authenticate.php';
$view = new View();
?>
<?= Html::docType() ?>
<html>
    <head>
        <?= Html::head() ?>
        <link rel="stylesheet" type="text/css" href="../lib/dhx/dhtmlxWindows/codebase/dhtmlxwindows.css">
        <link rel="stylesheet" type="text/css" href="../lib/dhx/dhtmlxWindows/codebase/skins/dhtmlxwindows_dhx_blue.css">
        <script src="../lib/dhx/dhtmlxWindows/codebase/dhtmlxcommon.js">
        </script>
        <script src="../lib/dhx/dhtmlxWindows/codebase/dhtmlxwindows.js">
        </script>
        <script src="../lib/js/jquery-1.3.2.min.js">
        </script>
        <script src="../lib/js/json2.js">
        </script>
        <script src="js/user.js">
        </script>
        <title>
            <?= $view->name ?>
        </title>
    </head>
    <body>
        <?= htmlNavBar($view->name) ?>
        <div id=actions>
            <center>
                <button id="newNoteBtn">
                    New
                </button>
                <button id="saveNotes">
                    Save
                </button>
                <button id="deleteNote">
                    Delete
                </button>
            </center>
        </div>
    </body>
</html>
