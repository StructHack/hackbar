/* Get the current tab */
async function getCurrentTab(){
    let queryOptions = {active: true, currentWindow: true}
    let tab = await chrome.tabs.query(queryOptions);
    return tab;
}

/* variables for different buttons */

let load_url = document.querySelector('.load_url');
let split_url = document.querySelector('.split_url');
let send_url = document.querySelector('.send_url');
let encode_url = document.querySelector('.encode_url');
let decode_url = document.querySelector('.decode_url');
let insert_payload = document.querySelector('.insert_payload');
var url = '';

/* check if the data is present in chrome.storage */

async function alreadypresent(){
    let data = await chrome.storage.sync.get('changed_url')
    if(data.changed_url){
        url = data.changed_url;
    }
    input_here.textContent = url;   
}


/* If the data is already present in the storage (chrome.storage) then load from there */

alreadypresent()

/* Onchange update the url of the textarea */

input_here.addEventListener('change',()=>{
    url = input_here.value;
    chrome.storage.sync.set({changed_url:url},()=>{
        console.log('value stored')
    })
})

/* When clicking on load url*/

load_url.addEventListener('click',async (event)=>{
    let tabs = await getCurrentTab();
    url = tabs[0].url;
    chrome.storage.sync.set({changed_url:url},()=>{
        console.log('value stored')
    })
    input_here.textContent = url;
})

/* When clickin on split url */

split_url.addEventListener('click',(event)=>{
    const load_url = new URL(url);
    const protocol = load_url.protocol
    const domain_name = load_url.hostname;
    const path = load_url.pathname;
    const search_params = load_url.search;
    const hash = load_url.hash

    if(!search_params) return;

   const query_string = search_params.split('?')[1]
   let queries = query_string.split('&')
   var edited_url = ''

   if(queries.length === 1){
       edited_url = '\n'+queries[0]
   }

   if(queries.length > 1){
        for(i=0;i<queries.length;i++){
            if(i==0){
                edited_url = edited_url + '\n' + queries[i]
                continue
            }
            edited_url = edited_url + '\n&' + queries[i]
        }
            
   }
   url = protocol+'//'+domain_name+path+'?'+edited_url+hash
   input_here.textContent = protocol+'//'+domain_name+path+'?'+edited_url+hash

})

/* When clicking on split url*/

send_url.addEventListener('click',async (event)=>{
    let tabs = await getCurrentTab();
    let tabId = tabs[0].id;
    let new_url = input_here.value
    chrome.tabs.update(tabId, {url:new_url})
})

/* conversion to hex */

function tohex(str){
    let arr = []
    for(i=0; i<str.length;i++){
        let hex = Number(str.charCodeAt(i)).toString(16)
        arr.push(hex)
    }
    return '0x'+arr.join('')
}

function toascii(hex_str){
    let text = hex_str.substring(2)
    let arr = text.match(/.{2}/g)
    let new_arr = arr.map(x=>{return String.fromCharCode(parseInt(x,16)) })
    return new_arr.join('')

}

/* when clicking on encode button */

encode_url.addEventListener('click',(event)=>{
    let selection_text = window.getSelection().toString();
    console.log(selection_text)
    let encoding = document.querySelector('#encodings').value;
    if(selection_text){
    let start = input_here.selectionStart;
    let stop = input_here.selectionEnd;
    let add_string = url.substring(0, start);
    let replace_string = ''
    let full_url = ''
    switch(encoding){
        case 'base64':
            replace_string = url.substring(start).replace(selection_text, btoa(selection_text));
            full_url = add_string+replace_string
            input_here.value = full_url
            url = full_url
            chrome.storage.sync.set({changed_url:full_url},()=>{
                console.log('value stored')
            })
            break;
        case 'hex':
            replace_string = url.substring(start).replace(selection_text, tohex(selection_text));
            full_url = add_string+replace_string
            input_here.value = full_url
            url = full_url
            chrome.storage.sync.set({changed_url:full_url},()=>{
                console.log('value stored')
            })
            break;
        case 'url':
            replace_string = url.substring(start).replace(selection_text, encodeURIComponent(selection_text));
            full_url = add_string+replace_string
            input_here.value = full_url
            url = full_url
            chrome.storage.sync.set({changed_url:full_url},()=>{
                console.log('value stored')
            })
            break;


    }
}

})

/* When clicking on decoding button */

decode_url.addEventListener('click',()=>{
    let selection_text = window.getSelection().toString();
    console.log(selection_text)
    let encoding = document.querySelector('#decodings').value;
    if(selection_text){
    let start = input_here.selectionStart;
    let stop = input_here.selectionEnd;
    let add_string = url.substring(0, start);
    let replace_string = ''
    let full_url = ''
    switch(encoding){
        case 'base64':
            replace_string = url.substring(start).replace(selection_text, atob(selection_text));
            full_url = add_string+replace_string
            input_here.value = full_url
            url = full_url
            chrome.storage.sync.set({changed_url:full_url},()=>{
                console.log('value stored')
            })
            break;
        case 'hex':
            replace_string = url.substring(start).replace(selection_text, toascii(selection_text));
            full_url = add_string+replace_string
            input_here.value = full_url
            url = full_url
            chrome.storage.sync.set({changed_url:full_url},()=>{
                console.log('value stored')
            })
            break;
        case 'url':
            replace_string = url.substring(start).replace(selection_text, decodeURIComponent(selection_text));
            full_url = add_string+replace_string
            input_here.value = full_url
            url = full_url
            chrome.storage.sync.set({changed_url:full_url},()=>{
                console.log('value stored')
            })
            break;


    }
}
})


insert_payload.addEventListener('click',()=>{
    const payload = document.querySelector('#xss_payloads').value;
    let cursor_postion = input_here.selectionStart;
    let start_payload = url.substring(0, cursor_postion)
    let end_payload = url.substring(cursor_postion)
    full_url = `${start_payload}${payload}${end_payload}`
    input_here.value = full_url

    chrome.storage.sync.set({changed_url:full_url},()=>{
        console.log('value stored')
    })
})
