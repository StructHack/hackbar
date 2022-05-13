





async function getCurrentTab(){
    let queryOptions = {active: true, currentWindow: true}
    let tab = await chrome.tabs.query(queryOptions);
    return tab;
}


let load_url = document.querySelector('.load_url');
let split_url = document.querySelector('.split_url');
let send_url = document.querySelector('.send_url');
let encode_url = document.querySelector('.encode_url');
var url = '';

async function alreadypresent(){
    let data = await chrome.storage.sync.get('changed_url')
    if(data.changed_url){
        url = data.changed_url;
    }
    input_here.textContent = url;   
}

alreadypresent()

input_here.addEventListener('change',()=>{
    url = input_here.value;
    chrome.storage.sync.set({changed_url:url},()=>{
        console.log('value stored')
    })
})


load_url.addEventListener('click',async (event)=>{
    let tabs = await getCurrentTab();
    url = tabs[0].url;
    chrome.storage.sync.set({changed_url:url},()=>{
        console.log('value stored')
    })
    input_here.textContent = url;
})

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
   if(queries.length > 1){
        for(i=0;i<queries.length;i++){
            if(i==0){
                edited_url = edited_url + '\n' + queries[i]
                continue
            }
            edited_url = edited_url + '\n&' + queries[i]
        }
            
   }
   input_here.textContent = protocol+'//'+domain_name+path+'?'+edited_url+hash

})

send_url.addEventListener('click',async (event)=>{
    let tabs = await getCurrentTab();
    let tabId = tabs[0].id;
    let new_url = input_here.value
    chrome.tabs.update(tabId, {url:new_url})
})



encode_url.addEventListener('click',(event)=>{
    let selection_text = window.getSelection().toString();
    console.log(selection_text)
    let encoding = document.querySelector('#encodings').value;
    if(selection_text){
    let start = input_here.selectionStart;
    let stop = input_here.selectionEnd;
    let add_string = url.substring(0, start);
    switch(encoding){
        case 'base64':
            let replace_string = url.substring(start).replace(selection_text, btoa(selection_text));
            let full_url = add_string+replace_string
            input_here.value = full_url
            url = full_url
            chrome.storage.sync.set({changed_url:full_url},()=>{
                console.log('value stored')
            })
            break;
    }
}

})