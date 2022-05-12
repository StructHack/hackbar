
async function getCurrentTab(){
    let queryOptions = {active: true, currentWindow: true}
    let tab = await chrome.tabs.query(queryOptions);
    return tab;
}


let load_url = document.querySelector('.load_url');
let split_url = document.querySelector('.split_url');
let send_url = document.querySelector('.send_url');
var url = '';

load_url.addEventListener('click',async (event)=>{
    let tabs = await getCurrentTab();
    url = tabs[0].url;
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

