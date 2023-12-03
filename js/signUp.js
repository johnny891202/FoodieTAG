/* 驗證 */
let totalErrors = []
function check() {
    /* 電子信箱驗證 */
    const emailInput = document.querySelector("#email");
    emailInput.addEventListener("input", function () {
        let emailValue = emailInput.value;
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailValue.trim() === "") {
            emailInput.nextElementSibling.nextElementSibling.textContent = "不能是空的";
            return totalErrors[0] = "錯誤";
        } else if (!emailRegex.test(emailValue)) {
            emailInput.nextElementSibling.nextElementSibling.textContent = "電子郵件格式不正確";
            return totalErrors[0] = "錯誤";
        } else {
            emailInput.nextElementSibling.nextElementSibling.textContent = "";
            return totalErrors[0] = "成功";
        }
    })

    /* 密碼驗證 */
    const passwordInput = document.querySelector("#password");
    passwordInput.addEventListener("input", function () {
        let passwordValue = passwordInput.value.length;
        if (passwordValue === 0) {
            passwordInput.nextElementSibling.nextElementSibling.textContent = "不能是空的";
            document.querySelector(".password-icon").classList.remove("green");
            return totalErrors[1] = "錯誤";
        } else if (passwordValue < 8) {
            passwordInput.nextElementSibling.nextElementSibling.textContent = "長度不能低於8個字";
            document.querySelector(".password-icon").classList.remove("green");
            return totalErrors[1] = "錯誤";
        } else {
            passwordInput.nextElementSibling.nextElementSibling.textContent = "";
            document.querySelector(".password-icon").classList.add("green");
            return totalErrors[1] = "成功";
        }
    })

    /* 再次確認密碼驗證 */
    const confirmPasswordInput = document.querySelector("#confirm-password");
    confirmPasswordInput.addEventListener("input", function () {
        let confirmPasswordValue = confirmPasswordInput.value;
        if (confirmPasswordValue.trim() === "") {
            confirmPasswordInput.nextElementSibling.nextElementSibling.textContent = "不能是空的";
            document.querySelector(".confirm-password-icon").classList.remove("green");
            return totalErrors[2] = "錯誤";
        } else if (confirmPasswordValue !== passwordInput.value) {
            confirmPasswordInput.nextElementSibling.nextElementSibling.textContent = "與密碼不相同";
            document.querySelector(".confirm-password-icon").classList.remove("green");
            return totalErrors[2] = "錯誤";
        } else {
            confirmPasswordInput.nextElementSibling.nextElementSibling.textContent = "";
            document.querySelector(".confirm-password-icon").classList.add("green");
            return totalErrors[2] = "成功";
        }
    })

    return (totalErrors)
}

check()

/* 註冊功能 */
function signUp(userAccount) {
    axios.post("http://localhost:3000/register", userAccount)
        .then(response => {
            console.log(response.data)
            location.href = "login.html";
            alert("註冊成功")
        })
        .catch(error => {
            console.log(error.response)
            if (error.response.data === "Email already exists") {
                alert("此電子郵件已經被使用過!")
            }
        })

}

const signUpBtn = document.querySelector(".signUp-button");
const agree = document.querySelector(".agree-input");

signUpBtn.addEventListener("click", function (e) {
    let totalErrors = check();
    const inputs = document.querySelectorAll("input");
    inputs.forEach(function (input, index) {
        if (input.value.trim() === "") {
            input.nextElementSibling.nextElementSibling.textContent = "不能是空的";
            totalErrors[index] = "錯誤"
        }
    });
    const emailInput = document.querySelector("#email");
    const passwordInput = document.querySelector("#password");
    const userAccount = {
        "email": emailInput.value,
        "password": passwordInput.value
    }
    if (totalErrors.includes("錯誤")) {
        alert("有錯誤，註冊失敗");
    } else if (agree.checked === false) {
        alert("沒有同意會員條款，註冊失敗");
    } else {
        signUp(userAccount)
    }
})

function turn() {

}
