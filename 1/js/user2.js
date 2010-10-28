/**
 * TODO
 * • fix: lost of focus when drag on safari
 * • make all sizes relative to screen size
 * •
 */
var prefs = {
    "nota": {
        "content": "",
        "color": "#FEF49C",
        "font_color": "black",
        "font_size": "22px",
        "font_type": "arial",
        "pos_x": 100,
        "pos_y": 100,
        "width": 220,
        "height": 200
    },
    "bgColor": "gray",
};

var notaOptions = {
    "font_type": [{
        "val": "arial",
        "html": "Arial"
    }, {
        "val": "verdana",
        "html": "Verdana"
    }, {
        "val": "monaco",
        "html": "Monaco"
    }, {
        "val": "courier",
        "html": "Courier"
    }],
    
    "font_size": [{
        "val": "14px",
        "html": "14px"
    }, {
        "val": "22px",
        "html": "22px"
    }, {
        "val": "30px",
        "html": "30px"
    }, {
        "val": "38px",
        "html": "38px"
    }, {
        "val": "46px",
        "html": "46px"
    }],
    
    "color": [{
        "val": "#FEF49C",
        "html": "<span class='miniNota' style='background-color: #FEF49C'></span>"
    }, {
        "val": "pink",
        "html": "<span class='miniNota' style='background-color: pink'></span>"
    }, {
        "val": "lightblue",
        "html": "<span class='miniNota' style='background-color: lightblue'></span>"
    }, ]
}

var actionBarItems = {
    "Notas": [{
        "html": "About"
    }, {
        "html": "Preferences"
    }, {
        "html": "Logout"
    }],
    
    "file": [{
        "html": "New Nota",
        "action": function(){
            createNota();
        }
    }, {
        "html": "Save",
        "action": function(){
            saveNotas();
        }
    }]
};

var actionBarItems2 = [{
    "Notas": [{
        "html": "About"
    }, {
        "html": "Preferences"
    }, {
        "html": "Logout"
    }]
}, {
    "File": [{
        "html": "New Nota",
        "action": function(){
            createNota();
        }
    }, {
        "html": "Save",
        "action": function(){
            saveNotas();
        }
    }]
}];

var changedNotas = [];
var notasList = {};
var notaFS = ["14px", "22px", "34px"];
var notaColor = ["#FEF49C", "pink", "lightblue"];
var activeNota = "none";
var autoSaveInterval;
var saveInProgress = false;
//var AUTO_SAVE_TIME = 60000;
var AUTO_SAVE_TIME = 100000000;

$.ajaxSetup({ //reference > http://docs.jquery.com/Ajax/jQuery.ajax#options
    global: true,
    type: "POST",
    url: "user_controller.php", //url: "test.php",
    async: true,
    cache: false,
    timeout: 30000,
    dataType: "json",
    error: function(){
        alert("Ups there was a comunication error.");
        saveInProgress = false;
    },
    beforeSend: function(d){
        $("#ajaxInProgress").show();
    },
    complete: function(){
        $("#ajaxInProgress").hide();
        resetAutoSave();
    }
});

$(document).ready(function(){
    setInitState();
    initActionBar();
    addListeneters();
    loadNotas();
});

function setInitState(){
    resizeNotasContainer();
}

function ActionBar(container, id, items){
    $("#container").append("<div id='actionBar' style='z-index: 10000'></div>");
    if (items) {
    
    }
}

ActionBar.prototype.addItem = function(){

}

