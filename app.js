const baseurl = 'https://mars-photos.herokuapp.com/api/v1/rovers/curiosity/photos?'
// const baseurl = 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?'


const container = document.querySelector('.container')
const form = document.querySelector('form')
const loader = document.querySelector('.loading')
let res;
let data = []

function likeimage(e) {
    if (e.target.innerText === 'Unlike') e.target.innerText = 'Like'
    else
        e.target.innerText = 'Unlike'
    const target = e.target.nextSibling.children[0]
    target.classList.toggle('visible')
}

function getinfo(element) {
    const p1 = document.createElement('p')
    const p2 = document.createElement('p')
    const btn = document.createElement('button')
    const div1 = document.createElement('div')
    const div2 = document.createElement('div')
    const img = document.createElement('img')
    div1.classList.add('info')
    p1.classList.add('text')
    btn.classList.add('btn')
    div2.classList.add('like-image')
    let str = `${element.rover} rover - ${element.camera}`
    p1.innerText = str
    p2.innerText = element.earth_date
    btn.innerText = 'Like'
    img.src = './images/heart.png'
    img.alt = 'like-image'
    img.classList.toggle('visible')
    div2.append(img)
    div1.append(p1, p2, btn, div2)
    btn.addEventListener('click', likeimage)
    return div1
}

function getinfo2(element) {
    const section = document.createElement('section')
    let str = `${element.rover} rover - ${element.camera}`
    section.innerHTML = `
    <div class="image"></div>
            <div class="info">
                <p class="text">
                    ${str}
                </p>
                <p class="date">${element.earth_date}</p>
                <button class="btn">Like</button>
                <div class="like-image">
                    <img src="./images/heart.png" alt="like-heart">
                </div>
    </div>`

}

function renderCard(element) {
    // console.log('hello')
    const card = document.createElement('section')
    const div1 = document.createElement('div')
    const div2 = getinfo(element)
    card.classList.add('card')

    card.setAttribute('data-aos', 'fade-up')         // This is a UI feature remove it if not required
    div1.classList.add('image')
    div1.style.backgroundImage = `url(${element.img_src})`
    card.append(div1, div2)
    container.append(card)
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    loader.style.visibility = 'visible';

    container.innerHTML = ''
    const search = form.elements
    const x = {
        // earth_date: search.earth_date.value,
        // api_key: 'kY1W9kSR8GjMAGPKVMgwaRMd0xkxXsGLcglBSlmB',
        sol: search.sol.value,
        camera: search.camera.value
    }
    let params = new URLSearchParams(x);
    let keysForDel = []

    params.forEach((value, key) => {
        if (value == '') keysForDel.push(key)
    })
    keysForDel.forEach(key => {
        params.delete(key)
    })

    console.log(x)
    const config = { params: params }
    data.length = 0;

    try {
        res = await axios.get(baseurl, config)
        const photos = res.data.photos
        for (let i = 0; i < photos.length; i++) {
            let obj = Object.create({})
            obj.img_src = photos[i].img_src
            obj.earth_date = photos[i].earth_date
            obj.camera = photos[i].camera.full_name
            obj.rover = photos[i].rover.name
            data.push(obj)
            // console.log(photos[i].img_src, photos[i].earth_date, photos[i].camera.full_name, photos[i].rover.name)
        }
    } catch (e) {
        console.log(e)
    }
    finally {
        loader.style.visibility = 'hidden'
        if (data.length == 0)
            container.innerText = 'Sorry! No images Found'
        else
            data.map(renderCard);
    }
})


console.log(loader)
function myfunction() {

    loader.style.visibility = none;
}