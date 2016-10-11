chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    if (request.action == 'readit') {
        sendResponse({
            selection: window.getSelection().toString()
        });
    }

    return true;

});