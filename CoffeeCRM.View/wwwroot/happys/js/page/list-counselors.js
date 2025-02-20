"use strict";

var dataSource = [];
var content = "Là một trong những bác sĩ đầu ngành về khám, điều trị các rối loạn tâm lý, tinh thần. Ngoài công tác khám chữa bệnh và giảng dạy, bác sĩ còn trực tiếp xuất bản các đầu sách chuyên môn, giáo trình giảng dạy về sức khỏe tinh thần. Bác sĩ khám và điều trị hầu hết các rối loạn tinh thần và không hạn chế về độ tuổi.Đặc biệt người bệnh gặp các vấn đề về rối loạn về giấc ngủ: mất ngủ, ngủ nhiều, ác mộng, hoảng sợ khi ngủ, rối loạn nhịp thức ngủ, đi trong giấc ngủ(chứng miên hành),...có thể tham khảo thăm khám với bác sĩ."
var healthFacilityName = ""
var loadData = async function LoadHealthFacities() {
    var result = await httpService.getAsync("Account/api/ListCounselor?pageIndex=" + pageIndex + "&pageSize=" + pageSize + "&accountId=" + accountId);
    $(".list-counselors").html('');
    if (result.status == "200") {
        dataSource = result.data;
        dataSource.forEach(function (item, index) {
            var slogan = "";
            if (item.slogan == null || item.slogan == undefined) {
                slogan = "";
            }
            else {
                slogan = `<div class="w-100 slogan">
                                <span class="line">`+ item.slogan + `</span>
                        </div>`;
            }
            if (item.description == null) {
                item.description = content
            }
            if (item.healthFacilityName == null) {
                healthFacilityName = ""
            }
            else {
                healthFacilityName = `<div class="tag">
                    <span class="line">`+ item.healthFacilityName +`</span>
                </div>`
            }
            $(".list-counselors").append(`
            <div class="screen" style="padding-left: 0px !important;">
            <div class="card d-flex flex-column big-none" style="padding: 32px !important; margin-right: 0px !important">
                <div class="d-flex info_body">
                    <a href="`+ systemURL + `counselors-details?id=` + item.accountId + `" class="ava">
                        <img src="`+ item.photo + `" />
                    </a>

                    <div class="w-100 info">
                        <div class="info-header" style="margin-bottom: 16px;">
                            <a class="name w-100" href="`+ systemURL +`chi-tiet-tu-van-vien?id=`+ item.accountId + `" id="accountName">` + item.accountName + `</a>
                            
                        </div>

                        <div class="d-flex flex-column">
                        `+ slogan +`
                        </div>
                        

                        <p class="des">
                            `+ item.description +`
                        </p>
                    </div>
                </div>

                <div class="info-footer">
                    <div class="interact d-flex">
                        <div class="w-100" style="padding-left: 0px;">
                            <label class="number">`+ item.countInteract +`</label>
                            <span class="tags">Lượt tương tác</span>
                        </div>
                        <div class="w-100 d-flex align-items-center">
                            <label class="lines"></label>
                        </div>
                        <div class="w-100" style="padding-left: 0px;">
                            <label class="number">`+ item.countBooking +`</label>
                            <span class="tags">Lượt đặt lịch hẹn</span>
                        </div>

                    </div>
                    <div class="info-button">
                        <div class="w-100 button_booking">
                            <a class="btn btnHS inbox btn-lg shadow-lg rounded-pill" href="/thong-tin-ca-nhan?messageTo=`+ item.accountId + `">Nhắn tin</a>
                        </div>
                    </div>
                </div>

            </div>
            <div class="card small-none" style="padding: 16px !important">
                <div class="d-flex">
                    <div class="ava">
                        <img style="width: 120px;" src="`+ item.photo + `" />
                    </div>

                    <div class="w-100 info">
                        <div class="info-header" style="margin-bottom: 16px;">
                            <span class="name">`+ item.accountName + `</span>
                            <div class="d-flex my-rating" data-rating="`+ item.totalRating +`">
                            </div>
                        </div>

                        <div class="interact d-flex">
                            <div class="w-100 left" style="padding-left: 0px;">
                                <label class="number">`+ item.countInteract +`</label>
                                <span class="tags">Lượt tương tác</span>
                            </div>
                            <div class="d-flex align-items-center">
                                <label class="lines"></label>
                            </div>
                            <div class="w-100 right" style="padding-left: 0px;">
                                <label class="number">`+ item.countBooking +`</label>
                                <span class="tags">Lượt đặt lịch hẹn</span>
                            </div>

                        </div>

                    </div>


                </div>

                <div class="w-100 mess" style="margin-top: 30px;">
                    <div class="tag">
                        <span class="line">`+ item.workingName +`</span>
                    </div>

                    `+ healthFacilityName + `

                    <p class="des">
                       `+ item.description +`
                    </p>
                </div>

                <div class="info-button">
                    <div class="w-100 button_booking">
                        <a class="btn btn-primary inbox btn-lg shadow-lg rounded-pill" href="/thong-tin-ca-nhan??messageTo=`+ item.accountId + `">Chat với cán bộ tư vấn</a>
                    </div>
                </div>
            </div>
        </div>
        `)
        });
        $(".my-rating").starRating({
            useGradient: false,
            starSize: 20,
            readOnly: true,
            starShape: 'rounded'
        });
    }
}

$(document).ready(async function () {
    await loadData.call();
    let element = $(".counselor_container .pagination_default")
    LoadPagingPage("Account/api/CountCounselor", element, loadData);
    localStorage.setItem('tabActive', 'message');
});

