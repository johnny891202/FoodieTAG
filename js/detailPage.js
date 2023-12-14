//已登入會員nav-bar
const user = document.getElementById('user');
const userBar = document.getElementById('userBar');

user.addEventListener('click', e => {
    userBar.classList.toggle('d-none')
})

const url = `http://localhost:3000`;
let postData = [];
let favoriteId = [];

//我的評論
//星星數
const stars = document.querySelectorAll('.stars i');
const starContainer = document.querySelector('.star-container');

starContainer.addEventListener('click',e=>{
    e.preventDefault();
    if (e.target.getAttribute('id') !== "starIcon"){
        return
    }else{
        let starNum = e.target.getAttribute('num-id');
        for(i= 1 ; i<=5 ; i++){
            stars.forEach(item=>{
                //當num-id的值等於e.target的num-id
                if(item.getAttribute('num-id') == i){
                    item.classList.add(`fa-solid`);
                }//當num-id的值小於e.target的num-id
                if (item.getAttribute('num-id')<=starNum){
                    item.classList.add(`fa-solid`);
                    //當num-id的值大於e.target的num-id
                }else{
                    item.classList.remove(`fa-solid`)
                }
            })
        }
    }
})

//加入收藏按鈕
const likeBtn = document.getElementById('likeBtn');

likeBtn.addEventListener('click',e=>{
    likeBtn.classList.toggle('like-added')
    if (likeBtn.value === "加入收藏"){
        likeBtn.value = "已加入收藏！"
    }else{
        likeBtn.value = "加入收藏"
    }
});

//我的評論
//加入指定標籤
const tagsContainer = document.querySelector('.tagsContainer');
const tagSelect = document.querySelector('.tagSelect');

let tagArr = []; //新增標籤欄內有的標籤
tagSelect.addEventListener('click',e=>{
    e.preventDefault();
    if(e.target.getAttribute('id')!== "tags"){
        return
    }else{
        tagArr.push(e.target.textContent);
        tagsContainer.innerHTML+=`<li class="d-inline me-4 mb-2 fs-3 fw-bold text-white bg-primary-400 py-1 px-3 rounded-pill">${e.target.textContent}<i class="fa-solid fa-xmark ms-2" value-id="${e.target.textContent}" id="xmark" style="cursor: pointer;"></i></li>`;
        e.target.classList.add('add-tag')
    }

});

//刪除標籤
const tags = document.getElementById('tags');

tagsContainer.addEventListener('click',e=>{
    e.preventDefault();
    if(e.target.getAttribute('id')!== "xmark"){
        return
    }else{
        //找要刪除的index
        let number
        tagArr.forEach((item,i)=>{
            if(item === e.target.getAttribute('value-id')){
                number = i
            }
        });
        //找到被選的標籤
        //tagsElements為節點清單
        const tagsElements = document.querySelectorAll('[id="tags"]');
        tagsElements.forEach(item=>{
            let valueId =item.getAttribute('value-id');
            if(valueId ===e.target.getAttribute('value-id')){
                item.classList.remove('add-tag');
                item.classList.add('delete-tag');
            }
        })
        tagArr.splice(number,'1');
        deleteTag();
    }
})
//移除標籤時，重新渲染tagsContainer
function deleteTag(){
    let str="";
    tagArr.forEach(item=>{
        str+=`<li class="d-inline me-4 mb-2 fs-3 fw-bold text-white bg-primary-400 py-1 px-3 rounded-pill">${item}<i class="fa-solid fa-xmark ms-2" value-id="${item}" id="xmark" style="cursor: pointer;"></i></li>`
    });
    tagsContainer.innerHTML =str;
}

//新增自訂標籤
const newTag = document.getElementById('newTag');
const addTag = document.getElementById('addTag');

