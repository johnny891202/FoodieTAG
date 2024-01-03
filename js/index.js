//地點列表toggle
const keywordOne = document.getElementById('keywordOne');
const keywordTwo = document.getElementById('keywordTwo');
const locationList = document.getElementById('locaitonSelectList');

keywordTwo.addEventListener('click',(e)=>{
    locationList.classList.toggle('hide');
});

//地點搜尋欄 出現指定地點
locationList.addEventListener('click',(e)=>{
    keywordTwo.value = e.target.textContent;
    if (!locationList.classList.contains('hide') ){ //點下指定縣市時，隱藏選單
        locationList.classList.add('hide')
    }
});

//搜尋bar active樣式
const searchBar = document.getElementById('searchBar');

searchBar.addEventListener('click',e=>{
    searchBar.classList.remove('border-0');
    searchBar.classList.add('search-bar-active');
});

window.addEventListener('click',e=>{
    if (e.target !== searchBar && e.target !== keywordOne && e.target !== keywordTwo){
        searchBar.classList.remove('search-bar-active');
    };

})

//搜尋bar
const _url = "http://localhost:3000";
const searchBtn = document.getElementById('searchBtn');

let resturantData = [];
function init(){
    axios.get(`${_url}/restaurants`)
    .then(function(response){
        resturantData = response.data;
        console.log(resturantData);
    })
    .catch(function(error){
        console.log(error);
    })
};

searchBtn.addEventListener('click',function(e){
    window.location.href = `restaurantList.html?q=${keywordOne.value}&Add_like=${keywordTwo.value}`;
    });

init();


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
