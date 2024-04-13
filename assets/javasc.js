/* ***********************toogle icon navbar************** */
let menuicon = document.querySelector('#menu_icon');
let navbar = document.querySelector('.navbar');

menuicon.onclick=()=>{
    menuicon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
}


let sections =document.querySelectorAll('section');
let navLinks =document.querySelectorAll('header nav a');


window.onscroll = () =>{
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset= sec.offsetTop-150;
        let height= sec.offsetHeight;
        let id= sec.getAttribute('id');
        
        if (top>=offset && top<offset+height) {
            navLinks.forEach(links=>{
                links.classList.remove('active');
               document.querySelector('header nav a[href*='+ id +']').classList.add('active');
            });
        };
        
    });
let header=document.querySelector('header');
header.classList.toggle('sticky',window.scrollY>100);
menuicon.classList.remove('bx-x');
navbar.classList.remove('active');
};


/* ***********************scroll reveal************** */

ScrollReveal({ 
    /*reset: true,*/
    distance:'80px',
    duration:2000,
    dealy:200

});
ScrollReveal().reveal('.home_content, .heading', { origin:'top' });
ScrollReveal().reveal('.image_design,.services_container,.skills_container,.portflio_box, .contact form, #MyCon', { origin:'bottom' });
ScrollReveal().reveal('.home_content h1, .about_image', { origin:'top' });
ScrollReveal().reveal('.home_content p, .about_content', { origin:'left' });

/* ***********************typed js************** */
const typed = new Typed('.typedd',{
    strings: ['Frontend Developer','Backend Developer','Youtuber','Designer'],
    typeSpeed:100,
    backSpeed:100,
    backDealy:1000,
    loop:true
});


// **********************************mouseover**************************

function mmover() {
    let mouse=document.getElementById('img2');
    // mouse.addEventListener("mouseover");
    if (mouse.style.display!='block') {
    mouse.style.display= 'block';
}
else{
    mouse.style.display= 'none';
    
    }
}

// form validation



