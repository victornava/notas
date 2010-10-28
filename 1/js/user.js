/**
 * TODO
 * •
 * • fix: frozen cursor on safari/chrome when click on notaDiv;
 * • fix: actionBar bug when win-resize
 * • fix: when a note is deleted active note should be "none";
 * • set welcome notas to no new users
 * • wait for all ajax calls to be done before logout;
 * • when logout display a message if couldn't save;
 * • make all sizes relative to screen size
 * • improve event handling: http://www.artzstudio.com/2009/04/jquery-performance-rules/#leverage-event-delegation
 */
var changedNotas = [];
var notasList = {};
var activeNota = "none";
var autoSaveInterval;
var saveInProgress = false;
var AUTO_SAVE_TIME = 60000;
var actionBar = {};
var NOTAS = {};

NOTAS.containerId = "notasContainer";

$.ajaxSetup({ //reference > http://docs.jquery.com/Ajax/jQuery.ajax#options
    global: true,
    type: "POST",
    url: "user_controller.php", //url: "test.php",
    async: true,
    cache: false,
    timeout: 30000,
    dataType: "json",
    error: function(){
        alert("Ups! there was a comunication error.");
    },
    beforeSend: function(d){
        $("#ajaxIcon").show();
    },
    complete: function(){
        $("#ajaxIcon").hide();
    }
});

$(document).ready(function(){
    actionBar = new ActionBar("actionBar", false, actionBarItems);
    //$("#actionBar").append($("#ajaxIcon"));
    $("#" + NOTAS.containerId).width(10).height(10); //necesary to calculate container top (shouldn't be necesary)
    resizeNotasContainer();
    addListeneters();
    drawPreloaded();
    resetAutoSave();
});

function addListeneters(){
    $(window).resize(function(){
        resizeNotasContainer();
    });
}

function resetAutoSave(){
    clearInterval(autoSaveInterval);
    autoSaveInterval = setInterval(function(){
        if (!saveInProgress && changedNotas.length > 0) { //todo: check for ajax in progress
            saveNotas(changedNotas);
        }
    }, AUTO_SAVE_TIME);
}

function resizeNotasContainer(){
    container = $("#" + NOTAS.containerId);
    //container.html("&nbsp"); //important! if div is empty position().top returns 
    var h = $(window).height() - container.position().top - 1;
    var w = $(window).width() - 1;
    
    //console.log("container.position().top:" + container.position().top);
    //console.log("resize container: " + w + ", " + h);
    
    container.css({
        "width": w,
        "height": h
    });
    //console.log("container.position().top:" + container.position().top);
}

function drawPreloaded(){
    var notas = NOTAS.preloadedNotas.notas;
    for (i in notas) {
        drawNota(notas[i]);
    }
}

function createNota(){
    var nota = drawNota(NOTAS.prefs);
    nota.setZ(getTopZ() + 1);
    return nota;
}

function drawNota(args){
    var nota = new Nota(args, 'notasContainer');
    notaDiv = $("#" + nota.htmlID);
    
    notaDiv.focus(function(){ //triggered on mousedown and textarea focus
        //var htmlId = $(this).attr("id");
        if (activeNota !== nota.htmlID) {
            if (notasList[activeNota]) {
                notasList[activeNota].hideIcons();
            }
            activeNota = nota.htmlID;
            bringNotaToFront(nota);
            //console.log(nota.htmlID + " focus");
        }
    });
    
    notaDiv.change(function(){
        var i;
        var alreadyIn = false;
        for (i in changedNotas) {
            if (nota.htmlID === changedNotas[i]) {
                alreadyIn = true;
                break;
            }
        }
        if (!alreadyIn) {
            changedNotas.push(nota.htmlID);
            //console.log(changedNotas);
        }
        //console.log($(this).attr("id") + " changed");
    });
    
    notaDiv.bind("delete", function(){
        deleteNota(nota.htmlID);
        //console.log("delete " + nota.htmlID);
    });
    
    notasList[nota.htmlID] = nota;
    notaDiv.children("textarea").focus();
    return nota;
}

