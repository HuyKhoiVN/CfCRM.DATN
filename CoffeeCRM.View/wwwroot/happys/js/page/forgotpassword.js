var currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab

function showTab(n) {
    // This function will display the specified tab of the form...
    var x = document.getElementsByClassName("tab");
    x[n].style.display = "block";
    //... and fix the Previous/Next buttons:
    if (n == 0) {
        document.getElementById("prevBtn").style.display = "none";
    } else {
        document.getElementById("prevBtn").style.display = "inline-flex";
    }
    if (n == (x.length - 1)) {
        document.getElementById("nextBtn").innerHTML = "Hoàn thành";
    } else {
        document.getElementById("nextBtn").innerHTML = "Tiếp theo";
    }
    //... and run a function that will display the correct step indicator:
    fixStepIndicator(n)
}

function nextPrev(n) {
    // This function will figure out which tab to display
    var x = document.getElementsByClassName("tab");
    // Exit the function if any field in the current tab is invalid:
    if (n == 1 && !validateForm()) return false;
    // Hide the current tab:
    x[currentTab].style.display = "none";
    // Increase or decrease the current tab by 1:
    currentTab = currentTab + n;
    // if you have reached the end of the form...
    if (currentTab >= x.length) {
        // ... the form gets submitted:
        changePassword();
        return false;
    }
    // Otherwise, display the correct tab:
    showTab(currentTab);
}

function validateForm() {
    // This function deals with validation of the form fields
    var x, y, i, z, valid = true;
    x = document.getElementsByClassName("tab");
    y = x[currentTab].getElementsByTagName("input");
    z = x[currentTab].getElementsByClassName("invalid_text");
    // A loop that checks every input field in the current tab:
    for (i = 0; i < y.length; i++) {
        if (y[i].ariaCurrent == "email") {
            if (!validateEmail(y[i].value)) {
                y[i].className += " invalid";
                z[i].innerHTML = y[i].name + " không đúng định dạng";
                z[i].style.display = "block";
                valid = false;
            }
        }
        if (y[i].ariaCurrent == "newpassword") {
            if (!validPassword(y[i].value)) {
                y[i].className += " invalid";
                z[i].innerHTML = y[i].name + " có ít nhất 6 ký tự";
                z[i].style.display = "block";
                valid = false;
            }
        }
        if (y[i].ariaCurrent == "confirmnewpassword") {
            if (!checkPasswork(y[i].value)) {
                y[i].className += " invalid";
                z[i].innerHTML = y[i].name + " không chính xác";
                z[i].style.display = "block";
                valid = false;
            }
        }
        if (y[i].value == "") {
            // add an "invalid" class to the field:
            y[i].parentElement.className += " invalid";
            z[i].innerHTML = y[i].name + " không được để trống";
            z[i].style.display = "block";
            // and set the current valid status to false
            valid = false;
        }
    }
    return valid; // return the valid status
}

function fixStepIndicator(n) {
    // This function removes the "active" class of all steps...
    var i, x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
        x[i].className = x[i].className.replace(" active", "");
    }
}

const togglePassword = document.querySelector('#toggle_password');
const toggleConfirmPassword = document.querySelector('#toggle_confirm_password');
const password = document.querySelector('#fw-password');
const confirmpassword = document.querySelector('#confirm-password');

if (togglePassword) {
    togglePassword.addEventListener('click', function (e) {
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        this.classList.toggle('bi-eye');
    });
}
if (toggleConfirmPassword) {
    toggleConfirmPassword.addEventListener('click', function (e) {
        const type = confirmpassword.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmpassword.setAttribute('type', type);
        this.classList.toggle('bi-eye');
    });
}

function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}
function validPassword(password) {
    //const passwordCheck = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    //if (!password.match(passwordCheck)) {
    //    return false;
    //}
    //return true;
    if (password.length >= 6) {
        return true;
    }
    return false;
}
function checkPasswork(confirmnewpassword) {
    if (confirmnewpassword.toString().trim() == $("#fw-password").val().toString().trim()) {
        return true;
    }
    return false;
}
async function SendEmailForgotPassword() {
    var email = $("#email").val();
    var obj = {
        "Email": email,
    }
    var regex = /^([\w-\.]+\u0040([\w-]+\.)+[\w-]{2,4})?$/;
    if (email.length < 1) {
        Swal.fire({
            icon: 'warning',
            title: 'Gửi Email thất bại.',
            text: 'Bạn chưa điền Email.'
        });
    }
    else if (!regex.test(email)) {
        Swal.fire({
            icon: 'warning',
            title: 'Gửi Email thất bại.',
            text: 'Email không hợp lệ.'
        });
    }
    else {
        var res = await httpService.postAsync("account/api/forgot-password-by-user?value=" + email + "", obj);
        if (res.status == 200 && res.message === "SUCCESS") {
            Swal.fire({
                icon: 'success',
                title: 'Gửi email thành công',
                html: 'Vui lòng kiểm tra email để cập nhật mật khẩu tài khoản',
                showCloseButton: false,
                focusConfirm: true,
                confirmButtonText: 'Ok',
            }).then(() => {
                //window.location.href = "sign-in";
            })
        }
        else if (!res.isSucceeded) {
            if (res.status == 400) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Gửi email thất bại',
                    html: res.errors != '' ? res.errors : 'Vui lòng kiểm tra lại thông tin của bạn',
                    showCloseButton: false,
                    focusConfirm: true,
                    confirmButtonText: 'Ok',
                })
            }
            else if (res.status == 420) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Gửi email thất bại',
                    html: res.errors != '' ? res.errors : 'Vui lòng kiểm tra lại thông tin của bạn',
                    showCloseButton: false,
                    focusConfirm: true,
                    confirmButtonText: 'Ok',
                })
            }
            else if (res.status == 410) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Gửi email thất bại',
                    html: res.errors != '' ? res.errors : 'Vui lòng kiểm tra lại thông tin của bạn',
                    showCloseButton: false,
                    focusConfirm: true,
                    confirmButtonText: 'Ok',
                })
            }
            else if (res.status == 404) {
                debugger
                Swal.fire({
                    icon: 'warning',
                    title: 'Gửi email thất bại',
                    html: res.message != '' ? res.message : 'Vui lòng kiểm tra lại thông tin của bạn',
                    showCloseButton: false,
                    focusConfirm: true,
                    confirmButtonText: 'Ok',
                })
            }
        }
    }
}
async function changePassword() {
    let data = {
        "email": $("#email").val(),
        "hash": $("#fw-code").val(),
        "hash": $("#fw-code").val(),
        "newPassword": $("#fw-password").val(),
    };
    var result = await httpService.postAsync("account/api/change-password-by-forgot", data);
    if (result.status == "200") {
        Swal.fire({
            icon: 'success',
            title: 'Đổi mật khẩu thành công',
            html: 'Vui lòng đăng nhập để sử dụng hệ thống',
            showCloseButton: false,
            focusConfirm: true,
            confirmButtonText: 'Đồng ý',
        }).then(() => {
            window.location.href = "/";
        })
    }
    else {
        Swal.fire({
            icon: 'error',
            title: 'Không thành công',
            html: 'Vui lòng thử lại để đổi mật khẩu',
        });
    }
}
