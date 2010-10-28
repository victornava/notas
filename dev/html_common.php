<?php

class Html {
    public static function docType() {
        return '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">';
    }

    public static function head() {
        $head = Array();
        $head[] = '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">';
        $head[] = '<link rel="STYLESHEET" type="text/css" href="css/main.css">';
        return implode("\r", $head);
    }

    public static function pageFooter() {
        $f = '<div id="footerDiv">home | info</div>';
        return $f;
    }
}
?>
