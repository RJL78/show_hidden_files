

define(function (require, exports, module) {
    "use strict";

    var CommandManager  = brackets.getModule("command/CommandManager"),
        ProjectManager  = brackets.getModule("project/ProjectManager"),
        Menus           = brackets.getModule("command/Menus"),
        Prefs           = brackets.getModule("preferences/PreferencesManager").getExtensionPrefs("show_hidden"),
        MY_COMMAND_ID   = "show_hidden.toggle",
        OS              = getOS();



    // Function to run when the menu item is clicked
    function handleHelloWorld() {
        window.alert(getOS());
    }

    function init(){

        if (OS === "Linux" || OS === "Mac OS X") {
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
                return result && (Prefs.get("showing_hidden_files") || !name.match(/^\.[\w]+/));
            }
        }
    }

    function toggle(){ 

        if (OS === "unknown"){
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

});