addTag.addEventListener('click',e=>{
    e.preventDefault();
    let newTagWord = newTag.value.trim();
    if(newTagWord === "" || newTagWord === undefined){
        return
    }else{
        tagArr.push(newTagWord);
        tagsContainer.innerHTML+=`<li class="d-inline me-4 mb-2 fs-3 fw-bold text-white bg-primary-400 py-1 px-3 rounded-pill">${newTagWord}<i class="fa-solid fa-xmark ms-2" value-id="${newTagWord}" id="xmark" style="cursor: pointer;"></i></li>`;
        newTag.value="";
    }
})


//渲染餐廳資訊
const testName = "藝居酒屋";
const userAvatar = document.querySelectorAll('.avatar-container');

let restaurantDetail = [];
function init(){
    //頁面帶入user資訊
    //menu登入後帶入user名稱
    const userName = document.querySelectorAll('.userName');
    const userTitle = document.querySelector('.userTitle')
    userStr = localStorage.getItem('user'); //取出localStorage的值(string)
    userObj = JSON.parse(userStr); // string轉換成物件

    //因網頁有多個.userName，要用forEach渲染textContent
    userName.forEach(item => {
        item.textContent = userObj.userName;
    });
    //頭銜
    userTitle.innerHTML = userObj.title;
    //頭像
    userAvatar.forEach(item=>{
        item.innerHTML = `<img src="${userObj.avatar}" class="user-avatar" alt="user-avatar">`
    })

    axios.get(`${url}/restaurants?Name=${testName}`)
    .then(function(res){
        restaurantDetail = res.data[0];
        console.log(restaurantDetail);
        renderRestaurantDetail();
        getComments();
    })
    .catch(function(error){
        console.log(error);
    })
}
init();

//渲染餐廳資料
const detailPageBanner = document.querySelector('.detailPage-banner');
const restaurantDetailContainer = document.querySelector('.restaurantDetailContainer');
const title = document.querySelector('.detailPage-banner h2');

function renderRestaurantDetail(){
    //Banner標題+圖片
    detailPageBanner.style.backgroundImage = `url(${restaurantDetail.Picture[0]})`;
    title.textContent = restaurantDetail.Name;

    //判斷星星數
    let restaurantstarNum = restaurantDetail.Stars;
    let restaurantstarNumInteger = parseInt(restaurantstarNum);
    let starStr=""; //餐廳星星icon
    for(let i = 1 ; i <=restaurantstarNumInteger ; i++){
        starStr+=`<i class="fa-sharp fa-solid fa-star" style="color: #f3b353;"></i>`
    }
    if(Number.isInteger(restaurantstarNum)){
        return
    }else{
        starStr+=`<i class="fa-solid fa-star-half-stroke" style="color: #f3b353;"></i>`
    }

    //餐廳詳細資訊
    restaurantDetailContainer.innerHTML = `
        <div class="d-flex align-items-center mb-4">
        <h2>${restaurantDetail.Name}</h2>
        <div class="d-flex list-unstyled ms-2">
        <a href="${restaurantDetail.igUrl}" class="mx-3 d-block d-flex align-items-center social-icon rounded-circle justify-content-center">
            <i class="fa-brands fa-instagram h3"></i>
            </a>
            <a href="${restaurantDetail.fbUrl}" class="mx-3 d-block d-flex text-center align-items-center social-icon rounded-circle justify-content-center">
            <i class="fa-brands fa-facebook h3"></i>
            </a>
        </div>
    </div>
    <div class="mb-4 d-flex align-items-center">${starStr}<span class="ms-2">${restaurantDetail.Stars}</span></div>
    <p class="d-flex align-items-center">
        <span class="material-icons me-2"> place </span>
        地址：${restaurantDetail.Add}
    </p>
    <p class="d-flex align-items-center">
        <span class="material-icons me-2"> schedule </span>營業時間：${restaurantDetail.Opentime}
    </p>
    <p class="d-flex align-items-center"><span class="material-icons me-2"> call </span>電話：${restaurantDetail.Tel}</p>
    <p class="d-flex align-items-center"><span class="material-icons me-2"> paid </span>人均消費：${restaurantDetail.Price}</p>
    <p>已被收藏  ${restaurantDetail.collectionNum}  次</p>`

    //tag區
    const tagsContainer = document.querySelector('.tags-container');
    let newArr = [...restaurantDetail.Tags] //淺拷貝
    let tagsShow = newArr.splice(2); //刪除前兩個標籤

    let tagStr = "";
    tagsShow.forEach(item=>{
        tagStr+=`<li class="fs-4 py-2 px-5 fw-bold me-4 mb-3 rounded-pill bg-primary-400 text-white border-0">${item}</li>`
    });
    tagsContainer.innerHTML = tagStr;


    //燈箱效果
    const lightBoxContainer = document.querySelector('.light-box-container');

    let lightBoxStr ="";
    restaurantDetail.Picture.forEach((item,i)=>{
        lightBoxStr+=`<div class="modal fade" id="user1Pic${i+1}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
            <img src="${item}" id="exampleModalLabel" width="100%" class="position-relative">
            <button type="button" class="btn-close position-absolute text-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
        </div>
        </div>
    </div>`
    });
    lightBoxContainer.innerHTML = lightBoxStr;

    //跑馬燈區
    const picContainer = document.querySelector('.pic-container');

    let picStr = "";
    restaurantDetail.Picture.forEach((item,i)=>{
        picStr+=`<a  class="pic" data-bs-toggle="modal" data-bs-target="#user1Pic${i+1}">
        <img src="${item}" alt="pic" style="cursor: pointer">
    </a>`
    });
    picContainer.innerHTML = picStr+picStr;
};

