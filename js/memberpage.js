//已登入會員nav-bar
const user = document.getElementById('user');
const userBar = document.getElementById('userBar');

user.addEventListener('click',e=>{
    userBar.classList.toggle('d-none')
})

//撈個人資訊
const _url = "http://localhost:3000";
const userName = document.querySelector('.user-name');
const headerUserName = document.querySelector('.header-userName');
let data = {};

function init(){
    axios.get(`${_url}/users/3`)
    .then(function(res){
        data = res.data;
        console.log(data)
        renderName();
    })
    .catch(function (error) {
        console.log(error);
    })
}
init();

//渲染名字
function renderName(){
    userName.textContent = data.userName;
    headerUserName.textContent = data.userName;
}