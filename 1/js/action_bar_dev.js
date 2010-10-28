/** TODO
 * • display checkmark of selected subitem
 */
function ActionBar(id, container, items){
    this.items = {};
    
    id ? this.id = id : this.id = 'actionBar' + Math.floor(Math.random() * 1000);
    
    var div = $("#" + id);
    if (div.length > 0) { //if id exist...
        div.addClass("actionBar");
    }
    else {
        var html = "<div id=" + this.id + " class='actionBar'></div>";
        if (container) {
            this.container = container;
            $("#" + this.container).prepend(html);
        }
        else {
            this.container = 'body';
            $("body").prepend(html);
        }
    }
    
    if (items) {
        this.build(items);
    }
}

ActionBar.prototype.build = function(items){
    var i, j, item, subItem, action;
    for (i in items) {
        item = items[i];
        this.addItem(item.name, item.html);
        if (item.subItem) {
            for (j in item.subItem) {
                subItem = item.subItem[j];
                if (item.action) {
                    action = item.action;
                }
                if (subItem.action) {
                    action = subItem.action;
                }
                this.addSubItem(item.name, subItem.name, subItem.html, action, subItem.arg);
            }
        }
    }
    return this;
}

ActionBar.prototype.addItem = function(name, html){
    var actionBar, div, ul;
    actionBar = $("#" + this.id);
    div = actionBar.append("<div></div>").children("div:last");
    html ? div.html(html) : div.text(name);
    div.append("<ul></ul>");
    div.attr("id", "_" + name);
    
    var left = div.position().left - 1;
    var top =  actionBar.position().top + actionBar.height();
	
    div.children("ul").css({
        "left": left,
        "top": top, //"top": 20, //note: this shouldn't be a fixed number;
        "display": "none"
    });
    
    
    /*
     div.children("ul").css({
     "left": left,
     "top": 6, //note: this shouldn't be a fixed number;
     "display": "none"
     });
     */
    div.mouseover(function(){
        $(this).children("ul").show();
    }).mouseout(function(){
        $(this).children("ul").hide();
    });
    
    this.items[name] = {
        "name": name,
        "subItem": {}
    };
    return this.items[name];
}

ActionBar.prototype.addSubItem = function(pItem, name, html, action, arg){ //todo: pass an json as arg
    //arg = {"pItem":"", "name":"", "action":"", "arg":""}
    //var item = this.items[pItem];
    this.items[pItem].subItem[name] = {
        "name": name,
        "html": html,
        "action": action,
        "arg": arg,
    }
    
    var item = $('#_' + pItem);
    var ul = item.children("ul");
    var li = ul.append("<li></li>").children("li:last");
    
    html ? li.html(html) : li.text(name);
    
    if (action) {
        li.click(function(){
            action(arg);
        });
    }
    li.click(function(){
        $(this).parent().hide();
    });
    return li;
}

//testZone

//$(document).ready(function(){
//aBar = constructActionBar("actionBar", "topContainer", actionBarItems);
//aBar = new ActionBar("actionBar", "topContainer", actionBarItems);
//aBar = new ActionBar();
//});
/*
 var actionBarItems = [{
 "name": "Notas",
 "html": "<b>Notas<b>",
 "subItem": [{
 "name": "About"
 }, {
 "name": "Preferences"
 }, {
 "name": "Logout",
 "action": userLogout
 }]
 }, {
 "name": "File",
 "subItem": [{
 "name": "New Nota",
 "action": createNota
 }, {
 "name": "Save",
 "action": saveNotas
 }]
 }, {
 "name": "Font-Type",
 "action": function(arg){
 notasList[activeNota].setFontType(arg);
 },
 "subItem": [{
 "name": "Arial",
 "arg": "arial"
 }, {
 "name": "Verdana",
 "arg": "verdana",
 }, {
 "name": "Monaco",
 "arg": "monaco",
 }, {
 "name": "Courier",
 "arg": "courier"
 }]
 }, {
 "name": "Font-Size",
 "action": function(arg){
 notasList[activeNota].setFontSize(arg);
 },
 "subItem": [{
 "arg": "12px",
 "name": "12px"
 }, {
 "arg": "16px",
 "name": "16px"
 }, {
 "arg": "24px",
 "name": "24px"
 }, {
 "arg": "34px",
 "name": "36px"
 }, {
 "arg": "46px",
 "name": "46px"
 }]
 }, {
 "name": "Color",
 "action": function(arg){
 notasList[activeNota].setColor(arg);
 },
 "subItem": [{
 "name": "yellow",
 "html": "<span class='miniNota' style='background-color: #FEF49C'></span>",
 "arg": "#FEF49C"
 }, {
 "name": "pink",
 "html": "<span class='miniNota' style='background-color: pink'></span>",
 "arg": "pink"
 }, {
 "name": "blue",
 "html": "<span class='miniNota' style='background-color: lightblue'></span>",
 "arg": "lightblue"
 }, ]
 }];
 */
function customAction(a){
    alert(a)
}

function testActionBar(){
    var actionBar = new ActionBar("topContainer");
    var notasItem = actionBar.addItem("Notas");
    actionBar.addSubItem("Notas", "About", function(){
        alert("notas");
    });
    actionBar.addItem("File");
}


