//首頁-輪播
var swiper = new Swiper(".mySwiper", {
    slidesPerView: 4,
    spaceBetween: 30,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    pagination: {
    el: ".swiper-pagination",
    clickable: true, 
    mousewheel: true,
    keyboard: true,
    },
});


//首頁-搜尋

const keywordTwo = document.getElementById('keywordTwo');
const locationList = document.getElementById('locaitonSelectList');
const a = document.querySelector('html').target;

//出現搜尋欄的 地點列表
keywordTwo.addEventListener('click',(e)=>{
    locationList.classList.toggle('hide');

});

// window.addEventListener('click',(e)=>{
//     if(!e.target == keywordTwo || !e.target == locationList)
//     locationList.classList.add('hide')
// })

//地點搜尋欄 出現指定地點
locationList.addEventListener('click',(e)=>{
    keywordTwo.value = e.target.textContent;
    if (!locationList.classList.contains('hide') ){
        locationList.classList.add('hide')
    }
});




