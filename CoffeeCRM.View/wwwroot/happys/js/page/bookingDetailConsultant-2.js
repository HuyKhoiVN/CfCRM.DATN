var star = 0;
var ratingStar = 0;
var dataConsultant;
var bookingStatusId = 0;


async function updateItem() {
    var updatingObj = {
        'id': dataConsultant.id,
        'accountId': dataConsultant.accountId,
        'counselorsId': dataConsultant.counselorId,
        'reason': dataConsultant.reason,
        'symptom': dataConsultant.symptom,
        'religiorelationship': dataConsultant.religiorelationship,
        'history': dataConsultant.history,
        'assessmentResult': dataConsultant.assessmentResult,
        'target': dataConsultant.target,
        'consultingResults': dataConsultant.consultingResults,
        'consultingPlan': dataConsultant.consultingPlan,
        'religiousNation': dataConsultant.religiousNation,
        'culturalLevel': dataConsultant.culturalLevel,
        'implementation': dataConsultant.implementation,
        'bookingId': dataConsultant.bookingId,
        'consultingTime': dataConsultant.consultingTime,
        'form': dataConsultant.form,
        'review': $("#review").val(),
        'rating': ratingStar,
        'createdTime': dataConsultant.createdTime,
    }

    Swal.fire({
        title: 'Phiếu đánh giá',
        html: "Bạn có chắc chắn muốn xác nhận phiếu đánh giá ?",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#443',
        cancelButtonText: 'Hủy',
        confirmButtonText: 'Đồng ý',
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: systemURL + "consultant/api/update",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(updatingObj),
                success: function (responseData) {
                    // debugger;
                    if (responseData.status == 200 && responseData.message === "SUCCESS") {
                        Swal.fire(
                            'Thành Công!',
                            'Đã xác nhận phiếu đánh giá thành công',
                            'success'
                        ).then(() => {
                            location.reload(true);
                        });
                    }
                },
                error: function (e) {
                    //console.log(e.message);
                    Swal.fire(
                        'Lỗi!',
                        'Đã xảy ra lỗi, vui lòng thử lại',
                        'error'
                    );
                }
            });
        }
    })
};

async function getDetailConsultantByBookingId(id) {
    $("#modal-export-consultant").modal('show');
    $("#modal-id-consultant").modal('hide');
    var data;
    await $.ajax({
        url: systemURL + "consultant/api/Consultant/" + id,
        method: "GET",
        success: function (responseData) {
            data = responseData.data[0];
            dataConsultant = data;
            if (data != null) {
                $("#full-name").val(data.accountName);
                $("#dob").val(moment(data.dob).format("DD/MM/YYYY"));
                $("#gender").val(data.gender = 'MALE' ? 'Nam' : 'Nữ');
                $("#religiousNation").val(data.religiousNation);
                $("#culturalLevel").val(data.culturalLevel);
                $("#phone-number").val(data.phone);
                $("#address-detail").val(data.address);
                $("#consultingTime").val(data.consultingTime);
                $("#booking-type").val(data.bookingTypeName);
                $("#conselor-name").val(data.counselorName);
                $("#booking-reason").text(data.reason);
                $("#symptom-user").text(data.symptom);
                $("#religiorelationship").text(data.religiorelationship);
                $("#history").text(data.history);
                $("#assessmentResult").text(data.assessmentResult);
                $("#target").text(data.target);
                $("#consultingResults").text(data.consultingResults);
                $("#consultingPlan").text(data.consultingPlan);
                $('.my-rating').starRating('setRating', data.rating);
                if (!(data.rating == null || data.rating == 0)) {
                    $('.my-rating').starRating('setReadOnly', true);
                    $("#btnSave").hide();
                }
                $("#review").text(data.review);
                if (!(data.review == null || data.review == "")) {
                    $("#review").attr("disabled", true);
                    $("#btnSave").hide();
                }
                if (data.accountId != systemConstant.accountId) {
                    $("#btnSave").hide();
                }
            }
            else {
                $("#note").removeClass('d-none');
                $(".card_rating").css("display", "none");
                $(".consultant_result_header_content").removeClass("d-none");
                $("#btnSave").hide();
            }
        },
        error: function (e) {
        },
    });
    return data;
}

