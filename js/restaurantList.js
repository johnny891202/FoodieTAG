/* 滑動金額 */
let slider = document.querySelector(".slider");
let priceRange = document.querySelector(".priceRange");
priceRange.innerHTML = `${slider.value} 元`;

slider.oninput = function () {
    priceRange.innerHTML = `${this.value} 元`;
}
/* 星星數篩選 */
const stars = document.querySelectorAll(".stars i");

stars.forEach(function (item) {
    item.addEventListener("click", function (e) {
        e.preventDefault();
        item.classList.toggle(`fa-solid`)
    })
});