"use strict";
/**
 * Author: Ha Thanh Nguyen
 * Created: 09/08/2024
 * Description: Login page javascript
 */
const accessKey = "Authorization";

/**
 * Author: Ha Thanh Nguyen
 * Created: 24/10/2024
 * Description: Toggle password
 */
const togglePassword = document.querySelector('#toggle_password');
const password = document.querySelector('#password');
if (togglePassword) {
    togglePassword.addEventListener('click', function (e) {
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        this.classList.toggle('bi-eye');
    });
}
$("#check_remember_password").on("change", function () {
    let checked = $(this).is(":checked");
    if (checked) {
        localStorage.setItem("usname", $("#username").val());
        localStorage.setItem("pass", $("#password").val());
        localStorage.setItem("remember_account", checked);
    }
    else {
        localStorage.removeItem("usname");
        localStorage.removeItem("pass");
        localStorage.removeItem("remember_account");
    }
})
/**
 * Author: Ha Thanh Nguyen
 * Created: 09/08/2024
 * Description: submit login
 */
$("#loginForm").on("submit", function (e) {
    e.preventDefault();
    signIn();
});
$(document).ready(function () {
    localStorage.removeItem("token");
    let checkedRemember = localStorage.getItem("remember_account");
    if (checkedRemember != null || checkedRemember != "") {
        if (checkedRemember) {
            $("#username").val(localStorage.getItem("usname"));
            $("#password").val(localStorage.getItem("pass"));
            $("#check_remember_password").prop("checked", true);
        }
    }
    $('.select_formgroup').select2();
    $('b[role="presentation"]').hide();
    $('.select2-selection__arrow').append(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M6.41438 9.53151C6.67313 9.20806 7.1451 9.15562 7.46855 9.41438L12 13.0396L16.5315 9.41438C16.855 9.15562 17.3269 9.20806 17.5857 9.53151C17.8444 9.85495 17.792 10.3269 17.4685 10.5857L12.4685 14.5857C12.1946 14.8048 11.8054 14.8048 11.5315 14.5857L6.53151 10.5857C6.20806 10.3269 6.15562 9.85495 6.41438 9.53151Z" fill="#1B1E28"/>
                </svg>`);
});

async function signIn() {
    try {
        let checked = $("#check_remember_password").is(":checked");
        if (checked) {
            localStorage.setItem("usname", $("#username").val());
            localStorage.setItem("pass", $("#password").val());
            localStorage.setItem("remember_account", checked);
        }
        else {
            localStorage.removeItem("usname");
            localStorage.removeItem("pass");
            localStorage.setItem("remember_account", checked);
        }
        let data = {
            'username': $("#username").val(),
            "password": $("#password").val()
        };
        let errors = [];
        let swalSubTitle = "<p class='swal__admin__subtitle'>Đăng nhập không thành công!</p>";
        if (data.username.trim().length == 0) {
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
                'warning',
            );
            return;
        }

        let result = await httpService.postAsync("account/api/login", data);
        if (result.status == "200") {
            renderConfetti();
            let token = result.resources.accessToken;
            let profile = result.resources.profile;
            localStorage.setItem("token", token);
            localStorage.setItem("profile", JSON.stringify(profile));
            document.cookie = `${accessKey}=${token}`;
            Swal.fire("Đăng nhập thành công", "Chào mừng <b>" + data.username + "</b> trở lại.", "success").then(function () {
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
            "Đăng nhập thất bại",
            "Tài khoản hoặc mật khẩu không chính xác. <br>Vui lòng thử lại sau!",
            "error");
        console.error(e);
    }
}
$("#btnLogin").on("click", function (e) {
    e.preventDefault();
    signIn();
})
$(document).on('keyup', function (e) {
    let key = e.which;
    if (key == 13) {
        signIn();
    }
});

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

//login google
google.accounts.id.initialize({
    client_id: '50294875820-f2opokj2gljfet85hisv53k85e3or4n7.apps.googleusercontent.com',
    callback: handleCredentialResponse,
    ux_mode: "popup",

});
google.accounts.id.prompt();
const createFakeGoogleWrapper = () => {
    const googleLoginWrapper = document.createElement("div");
    googleLoginWrapper.style.display = "none";
    googleLoginWrapper.classList.add("custom-google-button");

    // Add the wrapper to body
    document.body.appendChild(googleLoginWrapper);

    // Use GSI javascript api to render the button inside our wrapper
    // You can ignore the properties because this button will not appear
    google.accounts.id.renderButton(googleLoginWrapper, {
        theme: 'outline',
    });

    const googleLoginWrapperButton =
        googleLoginWrapper.querySelector("div[role=button]");

    return {
        click: () => {
            googleLoginWrapperButton.click();
        },
    };
}

const googleButtonWrapper = createFakeGoogleWrapper();
$("#login-width-google").on("click", function (e) {
    e.preventDefault();
    googleButtonWrapper.click()
})

function handleCredentialResponse(response) {
    // decodeJwtResponse() is a custom function defined by you
    // to decode the credential response.
    if (response == null || response == undefined) {
        Swal.fire(
            'Đăng nhập thất bại',
            'Vui lòng kiểm tra lại thông tin đăng nhập!',
            'error'
        );
    }
    const responsePayload = decodeJwtResponse(response.credential);

    var obj = {
        id: responsePayload.sub,
        fullName: responsePayload.name,
        photo: responsePayload.picture,
        email: responsePayload.email,
    }

    loginWithGoogle(obj);
}

async function loginWithGoogle(obj) {
    $.ajax({
        url: systemURL + 'account/api/sign-in-google',
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(obj),
        success: function (responseData) {
            if (responseData.status == 200 && responseData.message == "SUCCESS") {
                if (responseData.data != null) {
                    localStorage.setItem("profile", JSON.stringify(responseData.data[0]));
                    localStorage.setItem("token", responseData.data[0].token);
                    Swal.fire({
                        title: 'Đăng nhập thành công',
                        html: `Chào mừng <b>${responseData.data[0].name ? responseData.data[0].name : ""}</b> quay trở lại.`,
                        icon: 'success',
                        focusConfirm: true,
                        allowEnterKey: true,
                        showCancelButton: false,
                        confirmButtonText: 'OK'
                    }).then(() => {
                        window.location.href = '/';
                    })
                } else {
                    localStorage.setItem("profile", JSON.stringify(responseData.resources));
                    localStorage.setItem("token", responseData.resources.token);
                    Swal.fire({
                        title: 'Đăng nhập thành công',
                        html: `Chào mừng <b>${responseData.resources.name ? responseData.resources.name : ""}</b> quay trở lại.`,
                        icon: 'success',
                        focusConfirm: true,
                        allowEnterKey: true,
                        showCancelButton: false,
                        confirmButtonText: 'OK'
                    }).then(() => {
                        window.location.href = '/';
                    })
                }
            }
            else if (responseData.status == 400 && responseData.message === "BAD_REQUEST") {
                Swal.fire({
                    title: 'Đăng nhập thất bại',
                    html: responseData.title,
                    icon: 'warning',
                    focusConfirm: true,
                    allowEnterKey: true,
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                })
            }
        },
        error: function (e) {
            //console.log(e);
            Swal.fire(
                'Đăng nhập thất bại',
                'Vui lòng thử lại!',
                'error'
            );
        }
    })
}

//login facebook:

$("#login-width-facebook").on("click", function (e) {
    e.preventDefault();
    FB.login(function (response) {
        // handle the response
        if (response.status === 'connected') {
            // Logged into your webpage and Facebook.
            FB.api('/me', { locale: 'en_US', fields: 'id,first_name,middle_name,last_name,email,birthday,gender,picture,name' }, function (response) {
                if (response && !response.error) {
                    /* handle the result */
                    var facebookAccount = {
                        "id": response.id,
                        "fullname": response.name,
                        "email": response.email == undefined ? "" : response.email,
                        "photo": response.picture.data.url,
                    };
                    //console.log(facebookAccount, );
                    loginWithFacebook(facebookAccount);
                } else {
                    Swal.fire(
                        'Đăng nhập thất bại',
                        'Vui lòng thử lại!',
                        'error'
                    );
                }


            });
        } else {
            // The person is not logged into your webpage or we are unable to tell.

        }

    }, { scope: 'public_profile,email' });
})

function loginWithFacebook(obj) {
    $.ajax({
        url: systemURL + 'account/api/sign-in-facebook',
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(obj),
        success: function (responseData) {
            if (responseData.status == 200 && responseData.message == "SUCCESS") {
                if (responseData.data != null) {
                    localStorage.setItem("profile", JSON.stringify(responseData.data[0]));
                    localStorage.setItem("token", responseData.data[0].token);
                    Swal.fire({
                        title: 'Đăng nhập thành công',
                        html: `Chào mừng <b>${responseData.data[0].name ? responseData.data[0].name : ""}</b> quay trở lại.`,
                        icon: 'success',
                        focusConfirm: true,
                        allowEnterKey: true,
                        showCancelButton: false,
                        confirmButtonText: 'OK'
                    }).then(() => {
                        window.location.href = '/';
                    })
                } else {
                    localStorage.setItem("profile", JSON.stringify(responseData.resources));
                    localStorage.setItem("token", responseData.resources.token);
                    Swal.fire({
                        title: 'Đăng nhập thành công',
                        html: `Chào mừng <b>${responseData.resources.name ? responseData.resources.name : ""}</b> quay trở lại.`,
                        icon: 'success',
                        focusConfirm: true,
                        allowEnterKey: true,
                        showCancelButton: false,
                        confirmButtonText: 'OK'
                    }).then(() => {
                        window.location.href = '/';
                    })
                }
            }
            else if (responseData.status == 400 && responseData.message === "BAD_REQUEST") {
                Swal.fire({
                    title: 'Đăng nhập thất bại',
                    html: responseData.title,
                    icon: 'warning',
                    focusConfirm: true,
                    allowEnterKey: true,
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                })
            }
        },
        error: function (e) {
            //console.log(e);
            Swal.fire(
                'Đăng nhập thất bại',
                'Vui lòng kiểm tra lại thông tin đăng nhập!',
                'error'
            );
        }
    })
}

function decodeJwtResponse(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
        atob(base64)
            .split("")
            .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
    );

    return JSON.parse(jsonPayload);
}