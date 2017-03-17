var restoreOptions = function() {

    chrome.tts.getVoices(function(voices) {
        voices.forEach(function(voice) {
            document.getElementById('voice').innerHTML += `<option>${voice.lang}</option>`;
        })
    });

    chrome.storage.sync.get(function(items) {
        document.getElementById('voice').value = items.defaultVoice;
    });
}

var saveOptions = function() {
    var voice = document.getElementById('voice').value;
    chrome.storage.sync.set({
        defaultVoice: voice
    }, function() {
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
          status.textContent = '';
      }, 750);
    });

}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);