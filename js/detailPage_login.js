//已登入會員nav-bar
const user = document.getElementById('user');
const userBar = document.getElementById('userBar');

user.addEventListener('click', e => {
    userBar.classList.toggle('d-none')
})

const url = `http://localhost:3000`;
// const resname = decodeURI(location.href.split("=")[1]);
let postData = [];
let favoriteId = [];

//取得餐廳資訊
const testName = "藝居酒屋";
const userAvatar = document.querySelectorAll('.avatar-container');
//取得localstorage資料
const userName = document.querySelectorAll('.userName');
const userTitle = document.querySelector('.userTitle')
userStr = localStorage.getItem('user'); //取出localStorage的值(string)
userObj = JSON.parse(userStr); // string轉換成物件

let restaurantDetail = [];
function init(){
    axios.get(`${url}/restaurants?q=${testName}`)
    .then(function(res){
        restaurantDetail = res.data[0];
        console.log(restaurantDetail);
        renderRestaurantDetail();
        getComments();
        getUserData();
    })
    .catch(function(error){
        console.log(error);
    })
}
init();

//渲染餐廳資訊
const detailPageBanner = document.querySelector('.detailPage-banner');
const restaurantDetailContainer = document.querySelector('.restaurantDetailContainer');
const title = document.querySelector('.detailPage-banner h2');
const myCommentLabel = document.getElementById('myCommentLabel');
let tagsShow = [];

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
    tagsShow = restaurantDetail.Tags;

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

    //我的評論 餐廳名稱
    myCommentLabel.textContent = restaurantDetail.Name;
};

//取得使用者資料
const likeBtn = document.getElementById('likeBtn');

let userData = [];
function getUserData(){
    axios.get(`${url}/users/${userObj.id}`)
    .then(res=>{
        userData = res.data;
        renderCollectionBtn();
        renderUserData()
    })
};

function renderUserData(){
    //頁面帶入user資訊
    //因網頁有多個.userName，要用forEach渲染textContent
    userName.forEach(item => {
        item.textContent = userData.userName;
    });
    //頭銜
    userTitle.innerHTML = userData.title;
    //頭像
    userAvatar.forEach(item=>{
        item.innerHTML = `<img src="${userData.avatar}" class="user-avatar" alt="user-avatar">`
    })
}
//加入收藏按鈕狀態
function renderCollectionBtn(){
    userData.collection.forEach(item=>{
        if(item === restaurantDetail.id){
            likeBtn.value = "已加入收藏！";
            likeBtn.classList.add('like-added')
        }else{
            likeBtn.value = "加入收藏";
            likeBtn.classList.remove('like-added')
        }
    })
}

