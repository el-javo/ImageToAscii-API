const modusImage = document.querySelector("#modus_img")
const textgen = document.querySelector("#textgen")
const checkthis = document.querySelector('#checkthis')
const check_cont = document.querySelector('.check_cont')
const navbar = document.querySelector('.navbar')
const navbarlogo = document.querySelector('.navbar_logo')
const ratiobar = document.querySelector('.ratio')
const ratioVal = document.querySelector('.ratioval')
const navbar_burger = document.querySelector('.navbar_burger')
const navbar_menu = document.querySelector('.navbar_menu')

function wait(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

const generateText = ()=>{
    modusImage.classList.toggle('isActive')
    setTimeout(function() {
        modusImage.style.display = "none"
    },400)
    checkthis.classList.toggle('isActive')
    setTimeout(function() {
        check_cont.style.display = "flex"
    },2000)
    setTimeout(function() {
        check_cont.style.display = "none"
    },5000)
    textgen.classList.toggle('isActive')
}

const activeNavbar_scroll = ()=>{
    const current_section = ""
    if(scrollY > 200 ){
        if(!navbar.classList.contains('isActive')){
            navbar.classList.toggle('isActive')
        }
    }else if(scrollY < 200 && navbar.classList.contains('isActive')){
        navbar.classList.toggle('isActive')
    }
}

const toggle_burger_deploy = ()=>{
    navbar_burger.classList.toggle('isActive')
    navbar_menu.classList.toggle('burgerActive')
    navbarlogo.classList.toggle('burgerActive')
}

modusImage.addEventListener('click', generateText)
window.addEventListener('scroll', activeNavbar_scroll)
ratiobar.addEventListener("input", function(){
    ratioVal.innerHTML = ratiobar.value
})
navbar_burger.addEventListener('click', toggle_burger_deploy)