function getTopZ(){
    var k;
    var z = 0
    var topZ = 100;
    for (k in notasList) {
        z = notasList[k].getZ();
        if (z > topZ) {
            topZ = z;
        }
    }
    return topZ;
}

function swapNotaId(nota, newId){
    var oldHtmlID = nota.htmlID;
    nota.setId(newId);
    notasList[nota.htmlID] = nota; //nota: this is confusing, reference by id insteat of htmlid
    delete notasList[oldHtmlID];
}

function bringNotaToFront(topNota){
    var nota;
    var topZ = getTopZ();
    
    if (topNota.getZ() !== topZ) {
        for (n in notasList) {
            nota = notasList[n];
            nota.setZ(nota.getZ() - 1);
        }
        topNota.setZ(topZ);
    }
    topNota.showIcons();
    //console.log("topZ " + topZ);
}

function loadNotas(){ //load notas via ajax
    var i;
    var ajaxData = {
        'action': 'get_notes'
    };
    
    ajaxData = "data=" + JSON.stringify(ajaxData);
    //console.log(">>> Ajax Call, data to Server: \n" + ajaxData);
    $.ajax({
        data: ajaxData,
        success: function(resp){
            var notas = resp.notas;
            if (notas && notas.length > 0) {
                for (i in notas) {
                    drawNota(notas[i]);
                }
            }
            if (resp.errors) {
                alert("There was an error getting your notas, try refreshing the page");
            }
        }
    });
}

function saveNotas(notas, async){
    var i, k, nota, notaFields;
    var notasToSave = [];
    
    saveInProgress = true;
    //console.log(changedNotas);
    
    if (notas) { //saves only notas in notas arg
        for (i in notas) {
            nota = notasList[notas[i]];
            notasToSave.push(nota.getAllFields());
        }
    }
    else { //saves all notas
        for (k in notasList) {
            nota = notasList[k];
            notasToSave.push(nota.getAllFields());
        }
    }
    
    //console.log('notasToSave.length:' + notasToSave.length);
    if (notasToSave.length > 0) {
    
        //console.log("saveNotas(): async = " + ((async === undefined) ? true : async));
        
        var ajaxData = {
            'action': 'save_notes',
            'notas': notasToSave
        };
        
        ajaxData = "data=" + JSON.stringify(ajaxData);
        //console.log(">>> Ajax Call, data to Server: \n" + ajaxData);
        
        $.ajax({
            "data": ajaxData,
            "async": (async === undefined) ? true : async,
            "success": function(resp){
                if (resp.created) {
                    var nota, newId;
                    var created = resp.created;
                    
                    for (tempId in created) {
                        nota = notasList["nota_" + tempId]; //nota: this is confusing, reference by id instear of htmlid
                        newId = eval("created." + tempId); //todo: avoid eval
                        swapNotaId(nota, newId);
                    }
                }
                if (resp.errors && resp.errors.length > 0) {
                    alert("Something went wrong, save all again just to be sure.");
                }
            },
            "complete": function(){
                //console.log(changedNotas);
                saveInProgress = false;
                changedNotas = [];
                $("#ajaxIcon").hide();
            }
        });
    }
    resetAutoSave();
}

function deleteNota(htmlID){
    var nota, i, k;
    var thisZ = notasList[htmlID].getZ();
    var id = notasList[htmlID].id;
    
    for (i in changedNotas) {
        if (changedNotas[i] === htmlID) {
            changedNotas.splice(i, 1); //deletes item i from the array;
            break;
        }
    }
    
    for (k in notasList) {
        nota = notasList[k];
        if (nota.getZ() > thisZ) {
            nota.setZ(nota.getZ() - 1);
        }
        //console.log(htmlID + " " + nota.getZ() + "\n");
    }
    
    var ajaxData = {
        'action': 'delete_notes',
        'ids': [id]
    };
    
    ajaxData = "data=" + JSON.stringify(ajaxData);
    //console.log(">>> Ajax Call, data to Server: \n" + ajaxData);
    $.ajax({
        data: ajaxData,
        success: function(resp){
            if (resp.erros && resp.erros.length > 0) {
                alert("There was an error deleting your notas, try refreshing the page");
            }
        }
    });
    
    delete notasList[htmlID]; //nota: this is confusing, reference by id instead of htmlid
    $("#" + htmlID).remove();
}