//取得評論
let commentsData =[];
function getComments(){
    let RestaurantId = restaurantDetail.id;
    axios.get(`${url}/comments?restaurantId=${RestaurantId}&_expand=user`)
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
const commentNum = document.getElementById('commentNum');
let a =[]

//監聽最新按鈕(預設按最新排序)
sortNew.addEventListener('click',e=>{
    renderComments ();
});
const writeCommentBtn = document.querySelector('.write-comment-btn');
function renderComments(){
    let dataSorted = commentsData.sort((a,b)=>{
        let dateA = a.date;
        let dateB = b.date;
        return dateA > dateB ? -1 :1
    });
    commentNum.textContent = dataSorted.length;

    let commentStr ="";
    let starIcon = `<i class="fa-solid fa-star" style="color: #f5cd05;"></i>`;
    if(dataSorted.length === 0){
        commentStr =`<div><p>還沒有人評論過Q_Q 我要當第一位評論者！</p> </div>`
    }
    dataSorted.forEach((item,i,array)=>{
        let starNum = starIcon.repeat(item.starNum); //星星數
            commentStr += `<div class="col-lg-10 d-flex justify-content-evenly align-items-center bg-primary-100 px-8 py-3 my-2">
            <div class="d-flex flex-column align-items-center me-10">
            <div class="mb-3">
            <img src="${item.user.avatar}" class="user-avatar" alt="user-avatar">
            </div>
                <p  id="name" class=" mb-1" user-id="${item.user.id}">${item.user.userName}</p>
                <p class="mb-0 text-grey-400 fs-3">${item.user.title}</p>
            </div>
            <div class="d-flex flex-column w-75">
                <div class="d-flex align-items-center mb-3">
                    <div class="me-5">${starNum}</div>
                </div>
                <p class="mb-3 fs-4">${item.commentText}</p>
                <p class="text-end text-grey-300 mb-0 fs-3">${item.date}</p>
            </div>
        </div>`
    });
    commentContainer.innerHTML = commentStr;

    //查看評論區是否已有該使用者評論，有則改變寫評論按鈕樣式
    a = commentContainer.querySelectorAll('[id="name"]');
    a.forEach(item=>{
        let checkId = item.getAttribute('user-id');
        if(checkId == userObj.id){
            const textArea = document.querySelector('.text-area');

            textArea.textContent = `感謝您留下寶貴的評論！`;
            writeCommentBtn.style = "pointer-events:none";
            writeCommentBtn.classList.add('btn-primary-200');
            writeCommentBtn.textContent = `已完成評論！`;
        }
    });
};

//評論排序
//最高
const sortHigh = document.querySelector('.sort-high');

sortHigh.addEventListener('click',e=>{
    RestaurantId = restaurantDetail.id;
    getsortHigh ();
});
let sortHighData = [];
function getsortHigh (){
    axios.get(`${url}/comments?_sort=starNum&_order=desc&restaurantId=${RestaurantId}&_expand=user`)
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
            <p class="mb-3 fs-4">${item.commentText}</p>
            <p class="text-end text-grey-300 mb-0 fs-3">${item.date}</p>
        </div>
    </div>`
    });
    commentContainer.innerHTML = commentStr;
}
//評論內假圖片格式
// <div>
// <!-- 照片1 -->
// <img src="${item.photo[0]}" alt="photo" class="comment-pic me-3">
// <!-- 照片2 -->
// <img src="${item.photo[1]}" alt="photo" class="comment-pic me-3">
// </div>

//最低
const sortLow = document.querySelector('.sort-low');

sortLow.addEventListener('click',e=>{
    getsortLow ();
});
let sortLowData = [];
function getsortLow (){
    RestaurantId = restaurantDetail.id;
    axios.get(`${url}/comments?_sort=starNum&_order=asc&restaurantId=${RestaurantId}&_expand=user`)
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
            <p class="mb-3 fs-4">${item.commentText}</p>
            <p class="text-end text-grey-300 mb-0 fs-3">${item.date}</p>
        </div>
    </div>`
    });
    commentContainer.innerHTML = commentStr;
};



//我的評論
//星星數
const stars = document.querySelectorAll('.stars i');
const starContainer = document.querySelector('.star-container');
let sheetData ={}; //存放表單資料

starContainer.addEventListener('click',e=>{
    e.preventDefault();
    if (e.target.getAttribute('id') !== "starIcon"){
        return
    }else{
        starContainer.setAttribute('click-star','done')
        sheetData.starNum = e.target.getAttribute('num-id');
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
});

const sendCommentBtn = document.querySelector('.sendCommentBtn');
//送出我的評論
let newTagsShow;
sendCommentBtn.addEventListener('click',e=>{
    const myComments = document.getElementById('myComments');
    const addedTag = tagsContainer.querySelectorAll('i'); //標籤內的叉叉

    //判斷使用者是否有新增標籤
    if(tagsContainer.childElementCount !== 0){
        tagsContainer.setAttribute('add-tag','done')
    }else{
        tagsContainer.setAttribute('add-tag','none')
    }
    addedTag.forEach(item=>{
        let a = item.getAttribute('value-id');
        tagsShow.push(a)
    });
    newTagsShow = Array.from(new Set(tagsShow)); //排除重複的標籤

    //取得當前時間
    let time = new Date()
    //判斷分鐘位數
    let minutes = time.getMinutes();
    let montharr = time.getMonth();
    month = montharr+1;
    let dates = time.getDate();
    let hours = time.getHours();

    if (minutes <10){
        minutes = `0${time.getMinutes()}`
    };
    if (month <10){
        month = `0${time.getMonth()}`
    };
    if (dates <10){
        dates = `0${time.getDate()}`
    };
    if (hours <10){
        hours = `0${time.getHours()}`
    };

    sheetData.date =  `${time.getFullYear()}年${month}月${dates}日  ${hours}:${minutes}`;
    sheetData.text = myComments.value;

    //驗證
    const starValidate = document.querySelector('.star-validate');
    const tagValidate = document.querySelector('.tag-validate');

    if(starContainer.getAttribute('click-star') !== "done" && tagsContainer.getAttribute('add-tag') === "done"){
        starValidate.innerHTML = `整體評分為必填`;
    }else if(starContainer.getAttribute('click-star') === "done" && tagsContainer.getAttribute('add-tag') !== "done"){
        tagValidate.innerHTML = `新增標籤為必填`
    }else if(starContainer.getAttribute('click-star') !== "done" && tagsContainer.getAttribute('add-tag') !== "done"){
        starValidate.innerHTML = `整體評分為必填`;
        tagValidate.innerHTML = `新增標籤為必填`
    }else{
        starValidate.innerHTML = ``;
        tagValidate.innerHTML =``;
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
                addNewComment();
                addTags()
            };
        });
    }

});

