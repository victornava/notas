/** TODO
 * • display checkmark of selected subitem
 */
function ActionBar(id, container, items){
    this.items = {};
    this.actionBarClass = "actionBar";
    
    id ? this.id = id : this.id = this.actionBarClass + Math.floor(Math.random() * 1000);
    
    var div = $("#" + id);
    if (div.length > 0) { //if id exist...
        div.addClass(this.actionBarClass);
    }
    else {
        var html = "<div id=" + this.id + " class=" + this.actionBarClass + "></div>";
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
    var top = actionBar.position().top + actionBar.height();
    
    div.children("ul").css({
        "left": left,
        "top": top, //"top": 20, //note: this shouldn't be a fixed number;
        "display": "none"
    });
    
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
