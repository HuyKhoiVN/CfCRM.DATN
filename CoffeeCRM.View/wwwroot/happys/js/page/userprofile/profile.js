"use strict";

var profile = [];
var medicalProfile = [];
$(document).ready(function () {
    $('.select2').select2();
    $('b[role="presentation"]').hide();
    $('.select2-selection__arrow').append(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M6.41438 9.53151C6.67313 9.20806 7.1451 9.15562 7.46855 9.41438L12 13.0396L16.5315 9.41438C16.855 9.15562 17.3269 9.20806 17.5857 9.53151C17.8444 9.85495 17.792 10.3269 17.4685 10.5857L12.4685 14.5857C12.1946 14.8048 11.8054 14.8048 11.5315 14.5857L6.53151 10.5857C6.20806 10.3269 6.15562 9.85495 6.41438 9.53151Z" fill="#1B1E28"/>
                </svg>`);

    LoadProfile();
});
async function LoadProfile() {
    var result = await httpService.getAsync("account/api/profile/");
    console.log(result);
    if (result.status = "200") {
        var data = result.data[0];
        $(".author_img img, .p_info_item_happys img").attr("src", data.photo != "" ? data.photo : "https://static-00.iconduck.com/assets.00/avatar-default-symbolic-icon-2048x1949-pq9uiebg.png")
        $("#email").val(data.email);
        $("#fullname").val(data.name);
        $("#nickname").val(data.linkedAccount);
        $("#dob").val(data.dob != null ? moment(data.dob).format("DD/MM/YYYY") : "");
        $("#gender").val(data.gender != null ? data.gender : "0").trigger("change");
        $("#address").val(data.address != null ? data.address : "Trống");
        $("#medicalinfo-phone").val(data.phone != null ? data.phone : "");
        $("#class").val(data.className != null ? data.className : "")
        $("#school").val(data.schoolName != null ? data.schoolName : "")
        profile = result.data;
    }
}
async function UpdateProfile() {
    const data = {
        "name": $("#fullname").val(),
        "linkedAccount": $("#nickname").val(),
        "firstName": "",
        "middleName": "",
        "lastName": "",
        "phone": $("#medicalinfo-phone").val(),
        "address": $("#address").val(),
        "gender": $("#gender").val(),
        "email": $("#email").val(),
        "dob": $("#dob").val() == '' ? undefined  : moment(formatDatetime($("#dob").val())).format("YYYY - MM - DD"),
    };
    var fullName = $("#fullname").val().split(" ");
    if (fullName.length > 0) {
        if (fullName.length > 3) {
            data.firstName = fullName.slice(0, 2).join(' ');
        } else {
            data.firstName = fullName.slice(0, 1).join(' ');
        }

        if (fullName.length > 2) {
            data.lastName = fullName.slice(-2, -1).join(' ');
            data.middleName = fullName.slice(-1).join(' ');
        } else {
            data.lastName = fullName.slice(-1).join(' ');
            data.middleName = "";
        }
    }
    try {
        var result = await httpService.postAsync("account/api/update-profile", data);
        if (result.status == "200") {
            Swal.fire("Cập nhật thành công", "Đã cập nhật tài khoản thành công.", "success");
        } else if (result.status == "202") {
            Swal.fire("Cập nhật thất bại", "Email đã tồn tại.", "warning");
        } else if (result.status == "204") {
            Swal.fire("Cập nhật thất bại", "Số điện thoại đã tồn tại.", "warning");
        }
        if (result.status == "400") {
            Swal.fire("Cập nhật thất bại", "Cập nhật tài khoản không thành công.", "error");
        }
    } catch (e) {
        Swal.fire("Cập nhật thất bại", "Cập nhật tài khoản không thành công.", "error");
    }
   
}

$("#btnSave").click(function () {
    Swal.fire({
        title: 'Xác nhận thay đổi?',
        text: "Bạn xác nhận cập nhật tài khoản!",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.value) {
            UpdateProfile();
        }
    })
});
$("#btnUpload").click(function () {
    $("#avatar").click();
});
$("#avatar").on("change", function (e) {
    let file = e.target.files[0];
    uploadFile(file);
});
const uploadFile = async (file) => {
    var formData = new FormData();
    formData.append("file", file);
    axios.post("account/api/ChangeAvatar", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${localStorage.token}`
        },
    }).then((response) => {
        fnSuccess(response);
    }).catch((error) => {
        fnFail(error);
    });
}
const fnSuccess = (response) => { 
    $(".p_info_item_happys img").attr("src", response.data.data[0]);
    $(".author_img img").attr("src", response.data.data[0]);
    Swal.fire("Cập nhật thành công", "Cập nhật ảnh đại diện thành công.", "success");
    let dataBanner = JSON.parse(localStorage.profile);
    dataBanner.photo = response.data.data[0];
    localStorage.setItem("profile", JSON.stringify(dataBanner));
    $(".ava-banner").attr("src", response.data.data[0]);

}
const fnFail = (error) => {
    Swal.fire("Cập nhật thất bại", "Cập nhật ảnh đại diện không thành công.", "error");
}
