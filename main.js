

define(function (require, exports, module) {
    "use strict";

    var CommandManager  = brackets.getModule("command/CommandManager"),
        ProjectManager  = brackets.getModule("project/ProjectManager"),
        Menus           = brackets.getModule("command/Menus"),
        Prefs           = brackets.getModule("preferences/PreferencesManager").getExtensionPrefs("show_hidden"),
        MY_COMMAND_ID   = "show_hidden.toggle";



    // Function to run when the menu item is clicked
    function handleHelloWorld() {
        window.alert(getOS());
    }

    function init(){
           // package-style naming to avoid collisions

        CommandManager.register("Show Hidden Files", MY_COMMAND_ID, toggle);
        CommandManager.get(MY_COMMAND_ID).setChecked(1);

        var menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);
        menu.addMenuItem(MY_COMMAND_ID);

        Prefs.definePreference("showing_hidden_files", "boolean", true);
        Prefs.save();

        var FileSystem  = brackets.getModule("filesystem/FileSystem");
        var Original_Filter = FileSystem._FileSystem.prototype._indexFilter;

        FileSystem._FileSystem.prototype._indexFilter = function (path, name) {
            // Call old filter
            var result = Original_Filter.apply(this, arguments);

            if (!result) {
                return false;
            }
            else if (!Prefs.get("showing_hidden_files") && is_hidden_file(path,name) ){
                return false; 
            }
            else {
                return true;
            }   
        }

    }




    function toggle(){ 
        
       if (Prefs.get("showing_hidden_files")){
            Prefs.set("showing_hidden_files",false); 
            CommandManager.get(MY_COMMAND_ID).setChecked(0);
            window.alert("SET TO FALSE")
        }
        else {
            Prefs.set("showing_hidden_files",true); 
            CommandManager.get(MY_COMMAND_ID).setChecked(1);
        }
        Prefs.save();
        ProjectManager.refreshFileTree();
    }

    function is_hidden_file(path,name) 
    {
        return name.match(/^\.[\w]+/);

    }

    function getOS(){
        var os = "unknown";
        var os_list = [
            {s:'Windows 10', r:/(Windows 10.0|Windows NT 10.0)/},
            {s:'Windows 8.1', r:/(Windows 8.1|Windows NT 6.3)/},
            {s:'Windows 8', r:/(Windows 8|Windows NT 6.2)/},
            {s:'Windows 7', r:/(Windows 7|Windows NT 6.1)/},
            {s:'Windows Vista', r:/Windows NT 6.0/},
            {s:'Windows Server 2003', r:/Windows NT 5.2/},
            {s:'Windows XP', r:/(Windows NT 5.1|Windows XP)/},
            {s:'Windows 2000', r:/(Windows NT 5.0|Windows 2000)/},
            {s:'Windows ME', r:/(Win 9x 4.90|Windows ME)/},
            {s:'Windows 98', r:/(Windows 98|Win98)/},
            {s:'Windows 95', r:/(Windows 95|Win95|Windows_95)/},
            {s:'Windows NT 4.0', r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
            {s:'Windows CE', r:/Windows CE/},
            {s:'Windows 3.11', r:/Win16/},
            {s:'Android', r:/Android/},
            {s:'Open BSD', r:/OpenBSD/},
            {s:'Sun OS', r:/SunOS/},
            {s:'Linux', r:/(Linux|X11)/},
            {s:'iOS', r:/(iPhone|iPad|iPod)/},
            {s:'Mac OS X', r:/Mac OS X/},
            {s:'Mac OS', r:/(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
            {s:'QNX', r:/QNX/},
            {s:'UNIX', r:/UNIX/},
            {s:'BeOS', r:/BeOS/},
            {s:'OS/2', r:/OS\/2/},
            {s:'Search Bot', r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
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