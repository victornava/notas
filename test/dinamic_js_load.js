var __fileref = document.createElement('script').setAttribute("src", "http://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.min.js");
document.appendChild(__fileref);

/*

 if (!__jsRef) {

 function loadjscssfile(filename, filetype){

 if (filetype == "js") { //if filename is a external JavaScript file

 var fileref = document.createElement('script');

 fileref.setAttribute("type", "text/javascript");

 fileref.setAttribute("src", filename);

 }

 else

 if (filetype == "css") { //if filename is an external CSS file

 var fileref = document.createElement("link");

 fileref.setAttribute("rel", "stylesheet");

 fileref.setAttribute("type", "text/css");

 fileref.setAttribute("href", filename);

 }

 if (typeof fileref != "undefined")

 document.getElementsByTagName("head")[0].appendChild(fileref);

 }

 var __jsRef = "http://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.min.js";

 loadjscssfile(__jsRef, 'js');

 }

 */

/*

 *  __times = 1000;

 

 function waitForJquery(){

 if (typeof jQuery !== 'function' || !times > 0) {

 setTimeout(function(){

 waitForJquery();

 console.log('waitForJquery()');

 }, 10);

 __times--;

 }

 else {

 $('body').html('jquery loaded');

 delete __times;

 }

 }

 */

//use jQuery() instead of $();


