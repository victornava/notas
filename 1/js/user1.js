/**
 * TODO
 * • activeNota should be a nota not just the name. why?
 * • make all sizes relative to screen size
 * •
 */
var userPref = {
    "nota": {
        "color": "#0000ff",
        "font_color": "#0000cc",
        "font_size": 24,
        "font_type": "arial",
        "width": 300,
        "height": 300
    },
    "bgColor": "",
};

var changedNotas = [];
var notasList = [];
var notaFC = ["black", "blue", "red"];
var notaFS = ["14px", "22px", "34px"];
var notaColor = ["#FEF49C", "pink", "lightblue"];
var activeNota = "unknown";
var autoSaveInterval;
var ajaxNotInProgress = true;
var AUTO_SAVE_TIME = 3000000;

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
    },
    beforeSend: function(){
        $("#ajaxInProgress").show();
    },
    complete: function(){
        $("#ajaxInProgress").hide();
        resetAutoSave();
    }
});

$(document).ready(function(){
    setInitState();
    addListeneters();
    loadNotas();
});

function setInitState(){
    adjustNotasContainer();
}

function addListeneters(){
    $(window).resize(function(){
        adjustNotasContainer();
    });
    
    $("#newNoteBtn").click(function(){
        createNota();
    });
    
    $("#saveNotesBtn").click(function(){
        saveNotas();
        resetAutoSave();
    })
    
    $("#notaFTOpt").children("option").click(function(){
        var nota = notasList[activeNota];
        nota.setFontType($(this).val());
    });
    
    $("#notaFCSpan").children("*").click(function(){
        var nota = notasList[activeNota];
        nota.setFontColor(notaFC[$(this).attr("value")]);
    });
    
    $("#notaFSSpan").children("*").click(function(){
        var nota = notasList[activeNota];
        nota.setFontSize(notaFS[$(this).attr("value")]);
    });
    
    $("#notaColorSpan").children("*").click(function(){
        var nota = notasList[activeNota];
        nota.setColor(notaColor[$(this).attr("value")]);
    });
}

function resetAutoSave(){
    clearInterval(autoSaveInterval);
    autoSaveInterval = setInterval(function(){
        if (ajaxNotInProgress && changedNotas.length > 0) { //todo: check for ajax in progress
            saveNotas();
        }
    }, AUTO_SAVE_TIME);
}

function adjustNotasContainer(){
    var w = document.documentElement.clientWidth;
    var h = document.documentElement.clientHeight;
    $("#notasContainer").css("width", w - 4);
    $("#notasContainer").css("height", h - 26);
}

function createNota(){
    var topZ = getTopZ() + 1;
    var nota = drawNota({
        "pos_z": topZ,
    });
    return nota;
}

function drawNota(args){
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
        var push = true;
        for (i in changedNotas) {
            if (htmlID === changedNotas[i]) {
                push = false;
                break;
            }
        }
        if (push) {
            changedNotas.push(htmlID);
            console.log(changedNotas);
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
    for (nota in notasList) {
        z = notasList[nota].getZ();
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

function saveNotas(){
    console.log("changedNotas.length " + changedNotas.length);
    
    var nota, notaFields, notasToSave = [];
    
    for (i in changedNotas) {
        nota = notasList[changedNotas[i]];
        notasToSave.push(nota.getAllFields());
    }
    
    changedNotas = [];
    //console.log("notasToSave " + notasToSave);
    
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
        }
    });
}

function deleteNota(htmlID){
    var nota;
    var thisZ = notasList[htmlID].getZ();
    var id = notasList[htmlID].id;
    
    for (i in changedNotas) {
        if (changedNotas[i] === htmlID) {
            delete changedNotas[i];
            break;
        }
    }
    
    for (i in notasList) {
        nota = notasList[i];
        if (nota.getZ() > thisZ) {
            nota.setZ(nota.getZ() - 1);
        }
        console.log(htmlID + " " + nota.getZ() + "\n");
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
    
    delete notasList[htmlID]; //nota: this is confusing, reference by id instear of htmlid
    $("#" + htmlID).remove();
}

function Nota(args, container){ //Nota(args, container)
    var _properties = ["id", "content", "color", "font_color", "font_size", "font_type", "pos_x", "pos_y", "pos_z", "width", "height"];
    this.id = "temp" + (Math.floor(Math.random() * 1000));
    this.content = "";
    this.color = "pink";
    this.font_color = "black";
    this.font_size = "x-large";
    this.font_type = "arial";
    this.pos_x = 100;
    this.pos_y = 100;
    this.pos_z = 1000;
    this.width = 220;
    this.height = 200;
    this.htmlID = "";
    this.is_private = 1;
    this.state = "active";
	this.htmlID = "";
 
    if (args != undefined) { //todo: check for arg type 
        for (key in args) {
            for (i in _properties) { //nota: could be more efficient if delete i(key) after found on args
                if (_properties[i] === key) { //note: maybe call method instead
                    eval("this." + key + "= args[key]");
                }
            }
        }
    }
    
    this.htmlID = "nota_" + this.id;
    var notaHtml = '<div id=' + this.htmlID + ' class="ui-widget-content"><div class="notaCloseIcon">x</div><textarea class="notaTxa" wrap="soft"></textarea></div>';
    
    if (container) {
        $("#" + container).append(notaHtml);
    }
    else {
        $("body").append(notaHtml);
    }
    
    var notaDiv = $("#" + this.htmlID); //jquery object
    notaDiv.css("position", "absolute");
    notaDiv.css("padding", "10px");
    notaDiv.css("padding-top", "18px");
    notaDiv.css("cursor", "move");
    notaDiv.css("background", "none");
    notaDiv.css("border-color", "gray");
    notaDiv.css("background-color", "pink");
    
    notaDiv.draggable({
        "containment": "parent"
    });
    
    notaDiv.resizable({
        "handles": "se",
        "minHeight": 80,
        "minWidth": 100,
        "maxHeight": 1000,
        "maxWidth": 1000
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
    
    //notaDiv.children(".notaSettingsDiv").mousedown(function(){
    //    console.log(notaDiv.attr("id") + " settings");
    //});
    
    notaDiv.children(".notaCloseIcon").mousedown(function(){
        deleteNota(notaDiv.attr("id"));//todo: this should be outside the class
    });
    
    this.setY(this.pos_y);
    this.setX(this.pos_x);
    this.setZ(this.pos_z);
    this.setWidth(this.width);
    this.setHeight(this.height);
    this.setFontColor(this.font_color);
    this.setFontType(this.font_type);
    this.setFontSize(this.font_size);
    this.setColor(this.color);
    this.setContent(this.content);
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
    f.state = this.state;
    f.is_private = this.is_private;
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

function ajaxEnPolvo(ajaxData){
    ajaxData = "data=" + JSON.stringify(ajaxData);
    //console.log(">>> Ajax Call, data to Server: \n" + ajaxData);
    var ajaxResult = "";
    $.ajax({
        data: ajaxData,
        success: function(result){
            ajaxResult = result;
        },
        error: function(result){
            alert("Ups there was a comunication error.");
            ajaxResult = false;
        }
    });
    return ajaxResult;
}
