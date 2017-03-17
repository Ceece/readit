chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    if (request.action == 'browserAction') {
        sendResponse({
            selection: window.getSelection().toString()
        });
    }

    return true;

});