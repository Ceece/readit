Array.prototype.unique = function(a){
    return function(){ return this.filter(a) }
}(function(a,b,c){ return c.indexOf(a,b+1) < 0 });

var restoreOptions = function() {
    chrome.tts.getVoices(function(voices) {
        var langs = [];
        voices.forEach(function(voice) {
            langs.push(voice.lang);
        });
        langs.sort();
        langs = langs.unique().map(function(lang) {
            return `<option>${lang}</option>`;
        })
        document.getElementById('voice').innerHTML = langs.join('');
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