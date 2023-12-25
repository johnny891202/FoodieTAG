/* 星星數篩選 */
const stars = document.querySelectorAll(".stars i");

stars.forEach(function (item) {
    item.addEventListener("click", function (e) {
        e.preventDefault();
        item.classList.toggle(`fa-solid`)
    })
});

/* 滑動金額 */
let slider = document.querySelector(".slider");
let priceRange = document.querySelector(".priceRange");
priceRange.innerHTML = `${slider.value} 元`;
slider.oninput = function () {
    priceRange.innerHTML = `${this.value} 元`;
    applySortAndFilter();
}

/* 本週熱門標籤點擊加入至正在搜尋 */
const weeklyTopTag = document.querySelector(".weeklyTopTag");
const selectTags = document.querySelector(".selectTags");
const searchingTags = document.querySelector(".searchingTags");
let addTags = [];

weeklyTopTag.addEventListener("click", addSelectTags);
selectTags.addEventListener("click", addSelectTags);

function addSelectTags(e) {
    e.preventDefault();
    /* 檢查點擊的元素是否是<a>元素 */
    if (e.target.tagName === "A") {
        const clickedTag = e.target.textContent;
        // 檢查addTags裡面是否有相同的標籤
        if (!addTags.includes(clickedTag)) {
            addTags.push(clickedTag);
            renderSelectTags(addTags);
        }
    }
}

/* 渲染目前選取的標籤 */
function renderSelectTags(data) {
    let str = "";
    str += `<span class="me-2">正在搜尋：</span>`
    data.forEach(function (item) {
        str += `<a href="#">${item}<i class="fa-solid fa-x fa-sm ms-2" data-value="${item}"></i></a>`;
    })
    str += `<a href="#" class="clearAllTag btn-primary-300">全部清除</a>`
    searchingTags.innerHTML = str


}

/* 刪除正在搜尋單筆標籤 */
searchingTags.addEventListener("click", function (e) {
    if (e.target.tagName === "I") {
        const removedTag = e.target.dataset.value;
        /* 找要刪除的標籤在 addTags裡面的索引 */
        const index = addTags.indexOf(removedTag);
        addTags.splice(index, 1);
        renderSelectTags(addTags);
    }
})
/* 刪除正在搜尋全部標籤 */
searchingTags.addEventListener("click", function (e) {
    if (e.target.classList[0] === "clearAllTag") {
        addTags = [];
        renderSelectTags(addTags);
    }
})

/* 抓取所有餐廳資料 */
let filteredRestaurants;
axios.get("http://localhost:3000/restaurants")
    .then(function (response) {
        const allRestaurants = response.data;
        const filterTag = "咖啡";
        filteredRestaurants = allRestaurants.filter(function (restaurant) {
            return restaurant.Tags.includes(filterTag);
        })
        renderFilterRestaurant(filteredRestaurants)
        renderRestaurantsCount(filteredRestaurants)
    })
    .catch(function (error) {
        console.error("獲取數據時出錯:", error);
    })
/* 渲染找到幾筆資料 */
const restaurantCount = document.querySelector(".restaurantCount");
function renderRestaurantsCount(data) {
    let str = "";
    str += `<span>為您找到共 ${data.length} 筆</span>`
    restaurantCount.innerHTML = str;
}

/* 渲染篩選完的餐廳資料 */
const allList = document.querySelector(".allList");
function renderFilterRestaurant(data) {
    let str = "";
    data.forEach(function (item) {
        /* console.log(item) */
        /* 渲染星星數量 */
        let rating = "";
        /* 計算實心的星星數量 */
        const solidStars = Math.floor(item.Stars);
        for (let i = 0; i < solidStars; i++) {
            rating += `<a href="#" class="stars"><i class="fa-solid fa-star fs-5" style="color: #f5cd05;"></i></a>`;
        }
        /* 檢查有沒有半顆星 */
        if (item.Stars % 1 !== 0) {
            rating += `<a href="#" class="stars"><i class="fa-solid fa-star-half-alt fs-5" style="color: #f5cd05;"></i></a>`;
        }
        /* 創建空的星星 */
        for (let i = 0; i < (5 - solidStars - 1); i++) {
            rating += `<a href="#" class="stars"><i class="fa-regular fa-star fs-5" style="color: #f5cd05;"></i></a>`;
        }

        str += `<li class="restaurantItem">
                    <img src="${item.Picture[0]}" alt="">
                    <!-- 餐廳資訊 -->
                    <div class="restaurantContent">
                        <div class="d-flex align-items-center mb-2">
                            <a href="#" class="restaurantName me-2">${item.Name}</a>
                            <div class="rating">
                                ${rating}
                            </div>
                        </div>
                        <div class="info mb-2">
                            <p class="opentime mb-0">營業時間： <span class="opentimeInfo mb-0">${item.Opentime}</span></p>
                            <p class="averagePrice mb-0">均消： <span class="averagePriceInfo">${item.Price}</span></p>
                        </div>
                        <p class="address">地址： <span class="addressInfo">${item.Add}</span></p>
                        <div class="tagsList">
                            <a href="#">居酒屋</a>
                            <a href="#">有帥哥</a>
                            <a href="#">有wifi</a>
                            <a href="#">啤酒</a>
                            <a href="#">烤串</a>
                        </div>
                    </div>
                    <!-- 收藏 -->
                    <a href="#" class="collect fs-8 px-6 pt-2"><i class="fa-regular fa-bookmark" style="color: #6B5A52"></i></a>
                </li>`
    })
    allList.innerHTML = str;
}
/* 餐廳列表排序 */
const formSelect = document.querySelector(".form-select")

formSelect.addEventListener("change", function (e) {
    applySortAndFilter();

    // renderFilterRestaurant(filteredRestaurants)
})



function applySortAndFilter() {
    let sortedAndFilteredRestaurants = [...filteredRestaurants];//創建副本避免影響原始數據
    /* 排序 */
    if (formSelect.value === "評價由高到低") {
        sortedAndFilteredRestaurants.sort(function (a, b) {
            return b.Stars - a.Stars;
        });
    } else if (formSelect.value === "評價由低到高") {
        sortedAndFilteredRestaurants.sort(function (a, b) {
            return a.Stars - b.Stars;
        });
    } else if (formSelect.value === "價錢由高到低") {
        sortedAndFilteredRestaurants.sort(function (a, b) {
            return b.Price - a.Price;
        });
    } else if (formSelect.value === "價錢由低到高") {
        sortedAndFilteredRestaurants.sort(function (a, b) {
            return a.Price - b.Price;
        });
    }
    /* 價格篩選 */
    const filteredByPrice = sortedAndFilteredRestaurants.filter(function (restaurant) {
        return restaurant.Price >= slider.value;
    })
    renderFilterRestaurant(filteredByPrice)
    renderRestaurantsCount(filteredByPrice)
}

