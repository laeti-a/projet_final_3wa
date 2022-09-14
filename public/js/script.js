//////////////////////////////////////
// Navbar becoming a hamburger menu //
//////////////////////////////////////
const hamburgerMenu = document.querySelector(".menu-hamburger")
const navMenu = document.querySelector(".nav-menu")

hamburgerMenu.addEventListener("click", mobileMenu)

function mobileMenu() {
    hamburgerMenu.classList.toggle("active")
    navMenu.classList.toggle("active")
}

// Close hamburger menu when link clicked
const navLink = document.querySelectorAll(".nav-link")

navLink.forEach(n => n.addEventListener("click", closeMenu))

function closeMenu() {
    hamburgerMenu.classList.remove("active")
    navMenu.classList.remove("active")
}


/////////////////////////////////////////////////////////////
// Scroll bar of the header and Scroll to top button       //
/////////////////////////////////////////////////////////////
let button = document.querySelector(".btn-back-to-top")

window.onscroll = () => {
    fillScrollBar()
    scrollFunction()
}

function fillScrollBar() {
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight
    let scrolled = (winScroll / height) * 100
    document.querySelector("#myBar").style.width = scrolled + "%"
}

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        button.style.display = "block"
    } 
    else {
        button.style.display = "none"
    }
}

button.addEventListener("click", backToTop)

function backToTop() {
    document.body.scrollTop = 0
    document.documentElement.scrollTo({top: 0, behavior: 'smooth'})
}


////////////////////////////////////////////
// Show password when eye icon clicked    //
////////////////////////////////////////////
const iconShowPassword = document.querySelector('#showPassword')
const password = document.querySelector('#login_password')

iconShowPassword.addEventListener('click', () => {

    const type = password.getAttribute('type') === 'password' ? 'text' : 'password'
    password.setAttribute('type', type)

    iconShowPassword.classList.toggle('fa-eye-slash')
})