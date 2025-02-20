"use strict";
var surveyAccountId;
var loadDataSurvey = async function loadDataSurveyHistory() {
    try {
        var result = await httpService.getAsync("SurveyAccount/api/ListSurveyByAccountId?pageIndex=" + pageIndex + "&pageSize=" + pageSize + "");
        $("#survey_history").html('');
        if (result.status == "200") {
            result.data.forEach(function (item) {
                surveyAccountId = item.id
                var currentValue = item.createdTime
                if (!currentValue.includes("T")) return
                var date = new Date(currentValue);
                var newValue = date.toLocaleDateString('vi-VN') + " - " + date.toLocaleTimeString("vi-VN");
                $("#survey_history").append(`
                     <div class="card-history">
                        <div class="item">
                            <div class="img">
                                <img src="${item.photo}" />
                            </div>
                            <div class="info">
                                <div class="title">
                                    <label class="name-survey-history">`+ newValue + `</label>
                                </div>
                                <div class="tags">
                                    <div class="tag-survey-history">
                                       <span class="text-survey-history"><a href="/ket-qua-trac-nghiem-sktt/${surveyAccountId}">${item.text}</a></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
        `)
            });
        }
    } catch (e) {
        $("#surveyHistory").html(`<div class="not-found d-flex flex-column align-items-center">
            <img style="width:400px;height:auto;" src="/images/default/not-found.png"/>
            <p>Chưa có dữ liệu hiển thị</p>
        </div>`)
    }
    
}


function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

function timeSince(dateTime) {
    const currentTime = new Date();
    const timeDifference = (currentTime - new Date(dateTime)) / 1000;
    return formatTime(new Date(dateTime));
}

function formatDate(dateObject) {
    var d = new Date(dateObject);
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }
    var date = day + "/" + month + "/" + year;

    return date;
};
$(document).ready(function () {
    loadDataSurvey.call();
});
