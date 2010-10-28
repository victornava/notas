<?php
require 'core.php';
$saved = array(1,2,3);
$deleted = array(6,5,4);
$updated = array(8, 9);

$r = new AjaxResponse3(array('error'=>'unerror', 'saved'=>$saved, 'deleted'=>$deleted));
$r = new AjaxResponse3();
$r->addField('saved', $saved);
$r->addError("un error");
$r->addError("otro error");
//$r->addField('updated', $updated);

echo $r->addField('saved', $saved);
//echo $r->getJson();
?>