var loadDataConsuling = async function loadDataConsulingHistory() {
    var account = await httpService.getAsync("Account/api/Detail/" + systemConstant.accountId);
    var detailBooking = account.data[0].roleId == systemConstant.role_counselor_id ? "booking-detail/" : "booking-detail-user/";

    var result = await httpService.getAsync("Booking/api/consultingHistory?pageIndex=" + pageIndex + "&pageSize=" + pageSize + "");
    if (result != null) {
        $(".booking-detail").addClass('d-none')
    }
    //LoadPagingPageBookingHistory("booking/api/count-list-booking-by-accountId", "1000001");
    $(".parent-consulting-button-waiting").addClass("parent-button-container-active");
    $("#consulting_history").html('');
    if (result.status == "200") {
        var newRow = '';
        if (result.data != null && result.data.length != 0) {
            result.data.forEach(function (item) {
                var name = account.data[0].roleId == systemConstant.role_counselor_id ? item.accountName : item.counselorName;
                if (item.bookingStatusId == systemConstant.bookingStatus_wait_done || item.bookingStatusId == systemConstant.bookingStatus_wait_accept) {
                    var display = item.bookingStatusId == systemConstant.bookingStatus_wait_done ? '' : 'd-none';
                    newRow += `
                     <div class="card-history">
                        <div class="item" id="item-consuling-history" data-statusId="${item.bookingStatusId}">
                            <div class="img">
                                <img src="${item.photo}" />
                            </div>

                            <div class="info">
                                <div class="info-body">
                                     <div class="title m-0">
                                        <label class="name">${name}</label>
                                    </div>
                                    <div class="tags m-0">
                                         <div class="tag">
                                            <span class="content">
                                                ${timeSince(item.startTime)} - ${timeSince(item.endTime)} ${formatDate(item.startTime)}
                                            </span>
                                        </div>
                                        <div class="tag">
                                            <span class="content" >
                                                Đặt lịch hẹn ${item.bookingTypeName}
                                            </span>
                                        </div>
                                        <div class="tag ${display}" style="background: #11a111;">
                                            <span class="content" >
                                                Đã xác nhận
                                            </span>
                                        </div>
                                    </div>
                                     <p class="des m-0">
                                        ${item.description != null ? item.description : " "}
                                    </p>
                                </div>
                                <a class="see-details m-0" href="${detailBooking}` + item.id + `" >Xem chi tiết
                                </a>
                            </div>
                        </div>
                    </div>
                    `;
                    $("#consulting_history").html(newRow);
                }
            });
        }
        else {
            $(".pagination_default").addClass('d-none');
            $("#consulting_history").html(`<div class="forum_l_inner">
                    
                    <div class="forum_body">
                        <ul id="commentForumPost" class="navbar-nav topic_list">
                            <li>
                                <div class="media">
                                    <h3>Không có dữ liệu</h3>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            `);
        }
    }
}

const addBooking = () => {
    $(".booking-detail").removeClass("d-none")
}

