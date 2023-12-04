//已登入會員nav-bar
const user = document.getElementById('user');
const userBar = document.getElementById('userBar');

user.addEventListener('click',e=>{
    userBar.classList.toggle('d-none')
})


//頁籤

// const tabBar = document.querySelector('.tab-bar');
// const tabsActive = document.querySelector('.tabs-active');
// const tabs = document.querySelector('.tabs');
// const arr =tabsActive.parentNode.children;

// tabs.addEventListener('click',e=>{
//     tabs.classList.add('tabs-active');
//     tabs.classList.remove('tabs');
//     }
// );