function initActionBar(){
    $(".actionBarItemList").hide();
    
    function fillActionBarItemList(item, list, action){
        var i;
        for (i in list) {
            var subItem = list[i];
            var li = $("#" + item).append("<li></li>").children("li:last");
            li.html(subItem.html);
            
            if (subItem.val) {
                li.attr("val", subItem.val);
            }
            
            if (subItem.action) {
                action = subItem.action;
            }
            
            if (action) {
                li.click(action);
            }
        }
    }
    
    fillActionBarItemList("notasABI", actionBarItems.Notas);
    
    fillActionBarItemList("fileABI", actionBarItems.file);
    
    fillActionBarItemList("fontTypeABI", notaOptions.font_type, function(){
        var nota = notasList[activeNota];
        nota.setFontType($(this).attr("val"));
    });
    
    fillActionBarItemList("fontSizeABI", notaOptions.font_size, function(){
        var nota = notasList[activeNota];
        nota.setFontSize($(this).attr("val"));
    });
    
    fillActionBarItemList("colorABI", notaOptions.color, function(){
        var nota = notasList[activeNota];
        nota.setColor($(this).attr("val"));
    });
    
    $(".actionBarItem").each(function(){
        var item = $(this);
        var left = item.position().left - 1;
        //var top = item.position().top + item.height();
        
        item.children("ul").css({
            "left": left,
            "top": 4, //note: this shouldn't be a fixed number;
        });
        
        item.children("ul").children("li").click(function(){
            $(this).parent().hide();
        });
        
        item.mouseover(function(){
            $(this).children("ul").show();
        }).mouseout(function(){
            $(this).children("ul").hide();
        });
        
    });
    
}

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
            changedNotas = [];
        }
    }, AUTO_SAVE_TIME);
}

function resizeNotasContainer(){
    var container = $("#notasContainer");
    var h = $(document).height() - container.position().top - 1;
    var w = $(document).width() - 1;
    
    container.css({
        "width": w,
        "height": h
    });
}

function createNota(){
    prefs.nota.pos_z = getTopZ() + 1;
    var nota = drawNota(prefs.nota);
    delete prefs.nota.pos_z;
    return nota;
}

function drawNota(args){
    var i;
    var nota = new Nota(args, 'notasContainer');
    notaDiv = $("#" + nota.htmlID);
    
    notaDiv.children("textarea").focus(function(){
        var htmlId = $(this).parent().attr("id");
        if (activeNota !== htmlId) {
            $("#" + activeNota).children("textarea").trigger("blur");
        }
        activeNota = htmlId;
        bringNotaToFront(nota);
    });
    
    notaDiv.change(function(){
        var htmlID = $(this).attr("id");
        var alreadyIn = false;
        for (i in changedNotas) {
            if (htmlID === changedNotas[i]) {
                alreadyIn = true;
                break;
            }
        }
        if (!alreadyIn) {
            changedNotas.push(htmlID);
            //console.log(changedNotas);
        }
        console.log($(this).attr("id") + " changed");
    });
    
    notasList[nota.htmlID] = nota;
    notaDiv.trigger("mousedown");
    return nota;
}

function getTopZ(){
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
    var topZ = getTopZ();
    var nota;
    
    if (topNota.getZ() !== topZ) {
        for (n in notasList) {
            nota = notasList[n];
            nota.setZ(nota.getZ() - 1);
        }
        topNota.setZ(topZ);
    }
    //console.log("topZ "+topZ);
}

