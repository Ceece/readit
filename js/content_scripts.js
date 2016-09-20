responsiveVoice.AddEventListener("OnLoad", function() {
    chrome.runtime.onMessage.addListener(function(message) {
        if (message.action == 'speakit')
            responsiveVoice.speak(window.getSelection().toString());
    });
});