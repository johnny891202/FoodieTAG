// json-server-auth db.json
//已登入會員nav-bar
const user = document.getElementById('user');
const userBar = document.getElementById('userBar');

user.addEventListener('click', e => {
    userBar.classList.toggle('d-none')
})


const url = `http://localhost:3000`;
const token = localStorage.getItem('token');
userStr = localStorage.getItem('user'); //取出localStorage的值(string)
userObj = JSON.parse(userStr); // string轉換成物件

let postData = [];
let favoriteId = [];
let userData={};

function init() {
    //get貼文資料
    axios.get(`${url}/comments?userId=${userObj.id}`)
        .then(function (res) {
            postData = res.data
            renderPost();
        })
        .catch(function (error) {
            console.log(error);
        })
    //先取得user資料
    axios.get(`${url}/users/${userObj.id}`)
        .then(function (res) {
            if(res.data.collection.length === 0){
                renderFavorites(0);
            }else{
                res.data.collection.forEach(item => {
                    favoriteId.push(item)
                });
            }
            getFavoriteRestaurants(favoriteId);
            userData = res.data;
            getUserData(userData);
        })
        .catch(function (error) {
            console.log(error);
        });
};
init();

//頁面帶入user資訊
function getUserData(userData){
    const userName = document.querySelectorAll('.userName');
    //因網頁有多個.userName，要用forEach渲染textContent
    userName.forEach(item => {
        item.textContent = userData.userName;
    });
    const avatarContainer = document.querySelectorAll('.avatar-container');
    avatarContainer.forEach(item=>{
        item.innerHTML = `<img src="${userData.avatar}" alt="avatar" class="avatar">`

    const titleContainer = document.querySelector('.title-container ');
    titleContainer.textContent = userData.title;
    });

    //渲染編輯個人資訊跳窗
    const editContainer = document.getElementById('editContainer');

    let fb = "";
    let valueFb = "";
    valueFb = userData.fbUrl;
    if(valueFb === undefined){
        fb = "未設定";
        valueFb = "";
    };
    let ig = "";
    let valueIg = "";
    valueIg = userData.igUrl;
    if(valueIg === undefined){
        ig = "未設定";
        valueIg = ""
    }
    editContainer.innerHTML = `
    <form>
    <div class="row d-flex mx-30 mb-5">
    <span class="text-grey-500 fw-bold me-5 col-2">名稱：</span>
    <input type="text" value="${userData.userName}" class="userName text-primary-400 fs-4 border-0 border-bottom input-set col-6" id="editName">
    </div>
    <div class="row d-flex mx-30 mb-5">
    <span class="col-2 text-grey-500 fw-bold me-5 ">Email：</span>
    <input type="text" value="${userData.email}" class="col-6 userEmail text-primary-400 fs-4 border-0 border-bottom input-set" id="editEmail">
    </div>
    <div class="row d-flex mx-30 mb-5">
    <span class="col-2 text-grey-500 fw-bold me-5 ">Facebook：</span>
    <input type="text" placeholder="${fb}" value="${valueFb}" class="col-6 text-primary-400 border-0 border-bottom input-set" id="editUserfb">
    </div>
    <div class="row d-flex mx-30 mb-5">
    <span class="col-2 text-grey-500 fw-bold me-5 ">Instagram：</span>
    <input type="text" placeholder="${ig}" value="${valueIg}" class="col-6 text-primary-400 border-0 border-bottom input-set" id="editUserig">
    </div>
    <div class="row d-flex mx-30 mb-5">
    <button type="button" class="btn btn-primary-400 w-25">修改密碼</button>
    </div>
    <div class="d-flex flex=column justify-content-end">
    <button type="submit" class="btn btn-primary-400 text-white fw-bold fs-4 me-4" id="saveBtn">保存</button>
    <button type="button" class="btn btn-grey-200 text-grey-400 fw-bold fs-4" data-bs-dismiss="modal">取消</button>
    </div>
    </form>`

    //社群連結
    const socialContainer = document.getElementById('social-container');
    socialContainer.innerHTML = `<div>
        <a href="${ig} " class="mt-18 fs-5 link-primary-400 d-flex align-items-center">
        <i class="fa-brands fa-instagram me-3 h3"></i>
        <span class="border-end pe-25">Instagram</span>
        </a>
        </div>
        <div>
        <a href="${fb}" class="mt-18 fs-5 link-primary-400 d-flex align-items-center ms-25">
        <i class="fa-brands fa-facebook me-3 h3"></i>
        <span class=" pe-25">Facebook</span>
        </a>
        </div>`
}

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
    let str ="";
    let collectNums = "";
    if(favoriteItem === 0){
        str = "<div>還沒有任何收藏</div>"
    }else{
        collectNums = favoriteItem.length; //顯示幾個收藏
        favoriteItem.forEach(function (item) {
            str += `<div class="col-lg-3 position-relative collection">
                <a href="#" class="d-block h-100 collction">
                <img class="img-fluid h-100 cover-size rounded-1 " src="${item.picture}", alt="resturant-photo">
                <a class="collect-icon h3"><i class="fa-solid fa-bookmark bookmark" id="collectCancelBtn" data-id="${item.id}"></i></a>
                <span class="position-absolute top-50 start-50 translate-middle text-center"><a href="#" class="text-decoration-none fw-bold fs-5 collecton-text">${item.name}</a></span>
                </a>
                </div>`
        });
    };
    collectContainer.innerHTML = str;
    collectNum.innerHTML = collectNums;
}

