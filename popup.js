const dropdown = document.getElementById('targetLanguage');
const toggle = document.getElementById('toggle');

chrome.storage.local.get(['language'], function(language){
    console.log('Value currently is ' + language.language);
    dropdown.value = language.language;
});

dropdown.addEventListener("change", function(e) {
    chrome.storage.local.set({'language': e.target.value}, function() {
        console.log('Value is set to ' + e.target.value);
    });
});

toggle.addEventListener("change", function(e) {
    if(e.target.checked) {
        chrome.storage.local.set({'toggle': true}, function() {
            console.log('Value is set to ' + e.target.value);
        });
    } else {        
        chrome.storage.local.set({'toggle': false}, function() {
            console.log('Value is set to ' + e.target.value);
        });
    }
});

