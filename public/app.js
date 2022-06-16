const modusImage = document.querySelector("#modus_img")
const textgen = document.querySelector("#textgen")
const checkthis = document.querySelector('#checkthis')

function wait(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}
const showText = ()=>{
    textgen.classList.toggle('isActive')
}

const generateText = ()=>{
    modusImage.classList.toggle('isActive')
    checkthis.classList.toggle('isActive')
    showText()
}

modusImage.addEventListener('click', generateText)