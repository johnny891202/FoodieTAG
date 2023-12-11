const loginBtn = document.querySelector(".login-button");
const email = document.querySelector("#email");
const password = document.querySelector("#password");

let user = {}

loginBtn.addEventListener("click", function (e) {
    user.email = email.value;
    user.password = password.value;

    console.log(user)
    axios.post("http://localhost:3000/login", user)
        .then(function (response) {
            console.log(response.data.accessToken)
            Swal.fire({
                title: "登入成功",
                icon: "success"
            }).then(function () {
                localStorage.setItem("token", response.data.accessToken);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                location.href = "index.html";
            })
        })
        .catch(function (error) {
            console.log(error)
            if (error.response.data === "Incorrect password") {
                Swal.fire({
                    title: "密碼錯誤",
                    icon: "error"
                })
            } else if (error.response.data === "Cannot find user") {
                Swal.fire({
                    title: "這個信箱沒有註冊喔",
                    icon: "error"
                })
            }
        })
})