function loadNotas(){
    var i;
    var ajaxData = {
        'action': 'get_notes'
    };
    
    ajaxData = "data=" + JSON.stringify(ajaxData);
    console.log(">>> Ajax Call, data to Server: \n" + ajaxData);
    $.ajax({
        data: ajaxData,
        success: function(resp){
            var notas;
            if (resp.notes && resp.notes.length > 0) {
                notas = resp.notes;
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

function saveNotas(notas){
    var i, k, nota, notaFields;
    var notasToSave = [];
    
    saveInProgress = true;
    console.log(changedNotas);
    
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
    console.log("notasToSave " + notasToSave);
    
    var ajaxData = {
        'action': 'save_notes',
        'notas': notasToSave
    };
    
    ajaxData = "data=" + JSON.stringify(ajaxData);
    console.log(">>> Ajax Call, data to Server: \n" + ajaxData);
    
    $.ajax({
        data: ajaxData,
        success: function(resp){
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
            saveInProgress = false;
        }
    });
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
    console.log(">>> Ajax Call, data to Server: \n" + ajaxData);
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

function Nota(args, container){ //Nota(args, container)
    var k;
    var tempId = "temp" + (Math.floor(Math.random() * 10000));
    var field = {
        "id": tempId,
        "content": "",
        "color": "yellow",
        "font_color": "black",
        "font_size": "x-large",
        "font_type": "arial",
        "pos_x": 100,
        "pos_y": 100,
        "pos_z": 100,
        "width": 220,
        "height": 200,
        "is_private": 1, //todo: get rid of this
        "state": "active", //todo: get rid of this
    }
    
    if (args != undefined) { //todo: check for arg type 
        for (k in args) {
            for (f in field) { //nota: could be more efficient if delete i(k) after found on args
                if (f === k) { //note: maybe call method instead
                    field[f] = args[k];
                }
            }
        }
    }
    
    this.id = field["id"];
    this.htmlID = "nota_" + this.id;
    
    var notaHtml = '<div id=' + this.htmlID + ' class="ui-widget-content"><div class="notaCloseIcon">x</div><textarea class="notaTxa" wrap="soft"></textarea></div>';
    
    if (container) {
        $("#" + container).append(notaHtml);
    }
    else {
        $("body").append(notaHtml);
    }
    
    var notaDiv = $("#" + this.htmlID); //jquery object
    notaDiv.addClass("notaDiv");
    
    notaDiv.draggable({
        "containment": "parent"
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
        $(this).children("textarea").focus();
    });
    
    notaDiv.children("textarea").focus(function(){
        $(this).parent().children(".ui-icon-gripsmall-diagonal-se").show();
        $(this).parent().children(".notaCloseIcon").show();
    }).blur(function(){
        $(this).parent().children(".ui-icon-gripsmall-diagonal-se").hide();
        $(this).parent().children(".notaCloseIcon").hide();
    }).keypress(function(){
        $(this).parent().trigger("change");
    });
    
    notaDiv.children(".notaCloseIcon").mousedown(function(){
        deleteNota(notaDiv.attr("id"));//todo: this should be outside the class
    });
    
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
    $("#" + this.htmlID).css("left", x.toString() + "px");
    $("#" + this.htmlID).trigger("change");
}

Nota.prototype.setY = function(y){
    $("#" + this.htmlID).css("top", y.toString() + "px");
    $("#" + this.htmlID).trigger("change");
}

Nota.prototype.setZ = function(z){
    $("#" + this.htmlID).css("z-index", z);
    $("#" + this.htmlID).trigger("change");
}

Nota.prototype.setWidth = function(width){
    $("#" + this.htmlID).css("width", width.toString() + "px");
    $("#" + this.htmlID).trigger("change");
}

Nota.prototype.setHeight = function(height){
    $("#" + this.htmlID).css("height", height.toString() + "px");
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
    $("#" + this.htmlID).children("textarea").css("font-size", size);
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

Nota.prototype.getZ = function(){
    return Number($("#" + this.htmlID).css("z-index"));
}

Nota.prototype.getAllFields = function(){
    var f = {};
    var div = $("#" + this.htmlID);
    f.id = this.id;
    f.pos_x = div.css("left");
    f.pos_y = div.css("top");
    f.pos_z = div.css("z-index");
    f.width = div.css("width");
    f.height = div.css("height");
    f.color = div.css("background-color");
    f.font_type = div.children("textarea").css("font-family");
    f.font_color = div.children("textarea").css("color");
    f.font_size = div.children("textarea").css("font-size");
    f.content = div.children("textarea").val();
    f.state = "active"; //todo: eliminate this
    f.is_private = "1" //todo: eliminate this
    return f;
}

//////////////////////////////////////////////////////////
///////Test Zone//////////////////////////////////////////
//////////////////////////////////////////////////////////

var notaArgs = {
    "id": "id",
    "content": "Jabol The enemy is weakened",
    "color": "marron",
    "font_color": "negro",
    "font_size": "normal",
    "font_type": "arial",
    "pos_x": 222,
    "pos_y": 222,
    "pos_z": 1111,
    "width": 333,
    "height": 333
};

var testNotas = [{
    "id": "1",
    "content": "hello world!",
    "pos_x": 100,
    "pos_y": 60,
    "pos_z": 101,
    "color": "pink"
}, {
    "id": "2",
    "content": "holy guacamole",
    "pos_x": 400,
    "pos_y": 80,
    "pos_z": 102,
    "color": "lightblue"
}, {
    "id": "3",
    "content": "yellow",
    "pos_x": 700,
    "pos_y": 40,
    "pos_z": 103,
    "color": "yellow"
}];