//渲染貼文內容
const postsContainer = document.querySelector('.posts-container');
const postNum = document.getElementById('postNum');

function renderPost() {
    let str = "";
    let postNums = postData.length;
    if(postData.length === 0){
        str = `還沒有任何評論，寫下你的第一則評論，獲取積分！`
    }

    postData.forEach(item => {
        let starShow = "";
        let starTemplate = `<i class="fa-solid fa-star" style="color: #f5cd05;"></i>`;
        for (let i = 0; i < item.starNum; i++) {
            starShow += starTemplate
        };
        str += `<div class="d-flex justify-content-center align-items-center mb-15 w-75">
        <div class="col-lg-3"><img class="comment-avatar" src="${userObj.avatar}" alt="avatar"></div>
        <div class="col-lg-9 d-flex flex-column">
            <div class="d-flex justify-content-between">
                <div class="d-flex align-items-center mb-5">
                    <div class="me-5">
                    ${starShow}
                        </div>
                    <div class="fs-4"><a href="detailPage_login.html/?=q${item.resturantName}" class="text-decoration-none link-primary-400 fw-bold fs-5">${item.resturantName}</a></div>
                </div>
                <div>
                    <a href="#" class="link-grey-400" data-bs-toggle="modal" data-bs-target="#myComment" id="pen" restaurant-id="${item.restaurantId}" data-id="${item.id}"><i class="fa-solid fa-pen me-3" id="pen" restaurant-id="${item.restaurantId}" data-id="${item.id}"></i></a>
                    <a href="#" class="link-grey-400"><i class="fa-solid fa-x" id="deleteBtn" data-id = "${item.id}" ></i></a>
                </div>
            </div>
            <p class="fs-4">${item.commentText}</p>
            <p class="text-end text-grey-300 fs-3">${item.date}</p>
        </div>
    </div>`
    });
    postsContainer.innerHTML = str;
    postNum.innerHTML = postNums;
};

//評論假圖片
/* <div>
<img class="img-fluid comment-photo" src="../assets/images/memberPage/comment-photo.jpeg" alt="comment-photo">
<img class="img-fluid comment-photo" src="../assets/images/memberPage/comment-photo2.jpeg" alt="comment-photo">
</div> */

//編輯貼文按鈕
const myComment = document.getElementById('myComment');
let postId ="";
postsContainer.addEventListener('click',e=>{
    e.preventDefault();
    if(e.target.getAttribute('id') !== "pen"){
        return
    }else{
        let id = e.target.getAttribute('restaurant-id');
        getEditComment(id);
        postId = e.target.getAttribute('data-id');
    }
});

//取得貼文
function getEditComment(id){
    let str = "";
    // let starIcon = `<a href="#" class="stars"><i class="fa-solid fa-star fs-5" id="starIcon" style="color: #f5cd05;" num-id="1"></i></a>`;
    // let starIconRegular =  `<a href="#" class="stars"><i class="fa-regular fa-star fs-5" id="starIcon" style="color: #f5cd05;" num-id="1"></i></a>`;
    let index = "";
    postData.forEach((item,i)=>{
        console.log(postData);
        if(item.restaurantId != id){
            return
        }else if(item.restaurantId == id){
            index = i;
            str=`<div class="modal-dialog modal-lg">
            <div class="modal-content row">
              <div class="modal-header border-0 mt-10 mb-3 col-lg-8 mx-auto">
                <h4 class="modal-title" id="myCommentLabel"></h4>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body col-lg-9 d-flex flex-column mx-auto">
                <div class="d-flex align-items-center mx-10 border-bottom mb-6 pb-3 justify-content-evenly">
                  <div class="d-flex flex-column align-items-center me-10">
                    <div class="avatar-container mb-3 "><img src="${userObj.avatar}" alt="avatar" class="avatar"></div>
                    <p class="mb-0 userName">${userObj.userName}</p>
                  </div>
                  <div>
                    <p class="mb-3 fs-5 fw-bold">整體評分</p>
                    <div class="d-flex align-items-center mb-3">
                      <div class="me-5 star-container">
                      <a href="#" class="stars"><i class="fa-regular fa-star fs-5" id="starIcon" style="color: #f5cd05;" num-id="1"></i></a>
                      <a href="#" class="stars"><i class="fa-regular fa-star fs-5" id="starIcon" style="color: #f5cd05;" num-id="2"></i></a>
                      <a href="#" class="stars"><i class="fa-regular fa-star fs-5" id="starIcon" style="color: #f5cd05;" num-id="3"></i></a>
                      <a href="#" class="stars"><i class="fa-regular fa-star fs-5" id="starIcon" style="color: #f5cd05;" num-id="4"></i></a>
                      <a href="#" class="stars"><i class="fa-regular fa-star fs-5" id="starIcon" style="color: #f5cd05;" num-id="5"></i></a>
                        </div>
                    </div>
                  </div>
                </div>
                <textarea name="myComments" id="myComments" value="${item.commentText}" rows="3" class="border-primary-300 p-3 rounded fs-3 mx-10" style="resize:none">${item.commentText}</textarea>
              </div>
              <div class="modal-footer col-lg-8 border-0 mb-10 d-flex mx-auto">
                <button type="button" class="editCommentBtn btn shadow-sm btn-primary-400 text-white px-3 py-1 fs-3 me-2 fw-bold">修改</button>
                <button type="button" class="btn shadow-sm btn-grey-200 text-grey-400 px-3 py-1 fs-3 fw-bold " data-bs-dismiss="modal">取消</button>
              </div>
            </div>
          </div> `
        }
        renderEditComment(str,index);
    })
}

