/* 驗證 */
const signUpForm = document.querySelector(".signUpForm");
const inputs = document.querySelectorAll("input[name]");
const constraints = {
    "Email": {
        presence: {
            message: "是必填欄位"
        },
        email: {
            message: "格式錯誤"
        }
    },
    "使用者名稱": {
        presence: {
            message: "是必填欄位"
        },
        length: {
            maximum: 10,
            message: "最多10個字"
        }
    },
    "密碼": {
        presence: {
            message: "是必填欄位"
        },
        length: {
            minimum: 8,
            message: "需要超過8個字"
        }
    },
    "確認密碼": {
        presence: {
            message: "是必填欄位"
        },
        equality: {
            attribute: "密碼",
            message: "要與密碼相同"
        }
    }
}
let totalErrors;
inputs.forEach(function (item) {
    item.addEventListener("input", function () {
        item.nextElementSibling.nextElementSibling.textContent = "";
        totalErrors = validate(signUpForm, constraints);
        if (totalErrors) {
            Object.keys(totalErrors).forEach(function (keys) {
                document.querySelector(`[data-message = "${keys}"]`).textContent = totalErrors[keys];
            })
        }
    })
})
/* 綠勾勾 */
const passwordInput = document.querySelector("#password");
passwordInput.addEventListener("input", function () {
    if (passwordInput.value.length >= 8) {
        document.querySelector(".password-icon").classList.add("green");
    } else {
        document.querySelector(".password-icon").classList.remove("green");
    }
})
const confirmPasswordInput = document.querySelector("#confirm-password");
confirmPasswordInput.addEventListener("input", function () {
    if (confirmPasswordInput.value === passwordInput.value) {
        document.querySelector(".confirm-password-icon").classList.add("green");
    } else {
        document.querySelector(".confirm-password-icon").classList.remove("green");
    }
})
/* 註冊 */
const signUpBtn = document.querySelector(".signUp-button");
const agree = document.querySelector(".agree-input");
const email = document.querySelector("#email");
const userName = document.querySelector("#userName");
const password = document.querySelector("#password");
signUpBtn.addEventListener("click", function (e) {
    e.preventDefault();
    if (totalErrors) {
        Swal.fire({
            title: "目前有錯誤，註冊失敗",
            icon: "error",
            confirmButtonText: "確認",
            confirmButtonColor: "#6B5A52"
        })
    } else if (agree.checked === false) {
        Swal.fire({
            title: "沒有勾選同意條款",
            icon: "error",
            confirmButtonText: "確認",
            confirmButtonColor: "#6B5A52"
        })
    } else {
        let userAccount = {
            "email": email.value,
            "password": password.value,
            "userName": userName.value,
        }
        axios.post("http://localhost:3000/register", userAccount)
            .then(function (response) {
                location.href = "login.html";
                alert("註冊成功")

            })
            .catch(function (error) {
                if (error.response.data === "Email already exists") {
                    Swal.fire({
                        title: "此電子信箱已經被使用過!",
                        icon: "error"
                    })
                }
            })
    }
})