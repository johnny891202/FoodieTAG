const _url = "http://localhost:3000";
const list = document.querySelector('.list');
const back = document.getElementById('return');
const id = decodeURI(location.href.split("=")[1]+location.href.split("=")[2]);
console.log(id);

//撈取篩選後的資料庫
let filterdData = [];
function init(){
axios.get(`${_url}/resturants?q=${id}`)
.then(function(response){
    filterdData = response.data;
    console.log(filterdData);
    render();
})
};

//渲染畫面
function render(){
let content = "";
filterdData.forEach((item,i)=>{
    content+=
    `<h2 class="title">${item.Name}</h2>
    <img src="${item.Picture[0]}" alt="photo" class="img">
    <p class="tag">Tags：${item.Tags}</p>`;
});
list.innerHTML = content;
}


//監聽返回鍵
back.addEventListener('click',(e)=>{
    window.location.href= `index.html`
})


init();