var loadDataByStatus = async function LoadByStatus() {
    var result = await httpService.getAsync("booking/api/list-booking-by-bookingStatusId?pageIndex=" + pageIndex + "&pageSize=" + pageSize + "&bookingStatusId=" + bookingStatusId);
    $("#consulting_history").html('');
    var account = await httpService.getAsync("Account/api/Detail/" + systemConstant.accountId);
    var detailBooking = account.data[0].roleId == systemConstant.role_counselor_id ? "/app/booking-detail/" : "/app/booking-detail-user/";
    if (result.status == "200") {
        if (result.data != null && result.data.length != 0) {
            $("#consulting_history").html('');
            var newRow = '';
            var dataSource = result.data;
            if (bookingStatusId == 102) {
                dataSource.forEach(function (item, index) {
                    var name = account.data[0].roleId == systemConstant.role_counselor_id ? item.accountName : item.counselorName;
                    var display = item.bookingStatusId == systemConstant.bookingStatus_wait_done ? '' : 'd-none';
                    newRow += `<div class="card-history">
                        <div class="item" id="item-consuling-history" data-statusId="${item.bookingStatusId}">
                            <div class="img">
                                <img src="${item.photo}" />
                            </div>

                            <div class="info">
                                <div class="title">
                                    <label class="name mb-2">${name}</label>
                                </div>
                                <div class="tags">
                                     <div class="tag">
                                        <span class="content">
                                            ${timeSince(item.startTime)} - ${timeSince(item.endTime)} ${formatDate(item.startTime)}
                                        </span>
                                    </div>
                                    <div class="tag">
                                        <span class="content">
                                            Đặt lịch hẹn ${item.bookingTypeName}
                                        </span>
                                    </div>
                                    <div class="tag ${display}" style="background: #11a111;">
                                        <span class="content" >
                                            Đã xác nhận
                                        </span>
                                    </div>
                                </div>

                                <p class="des">
                                    ${item.description != null ? item.description : " "}
                                </p>
                                <a class="see-details" href="${detailBooking}` + item.id + `" >Xem chi tiết
                                </a>
                            </div>
                        </div>
                    </div>`
                });
            }
            else {
                dataSource.forEach(function (item, index) {
                    var name = account.data[0].roleId == systemConstant.role_counselor_id ? item.accountName : item.counselorName;
                    newRow += `<div class="card-history">
                        <div class="item" id="item-consuling-history" data-statusId="${item.bookingStatusId}">
                            <div class="img">
                                <img src="${item.photo}" />
                            </div>

                            <div class="info">
                                <div class="title">
                                    <label class="name mb-2">${name}</label>
                                </div>
                                <div class="tags">
                                     <div class="tag">
                                        <span class="content">
                                            ${timeSince(item.startTime)} - ${timeSince(item.endTime)} ${formatDate(item.startTime)}
                                        </span>
                                    </div>
                                    <div class="tag">
                                        <span class="content">
                                            Đặt lịch hẹn ${item.bookingTypeName}
                                        </span>
                                    </div>
                                </div>

                                <p class="des">
                                    ${item.description != null ? item.description : " "}
                                </p>
                                <a class="see-details" href="${detailBooking}` + item.id + `" >Xem chi tiết
                                </a>
                            </div>
                        </div>
                    </div>`
                });
            }

            $("#consulting_history").append(newRow);
        }
        else {
            $(".pagination_default").addClass('d-none');
            $("#consulting_history").append(`<div class="forum_l_inner">
                    
                    <div class="forum_body">
                        <ul id="commentForumPost" class="navbar-nav topic_list">
                            <li>
                                <div class="media">
                                    <h3>Không có dữ liệu</h3>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            `);
        }
    }
}

function loadFilterConsulingStatusId() {
    var bookingStatusId = $("#item-consuling-history").attr('data-statusId');
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
    $(".caption").addClass("d-none");
    var url = new URL(window.location.href);
    var pathUrl = url.pathname;
    var urlArray = pathUrl.split('/')
    var bookingId = urlArray[urlArray.length - 1];
    getDetailConsultantByBookingId(bookingId);
    loadDataConsuling.call();
    $(document).on("click", ".parent-button-container", async function () {
        pageIndex = 1;
        $(".parent-button-container").removeClass("parent-button-container-active");
        $(this).addClass("parent-button-container-active");
        var statusId = $(this).data("statusid");
        bookingStatusId = statusId;
        loadDataByStatus.call();
        let element = $("#consultingHistory .pagination_default")
        LoadPagingPage("booking/api/count-list-booking-by-accountId?bookingStatusId=" + statusId, element, loadDataByStatus);
    });
    $('#btnSave').click(function () {
        updateItem();
    });
    $(".my-rating").starRating({
        useGradient: false,
        starSize: 50,
        readOnly: false,
        disableAfterRate: false,
        starShape: 'rounded',
        callback: function (currentRating, $el) {
            // do something after rating
            //alert(currentRating);
            ratingStar = currentRating;
        }
    });
    if (checkRole == false) {
        $("#btnSave").hide();
    }
});