function addNewComment(){
    //db.json新增評論
    axios.post(`${url}/comments`,
    {
        "resturantName": restaurantDetail.Name,
        "starNum":sheetData.starNum,
        "commentText": sheetData.text,
        "date": sheetData.date,
        "userId": userObj.id,
        "restaurantId":restaurantDetail.id ,
    })
    .then(res=>{
        console.log(res.data);
    })
    .catch(error=>{
        console.log(error);
    });
}

function addTags(){
    //db.json新增餐廳標籤
    axios.patch(`${url}/restaurants/${restaurantDetail.id}`,
    {
        "Tags": newTagsShow,
    })
    .then(res=>{
        console.log(res)
    })
    .catch(error=>{
        console.log(error)
    });
};

// function deleteTest(){
//     axios.delete(`${url}/comments/28`)
//     .then(res=>{
//         console.log(res);
//     })
//     .catch(error=>{
//         console.log(error);
//     })
// }

//加入收藏按鈕
let usercollection =[];
likeBtn.addEventListener('click',e=>{
    if(likeBtn.value === "加入收藏"){
        addUsercollection();
    }else if(likeBtn.value === "已加入收藏！"){
        removeUsercollection();
    }
});

function addUsercollection(){
    usercollection = userData.collection;
    usercollection.push(restaurantDetail.id);
    patchUserCollectionAdd(usercollection)
}

function removeUsercollection(){
    usercollection = userData.collection;
    let b = usercollection.filter(function(item){
        return item !== restaurantDetail.id
    });
    patchUserCollectionRemove(b)
}

function patchUserCollectionRemove(arr){
    axios.patch(`${url}/users/${userObj.id}`,
    {
        collection : arr
    })
    .then(res=>{
        console.log(res);
        getRestaurantcollectionNumRemove();
    })
    .catch(error=>{
        console.log(error);
    })
}

function getRestaurantcollectionNumRemove(){
    axios.get(`${url}/restaurants/${restaurantDetail.id}`)
    .then(res=>{
        let num = res.data.collectionNum;
        patchRestaurantcollectionNumRemove(num)
    })
}

function patchRestaurantcollectionNumRemove(num){
    axios.patch(`${url}/restaurants/${restaurantDetail.id}`,
    {
        collectionNum : parseInt(num)-1
    })
    .then(res=>{
        console.log(res);
    })
    .catch(function(error){
        console.log(error);
    })
}

function patchUserCollectionAdd(arr){
    axios.patch(`${url}/users/${userObj.id}`,
    {
        collection : arr
    })
    .then(res=>{
        console.log(res);
        getRestaurantcollectionNumAdd();
    })
    .catch(error=>{
        console.log(error);
    })
}


function getRestaurantcollectionNumAdd(){
    axios.get(`${url}/restaurants/${restaurantDetail.id}`)
    .then(res=>{
        let num = res.data.collectionNum;
        patchRestaurantcollectionNumAdd(num)
    })
}


function patchRestaurantcollectionNumAdd(num){
    axios.patch(`${url}/restaurants/${restaurantDetail.id}`,
    {
        collectionNum : parseInt(num)+1
    })
    .then(res=>{
        console.log(res);
    })
    .catch(function(error){
        console.log(error);
    })
}