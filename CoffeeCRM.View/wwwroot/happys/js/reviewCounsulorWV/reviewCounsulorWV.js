$(document).ready(function () {
    loadReviewCounselor();
});
var reviewCounselorData = [];
var reviewCounselorPageIndex = 1;
var reviewCounselorPageSize = 6;
const urlParams = new URLSearchParams(window.location.search);
var counselorId = urlParams.get('counselorId');
async function loadReviewCounselor() {
    if (reviewCounselorPageIndex === 1) {
        $("#ulReviewCounsulor").empty();
    }
    if (reviewCounselorData.length == 0) {
        reviewCounselorPageIndex = 1;
    }
    try {
        var result = await httpService.getAsync("consultant/api/ListReviewCounselor?pageIndex=" + reviewCounselorPageIndex + "&pageSize=" + reviewCounselorPageSize + "&counselorId=" + counselorId + "");
        if (result.status == 200) {
            var data = result.data[0];
            reviewCounselorData.push(...data);

            data.forEach(function (item, index) {
                var currentValue = item.createdTime
                if (!currentValue.includes("T")) return
                var date = new Date(currentValue);
                var newValue = date.toLocaleDateString('vi-VN');
                if (index === 0) {
                    $("#countReview").text(item.total);
                    if (item.hasNext == false) {
                        $("#reviewSectionLoadMore").hide();
                    }
                    else {
                        $("#reviewSectionLoadMore").show();
                    }

                }
                var divRow = `<li class="review review-counsulor deactive">
                                <div class="w-100">
                                    <div class="review-counselor-textbox">
                                        <div class="review-img-text">
                                            <img src="${item.photo != null ? item.photo : "/happys/img/Rectangle 873.png"}" />
                                            <div>
                                                <span class="user-name-counselor">${item.counselorsName}</span>
                                                <div class="rating-course courseReview-rating" data-rate-value=${item.rating != null ? item.rating : 1}>
                                                    <div class="stars" data-stars="5">
                                                         ${genRatingStar(item.rating)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="review-counsulor-rating">
                                            <p class="date-time m-0">`+ newValue + `</p>
                                        </div>
                                    </div>
                                    <div>
                                        <span class="des">${item.review != null ? item.review : " "}</span>
                                    </div>
                                </div>
                            </li>`
                $(divRow).appendTo($("#ulReviewCounsulor"));
            });
        }
    } catch (e) {
        $("#reviewSectionLoadMore").hide();
    }
}

$("#reviewSectionLoadMore").click(function (e) {
    e.preventDefault();
    reviewCounselorPageIndex++;
    loadReviewCounselor();
})


function genRatingStar(rating) {
    let roundedRating = Math.round(rating * 2) / 2;
    let returnStr = "";
    let natural = Math.floor(roundedRating);
    let residual = roundedRating % 1;

    for (let i = 0; i < natural; i++) {
        returnStr += `<i class="fas fa-star"></i>`
    }
    if (residual == 0) {
        for (let i = 0; i < (5 - natural); i++) {
            returnStr += `<i class="far fa-star"></i>`;
        }
    } else {
        returnStr += `<i class="fas fa-star-half-alt"></i>`
        for (let i = 0; i < (4 - natural); i++) {
            returnStr += `<i class="far fa-star"></i>`;
        }
    }
    return returnStr;
}