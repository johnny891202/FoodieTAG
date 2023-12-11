// json-server-auth db.json
//已登入會員nav-bar
const user = document.getElementById('user');
const userBar = document.getElementById('userBar');

user.addEventListener('click',e=>{
    userBar.classList.toggle('d-none')
})

const url =  `http://localhost:3000`;
let postData = [];

function init(){
    //頁面帶入user資訊
    //menu登入後帶入user名稱
    const userName = document.querySelectorAll('.userName');
    userStr = localStorage.getItem('user'); //取出localStorage的值(string)
    userObj = JSON.parse(userStr); // string轉換成物件

    const userEmail = document.querySelector('.userEmail');
    userEmail.textContent = userObj.email;

    //因網頁有多個.userName，要用forEach渲染textContent
    userName.forEach(item => {
        item.textContent = userObj.username;
    });
    editNameBtnFn()

    //get貼文資料
    axios.get(`${url}/posts?userId=${userObj.id}`)
    .then(function(res){
        postData = res.data
        console.log([postData]);
        renderPost();
    })
    .catch(function(error){
        console.log(error);
    })

    //get收藏資料
    //先取得user資料
    let favoriteId=[];
    axios.get(`${url}/users/${userObj.id}`)
    .then(function(res){
        console.log(res.data.restaurant.Name);
        res.data.favorites.forEach(item=>{
            favoriteId.push(item)
        });
        getFavoriteRestaurants(favoriteId);
    })
    .catch(function(error){
        console.log(error);
    })
};
init();

//用?_expand取得餐廳資料（但只能取一間）
// axios.get(`${url}/users/${userObj.id}?_expand=restaurant`)
// .then(function(res){
//     console.log(res.data.restaurant.Name);
// })
// .catch(function(error){
//     console.log(error);
// })


//再取得收藏的餐廳名字＋圖片
function getFavoriteRestaurants(favoriteId){
    const favoriteItem =[];

    favoriteId.forEach(item=>{
        axios.get(`${url}/resturants?id=${item}`)
        .then(function(res){
            let list = {};
            list.name = res.data[0].Name;
            list.picture = res.data[0].Picture[0];
            favoriteItem.push(list)
        })
    });
    renderFavorites(favoriteItem);

    }


//渲染收藏餐廳清單
const collectContainer = document.querySelector('.collect-container');

function renderFavorites(favoriteItem){
    console.log(favoriteItem);
    let str ="";
    favoriteItem.forEach(function(item){
        str+=`<div class="col-lg-3 position-relative">
            <img class="img-fluid h-100 cover-size rounded-1 " src="${item[0].picture}", alt="resturant-photo">
            <a class="collect-icon h3 link-primary-400"><i class="fa-solid fa-bookmark"></i></a>
            </div>`

    });
    collectContainer.innerHTML = str
}



//渲染貼文內容
const postsContainer = document.querySelector('.posts-container');

function renderPost(){
    let str ="";
    postData.forEach(item=>{
        let starShow = "";
        let starTemplate = `<i class="fa-solid fa-star" style="color: #f5cd05;"></i>`;
        for(let i = 0 ; i< item.starNum ; i++){
            starShow += starTemplate
        };

        str +=`<div class="row justify-content-center align-items-center mb-15">
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
};

//刪除貼文
    postsContainer.addEventListener('click',e=>{
        e.preventDefault();
        const idName = e.target.getAttribute('id');
        if(idName !== "deleteBtn"){
            return
        }
        const postId = e.target.getAttribute('data-id');
        deletePost(postId);
    })

function deletePost(id){
    axios.delete(`${url}/posts/${id}`)
    .then(function(res){
        console.log(res.data);
        renderPost();
    })
    .catch(function(error){
        console.log(error);
    })
}

//編輯個人頁面跳窗
//編輯名稱
function editNameBtnFn(){
    const editNameContainer = document.querySelector('.edit-name-container');
    const editNameBtn = document.querySelector('.edit-name-btn');

    editNameBtn.addEventListener('click',e=>{
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

function editNameCancelFn(){
    const editNameContainer = document.querySelector('.edit-name-container');
    const editNameCancel = document.querySelector('.edit-name-cancel')
    editNameCancel.addEventListener('click',e=>{
        editNameContainer.innerHTML = `<div>
        <span class="text-grey-500 fw-bold me-5 ">名稱：</span>
        <span class="userName text-primary-400 fs-5"></span>
    </div>
    <a href="#" class="edit-name-btn text-decoration-none link-grey-300 text-end">編輯</a>`
    });
    init();
}
