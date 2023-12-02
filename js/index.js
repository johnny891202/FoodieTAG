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
const keywordOne = document.getElementById('keywordOne');
const keywordTwo = document.getElementById('keywordTwo');
const locationList = document.getElementById('locaitonSelectList');

//出現搜尋欄的 地點列表
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

//搜尋欄active樣式
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


//已登入會員nav-bar 

// const user = document.getElementById('user');
// const userBar = document.getElementById('userBar');

// user.addEventListener('click',e=>{
//     userBar.classList.toggle('d-none')
// })


//關鍵字搜尋功能----------------

const _url = "http://localhost:3000";
const searchBtn = document.getElementById('searchBtn');
let filteredData;


//初始化畫面，抓取資料庫
let data = []; //賦予一個空陣列到變數data上
function init(){
axios.get(`${_url}/resturants`)
.then(function(response){
    data = response.data; //把後端的posts內的資料賦予到變數data上
   console.log(data);
})
};

//監聽按鈕，篩選關鍵字
btn.addEventListener('click',function(e){
   const keyWords = input.value;

   window.location.href = `restaurant_info.html?q=${keyWords}`;
   });