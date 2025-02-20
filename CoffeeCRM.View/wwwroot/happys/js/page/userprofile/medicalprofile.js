"use strict"
let dataGrade = [];
$(".input-value[name=calculate]").on("keyup", function () {
    $(this).val($(this).val().replace(/\D/g, '').replace(/\B(?=(\d{2})+(?!\d))/g, '.'));
    $("#medicalinfo-height").parent().css("border", "unset");
    $("#medicalinfo-weight").parent().css("border", "unset");
    calculateBMI();
});
function calculateBMI() {
    var height = parseFloat($("#medicalinfo-height").val().replace(/\D/g, '').replace(/\B(?=(\d{2})+(?!\d))/g, '.'));
    var weight = parseFloat($("#medicalinfo-weight").val());
    if ($("#medicalinfo-height").val().length > 0 && $("#medicalinfo-weight").val().length > 0) {
        var bmi = (weight / (height * height)).toFixed(2);
        $("#medicalinfo-bmi").val(bmi);
    }
    else {
        if ($("#medicalinfo-height").val().length == 0) {
            $("#medicalinfo-height").parent().css("border", "1px solid #ff000054");
        }
        if ($("#medicalinfo-weight").val().length == 0) {
            $("#medicalinfo-weight").parent().css("border", "1px solid #ff000054");
        }
        //Swal.fire(
        //    'Thất bại!',
        //    'Bạn chưa nhập chiều cao và cân nặng',
        //    'error'
        //);
    }
}
//Load data
async function LoadMedicalProfile() {
    try {
        var result = await httpService.getAsync("medicalProfile/api/medicalprofile");
        if (result.status == "200") {
            medicalProfile = result.data;
        }
    } catch (e) {
        
    }
}
async function LoadGrade() {
    try {
        var result = await httpService.getAsync("grade/api/list");
        if (result.status == "200") {
            dataGrade = result.data;
            dataGrade.forEach(function (item) {
                $('#medicalinfo-grade').append(new Option(item.description, item.id, false, false));
            });
            $("#medicalinfo-grade").select2();
        }
    } catch (e) {
    }
   
}
$(document).ready(function () {
    LoadGrade();
    //1. Init Thông tin chung
    $.when(LoadProfile()).done(function () {
        if (profile.length > 0) {
            let data = profile[0];
            $("#medicalinfo-name").val(data.id > 0 ? data.name : "");
            $("#medicalinfo-gender").val(data.gender != null ? data.gender : "0").trigger("change");
            $("#medicalinfo-dob").val(moment(data.dob).format("DD/MM/YYYY"));
        }
    });
    //2.Load Thể trạng
    $.when(LoadMedicalProfile()).done(async function () {
        if (medicalProfile.length > 0) {
            let data = medicalProfile[0];
            $("#medicalinfo-height").val(data.id > 0 ? data.height : "");
            $("#medicalinfo-weight").val(data.id > 0 ? data.weight : "");
            $("#medicalinfo-bmi").val(data.id > 0 ? data.bmi : "");
            $("#medicalinfo-blood").val(data.id > 0 ? data.healthInfo : "");
            $(".radio-group input[name=radio_heartdiseasecard]").filter('[value="' + (data.id > 0 ? data.heartDiseaseCard : 0) + '"]').attr('checked', true);
            $(".radio-group input[name=diabetes]").filter('[value="' + (data.id > 0 ? data.diabetes : 0) + '"]').attr('checked', true);
            $(".radio-group input[name=asthma]").filter('[value="' + (data.id > 0 ? data.asthma : 0) + '"]').attr('checked', true);
            $(".radio-group input[name=epilepsy]").filter('[value="' + (data.id > 0 ? data.epilepsy : 0) + '"]').attr('checked', true);
            $(".radio-group input[name=depression]").filter('[value="' + (data.id > 0 ? data.depression : 0) + '"]').attr('checked', true);
            $(".radio-group input[name=stress]").filter('[value="' + (data.id > 0 ? data.stress : 0) + '"]').attr('checked', true);
            $(".radio-group input[name=anxietydisorders]").filter('[value="' + (data.id > 0 ? data.anxietyDisorders : 0) + '"]').attr('checked', true);
            $("#medicalinfo-orther").val(data.id > 0 ? data.orther : "");
            $('#medicalinfo-grade').val(data.gradeId).trigger("change");

            
        }
        try {
            let resultAccountSurvey = await httpService.getAsync("surveyaccount/api/GetResultSurveyLatest");
            if (resultAccountSurvey.status == '200' && resultAccountSurvey.message == 'SUCCESS') {
                if (resultAccountSurvey.data[0]) {
                    $("#medicalinfo_card_result").append(`
                            <div class="result-servey col-lg-6 mt-4 ">
                                <a class="btn btnHS" href="/chi-tiet-bai-trac-nghiem-sktt?id=`+ resultAccountSurvey.data[0].id + `">Xem lại kết quả trắc nghiệm SKTT</a>
                            </div> 
                            <div class="col-lg-6 mt-4">
                                <a id="survey-button" type="button" class="btn btnHS" href="/trac-nghiem-suc-khoe-tam-than">
                                    Tham gia lại trắc nghiệm SKTT
                                </a>
                            </div>
                            `)
                }
                else {
                    $("#medicalinfo_card_result").append(`<div class="col-lg-6 mt-4">
                     <a id="survey-button" type="button" class="btn btnHS" href="/trac-nghiem-suc-khoe-tam-than">
                        Tham gia trắc nghiệm SKTT
                    </a>
                </div>`)
                }
            }
        }
        catch (e) {
            $("#medicalinfo_card_result").append(`<div class="col-lg-6 mt-4">
                    <a id="survey-button" type="button" class="btn btnHS" href="/trac-nghiem-suc-khoe-tam-than">
                        Tham gia trắc nghiệm SKTT
                    </a>
                </div>`)
        }
    });
});

