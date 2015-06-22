(function(win) {
    var fireReady = win.KangoAPI._fireReady;

    win.KangoAPI._fireReady = function() {
        var scripts;
        fireReady.call(win.KangoAPI);

        if (!win.kango || !win.KangoAPI) {
            return;
        }

        scripts = win.kango.getExtensionInfo().popup_scripts;

        bindScript(scripts);
    };

    function bindScript(scripts, i) {
        var scriptUrl;
        var scriptNode;
        var extensionFileUrl;
        i = i || 0;
        if (i >= scripts.length) return;

        scriptUrl = scripts[i];
        scriptNode = win.document.createElement("script");
        scriptNode.setAttribute("type", "text/javascript");
        extensionFileUrl = kango.io.getExtensionFileUrl(scriptUrl);
        scriptNode.setAttribute("src", extensionFileUrl);
        scriptNode.onerror = function() {
            console.error("Unable to load " + scriptUrl)
        };
        if (scriptNode.onreadystatechange) {
            scriptNode.onreadystatechange = function() {
                if (scriptNode.readyState == "complete") {
                    bindScript(scripts, i + 1);
                }
            }
        } else {
            scriptNode.onload = function() {
                bindScript(scripts, i + 1);
            };
        }
        win.document.body.appendChild(scriptNode);
    }
})(window);
