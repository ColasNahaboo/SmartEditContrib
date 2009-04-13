function include_dom(script_filename) {
    var html_doc = document.getElementsByTagName('head').item(0);
    var js = document.createElement('script');
    js.setAttribute('language', 'javascript');
    js.setAttribute('type', 'text/javascript');
    js.setAttribute('src', script_filename);
    html_doc.appendChild(js);
    return false;
}
include_dom(twikismartScriptURL+"mochikit/lib/MochiKit/MochiKit.js");
include_dom(twikismartScriptURL+"wikismartEngine.js");
include_dom(twikismartScriptURL+"wikismartActions.js");
include_dom(twikismartScriptURL+"smartEditUI.js");
include_dom(twikismartScriptURL+"wikismartEvents.js");
include_dom(twikismartScriptURL+"smartEditAutoCompletion.js");
include_dom(twikismartScriptURL+"smartEditDynamicDivision.js");

