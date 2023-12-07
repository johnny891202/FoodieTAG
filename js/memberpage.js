//已登入會員nav-bar
const user = document.getElementById('user');
const userBar = document.getElementById('userBar');

user.addEventListener('click',e=>{
    userBar.classList.toggle('d-none')
})

//menu登入後帶入user名稱
function init(){
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
};

init();

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