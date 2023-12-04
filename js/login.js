const loginBtn = document.querySelector(".login-button");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");

let user = {}

loginBtn.addEventListener("click", e => {
    user.email = emailInput.value;
    user.password = passwordInput.value;
    login();

})

function login() {
    axios.post("http://localhost:3000/login", user)
        .then(response => {
            console.log(response);
            localStorage.setItem("token", response.data.accessToken);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            location.href = "index.html";
        })
        .catch(error => {
            if (error.response.data === "Incorrect password") {
                alert("密碼錯誤喔");
            } else if (error.response.data === "Cannot find user") {
                alert("這個信箱沒有註冊過喔");
            }
        })
}