//渲染指定貼文
function renderEditComment(str,index){
    myComment.innerHTML = str;
    renderStar(index);
}

//渲染我的評論星星數
function renderStar(index){
    const stars = document.querySelectorAll('.stars i');

    for(i= 1 ; i<=5 ; i++){
        stars.forEach(item=>{
            //當num-id的值等於e.target的num-id
            if(item.getAttribute('num-id') == i){
                item.classList.add(`fa-solid`);
            }//當num-id的值小於e.target的num-id
            if (item.getAttribute('num-id')<= postData[index].starNum){
                item.classList.add(`fa-solid`);
                //當num-id的值大於e.target的num-id
            }else{
                item.classList.remove(`fa-solid`)
            }
        })
    };
    editComment();
    goEditComment(index);
}


//編輯星星
let sheetData ={}; //存放表單資料

function editComment(){
    const stars = document.querySelectorAll('.stars i');
    const starContainer = document.querySelector('.star-container');

    starContainer.addEventListener('click',e=>{
        e.preventDefault();
        if (e.target.getAttribute('id') !== "starIcon"){
            return
        }else{
            sheetData.starNum = e.target.getAttribute('num-id');
            for(i= 1 ; i<=5 ; i++){
                stars.forEach(item=>{
                    //當num-id的值等於e.target的num-id
                    if(item.getAttribute('num-id') == i){
                        item.classList.add(`fa-solid`);
                    }//當num-id的值小於e.target的num-id
                    if (item.getAttribute('num-id')<=sheetData.starNum){
                        item.classList.add(`fa-solid`);
                        //當num-id的值大於e.target的num-id
                    }else{
                        item.classList.remove(`fa-solid`)
                    }
                })
            }
        };
    })
};

//監聽修改按鈕
function goEditComment(index){
    const editCommentBtn = document.querySelector('.editCommentBtn');
    const myComments = document.getElementById('myComments');

    editCommentBtn.addEventListener('click',e=>{
        let editData = {};
        if(sheetData.starNum === undefined){
            editData.star = postData[index].starNum
        }else{
            editData.star = sheetData.starNum;
        }
        editData.text = myComments.value;
        patchComment(editData);
    })
};

function patchComment(data){
    axios.patch(`${url}/comments/${postId}`,
    {
        "starNum" : data.star,
        "commentText" : data.text
    },{
        headers:{
            "authorization": `Bearer ${token}`
        }
    })
    .then(res=>{
        console.log(res);
    })
    .catch(error=>{
        console.log(error);
    })
}

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
    axios.delete(`${url}/comments/${id}`)
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
                getFavoriteRestaurants(otherRestaurantId)
            })
            .catch(function (error) {
                console.log(error);
            })

    }
})

//編輯個人頁面
const editBtn = document.getElementById('editBtn');
editBtn.addEventListener('click',e=>{
    startSaveBtn();
})

function startSaveBtn(){
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.addEventListener('click',e=>{
        e.preventDefault();
        let userData ={};
        const editName = document.getElementById('editName').value;
        const editEmail = document.getElementById('editEmail').value;
        const editUserfb = document.getElementById('editUserfb').value;
        const editUserig = document.getElementById('editUserig').value;

        userData.name = editName
        userData.email = editEmail
        userData.fb = editUserfb
        userData.ig = editUserig
        console.log(userData);
        patchUserData(userData);
    });

    function patchUserData(userData){
        axios.patch(`${url}/users/${userObj.id}`,
        {
            "email": userData.email,
            "userName":userData.name,
            "fbUrl":userData.fb,
            "igUrl":userData.ig
        },{
            headers:{
                "authorization": `Bearer ${token}`
            }
        })
        .then(res=>{
            console.log(res);
            init()
        })
        .catch(error=>{
            console.log(error);
        })
    }
}
