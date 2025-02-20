"use strict";

const accessKey = "Authorization";
const params = new URL(document.location).searchParams;
const id = params.get("id");
var content = "Là một trong những bác sĩ đầu ngành về khám, điều trị các rối loạn tâm lý, tinh thần. Ngoài công tác khám chữa bệnh và giảng dạy, bác sĩ còn trực tiếp xuất bản các đầu sách chuyên môn, giáo trình giảng dạy về sức khỏe tinh thần.<br>Bác sĩ khám và điều trị hầu hết các rối loạn tinh thần và không hạn chế về độ tuổi.Đặc biệt người bệnh gặp các vấn đề về rối loạn về giấc ngủ: mất ngủ, ngủ nhiều, ác mộng, hoảng sợ khi ngủ, rối loạn nhịp thức ngủ, đi trong giấc ngủ(chứng miên hành),...có thể tham khảo thăm khám với bác sĩ."
var healthFacilityName = ""
var ratting = ""

const load = async () => {
    console.log(roleAdmin)
    var slogan = "";
    var result = await httpService.getAsync("Account/api/DetailCounselor/" + id);
    $(".details").html('');
    if (result.status == "200") {
        console.log(result.data)
        result.data.forEach(function (item, index) {
            var phoneAccount = item.phone != null ? item.phone : "";
            if (item.slogan == null || item.slogan == undefined) {
                slogan = "";
            }
            else {
                slogan = `<div class="w-100 slogan">
                          <div class="">
                                <span class="line">`+ item.slogan + `</span>
                            </div>
                        </div>`;
            }
            if (roleAdmin == "1000001") {
                ratting = `<div class="input rate">
                                <span class="text-input">
                                    Đánh giá
                                </span>

                                <div class="d-flex evaluate">
                                    <div class="my-rating" data-rating="`+ item.totalRating + `"></div>
                                    <span style="margin-left: 16px; margin-right: 16px;">`+ item.totalRating + `</span>
                                </div>

                            </div>`
            }
            else {
                ratting = ""
            }
            if (item.description == null) {
                item.description = content
            }
            if (item.healthFacilityName == null) {
                item.healthFacilityName = "Chờ cập nhật"
            }

            $(".details").append(`
    <div class="container">
        <div class="screen big">
            <div class="profile">
                <div class="ava">
                    <img class="shadow" src="`+ item.photo + `" />
                </div>
                <div class="w-100 detail-counselors">
               <div class="title-name-counselors">
                            <div class="name-counselors">
                                <label class="name">`+ item.accountName + `</label>
                                                            `+ slogan +`
                            </div>
                            
                            <div class="interact d-flex">
                                <div class="w-100">
                                    <label class="number">`+ item.countBooking + `</label>
                                    <span class="tags">Lượt tương tác</span>
                                </div>
                                <div class="d-flex align-items-center">
                                    <label class="lines"></label>
                                </div>
                                <div class="w-100">
                                    <label class="number">`+ item.countInteract +`</label>
                                    <span class="tags">Lượt đặt lịch hẹn</span>
                                </div>

                            </div>
                        </div>

                    <div class="body-detail">
                        <div class="box">
                         
                            `+ ratting + `
                            <div class="input">
                                <span class="text-input">
                                    Số điện thoại
                                </span>

                                <div class="text-input">
                                    `+ phoneAccount + `
                                </div>

                            </div>
                        </div>

                        <div class="box">
                            <div class="input">
                                <span class="text-input">
                                    Email
                                </span>

                                <div class="text-input">
                                    `+ item.email + `
                                </div>

                            </div>
                        </div>

                        <div class="box">
                            <div class="detail-button">
                                <div class=" button_inbox">
                                    <a class="shadow-lg btn btn-light btnHS  inbox btn-lg rounded-pill" href="/thong-tin-ca-nhan?messageTo=` + item.accountId + `">Nhắn tin</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <label class="name">
                    Thông tin về cán bộ tư vấn
                </label>

                <p class="content">
                    `+ item.description + `
                </p>
            </div>
        </div>
    </div>

    <div class="screen small">
        <div class="banner">
        </div>
        <div class="profile">
            <div class="ava">
                <img src="`+ item.photo + `" />
            </div>

            <div class="w-100 head-detail">
                <label class="name"> `+ item.accountName + `</label>
        <div class="behind-name">
                 `+ slogan +`
                </div>
            </div>
        </div>

        <div class="interact d-flex">
            <div class="w-100">
                <label class="number">`+ item.countBooking + `</label>
                <span class="tags">Lượt tương tác</span>
            </div>
            <div class="d-flex align-items-center">
                <label class="lines"></label>
            </div>
            <div class="w-100">
                <label class="number">`+ item.countInteract + `</label>
                <span class="tags">Lượt đặt lịch hẹn</span>
            </div>

        </div>
        <div class="behind-vote">
         `+ slogan +`
        </div>

            `+ ratting + `



    <div class="input">
        <span class="text-input">
            Số điện thoại
        </span>

        <span class="text-input">
            `+ phoneAccount + `
        </span>

    </div>

    <div class="input">
        <span class="text-input">
            Email
        </span>

        <span class="text-input">
            `+ item.email + `
        </span>

    </div>

    <div class="input">
        <span class="text-input">
            Nơi công tác
        </span>

        <span class="text-input address-counselors">
            `+ item.healthFacilityName + `
        </span>

    </div>

    <div class="detail-button">
        <div class=" button_inbox">
            <a class="btn btn-light btnHS   inbox btn-lg rounded-pill" href="`+ systemURL + `chat?id=` + item.accountId + `">Nhắn tin</a>
        </div>
    </div>

    <label class="info-name">
        Thông tin về cán bộ tư vấn
    </label>

    <p class="content">
        `+ item.description + `
    </p>
    </div>`)
        })
    }
}
//<div class="input">
//    <span class="text-input">
//        Đánh giá
//    </span>

//    <div class="d-flex evaluate">
//        <div class="my-rating" data-rating="`+ item.totalRating + `"></div>
//        <span style="margin-left: 16px; margin-right: 16px;">`+ item.totalRating + `</span>
//    </div>

//</div>
$(document).ready(async function () {
    await load.call();
    $(".my-rating").starRating({
        useGradient: false,
        starSize: 20,
        readOnly: true,
        starShape: 'rounded'
    });
});