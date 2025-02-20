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
    var result = await httpService.getAsync("account/api/profile/" + id);
    var genderCustomer = ""
    if (result.status = "200") {
        var data = result.data[0];
        if (data.gender != null) {
            if (data.gender == "male") {
                genderCustomer = "Nam"
            }
            else {
                genderCustomer = "Nữ"
            }
        }
        else {
            genderCustomer = ""
        }
        $(".author_img img, .p_info_item_happys img").attr("src", data.photo != "" ? data.photo : "https://static-00.iconduck.com/assets.00/avatar-default-symbolic-icon-2048x1949-pq9uiebg.png")
        $("#email").val(data.email);
        $("#fullname").val(data.name);
        $("#dob").val(moment(data.dob).format("DD/MM/YYYY"));
        $("#gender").val(genderCustomer).trigger("change");
        $("#address").val(data.address != null ? data.address : "Trống");
        $("#medicalinfo-phone").val(data.phone != null ? data.phone : "");
        $("#class").val(data.className != null ? data.className : "");
        $("#school").val(data.schoolName != null ? data.schoolName : "");
        profile = result.data;
    }
}