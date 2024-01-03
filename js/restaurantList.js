/* 初始化 */
function init() {
    getAllRestaurants();
}
init()

/* 取得所有餐廳資料 */
let allRestaurants;
function getAllRestaurants() {
    axios.get("http://localhost:3000/restaurants")
        .then(function (response) {
            allRestaurants = response.data;
            renderRestaurantCounts(allRestaurants);
            renderRestaurantList(allRestaurants, 1)
        })
        .catch(function (error) {
            console.error("獲取數據時出錯:", error);
        })
}

/* 渲染餐廳資料到列表 */
const allList = document.querySelector(".allList");
/* 分頁 */
const pageid = document.getElementById("pageid");
function renderRestaurantList(data, nowPage) {
    /* 資料筆數 */
    const dataTotal = data.length;
    // 要顯示在畫面上的資料數量，每頁10筆資料
    const perpage = 10;
    // 總頁數(無條件進位)
    const pageTotal = Math.ceil(dataTotal / perpage);
    // 當前頁數
    let currentPage = nowPage;
    if (currentPage > pageTotal) {
        currentPage = pageTotal;
    }
    const minData = (currentPage * perpage) - perpage + 1;
    const maxData = (currentPage * perpage);

    const newData = [];
    data.forEach(function (item, index) {
        const num = index + 1;
        if (num >= minData && num <= maxData) {
            newData.push(item);
        }
    })
    const page = {
        pageTotal,
        currentPage,
        hasPage: currentPage > 1,
        hasNext: currentPage < pageTotal,
    }
    displayData(newData);
    pageBtn(page);
}

