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
        <title><?=$view->name?></title>
    </head>
    <body>
        <?= page_footer() ?>
    </body>
</html>
