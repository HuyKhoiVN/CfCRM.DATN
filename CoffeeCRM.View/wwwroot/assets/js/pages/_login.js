"use strict";
/**
 * Author: Ha Thanh Nguyen
 * Created: 09/08/2024
 * Description: Login page javascript
 */
const accessKey = "Authorization";
/**
 * Author: Ha Thanh Nguyen
 * Created: 09/08/2024
 * Description: submit login
 */
$("#loginForm").on("submit",function (e) {
    e.preventDefault();
    signIn();
});
$(document).ready(function () {
    localStorage.removeItem("token");
})

async function signIn() {
    try {
        let data = {
            'userName': $("#username").val(),
            "password": $("#password").val()
        };
        let errors = [];
        let swalSubTitle = "<p class='swal__admin__subtitle'>Đăng nhập không thành công!</p>";
        if (data.userName.trim().length == 0) {
            errors.push("Tài khoản không được để trống");
        }
        if (data.password.trim().length == 0) {
            errors.push("Mật khẩu không được để trống");
        }
        if (errors.length > 0) {
            let contentError = "<ul>";
            errors.forEach(function (item, index) {
                contentError += "<li class='text-start'>" + item + "</li>";
            })
            contentError += "</ul>";
            Swal.fire(
                'Đăng nhập' + swalSubTitle,
                contentError,
                'warning'
            );
            return;
        }
        
        let result = await httpService.postAsync("/account/api/login", data);
        if (result.status == "200") {
            let token = result.resources.accessToken;
            let profile = result.resources.profile;
            localStorage.setItem("token", token);
            localStorage.setItem("profile", JSON.stringify(profile));
            document.cookie = `${accessKey}=${token}`;
            Swal.fire("Đăng nhập thành công", "Chào mừng <b>" + data.userName + "</b> trở lại.", "success").then(function () {
                location.href = "/";
            });
        }
        else {
            if (result.errors.length > 1) {
                let contentError = "<ul>";
                result.errors.forEach(function (item, index) {
                    contentError += "<li class='text-start'>" + item + "</li>";
                })
                contentError += "</ul>";
                Swal.fire(
                    'Đăng nhập' + swalSubTitle,
                    contentError,
                    'warning'
                );
            }
            else {
                Swal.fire(
                    "Đăng nhập",
                    result.errors[0],
                    "error");
            }
        }
    } catch (e) {
        Swal.fire(
            "Đăng nhập",
            "Đã có lỗi xảy ra xin vui lòng thử lại sau!",
            "error");
        console.error(e);
    }
}
$("#btnLogin").on("click", function (e) {
    e.preventDefault();
    signIn();
})

$("#loginForm").on("input change keypress keydown", "input", function (e) {
    let text = $(this).val().trim();
    $(this).val(text);
    if (e.which == 13) {
        signIn();
    }
})
$(".none-space").on("change input blur", function () {
    let e = $(this);
    let text = e.val().trim();
    e.val(text);
})
$(".btn_show_pass").on("click", function (e) {
    var target = $($(this).attr("data-target"));
    if (target.attr("type") == "password") {
        target.attr("type", "text");
        $(this).html(`<i class="ki-duotone ki-eye-slash fs-3">
                                            <span class="path1 ki-uniEC07"></span>
                                            <span class="path2 ki-uniEC08"></span>
                                            <span class="path3 ki-uniEC09"></span>
                                            <span class="path4 ki-uniEC0A"></span>
                                        </i>`);
    }
    else {
        target.attr("type", "password");
        $(this).html(`<i class="ki-duotone ki-eye fs-3">
                                            <span class="path1 ki-uniEC0B"></span>
                                            <span class="path2 ki-uniEC0B"></span>
                                            <span class="path3 ki-uniEC0D"></span>
                                        </i>`);
    }
});