function displayData(data) {
    let str = "";
    data.forEach(function (item) {
        /* 餐廳標籤 */
        let restaurantTags = "";
        // 每個餐廳顯示五個標籤
        if (item.Tags.length <= 5) {
            for (let i = 0; i < item.Tags.length; i++) {
                restaurantTags += `<a href="#">${item.Tags[i]}</a>`;
            }
        } else {
            for (let i = 0; i < 5; i++) {
                restaurantTags += `<a href="#">${item.Tags[i]}</a>`;
            }
        }
        /* 餐廳星星數 */
        let rating = "";
        // 計算實心星星數量
        const solidStars = Math.floor(item.Stars);
        for (let i = 0; i < solidStars; i++) {
            rating += `<a href="#" class="stars"><i class="fa-solid fa-star fs-5" style="color: #f5cd05;"></i></a>`;
        }
        // 檢查有沒有半顆星
        if (item.Stars % 1 !== 0) {
            rating += `<a href="#" class="stars"><i class="fa-solid fa-star-half-alt fs-5" style="color: #f5cd05;"></i></a>`;
        } else {
            rating += `<a href="#" class="stars"><i class="fa-regular fa-star fs-5" style="color: #f5cd05;"></i></a>`;
        }
        // 創建空的星星
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
                            ${restaurantTags}
                        </div>
                    </div>
                    <!-- 收藏 -->
                    <a href="#" class="collect fs-8 px-6 pt-2"><i class="fa-regular fa-bookmark" style="color: #6B5A52"></i></a>
                </li>`
    })
    allList.innerHTML = str;
}
function pageBtn(page) {
    let str = "";
    const total = page.pageTotal;
    if (page.hasPage) {
        str += `<li class="page-item"><a class="page-link" href="#" data-page="${Number(page.currentPage) - 1}">上一頁</a></li>`

    } else {
        str += `<li class="page-item disabled"><span class="page-link">上一頁</span></li>`;
    }
    for (let i = 1; i <= total; i++) {
        if (Number(page.currentPage) === i) {
            str += `<li class="page-item active"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
        } else {
            str += `<li class="page-item"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
        }
    }
    if (page.hasNext) {
        str += `<li class="page-item"><a class="page-link" href="#" data-page="${Number(page.currentPage) + 1}">下一頁</a></li>`;
    } else {
        str += `<li class="page-item disabled"><span class="page-link">下一頁</span></li>`;
    }
    pageid.innerHTML = str;
}

function switchPage(e) {
    e.preventDefault();
    if (e.target.nodeName !== "A") {
        return;
    }
    const page = e.target.dataset.page;
    const currentData = filteredByKeyword || filteredByLocation || allRestaurants;

    renderRestaurantList(currentData, page);
}
pageid.addEventListener("click", switchPage)

/* 渲染餐廳資料筆數 */
const restaurantCounts = document.querySelector(".restaurantCount");
function renderRestaurantCounts(data) {
    let str = "";
    str += `<span>為您找到共 ${data.length} 筆</span>`;
    restaurantCounts.innerHTML = str;
}

/* 點擊標籤搜尋相關餐廳 */
const weeklyTopTag = document.querySelector(".weeklyTopTag");
const selectTags = document.querySelector(".selectTags");
const searchingTags = document.querySelector(".searchingTags");
const keywordInput = document.querySelector(".keyword");
const placeInput = document.querySelector(".place");
const searchBtn = document.querySelector(".searchBtn");
let addTags = [];
let addPlace;
let filteredByKeyword;
let filteredByLocation;

weeklyTopTag.addEventListener("click", addSelectTags);
selectTags.addEventListener("click", addSelectTags);
function addSelectTags(e) {
    e.preventDefault();
    if (e.target.tagName === "A") {
        const clickedTag = e.target.textContent;
        // 檢查addTags裡面是否有相同的標籤
        if (!addTags.includes(clickedTag)) {
            addTags.push(clickedTag);
            renderSelectTags(addTags);
        }
    }
    if (addPlace !== null && addPlace !== undefined) {
        renderSelectTags(addTags, addPlace);
        filteredByKeyword = allRestaurants.filter(function (restaurant) {
            return addTags.every(tag => restaurant.Tags.includes(tag));
        })
        console.log(filteredByKeyword)
        filteredByLocation = filteredByKeyword.filter(function (restaurant) {
            return (restaurant.Add.includes(addPlace))
        })
        console.log(filteredByLocation)
        renderRestaurantList(filteredByLocation, 1);
        renderRestaurantCounts(filteredByLocation);
    } else {
        renderSelectTags(addTags);
        filteredByKeyword = allRestaurants.filter(function (restaurant) {
            return addTags.every(tag => restaurant.Tags.includes(tag));
        })
        renderRestaurantList(filteredByKeyword, 1);
        renderRestaurantCounts(filteredByKeyword);
    }
}
searchBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const keyword = keywordInput.value.trim();
    if (keyword !== "") {
        if (!addTags.includes(keyword)) {
            addTags.push(keyword);
            renderSelectTags(addTags);
        }
        filteredByKeyword = allRestaurants.filter(function (restaurant) {
            return addTags.every(tag => restaurant.Tags.includes(tag));
        })
        filteredByLocation = filteredByKeyword.filter(function (restaurant) {
            return (restaurant.Add.includes(placeInput.value))
        })
        renderRestaurantList(filteredByLocation, 1);
        renderRestaurantCounts(filteredByLocation);
        keywordInput.value = "";
    } else {
        filteredByKeyword = allRestaurants.filter(function (restaurant) {
            return addTags.every(tag => restaurant.Tags.includes(tag));
        })
        filteredByLocation = filteredByKeyword.filter(function (restaurant) {
            return (restaurant.Add.includes(placeInput.value))
        })
        renderRestaurantList(filteredByLocation, 1);
        renderRestaurantCounts(filteredByLocation);

    }
    if (placeInput.value !== "") {
        addPlace = placeInput.value;
        renderSelectTags(addTags, addPlace);
        placeInput.value = "";
    } else {
        addPlace = addPlace;
        renderSelectTags(addTags, addPlace);
        placeInput.value = "";
    }

})
/* 渲染選取的標籤 */
function renderSelectTags(tag, place) {
    let str = "";
    str += `<span class="me-2">正在搜尋：</span>`;
    if (place !== null && place !== undefined) {
        str += `<a href="#">${place}<i class="fa-solid fa-x fa-sm ms-2" data-value="${place}" data-name="location"></i></a>`
    }
    tag.forEach(function (item) {
        str += `<a href="#">${item}<i class="fa-solid fa-x fa-sm ms-2" data-value="${item}"></i></a>`;
    })
    str += `<a href="#" class="clearAllTag btn-primary-300">全部清除</a>`;
    searchingTags.innerHTML = str;
}

/* 刪除正在搜尋單筆標籤 */
searchingTags.addEventListener("click", function (e) {
    e.preventDefault();
    if (e.target.tagName === "I") {
        if (e.target.dataset.name === "location") {
            addPlace = null;
            renderSelectTags(addTags, addPlace);
            renderRestaurantList(filteredByKeyword, 1);
            renderRestaurantCounts(filteredByKeyword);
        } else {
            const removedTag = e.target.dataset.value;
            /* 找要刪除的標籤在 addTags裡面的索引 */
            const index = addTags.indexOf(removedTag);
            addTags.splice(index, 1);
            renderSelectTags(addTags, addPlace);
            if (addPlace !== null && addPlace !== undefined) {
                renderSelectTags(addTags, addPlace);
                filteredByKeyword = allRestaurants.filter(function (restaurant) {
                    return addTags.every(tag => restaurant.Tags.includes(tag));
                })
                filteredByLocation = filteredByKeyword.filter(function (restaurant) {
                    return (restaurant.Add.includes(addPlace))
                })
                renderRestaurantList(filteredByLocation, 1);
                renderRestaurantCounts(filteredByLocation);
            } else {
                renderSelectTags(addTags);
                filteredByKeyword = allRestaurants.filter(function (restaurant) {
                    return addTags.every(tag => restaurant.Tags.includes(tag));
                })
                renderRestaurantList(filteredByKeyword, 1);
                renderRestaurantCounts(filteredByKeyword);
            }
        }
    }
})
/* 刪除正在搜尋全部標籤 */
searchingTags.addEventListener("click", function (e) {
    e.preventDefault();
    if (e.target.classList[0] === "clearAllTag") {
        addTags = [];
        addPlace = null;
        renderSelectTags(addTags, addPlace);
        filteredByKeyword = allRestaurants.filter(function (restaurant) {
            return addTags.every(tag => restaurant.Tags.includes(tag));
        })
        renderRestaurantList(filteredByKeyword, 1);
        renderRestaurantCounts(filteredByKeyword);
    }
})

/* 金額滑動條 */
let slider = document.querySelector(".slider");
let priceRange = document.querySelector(".priceRange");
priceRange.innerHTML = `${slider.value} 元`;
slider.oninput = function () {
    priceRange.innerHTML = `${this.value} 元`;
}
/* 星星數篩選 */
const stars = document.querySelectorAll(".stars i");
let selectedStars = 0;
stars.forEach(function (item) {
    item.addEventListener("click", function (e) {
        e.preventDefault();
        item.classList.toggle(`fa-solid`);
        selectedStars = Array.from(stars).filter(item => item.classList.contains("fa-solid")).length;
    })
});

/* 排序 */
const formSelect = document.querySelector(".form-select");

formSelect.addEventListener("change", function (e) {
    const currentData = filteredByLocation || filteredByKeyword || allRestaurants;
    if (formSelect.value === "評價由高到低") {
        currentData.sort(function (a, b) {
            return b.Stars - a.Stars;
        });
    } else if (formSelect.value === "評價由低到高") {
        currentData.sort(function (a, b) {
            return a.Stars - b.Stars;
        });
    } else if (formSelect.value === "價錢由高到低") {
        currentData.sort(function (a, b) {
            return b.Price - a.Price;
        });
    } else if (formSelect.value === "價錢由低到高") {
        currentData.sort(function (a, b) {
            return a.Price - b.Price;
        });
    }
    renderRestaurantList(currentData, 1);
    renderRestaurantCounts(currentData);
})