//Update medicalprofile
$("#btn_update_medicalprofile").click(async function () {
    Swal.fire({
        title: 'Xác nhận thay đổi?',
        text: "Bạn xác nhận cập nhật thể trạng!",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy'
    }).then((response) => {
        if (response.value) {
            AddOrUpdatePhysicalCondition();
        }
    });
});
async function AddOrUpdatePhysicalCondition() {
    let errors = [];
    let swalSubTitle = "<p class='swal__admin__subtitle'>Cập nhật không thành công!</p>";
    let data = {
        "id": 0,
        "healthInfo": $("#medicalinfo-blood").val(),
        "height": $("#medicalinfo-height").val(),
        "weight": $("#medicalinfo-weight").val(),
        "bmi": $("#medicalinfo-bmi").val(),
        "gradeId": $("#medicalinfo-grade :selected").val(),
        "accountId": systemConstant.accountId,
    }
    if (data.height.length == 0) {
        errors.push("Chiều cao không được để trống");
    }
    if (data.weight.length == 0) {
        errors.push("Cân nặng không được để trống");
    }
    if (data.bmi.length == 0) {
        errors.push("Chỉ số BMI không được để trống");
    }
    if (errors.length > 0) {
        let contentError = "<ul>";
        errors.forEach(function (item, index) {
            contentError += "<li class='text-start'>" + item + "</li>";
        })
        contentError += "</ul>";
        Swal.fire(
            '' + swalSubTitle,
            contentError,
            'warning'
        );
        return;
    }
    var result = await httpService.postAsync("medicalProfile/api/AddOrUpdateMedicalProfile", data);
    if (result.status == "200") {
        Swal.fire(
            'Thành công!',
            'Bạn đã cập nhật thông tin thể trạng thành công',
            'success'
        );
    }
}

$("#btn_update_anamnesis").click(function () {
    Swal.fire({
        title: 'Xác nhận thay đổi?',
        text: "Bạn xác nhận cập nhật thông tin thể trạng!",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy'
    }).then((response) => {
        if (response.value) {
            AddOrUpdateAnamnesis();
        }
    });
});
async function AddOrUpdateAnamnesis() {
    let data = {
        "id": 0,
        "heartDiseaseCard": $("input[name=radio_heartdiseasecard]:checked").val() != undefined ? $("input[name=radio_heartdiseasecard]:checked").val() : 0,
        "diabetes": $("input[name=diabetes]:checked").val() != undefined ? $("input[name=diabetes]:checked").val() : 0,
        "asthma": $("input[name=asthma]:checked").val() != undefined ? $("input[name=asthma]:checked").val() : 0,
        "epilepsy": $("input[name=epilepsy]:checked").val() != undefined ? $("input[name=epilepsy]:checked").val() : 0,
        "depression": $("input[name=depression]:checked").val() != undefined ? $("input[name=depression]:checked").val() : 0,
        "stress": $("input[name=stress]:checked").val() != undefined ? $("input[name=stress]:checked").val() : 0,
        "anxietyDisorders": $("input[name=anxietydisorders]:checked").val() != undefined ? $("input[name=anxietydisorders]:checked").val() : 0,
        "orther": $("#medicalinfo-orther").val(),
        "accountId": systemConstant.accountId,
    }
    var result = await httpService.postAsync("anamnesis/api/AddOrUpdateAnamnessis", data);
    if (result.status == "200") {
        Swal.fire(
            'Thành công!',
            'Bạn đã cập nhật thông tin sức khỏe thành công',
            'success'
        );
    }
}

$("#survey-button").click("on",function () {
    window.location.href = "/detail-survey"
})

$("#general-editing").click(function () {
    Swal.fire({
        title: 'Xác nhận thay đổi?',
        text: "Bạn xác nhận cập nhật thông tin!",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy'
    }).then((response) => {
        if (response.value) {
            AddOrUpdateAnamnesis();
            AddOrUpdatePhysicalCondition();
        }
    });
});
