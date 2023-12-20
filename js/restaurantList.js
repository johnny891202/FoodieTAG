/* 滑動金額 */
let slider = document.querySelector(".slider");
let priceRange = document.querySelector(".priceRange");
priceRange.innerHTML = `${slider.value} 元`;

slider.oninput = function () {
    priceRange.innerHTML = `${this.value} 元`;
}
/* 星星數篩選 */
const stars = document.querySelectorAll(".stars i");

stars.forEach(function (item) {
    item.addEventListener("click", function (e) {
        e.preventDefault();
        item.classList.toggle(`fa-solid`)
    })
});

/* 本周熱門標籤點擊增加到正在搜尋 */
const weeklyTop = document.querySelector(".weeklyTop");
const selectTags = document.querySelector(".selectTags");
const selectedTags = document.querySelector(".selectedTags");
let addTags = [];

weeklyTop.addEventListener("click", addSelectTags);
selectTags.addEventListener("click", addSelectTags);

function addSelectTags(e) {
    e.preventDefault();
    /* 檢查點擊的元素是否是<a>元素 */
    if (e.target.tagName === "A") {
        const clickedTag = e.target.textContent;
        // 檢查addTags裡面是否有相同的標籤
        if (!addTags.includes(clickedTag)) {
            addTags.push(clickedTag);
            renderTags(addTags);
        }
    }
}
/* 渲染選取的標籤 */
function renderTags(data) {
    let str = "";
    data.forEach(function (item) {
        str += `<a href="#">${item}</a>`
    })
    selectedTags.innerHTML = str;
}

/* 清除全部正在搜尋 */
const clearAllTag = document.querySelector(".clearAllTag");
clearAllTag.addEventListener("click", function (e) {
    e.preventDefault();
    addTags = [];
    renderTags(addTags);
})

/* 抓資料 */
axios.get("http://localhost:3000/restaurants")
    .then(function (response) {
        const allRestaurants = response.data;
        const targetTag = "咖啡";
        const filteredRestaurants = allRestaurants.filter(function (restaurant) {
            return restaurant.Tags.includes(targetTag);
        });
        renderFilterRestaurant(filteredRestaurants)

    })
    .catch(function (error) {
        console.error("獲取數據時出錯:", error);
    })

/* 渲染篩選完的餐廳資料 */
const allList = document.querySelector(".allList");
function renderFilterRestaurant(data) {
    let str = "";
    data.forEach(function (item) {
        /* 星星數量 */
        let rating = "";
        /* 計算實心的星星 */
        const solidStars = Math.floor(item.Stars);
        /* 創建實心星星 */
        for (let i = 0; i < solidStars; i++) {
            rating += `<a href="#" class="stars"><i class="fa-solid fa-star fs-5" style="color: #f5cd05;"></i></a>`;
        }
        if (item.Stars % 1 !== 0) {
            rating += `<a href="#" class="stars"><i class="fa-solid fa-star-half-alt fs-5" style="color: #f5cd05;"></i></a>`;
        }
        /* 創建空星星 */
        for (let i = 0; i < (5 - solidStars - 1); i++) {
            rating += `<a href="#" class="stars"><i class="fa-regular fa-star fs-5" style="color: #f5cd05;"></i></a>`;
        }
        console.log(rating)

        str += `<li class="restaurantItem">
                    <img src="${item.Picture[0]}" alt="">
                    <!-- 餐廳資訊 -->
                    <div class="restaurantContent">
                        <a href="#" class="restaurantName">${item.Name}</a>
                        <p class="opentime">營業時間: <span class="opentimeInfo">${item.Opentime}</span></p>
                        <p class="address">地址: <span class="addressInfo">${item.Add}</span></p>
                        <p class="averagePrice">均消: <span class="averagePriceInfo">${item.Price}</span></p>
                        <div class="tagsList">
                            <a href="#">居酒屋</a>
                            <a href="#">有帥哥</a>
                            <a href="#">有wifi</a>
                            <a href="#">啤酒</a>
                            <a href="#">烤串</a>
                        </div>
                    </div>
                    <!-- 星級與收藏 -->
                    <div class="rating">
                        ${rating}
                        <a href="#" class="collect"><i class="fa-regular fa-bookmark"></i></a>
                    </div>
                </li>`
    })
    allList.innerHTML = str;
}