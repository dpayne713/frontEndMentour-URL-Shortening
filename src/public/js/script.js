
const search = document.querySelector('#submit'); 
const input = document.querySelector('#url')
const urlDIV = document.querySelector('.mid__url')
const error = document.querySelector('.mid-form__form-errorMSG')

const cardHTML = 
`<div class="mid__url-box">
    <div class="mid__url-box-link">
        <span class="mid__url-box-link-LINK">{%LINK%}</span>
    </div>
    <div class="mid__url-box-short">
        <span class="mid__url-box-short-SHORT">{%SHORT%}</span>
        <button class="mid__url-box-short-COPY" data="COPY {%ID%}">Copy</button>
        <button class="mid__url-box-short-DELETE" data="DELETE {%ID%}">Delete</button>
    </div>
</div>`


search.addEventListener('click', async (event)=> {
    event.preventDefault(); 

    if (!input.value) {
        displayError('Please add a link'); 
        return;
    }
    if(!(/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig.test(input.value))) {
        displayError('Invalid URL. Please type or paste a valid URL'); 
        return;
    }
    removeError(); 

    const url = {url: input.value}; 
    const short = await getShortenedURL(url)

    if (getLocals()) {
        let shorts = getLocals(); 
        shorts.push({url: url.url, short}); 
        setAndDisplayShorts(shorts);

    } else {
        localStorage.setItem('shorts', JSON.stringify([{url: url.url, short}]))
        const html = cardHTML.replace('{%LINK%}', url.url).replace('{%SHORT%}', short).replaceAll('{%ID%}', '0')
        urlDIV.insertAdjacentHTML('beforeend', html); 
    }

});

urlDIV.addEventListener('click', (event)=> {
    
    if(event.target.getAttribute('data')) {
        const data = event.target.getAttribute('data').split(' '); 
        const type = data[0]; 
        const id = parseInt(data[1]); 
        const shorts = getLocals(); 

        if (type === 'DELETE') {
            shorts.splice(id,1); 
            setAndDisplayShorts(shorts)
        }
        if (type === 'COPY') {
            const text = shorts[id].short
            
            navigator.clipboard.writeText(text).then(()=>{
                 event.target.innerHTML="COPIED!"
                 event.target.classList.add('btn-copy')
            }); 
        };
    }
});

async function getShortenedURL(x) {
    const res = await fetch('/shorten', {
        method: 'POST', 
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(x)

    })
    return res.json(); 

};

function getLocals(x) {
    return JSON.parse(localStorage.getItem('shorts'));
};


function setAndDisplayShorts(shorts) {
    if (shorts) {
        localStorage.setItem('shorts', JSON.stringify(shorts)); 

        while (urlDIV.hasChildNodes()) {
            urlDIV.removeChild(urlDIV.firstChild)
        };        
    } else {
        shorts = getLocals()
    }

    shorts.forEach((el, i)=> {
        const html = cardHTML.replace('{%LINK%}', el.url).replace('{%SHORT%}', el.short).replaceAll('{%ID%}', i)
        urlDIV.insertAdjacentHTML('beforeend', html); 
    });

};

function displayError(string) {
    error.textContent = string; 
    error.style = 'visibility: visible'; 
    input.style = 'border: 3px solid  hsl(0, 87%, 67%)'
}

function removeError() {
    error.textContent = ''
    error.style = 'visibility: hidden'
    input.style = 'border: none'
}

setAndDisplayShorts(); 


