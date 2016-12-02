

define(function (require, exports, module) {
    "use strict";

    var CommandManager  = brackets.getModule("command/CommandManager"),
        ProjectManager  = brackets.getModule("project/ProjectManager"),
        Menus           = brackets.getModule("command/Menus"),
        Prefs           = brackets.getModule("preferences/PreferencesManager").getExtensionPrefs("show_hidden"),
        MY_COMMAND_ID   = "show_hidden.toggle";
        OS              = getOS();



    // Function to run when the menu item is clicked
    function handleHelloWorld() {
        window.alert(getOS());
    }

    function init(){
           // package-style naming to avoid collisions

        CommandManager.register("Show Hidden Files", MY_COMMAND_ID, toggle);
        CommandManager.get(MY_COMMAND_ID).setChecked(0);

        var menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);
        menu.addMenuItem(MY_COMMAND_ID);

        Prefs.definePreference("showing_hidden_files", "boolean", false);
        Prefs.save();

        var FileSystem  = brackets.getModule("filesystem/FileSystem");
        var Original_Filter = FileSystem._FileSystem.prototype._indexFilter;

        FileSystem._FileSystem.prototype._indexFilter = function (path, name) {
            // Call old filter
            var result = Original_Filter.apply(this, arguments);
            return result && (Prefs.get("showing_hidden_files") || !is_hidden_file(path,name));
        }

    }




    function toggle(){ 

        if (OS.equals("unknown")){
            window.alert("Operating System Unrecognized"); 
            return;
        }
        
       if (Prefs.get("showing_hidden_files")){
            Prefs.set("showing_hidden_files",false); 
            CommandManager.get(MY_COMMAND_ID).setChecked(0);
            
        }
        else {
            Prefs.set("showing_hidden_files",true); 
            CommandManager.get(MY_COMMAND_ID).setChecked(1);
        }

        Prefs.save();
        ProjectManager.refreshFileTree();
        return;
    }

    function is_hidden_file(path,name) 
    {
        switch (OS) {
            case 'Windows': 
            case 'Windows 8.1':
            case 'Windows 8':
            case 'Windows 7': 
            case 'Windows Vista':
            case 'Windows XP': 
            case 'Windows 2000': 
                var fswin = require("fswin"); 
                // should return JSON object ? We're looking for the IS_HIDDEN attribute
                fswin.getAttributesSync(path+name);
                return false; 

            case 'Linux':
            case 'Mac OS X': 
                return name.match(/^\.[\w]+/);
            default: 
                return false;
        }
     

    }

    function getOS(){
        var os = "unknown";
        var os_list = [
            {s:'Windows', r:/(Windows 10.0|Windows NT 10.0)/},
            {s:'Windows 8.1', r:/(Windows 8.1|Windows NT 6.3)/},
            {s:'Windows 8', r:/(Windows 8|Windows NT 6.2)/},
            {s:'Windows 7', r:/(Windows 7|Windows NT 6.1)/},
            {s:'Windows Vista', r:/Windows NT 6.0/},
            {s:'Windows XP', r:/(Windows NT 5.1|Windows XP)/},
            {s:'Windows 2000', r:/(Windows NT 5.0|Windows 2000)/},
            {s:'Linux', r:/(Linux|X11)/},
            {s:'Mac OS X', r:/Mac OS X/},
        ];

        for (var id in os_list) {
            var cs = os_list[id];
            if (cs.r.test(navigator.userAgent)) {
                os = cs.s;
                break;
            }
        }

    return os;
}
    

    init();

    // First, register a command - a UI-less object associating an id to a handler

    // Then create a menu item bound to the command
    // The label of the menu item is the name we gave the command (see above)


    // We could also add a key binding at the same time:
    //menu.addMenuItem(MY_COMMAND_ID, "Ctrl-Alt-W");
    // (Note: "Ctrl" is automatically mapped to "Cmd" on Mac)
});