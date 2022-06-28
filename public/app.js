
const modusImage = document.querySelector("#modus_img")
const textgen = document.querySelector("#textgen")
const checkthis = document.querySelector('#checkthis')
const check_cont = document.querySelector('.check_cont')
const navbar = document.querySelector('.navbar')
const navbarlogo = document.querySelector('.navbar_logo')
const ratiobar = document.querySelector('.ratio')
const ratioVal = document.querySelector('#ratioval')
const navbar_burger = document.querySelector('.navbar_burger')
const navbar_menu = document.querySelector('.navbar_menu')
const jpg_selector = document.querySelector('#jpg')
const txt_selector = document.querySelector('#txt')
const borde_selektor = document.querySelector('#borde_selektor')
const generate_txt = document.querySelector('#generate_txt')
const generate_cont = document.querySelector('#generate_cont')
const loading_txt = document.querySelector('#loading_txt')
const file = document.querySelector('#upload_img')
const form_cont_img = document.querySelector('#form_cont_img')
const invert_cont = document.querySelector('#invert_cont')
const invert_txt = document.querySelector('#invert_txt')
const contrastbar = document.querySelector('#contrast')
const contrastVal = document.querySelector('#contrastval')


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
    if(scrollY > 150 ){
        if(!navbar.classList.contains('isActive')){
            navbar.classList.toggle('isActive')
        }
    }else if(scrollY < 150 && navbar.classList.contains('isActive')){
        navbar.classList.toggle('isActive')
    }
}

const toggle_burger_deploy = ()=>{
    navbar_burger.classList.toggle('isActive')
    navbar_menu.classList.toggle('burgerActive')
    navbarlogo.classList.toggle('burgerActive')
}

const format_selector_toggle = (wich)=>{
    if(wich == 'txt'){
        return ()=>{
            if(borde_selektor.classList.contains('isJpg')){
                borde_selektor.classList.toggle('isJpg')
            }
        }
    }else if(wich == 'jpg'){
        return ()=>{
            if(!borde_selektor.classList.contains('isJpg')){
                borde_selektor.classList.toggle('isJpg')
            }
        }
    }
}

const generate_animation_toggle =()=>{
    generate_txt.classList.toggle('loading')
    loading_txt.classList.toggle('loading')
}

const download = (data,filename,type) =>{
    const file = new Blob([data], {type:type})
    if(window.navigator.msSaveOrOpenBlob) //IE10+
        window.navigator.msSaveOrOpenBlob(file,filename)
    else{ //others
        let a = document.createElement("a")
        let url = URL.createObjectURL(file)
        a.href = url;
        a.download = filename
        document.body.appendChild(a)
        a.click()
        setTimeout(function(){
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)
        },0)
    }
}

const generateImgAPI = async  ()=>{
    const isJpg = borde_selektor.classList.contains('isJpg')

    const url = isJpg ? "https://image2ascii.up.railway.app/api/v1/gen/generateImgNoUp":"https://image2ascii.up.railway.app/api/v1/gen/generateTxtNoUp"
    const image = file.files[0]
    const inverted = invert_cont.classList.contains('inverted') ? 'true':'false'
    const ratio = ratiobar.value
    const contrast = contrastbar.value

    if(!image){ 
        form_cont_img.classList.add('badData')
        console.log('hi');
        return
    }
    
    const formData = new FormData();
    formData.append('image', image)
    formData.append('invert', inverted)
    formData.append('contrast', contrast)
    formData.append('resolution', ratio)
    if(isJpg){
        const bgColor = invert_cont.classList.contains('inverted') ? '255':'0'
        const fontColor = invert_cont.classList.contains('inverted') ? '0':'255'
        formData.append('backgroundColor', bgColor)
        formData.append('backgroundColor', bgColor)
        formData.append('backgroundColor', bgColor)
        formData.append('fontColor', fontColor)
        formData.append('fontColor', fontColor)
        formData.append('fontColor', fontColor)
    }

    form_cont_img.classList.remove('badData')
    generate_animation_toggle()

    const res = await fetch(url, {
        method:"POST",
        body:formData
    })

    let data = undefined
    if(isJpg){
        data = await res.blob()
    }else{
        data = await res.text()
    }

    const type = isJpg ? 'image/jpg':'text/plain'
    const filename = isJpg ? 'generation.jpg': 'generation.txt'
    download(data, filename, type)

    generate_animation_toggle()

}
const generate = ()=>{
    //generateImgAPI()
    generate_animation_toggle()

}

const inverted = ()=>{
    invert_cont.classList.toggle('inverted')
    invert_txt.classList.toggle('inverted')
}

modusImage.addEventListener('click', generateText)
window.addEventListener('scroll', activeNavbar_scroll)
navbar_burger.addEventListener('click', toggle_burger_deploy)
jpg_selector.addEventListener('click',format_selector_toggle('jpg'))
txt_selector.addEventListener('click',format_selector_toggle('txt'))
generate_cont.addEventListener('click',generate)
invert_cont.addEventListener('click', inverted)
ratiobar.addEventListener("input", function(){
    ratioVal.innerHTML = ratiobar.value
})
contrastbar.addEventListener("input",function(){
    contrastVal.innerHTML = contrastbar.value
})
