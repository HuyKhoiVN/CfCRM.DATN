"use strict";
var bookingStatusId = 0;
var loadDataConsuling = async function loadDataConsulingHistory() {
    var account = await httpService.getAsync("Account/api/Detail/" + systemConstant.accountId);
    var detailBooking = account.data[0].roleId == systemConstant.role_counselor_id ? "booking-detail/" : "booking-detail-user/";
    
    var result = await httpService.getAsync("Booking/api/consultingHistory?pageIndex=" + pageIndex + "&pageSize=" + pageSize + "");
    //LoadPagingPageBookingHistory("booking/api/count-list-booking-by-accountId", "1000001");
    $(".parent-consulting-button-waiting").addClass("parent-button-container-active");
    $("#consulting_history").html('');
    if (result.status == "200") {
        if (result.data != null && result.data.length != 0) {
            result.data.forEach(function (item) {
                var name = account.data[0].roleId == systemConstant.role_counselor_id ? item.accountName : item.counselorName;
                if (item.bookingStatusId == systemConstant.bookingStatus_wait_done || item.bookingStatusId == systemConstant.bookingStatus_wait_accept) {
                    var display = item.bookingStatusId == systemConstant.bookingStatus_wait_done ? '' : 'd-none';
                    $("#consulting_history").append(`
                     <div class="card-history">
                        <div class="item" id="item-consuling-history" data-statusId="${item.bookingStatusId}">
                            <div class="img">
                                <img src="${item.photo}" />
                            </div>

                            <div class="info">
                                <div class="title mb-2">
                                    <label class="name">${name}</label>
                                </div>
                                <div class="tags">
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

                                <p class="des">
                                    ${item.description != null ? item.description : " "}
                                </p>
                                <a class="see-details" href="${detailBooking}` + item.id + `" >Xem chi tiết
                                </a>
                            </div>
                        </div>
                    </div>
                    `);
                }
            });
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
$(document).ready(async function () {
    await loadDataConsuling.call();
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
});

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
                                <a class="see-details" href="${detailBooking}`+ item.id + `" >Xem chi tiết
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
