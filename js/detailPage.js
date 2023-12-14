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
