// json-server-auth db.json

//已登入會員nav-bar
const user = document.getElementById('user');
const userBar = document.getElementById('userBar');

user.addEventListener('click', e => {
    userBar.classList.toggle('d-none')
})

const url = `http://localhost:3000`;
let postData = [];
let favoriteId = [];

function init() {
    //頁面帶入user資訊
    //menu登入後帶入user名稱
    const userName = document.querySelectorAll('.userName');
    userStr = localStorage.getItem('user'); //取出localStorage的值(string)
    userObj = JSON.parse(userStr); // string轉換成物件

    const userEmail = document.querySelector('.userEmail');
    userEmail.textContent = userObj.email;
    //因網頁有多個.userName，要用forEach渲染textContent
    userName.forEach(item => {
        item.textContent = userObj.userName;
    });
    editNameBtnFn()

    //get貼文資料
    axios.get(`${url}/posts?userId=${userObj.id}`)
        .then(function (res) {
            postData = res.data
            renderPost();
        })
        .catch(function (error) {
            console.log(error);
        })

    //get收藏資料
    //先取得user資料
    axios.get(`${url}/users/${userObj.id}`)
        .then(function (res) {
            console.log(res.data.collection);
            res.data.collection.forEach(item => {
                favoriteId.push(item)
                console.log(favoriteId);
            });
            getFavoriteRestaurants(favoriteId);
        })
        .catch(function (error) {
            console.log(error);
        })
};
init();


//再取得收藏的餐廳名字＋圖片
function getFavoriteRestaurants(favoriteId) {
    const favoriteItem = [];

    // 使用 map 產生一組 promises，然後使用 Promise.all 等待它們全部完成
    const promises = favoriteId.map(item => {
        return axios.get(`${url}/restaurants?id=${item}`)
            .then(function (res) {
                let list = {};
                list.name = res.data[0].Name;
                list.picture = res.data[0].Picture[0];
                list.id = res.data[0].id;
                favoriteItem.push(list);
                console.log(promises);
            })
            .catch(function (error) {
                console.log(error);
            });
    });
    // 使用 Promise.all 來等待所有 promises 完成
    Promise.all(promises)
        .then(() => {
            renderFavorites(favoriteItem);
        });
}


//渲染收藏餐廳清單
const collectContainer = document.querySelector('.collect-container');
const collectNum = document.getElementById('collectNum')

function renderFavorites(favoriteItem) {
    let str = "";
    let collectNums = favoriteItem.length; //顯示幾個收藏

    favoriteItem.forEach(function (item) {
        str += `<div class="col-lg-3 position-relative collection">
            <a href="#" class="d-block h-100 collction">
            <img class="img-fluid h-100 cover-size rounded-1 " src="${item.picture}", alt="resturant-photo">
            <a class="collect-icon h3"><i class="fa-solid fa-bookmark bookmark" id="collectCancelBtn" data-id="${item.id}"></i></a>
            <span class="position-absolute top-50 start-50 translate-middle text-center"><a href="#" class="text-decoration-none fw-bold fs-5 collecton-text">${item.name}</a></span>
            </a>
            </div>`
    });
    collectContainer.innerHTML = str;
    collectNum.innerHTML = collectNums;
    // mouseover() 滑鼠效果
}

//渲染貼文內容
const postsContainer = document.querySelector('.posts-container');
const postNum = document.getElementById('postNum');

function renderPost() {
    let str = "";
    let postNums = postData.length;

    postData.forEach(item => {
        let starShow = "";
        let starTemplate = `<i class="fa-solid fa-star" style="color: #f5cd05;"></i>`;
        for (let i = 0; i < item.starNum; i++) {
            starShow += starTemplate
        };

        str += `<div class="row justify-content-center align-items-center mb-15">
        <div class="col-lg-3 comment-user-photo me-10"></div>
        <div class="col-lg-9 d-flex flex-column">
            <div class="d-flex justify-content-between">
                <div class="d-flex align-items-center mb-5">
                    <div class="me-5">
                    ${starShow}
                        </div>
                    <div class="fs-5">${item.resturantName}</div>
                </div>
                <div>
                    <a href="#" class="link-grey-400"><i class="fa-solid fa-pen me-3"></i></a>
                    <a href="#" class="link-grey-400"><i class="fa-solid fa-x" id="deleteBtn" data-id = "${item.id}"></i></a>
                </div>
            </div>
            <p>${item.commentText}</p>
            <div>
                <img class="img-fluid comment-photo" src="../assets/images/memberPage/comment-photo.jpeg" alt="comment-photo">
                <img class="img-fluid comment-photo" src="../assets/images/memberPage/comment-photo2.jpeg" alt="comment-photo">
            </div>
            <p class="text-end text-grey-300">${item.date}</p>
        </div>
    </div>`
    });
    postsContainer.innerHTML = str;
    postNum.innerHTML = postNums;
};

//刪除貼文
    postsContainer.addEventListener('click',e=>{
        e.preventDefault();
        const idName = e.target.getAttribute('id');
        if(idName !== "deleteBtn"){
            return
        }
        const postId = e.target.getAttribute('data-id');
        Swal.fire({  //alert套件
            title: "確定要刪除評論嗎？",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "確定"
          }).then((result) => {
            if (result.isConfirmed) {
              deletePost(postId);
            };
          });

})

function deletePost(id) {
    axios.delete(`${url}/posts/${id}`)
        .then(function (res) {
            console.log(res.data);
        })
        .catch(function (error) {
            console.log(error);
        })
}

//取消收藏
collectContainer.addEventListener('click', e => {
    e.preventDefault();
    if (e.target.getAttribute('id') !== "collectCancelBtn") {
        return
    } else {
        let restaurantId = e.target.getAttribute('data-id');

        let otherRestaurantId = favoriteId.filter((item) => {
            return item != restaurantId
        });

        axios.patch(`${url}/users/${userObj.id}`,
            { "collection": otherRestaurantId })

            .then(function (res) {
                console.log(res.data);
                getFavoriteRestaurants(otherRestaurantId)
            })
            .catch(function (error) {
                console.log(error);
            })

    }
})


//編輯個人頁面跳窗
//編輯名稱
function editNameBtnFn() {
    const editNameContainer = document.querySelector('.edit-name-container');
    const editNameBtn = document.querySelector('.edit-name-btn');

    editNameBtn.addEventListener('click', e => {
        e.preventDefault();
        editNameContainer.innerHTML =
            `<div class="d-flex align-items-center">
                <span class="text-grey-500 fw-bold me-5 ">名稱：</span>
                <input type="text" class="border-0 border-bottom" placeholder="請輸入">
            </div>
            <div class="d-flex align-items-center">
                <button type="button" class="btn btn-primary-300 text-decoration-none me-5">確定</button>
                <a href="#" class="edit-name-cancel text-decoration-none link-grey-300">取消</a>
            </div>`
        editNameCancelFn();
    });
}

function editNameCancelFn() {
    const editNameContainer = document.querySelector('.edit-name-container');
    const editNameCancel = document.querySelector('.edit-name-cancel')
    editNameCancel.addEventListener('click', e => {
        e.preventDefault();
        editNameContainer.innerHTML = `<div>
        <span class="text-grey-500 fw-bold me-5 ">名稱：</span>
        <span class="userName text-primary-400 fs-5"></span>
    </div>
    <a href="#" class="edit-name-btn text-decoration-none link-grey-300 text-end">編輯</a>`
    });
    init();
}