function userLogout(){
    saveNotas(changedNotas, false);
    window.location = "logout_controller.php";
}

function setDefaultNota(nota){
    if (nota instanceof Nota) {
        var f = nota.getAllFields();
        var p = NOTAS.prefs;
        p.color = f.color;
        p.font_size = f.font_size;
        p.font_type = f.font_type;
        p.width = f.width;
        p.height = f.height;
        setUserPrefs(p);
        return p;
    }
    else {
        return false;
    }
}

function setUserPrefs(prefs){
    var ajaxData = {
        'action': 'setUserPrefs',
        'arg': prefs
    };
    
    ajaxData = "data=" + JSON.stringify(ajaxData);
    //console.log(">>> Ajax Call, data to Server: \n" + ajaxData);
    
    $.ajax({
        "data": ajaxData,
        "success": function(reply){
            if (reply.errors) {
                alert("An error occured while saving your preferences, please try again");
            }
        }
    });
}

function Nota(args, container){ //Nota(args, container)
    var k, f;
    var nota = this;
    var tempId = "temp" + (Math.floor(Math.random() * 10000));
    var field = {
        "id": tempId,
        "content": "",
        "color": "yellow",
        "font_color": "black",
        "font_size": "x-large",
        "font_type": "arial",
        "pos_x": 20,
        "pos_y": 40,
        "pos_z": 100,
        "width": 220,
        "height": 200,
        "is_private": 1, //todo: get rid of this
        "state": "active", //todo: get rid of this
    }
    
    if (args !== undefined) { //todo: check for arg type 
        for (k in args) {
            for (f in field) { //note: could be more efficient if delete field[f] after k is found
                if (f === k) {
                    field[f] = args[k];
                    break;
                }
            }
        }
    }
    
    //console.log('field["width"]: ' + field["width"] + ', field["height"]: ' + field["height"]);
    
    this.id = field["id"];
    this.htmlID = "nota_" + this.id;
    
    //TODO this is ugly simplify
    var notaHtml = '<div id=' + this.htmlID +' class="ui-widget-content"><div class="notaCloseIcon">x</div><textarea class="notaTxa" wrap="soft"></textarea></div>';
    
    (container) ? $("#" + container).append(notaHtml) : $("body").append(notaHtml);
    
    var notaDiv = $("#" + this.htmlID); //jquery object
    notaDiv.addClass("notaDiv");
	    
    notaDiv.draggable({
        "containment": "parent",
        "cursor": "default"
    });
    
    notaDiv.resizable({
        "handles": "se",
        "minHeight": 80,
        "minWidth": 100,
        //"maxHeight": 1000,
        //"maxWidth": 1000
    });
    
    notaDiv.bind('dragstop', function(event, ui){
        $(this).trigger("change");
    });
    
    notaDiv.bind('resizestop', function(event, ui){
        $(this).trigger("change");
    });
    
    notaDiv.mousedown(function(){
        $(this).trigger("focus");
    });
    
	//TODO: fix frozen cursor on safari/chrome when click on notaDiv
    //notaDiv.mouseup(function(){ 
    //    $(this).children("textarea").focus();
    //});
    
    notaDiv.children("textarea").focus(function(){
        $(this).parent().trigger("focus");
    }).keydown(function(){
        $(this).parent().trigger("change");
    });
    
    notaDiv.children(".notaCloseIcon").mousedown(function(){
        $(this).parent().trigger("delete");
    });
    
    //console.log('field["width"]: ' + field["width"] + ', field["height"]: ' + field["height"]);
    
    this.setY(field["pos_y"]);
    this.setX(field["pos_x"]);
    this.setZ(field["pos_z"]);
    this.setWidth(field["width"]);
    this.setHeight(field["height"]);
    this.setFontColor(field["font_color"]);
    this.setFontType(field["font_type"]);
    this.setFontSize(field["font_size"]);
    this.setColor(field["color"]);
    this.setContent(field["content"]);
}