//取得評論
const testRestaurantId = 146;

let commentsData =[];
function getComments(){
    axios.get(`${url}/comments?_restaurantId=${testRestaurantId}&_expand=user`)
    .then(function(res){
        commentsData = res.data;
        renderComments();
    })
    .catch(function(error){
        console.log(error);
    })
};

//渲染評論
const commentContainer = document.querySelector('.comment-container');
const sortNew = document.querySelector('.sort-new');

//監聽最新按鈕
sortNew.addEventListener('click',e=>{
    renderComments ();
});

function renderComments(){
    let dataSorted = commentsData.sort((a,b)=>{
        return a['Date(date)'] > b['Date(date)'] ? -1 :1
    });

    let commentStr ="";
    let starIcon = `<i class="fa-solid fa-star" style="color: #f5cd05;"></i>`;

    dataSorted.forEach((item,i)=>{
        let starNum = starIcon.repeat(item.starNum); //星星數

        commentStr += `<div class="col-lg-10 d-flex justify-content-evenly align-items-center bg-primary-100 px-8 py-3 my-2">
        <div class="d-flex flex-column align-items-center me-10">
        <div class="mb-3">
        <img src="${item.user.avatar}" class="user-avatar" alt="user-avatar">
        </div>
            <p class="mb-1">${item.user.userName}</p>
            <p class="mb-0 text-grey-400 fs-3">${item.user.title}</p>
        </div>
        <div class="d-flex flex-column w-75">
            <div class="d-flex align-items-center mb-3">
                <div class="me-5">${starNum}</div>
            </div>
            <p class="mb-3 fs-3">${item.commentText}</p>
            <div>
            <!-- 照片1 -->
            <img src="${item.photo[0]}" alt="photo" class="comment-pic me-3">
            <!-- 照片2 -->
            <img src="${item.photo[1]}" alt="photo" class="comment-pic me-3">
            </div>
            <p class="text-end text-grey-300 mb-0 fs-3">${item.date}</p>
        </div>
    </div>`
    });
    commentContainer.innerHTML = commentStr;
};

//評論排序
//最高
const sortHigh = document.querySelector('.sort-high');

