<?php

ob_start();

echo "Hello ";

$out1 = ob_get_contents();

ob_end_clean();

echo "world ";

$out2 = ob_get_contents();

ob_end_clean();

echo $out1, $out2;
?>


