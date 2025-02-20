/**
 * Author: Ha Thanh Nguyen
 * Created: 10/08/2024
 * Description: Admin user profile javascript
 */
"use strict";
$(document).ready(function () {
    $("#adminAccountPhoto").on("change", async function (e) {
        let obj = currentUser;
        let filePath = $(this).attr("file-path");
        if (filePath != undefined && filePath.trim().length > 0) {
            filePath = filePath.replace(systemConfig.defaultStorageURL, "");
            obj.photo = filePath;
            $("#loading").addClass("show");
            try {
                let result = await httpService.putAsync("api/admin-account/update", currentUser);
                $("#loading").removeClass("show");
                if (result.isSucceeded) {
                    getInfo();
                }
                else {
                    Swal("Cập nhật ảnh", "Đã có lỗi xảy ra, xin vui lòng thử lại sau!", "error");
                }
            } catch (e) {
                $("#loading").removeClass("show");
                console.error(e);
            }
        }
    });
    $("#btn_edit_profile").on("click", async function () {
        await getInfo();
        $("#adminAccountEmail").val(currentUser.email).trigger("change");
        $("#adminAccountFullName").val(currentUser.fullName).trigger("change");
        $("#adminAccountUserName").val(currentUser.userName).trigger("change");
        $("#adminAccountPhone").val(currentUser.phone).trigger("change");
        $("#adminAccountDescription").val(currentUser.description).trigger("change");
        $("#modal_admin_account .modal-title").text('Cập nhật thông tin cá nhân');
        $("#modal_admin_account").modal("show");
    })
    $("#btn_update_password").on("click", function () {
        let obj = {
            "oldPassword": $("#oldPass").val(),
            "newPassword": $("#newPass").val(),
            "reNewPassword": $("#confirmNewPass").val()
        }
        swal.fire({
            title: "Đổi mật khẩu",
            html: "Bạn có chắc chắn muốn cập nhật mật khẩu mới?",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#443',
            cancelButtonText: 'Hủy',
            confirmButtonText: 'Lưu'
        }).then(async (result) => {
            if (result.isConfirmed) {
                $("#loading").addClass("show");
                try {
                    let result = await httpService.postAsync("api/admin-account/update-password", obj);
                    $("#loading").removeClass("show");
                    if (result.isSucceeded) {
                        Swal.fire(
                            'Đổi mật khẩu',
                            'Mật khẩu của bạn đã được cập nhật thành công.',
                            'success'
                        ).then((result) => {
                            window.location.reload();
                        });
                    }
                    else {
                        if (result.status == 400) {
                            let swalSubTitle = "<p class='swal__admin__subtitle'>Cập nhật mật khẩu không thành công</p>";
                            if (result.errors != null) {
                                let contentError = "<ul>";
                                result.errors.forEach(function (item, index) {
                                    contentError += "<li class='text-start'>" + item + "</li>";
                                })
                                contentError += "</ul>";
                                Swal.fire(
                                    'Đổi mật khẩu' + swalSubTitle,
                                    contentError,
                                    'warning'
                                );

                            } else {
                                let contentError = `<ul>
                                                <li class='text-start'>`+ result.message + `</li>
                                </ul>`;
                                Swal.fire(
                                    'Đổi mật khẩu' + swalSubTitle,
                                    contentError,
                                    'warning'
                                );
                            }
                        }
                        else {
                            Swal.fire(
                                'Đổi mật khẩu',
                                `Cập nhât mật khẩu không thành công, <br> vui lòng thử lại sau!`,
                                'error'
                            );
                        }
                    }
                    $("#loading").removeClass("show");
                }
                catch (e) {
                    console.error(e);
                    if (e.status === 401) {
                        Swal.fire(
                            'Đổi mật khẩu',
                            'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                            'error'
                        ).then(function () {
                            window.location.href = "/home/login";
                        });
                    }
                    else if (e.status == 403) {
                        Swal.fire(
                            'Đổi mật khẩu',
                            'Bạn không có quyền sử dụng tính năng này.',
                            'error'
                        );
                    }
                    else {
                        swal.fire(
                            'Đổi mật khẩu',
                            `Cập nhật mật khẩu không thành công, <br> vui lòng thử lại sau!`,
                            'error'
                        );
                    }
                    $("#loading").removeClass("show");
                }
            }
        });
    })

    $("#saveData").on("click", function () {
        let obj = currentUser;
        obj.email = $("#adminAccountEmail").val();
        obj.fullName = $("#adminAccountFullName").val();
        obj.phone = $("#adminAccountPhone").val();
        obj.description = $("#adminAccountDescription").val().escape();
        swal.fire({
            title: "Thông tin cá nhân",
            html: "Bạn có chắc chắn muốn cập nhật thông tin cá nhân?",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#443',
            cancelButtonText: 'Hủy',
            confirmButtonText: 'Lưu'
        }).then(async (result) => {
            if (result.isConfirmed) {
                $("#loading").addClass("show");
                try {
                    let result = await httpService.putAsync("api/admin-account/update", obj);
                    $("#loading").removeClass("show");
                    if (result.isSucceeded) {
                        Swal.fire(
                            'Thông tin cá nhân',
                            'Thông tin cá nhân của bạn đã được cập nhật thành công.',
                            'success'
                        ).then((result) => {
                            $("#modal_admin_account").modal("hide");
                            getInfo();
                        });
                    }
                    else {
                        if (result.status == 400) {
                            let swalSubTitle = "<p class='swal__admin__subtitle'>Cập nhật thông tin không thành công</p>";
                            if (result.errors != null) {
                                let contentError = "<ul>";
                                result.errors.forEach(function (item, index) {
                                    contentError += "<li class='text-start'>" + item + "</li>";
                                })
                                contentError += "</ul>";
                                Swal.fire(
                                    'Thông tin cá nhân' + swalSubTitle,
                                    contentError,
                                    'warning'
                                );

                            } else {
                                let contentError = `<ul>
                                                <li class='text-start'>`+ result.message + `</li>
                                </ul>`;
                                Swal.fire(
                                    'Thông tin cá nhân' + swalSubTitle,
                                    contentError,
                                    'warning'
                                );
                            }
                        }
                        else {
                            Swal.fire(
                                'Thông tin cá nhân',
                                `Cập nhât thông tin cá nhân không thành công, <br> vui lòng thử lại sau!`,
                                'error'
                            );
                        }
                    }
                    $("#loading").removeClass("show");
                }
                catch (e) {
                    console.error(e);
                    if (e.status === 401) {
                        Swal.fire(
                            'Thông tin cá nhân',
                            'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                            'error'
                        ).then(function () {
                            window.location.href = "/home/login";
                        });
                    }
                    else if (e.status == 403) {
                        Swal.fire(
                            'Thông tin cá nhân',
                            'Bạn không có quyền sử dụng tính năng này.',
                            'error'
                        );
                    }
                    else {
                        swal.fire(
                            'Thông tin cá nhân',
                            `${actionName} tài khoản không thành công, <br> vui lòng thử lại sau!`,
                            'error'
                        );
                    }
                    $("#loading").removeClass("show");
                }
            }
        });
    })
})