sortHigh.addEventListener('click',e=>{
    getsortHigh ();
});
let sortHighData = [];
function getsortHigh (){
    axios.get(`${url}/comments?_sort=starNum&_order=desc&?_restaurantId=${testRestaurantId}&_expand=user`)
    .then(function(res){
        sortHighData=res.data;
        rendersortHigh ()
    })
    .catch(function(error){
        console.log(error);
    })
}

function rendersortHigh (){
    let commentStr ="";
    let starIcon = `<i class="fa-solid fa-star" style="color: #f5cd05;"></i>`;

    sortHighData.forEach((item,i)=>{
        let starNum = starIcon.repeat(item.starNum); //星星數

        commentStr += `<div class="col-lg-10 d-flex justify-content-evenly align-items-center bg-primary-100 px-8 py-3 my-2">
        <div class="d-flex flex-column align-items-center me-10">
        <div class="mb-3">
        <img src="${item.user.avatar}" class="user-avatar" alt="user-avatar">
        </div>
            <p class="mb-1">${item.user.userName}</p>
            <p class="mb-0 text-grey-400 fs-3">${item.user.title}</p>
        </div>
        <div class="d-flex flex-column w-75">
            <div class="d-flex align-items-center mb-3">
                <div class="me-5">${starNum}</div>
            </div>
            <p class="mb-3 fs-3">${item.commentText}</p>
            <div>
            <!-- 照片1 -->
            <img src="${item.photo[0]}" alt="photo" class="comment-pic me-3">
            <!-- 照片2 -->
            <img src="${item.photo[1]}" alt="photo" class="comment-pic me-3">
            </div>
            <p class="text-end text-grey-300 mb-0 fs-3">${item.date}</p>
        </div>
    </div>`
    });
    commentContainer.innerHTML = commentStr;
}

//最低
const sortLow = document.querySelector('.sort-low');

sortLow.addEventListener('click',e=>{
    getsortLow ();
});
let sortLowData = [];
function getsortLow (){
    axios.get(`${url}/comments?_sort=starNum&_order=asc&?_restaurantId=${testRestaurantId}&_expand=user`)
    .then(function(res){
        sortLowData=res.data;
        rendersortLow ()
    })
    .catch(function(error){
        console.log(error);
    })
}

function rendersortLow (){
    let commentStr ="";
    let starIcon = `<i class="fa-solid fa-star" style="color: #f5cd05;"></i>`;

    sortLowData.forEach((item,i)=>{
        let starNum = starIcon.repeat(item.starNum); //星星數

        commentStr += `<div class="col-lg-10 d-flex justify-content-evenly align-items-center bg-primary-100 px-8 py-3 my-2">
        <div class="d-flex flex-column align-items-center me-10">
        <div class="mb-3">
        <img src="${item.user.avatar}" class="user-avatar" alt="user-avatar">
        </div>
            <p class="mb-1">${item.user.userName}</p>
            <p class="mb-0 text-grey-400 fs-3">${item.user.title}</p>
        </div>
        <div class="d-flex flex-column w-75">
            <div class="d-flex align-items-center mb-3">
                <div class="me-5">${starNum}</div>
            </div>
            <p class="mb-3 fs-3">${item.commentText}</p>
            <div>
            <!-- 照片1 -->
            <img src="${item.photo[0]}" alt="photo" class="comment-pic me-3">
            <!-- 照片2 -->
            <img src="${item.photo[1]}" alt="photo" class="comment-pic me-3">
            </div>
            <p class="text-end text-grey-300 mb-0 fs-3">${item.date}</p>
        </div>
    </div>`
    });
    commentContainer.innerHTML = commentStr;
};


//送出我的評論
const sendCommentBtn = document.querySelector('.sendCommentBtn');

sendCommentBtn.addEventListener('click',e=>{
    Swal.fire({  //alert套件
        title: "確定要送出評論嗎？",
        text:"您的標籤將進行審核，約1~3日審核完畢",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "確定"
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire("已送出評論！", "", "success");
            if (result.isConfirmed) {
                console.log(123);
            }
        };
    });
})