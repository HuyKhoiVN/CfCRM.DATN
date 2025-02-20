"use strict";
 
let params = new URL(document.location).searchParams;
let id = parseInt(params.get("id"));
const bg_normal = "rgba(54, 161, 0, 0.10)";
const bg_light = "rgba(255, 193, 51, 0.20)";
const bg_fit = "rgba(255, 193, 51, 0.20)";
const bg_heavy = "rgba(255, 0, 0, 0.20)";
const bg_weighty = "rgba(255, 0, 0, 0.20)";
const name_section_loau = "Lo âu"
const name_section_tramcam = "Trầm cảm"
const name_section_cangthang = "Căng thẳng"
const name_section_stress = "Stress";
$(document).ready(function () {
    LoadDataSurvey();
});
async function LoadDataSurvey() {
    var result = await httpService.getAsync("survey/api/GetSurveyResult/" + id);
    let resultApi = await httpService.getAsync("surveyAccount/api/ListBySurveyAccountId/" + id);
    let resultSurvey = resultApi.data[0];

    let maxScore = -Infinity;
    for (const section of resultSurvey.surveySectionAccounts) {
        if (section.score > maxScore) {
            maxScore = section.score;
        }

        if (removeVietnameseTones(name_section_loau) == removeVietnameseTones(section.name)) {
            $(".mark_concerned").each(function (index, item) {
                if ($(item).attr("data-value") != section.score) {
                    $(item).addClass("mark_active");
                }
            })
        }

        if (removeVietnameseTones(name_section_tramcam) == removeVietnameseTones(section.name)) {
            $(".mark_depression").each(function (index, item) {
                if ($(item).attr("data-value") != section.score) {
                    $(item).addClass("mark_active");
                }
            })
        }

        if (removeVietnameseTones(name_section_stress) == removeVietnameseTones(section.name) || removeVietnameseTones(name_section_cangthang) == removeVietnameseTones(section.name)) {
            $(".mark_stress").each(function (index, item) {
                if ($(item).attr("data-value") != section.score) {
                    $(item).addClass("mark_active");
                }
            })
        }
    }

    switch (maxScore) {
        case 1:
            $("#noti_result").css('background-color', bg_normal);
            break;
        case 2:
            $("#noti_result").css('background-color', bg_light);
            break;
        case 3:
            $("#noti_result").css('background-color', bg_light);
            break;
        case 4:
            $("#noti_result").css('background-color', bg_weighty);
            break;
        case 5:
            $("#noti_result").css('background-color', bg_weighty);
            break;
    }


    if (result.status == "200") {
        var html = '';
        result.data[0].listSurveyResultDetail.forEach(function (item, index) {
            var htmlAnswer = '';
            item.listAnswer.forEach(function (itemAnswer) {
                if (itemAnswer.description == "1") {
                    htmlAnswer += `<div class="d-flex flex-row gap-16px "><input type="radio" class="radio_style" disabled id="` + itemAnswer.id + `" name="fav_language_` + item.id + `" checked value="` + itemAnswer.id + `">
                     <label for="` + itemAnswer.id + `">` + itemAnswer.name + `</label></div>`;
                }
                else {
                    htmlAnswer += `<div class="d-flex flex-row gap-16px"><input type="radio" class="radio_style" disabled id="` + itemAnswer.id + `" name="fav_language_` + item.id + `" value="` + itemAnswer.id + `">
                     <label for="` + itemAnswer.id + `">` + itemAnswer.name + `</label></div>`;
                }
             
            });
            html += `
                <div class="d-flex item-card flex-column col-lg-6-happys col-xs-12-happys gap-16px p-0 justify-content-end">
                 <p>`+ (index + 1) + `. ` + item.questionName +`:</p>
                 <div class="result_survey_section_answer d-flex flex-column align-items-start gap-16px">
                    `+ htmlAnswer +`
                 </div>
                 </div>
            `;
        });
        $(".result_survey_section_question").append(html);
        $("#title_survey").text(result.data[0].nameSurvey);
        $("#identify_counselor").text(result.data[0].textSurveyAccount);
        /*$(".result_survey_sumary_description").text(result.data[0].descriptionSurveyAccount);*/
    }
}
function removeVietnameseTones(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g, " ");
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    return str;
}