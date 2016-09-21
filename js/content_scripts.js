chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action == 'speakit') {
        sendResponse({
            selection: window.getSelection().toString()
        });
    }
});