Nota.prototype.setId = function(id){
    var htmlID = "nota_" + id;
    $("#" + this.htmlID).attr("id", htmlID);
    this.id = id;
    this.htmlID = htmlID;
}

Nota.prototype.setX = function(x){
    $("#" + this.htmlID).css("left", x + "px");
    $("#" + this.htmlID).trigger("change");
}

Nota.prototype.setY = function(y){
    $("#" + this.htmlID).css("top", y + "px");
    $("#" + this.htmlID).trigger("change");
}

Nota.prototype.setZ = function(z){
    $("#" + this.htmlID).css("z-index", z);
    $("#" + this.htmlID).trigger("change");
}

Nota.prototype.setWidth = function(width){
    $("#" + this.htmlID).css("width", width + "px");
    $("#" + this.htmlID).trigger("change");
}

Nota.prototype.setHeight = function(height){
    $("#" + this.htmlID).css("height", height + "px");
    $("#" + this.htmlID).trigger("change");
}

Nota.prototype.setFontType = function(fontType){
    $("#" + this.htmlID).children("textarea").css("font-family", fontType);
    $("#" + this.htmlID).trigger("change");
}

Nota.prototype.setFontColor = function(color){
    $("#" + this.htmlID).children("textarea").css("color", color);
    $("#" + this.htmlID).trigger("change");
}

Nota.prototype.setFontSize = function(size){
    $("#" + this.htmlID).children("textarea").css("font-size", size + "px");
    $("#" + this.htmlID).trigger("change");
}

Nota.prototype.setColor = function(color){
    $("#" + this.htmlID).css("background-color", color);
    $("#" + this.htmlID).trigger("change");
}

Nota.prototype.setContent = function(content){
    $("#" + this.htmlID).children("textarea").val(content);
    $("#" + this.htmlID).trigger("change");
}

Nota.prototype.showIcons = function(){
    $("#" + this.htmlID).children(".ui-icon-gripsmall-diagonal-se").show();
    $("#" + this.htmlID).children(".notaCloseIcon").show();
}

Nota.prototype.hideIcons = function(){
    $("#" + this.htmlID).children(".ui-icon-gripsmall-diagonal-se").hide();
    $("#" + this.htmlID).children(".notaCloseIcon").hide();
}

Nota.prototype.getZ = function(){
    return Number($("#" + this.htmlID).css("z-index"));
}

Nota.prototype.getAllFields = function(){
    var f = {};
    var div = $("#" + this.htmlID);
    f.id = this.id;
    f.pos_x = parseInt(div.css("left"), 10);
    f.pos_y = parseInt(div.css("top"), 10);
    f.width = parseInt(div.css("width"), 10);
    f.height = parseInt(div.css("height"), 10);
    f.pos_z = div.css("z-index");
    f.color = div.css("background-color");
    f.font_type = div.children("textarea").css("font-family");
    f.font_color = div.children("textarea").css("color");
    f.font_size = parseInt(div.children("textarea").css("font-size"), 10);
    f.content = div.children("textarea").val();
    f.state = "active"; //todo: eliminate this
    f.is_private = "1" //todo: eliminate this
    return f;
}

////////////////test zone
/*NOTAS.prefs = {

 "color": "#FEF49C",

 "font_color": "black",

 "font_size": "22px",

 "font_type": "arial",

 "width": 220,

 "height": 200,

 "bgColor": "gray",

 "bgImg": ""

 };

 */



