const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
});

function signUpfunc() {
    var user = {
        reqType: "signup",
        name: $("#signUp_username").val(),
        email: $("#signUp_email").val(),
        password: $("#signUp_password").val(),
        usertype: $("#signUp_isDoctor").is(":checked") ? "doctor" : "patient",
        imageURL: "somurl.jpg",
    };
    $.ajax({
        url: "/login-signup",
        type: "post",
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            window.localStorage.setItem("accessToken", data.accessToken);
            $.ajax({
                url: "/",
                type: "GET",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', `Bearer ${data.accessToken}`);
                },
                success: function () {
                    setTimeout(function () {
                        window.location.href = '/';
                    }, 333);
                }
            })
        },
        data: JSON.stringify(user),
    });
}
function signInfunc() {
    var user = {
        reqType: "login",
        name: $("#signIn_username").val(),
        // email: $("#signIn_email").val(),
        password: $("#signIn_password").val(),
        usertype: $("#signUp_isDoctor").is(":checked") ? "doctor" : "patient",
        // imageURL: "somurl.jpg",
    };
    $.ajax({
        url: "/login-signup",
        type: "post",
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            window.localStorage.setItem("accessToken", data.accessToken);
            $.ajax({
                url: "/",
                type: "GET",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', `Bearer ${data.accessToken}`);
                },
                success: function () {
                    setTimeout(function () {
                        window.location.href = '/';
                    }, 333);
                }
            })
        },
        data: JSON.stringify(user),
    });
}
