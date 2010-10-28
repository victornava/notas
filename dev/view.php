<?php
class View
{
    public $name, $controllerName;

    public function __construct(){
        $path = Explode('/', $_SERVER["SCRIPT_NAME"]);
        $name = $path[count($path)-1];
		$this->name = $name;
        $this->controllerName = preg_replace('/_view/', '_controller', $name);
    }
}
?>