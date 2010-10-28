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

function page_header() {
    return '<center><div align="top">page Header</div></center><hr>';
}

function navBar2($controllerName) {
    $userName = $_SESSION['userScreenName'];
    $home = '<a href="user_view.php">Home</a>';
    $settings = '<a href="settings_view.php">Settings</a>';
    $help = '<a href="help_view.php">Help</a>';
    $logOut = '<a href='."$controllerName?action=logoutUser".'>Logout</a>';
    $links = array ($home, $settings, $help, $logOut);
    $links = implode(' | ', $links);

    $bar = "<div id='topContainer'>
            	<div id='notasLogo'><b>$userName</b>@NotasLogo</div>
            	<div id='navBar'>$links</div>
			</div>";
    return $bar;
}

function htmlNavBar($viewName) {
    $userName = $_SESSION['userScreenName'];
    $home = '<a href="user_view.php">Home</a>';
    $settings = '<a href="settings_view.php">Settings</a>';
    $help = '<a href="help_view.php">Help</a>';
    $logOut = '<a href="logout_controller.php">Logout</a>';

    $links = array ($home, $settings, $help, $logOut);
    $links = implode(' | ', $links);

    $navBar = "<div id='topContainer'>
            	<div id='notasLogo'>Notas &nbsp&nbsp Font &nbsp&nbsp Color &nbsp&nbsp Save &nbsp&nbsp New </div>
            	<div id='navBar'>$links</div>
			  </div>";
    return $navBar;
}

function htmlNavBarCopy($viewName) {
    $userName = $_SESSION['userScreenName'];
    $home = '<a href="user_view.php">Home</a>';
    $settings = '<a href="settings_view.php">Settings</a>';
    $help = '<a href="help_view.php">Help</a>';
    $logOut = '<a href="logout_controller.php">Logout</a>';

    $links = array ($home, $settings, $help, $logOut);
    $links = implode(' | ', $links);

    $navBar = "<div id='topContainer'>
            	<div id='notasLogo'><b>$userName</b>@NotasLogo</div>
            	<div id='navBar'>$links</div>
			  </div>";
    return $navBar;
}

function page_footer() {
    $footer = '<div id="footerDiv">home | info</div>';
    return $footer;
}
?>
