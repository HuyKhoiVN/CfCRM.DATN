"use strict";

var online = $('.booking-online')
var offline = $('.booking-offline')
var idSelect = 0;
var bookingType = '';
var address = ''
var start = ''
var end = ''
var timeselect = ''
var startTime = ''
var endTime = ''
var bookingStatus = ''
var m = new Date();
var counselorId = ''
var accountName = ''
var timeSelectSplit = ''
var datePcSelect = ''
var dateMobileSelect = ''
var bookingAccountId = 0;
var bookingCounselorId = 0;
var bookingId = 0
var id = 0
var bookingDetailHTML = document.getElementById("booking-detail");
var checkSchool = 0;
var isLoad = 0;

var addBooking = async () => {
    if (bookingDetailHTML.style.display === "none") {
        //var result = await httpService.getAsync("Account/api/detail/" + systemConstant.accountId);
        var school = await httpService.getAsync("Account/api/DetailCounselor/" + systemConstant.counselorDefautId + "?accountId=" + systemConstant.accountId);

        if (school.status == "200" && school.data != null) {
            $("#booking-address").val(school.data[0].address);
            checkSchool = 1;
        } else {
            $("#booking-address").val('(Bạn chưa cập nhật dữ liệu về trường học trong thông tin cá nhân)');
            $("#time-pc").html('Bạn chưa cập nhật dữ liệu về trường học trong thông tin cá nhân');
        }

        bookingDetailHTML.style.display = "block";
        $("#btnAddBooking").html("Đóng");
        $("#btnAddBooking").addClass("cancel");

    }
    else {
        bookingDetailHTML.style.display = "none";
        $("#btnAddBooking").html("Tạo lịch tư vấn");
        $("#btnAddBooking").removeClass("cancel");
    }
    getSchedule();
}
var loadDataByStatusWait = async function () {
    bookingDetailHTML.style.display = "none";
    $("#btnAddBooking").html("Tạo lịch tư vấn");
    $("#btnAddBooking").removeClass("cancel");

    var result = await httpService.getAsync("booking/api/list-booking-by-bookingStatusId?pageIndex=" + pageIndex + "&pageSize=" + pageSize + "&bookingStatusId=" + systemConstant.bookingStatus_wait_accept);
    if (result != null) {
        bookingDetailHTML.style.display = "none"
    }
    var account = await httpService.getAsync("Account/api/Detail/" + systemConstant.accountId);
    var detailBooking = account.data[0].roleId == systemConstant.role_counselor_id ? "/chi-tiet-dat-lich-cua-giao-vien/" : "/chi-tiet-dat-lich-cua-hoc-sinh/";
    if (result.status == "200") {
        if (result.data != null && result.data.length != 0) {
            var count = await httpService.getAsync("booking/api/count-list-booking-by-accountId?bookingStatusId=" + systemConstant.bookingStatus_wait_accept)
            $('#count-wait').text(count);
            $("#consulting_history_wait").html('');
            var newRow = '';
            var dataSource = result.data;

            dataSource.forEach(function (item, index) {
                var name = account.data[0].roleId == systemConstant.role_counselor_id ? item.accountName : item.counselorName;
                var colorBookingType = item.bookingTypeId == systemConstant.bookingType_online ? 'online' : 'offline';
                newRow += `<div class="card-history">
                        <div class="item" id="item-consuling-history-wait" data-statusId="${item.bookingStatusId}">
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
                                    <div class="tag ${colorBookingType}">
                                        <span class="content ">
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
            $("#parent-consulting-button-wait").addClass("parent-button-container-active")
            $("#consulting_history_accept").addClass("d-none")
            $("#consulting_history_done").addClass("d-none")
            $("#consulting_history_cancel").addClass("d-none")
            $("#consulting_history_wait").append(newRow);
        }
        else {
            $("#consulting_history_wait").html('');
            var newRow = `<div class="not-found d-flex flex-column align-items-center">
            <img style="width:400px;height:auto;" src="/images/default/not-found.png"/>
            <p>Chưa có dữ liệu hiển thị</p>
            </div>`;

            $("#parent-consulting-button-wait").addClass("parent-button-container-active")
            $("#consulting_history_accept").addClass("d-none")
            $("#consulting_history_done").addClass("d-none")
            $("#consulting_history_cancel").addClass("d-none")
            $("#consulting_history_wait").append(newRow);
        }
    }

}
var loadDataByStatusAccept = async function () {
    bookingDetailHTML.style.display = "none";
    $("#btnAddBooking").html("Tạo lịch tư vấn");
    $("#btnAddBooking").removeClass("cancel");

    var result = await httpService.getAsync("booking/api/list-booking-by-bookingStatusId?pageIndex=" + pageIndex + "&pageSize=" + pageSize + "&bookingStatusId=" + systemConstant.bookingStatus_wait_done);
    var account = await httpService.getAsync("Account/api/Detail/" + systemConstant.accountId);
    var detailBooking = account.data[0].roleId == systemConstant.role_counselor_id ? "/chi-tiet-dat-lich-cua-giao-vien/" : "/chi-tiet-dat-lich-cua-hoc-sinh/";
    if (result.status == "200") {
        if (result.data != null && result.data.length != 0) {
            var count = await httpService.getAsync("booking/api/count-list-booking-by-accountId?bookingStatusId=" + systemConstant.bookingStatus_wait_done)
            $('#count-accept').text(count);
            $("#consulting_history_accept").html('');
            var newRow = '';
            var dataSource = result.data;

            dataSource.forEach(function (item, index) {
                var name = account.data[0].roleId == systemConstant.role_counselor_id ? item.accountName : item.counselorName;
                var colorBookingType = item.bookingTypeId == systemConstant.bookingType_online ? 'online' : 'offline';
                newRow += `<div class="card-history">
                        <div class="item" id="item-consuling-history-accept" data-statusId="${item.bookingStatusId}">
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
                                    <div class="tag ${colorBookingType}">
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
            $("#parent-consulting-button-accept").addClass("parent-button-container-active");
            $("#consulting_history_done").addClass("d-none");
            $("#consulting_history_cancel").addClass("d-none");
            $("#consulting_history_accept").append(newRow);
        }
        else {
            $("#consulting_history_accept").html('');
            var newRow = `<div class="not-found d-flex flex-column align-items-center">
            <img style="width:400px;height:auto;" src="/images/default/not-found.png"/>
            <p>Chưa có dữ liệu hiển thị</p>
            </div>`;

            $("#parent-consulting-button-accept").addClass("parent-button-container-active");
            $("#consulting_history_done").addClass("d-none");
            $("#consulting_history_cancel").addClass("d-none");
            $("#consulting_history_accept").append(newRow);
        }
    }
}
var loadDataByStatusDone = async function () {
    bookingDetailHTML.style.display = "none";
    $("#btnAddBooking").html("Tạo lịch tư vấn");
    $("#btnAddBooking").removeClass("cancel");
    var result = await httpService.getAsync("booking/api/list-booking-by-bookingStatusId?pageIndex=" + pageIndex + "&pageSize=" + pageSize + "&bookingStatusId=" + systemConstant.bookingStatus_done);
    var account = await httpService.getAsync("Account/api/Detail/" + systemConstant.accountId);
    var detailBooking = account.data[0].roleId == systemConstant.role_counselor_id ? "/chi-tiet-dat-lich-cua-giao-vien/" : "/chi-tiet-dat-lich-cua-hoc-sinh/";
    if (result.status == "200") {
        if (result.data != null && result.data.length != 0) {
            var count = await httpService.getAsync("booking/api/count-list-booking-by-accountId?bookingStatusId=" + systemConstant.bookingStatus_done)
            // Nếu đã tư vẫn thì lần tạo tới cho phép chọn thầy cô
            if (count > 0 && isLoad == 0) {
                isLoad = 1;
                $(".teacher").show();
                //Load data Teacher
                loadDataConselor();
            }
            $('#count-done').text(count);
            $("#consulting_history_done").html('');
            var newRow = '';
            var dataSource = result.data;

            dataSource.forEach(function (item, index) {
                var name = account.data[0].roleId == systemConstant.role_counselor_id ? item.accountName : item.counselorName;
                var colorBookingType = item.bookingTypeId == systemConstant.bookingType_online ? 'online' : 'offline';
                newRow += `<div class="card-history">
                        <div class="item" id="item-consuling-history-done" data-statusId="${item.bookingStatusId}">
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
                                    <div class="tag ${colorBookingType}">
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
            $("#consulting_history_done").append(newRow);
        }
        else {
            $("#consulting_history_done").html('');
            var newRow = `<div class="not-found d-flex flex-column align-items-center">
            <img style="width:400px;height:auto;" src="/images/default/not-found.png"/>
            <p>Chưa có dữ liệu hiển thị</p>
            </div>`;

            $("#consulting_history_done").append(newRow);
        }
    }
}
var loadDataByStatusCancel = async function () {
    bookingDetailHTML.style.display = "none";
    $("#btnAddBooking").html("Tạo lịch tư vấn");
    $("#btnAddBooking").removeClass("cancel");

    var result = await httpService.getAsync("booking/api/list-booking-by-bookingStatusId?pageIndex=" + pageIndex + "&pageSize=" + pageSize + "&bookingStatusId=" + systemConstant.bookingStatus_cancel);

    var account = await httpService.getAsync("Account/api/Detail/" + systemConstant.accountId);
    var detailBooking = account.data[0].roleId == systemConstant.role_counselor_id ? "/chi-tiet-dat-lich-cua-giao-vien/" : "/chi-tiet-dat-lich-cua-hoc-sinh/";
    if (result.status == "200") {
        if (result.data != null && result.data.length != 0) {
            var count = await httpService.getAsync("booking/api/count-list-booking-by-accountId?bookingStatusId=" + systemConstant.bookingStatus_cancel)
            $('#count-cancel').text(count);
            $("#consulting_history_cancel").html('');
            var newRow = '';
            var dataSource = result.data;

            dataSource.forEach(function (item, index) {
                var name = account.data[0].roleId == systemConstant.role_counselor_id ? item.accountName : item.counselorName;
                var colorBookingType = item.bookingTypeId == systemConstant.bookingType_online ? 'online' : 'offline';
                newRow += `<div class="card-history">
                        <div class="item" id="item-consuling-history-cancel" data-statusId="${item.bookingStatusId}">
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
                                    <div class="tag ${colorBookingType}">
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
            $("#consulting_history_cancel").append(newRow);
        }
        else {
            $("#consulting_history_cancel").html('');
            var newRow = `<div class="not-found d-flex flex-column align-items-center">
            <img style="width:400px;height:auto;" src="/images/default/not-found.png"/>
            <p>Chưa có dữ liệu hiển thị</p>
            </div>`;

            $("#consulting_history_cancel").append(newRow);
        }
    }
}

var loadDataConselor = async function () {
    $('#teacher-value').empty();
    var listConselor = await httpService.getAsync("Account/api/ListCounselorByUserId/" + systemConstant.accountId);
    if (listConselor.status == "200") {
        listConselor.data.forEach(function (item) {
            $('#teacher-value').append(new Option(item.name, item.id, false, false)).trigger("change");
        });
        changeDate();
        $("#teacher-value").on("change", function (e) {
            changeDate();
            getSchedule();
        });
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

var checked = () => {
    offline.prop('checked', true)
    //$('.address').removeClass('d-none')
    //$('.phone').addClass('d-none')
    address = $(".booking-address").val()
    bookingType = $("input[name*='radio-bookingtype']:checked").val()
    counselorId = $("label[name*='counselorName']").data('value')
}

$(document).ready(async function () {
    if (roleId == systemConstant.role_counselor_id) {
        $("#btnAddBooking").addClass('d-none')
    }
    /*    await load()*/
    await checked();
    //await loadDataByStatusAccept();
    await loadDataByStatusDone();
    await loadDataByStatusCancel();
    $(".pagination_default").attr("class", "navigation pagination pagination_default accept align-items-end justify-content-end");
    let element = $(".pagination_default.accept");
    LoadPagingPage("booking/api/count-list-booking-by-accountId?bookingStatusId=" + systemConstant.bookingStatus_wait_done, element, loadDataByStatusAccept);
    $(".datepicker").on('dp.change', async function (e) {
        changeDate();
    });
    $('#date-pc').val(moment(new Date()).format("DD/MM/YYYY")).trigger("change");
})



async function changeDate() {
    var date = $("#date-pc").val().split('/').reverse().join('-');;
    infoSchool = [];

    // console.log(this.value);
    if ($("#teacher-value").val() != null) {
        var infoSchool = await httpService.getAsync("counselorSchedule/api/listSchedule?counselorId=" + $("#teacher-value").val() + "&date=" + date);
    }
    else {
        var infoSchool = await httpService.getAsync("counselorSchedule/api/listSchedule?date=" + date);
    }
    //var infoSchool = await httpService.getAsync("schoolSchedule/api/listBySchoolId/" + info.data[0].schoolId);
    if (infoSchool.data != null) {
        //time - pc
        $("#time-pc").html('');
        //var arrayTime = sortTimeRanges(infoSchool.data[0].description);
        var listTime = [];
        var n = 0;
        if (infoSchool.data.length == 0) {
            $('#time-pc').append(new Option('Chưa có lịch tư vấn', "Chưa có lịch tư vấn", 1, false, false));
        }
        else {
            infoSchool.data.forEach(function (item) {
                //console.log(moment(item.startTime).format("HH:mm"));
                listTime.push({
                    'id': n + 1,
                    'name': moment(item.startTime).format("HH:mm") + "-" + moment(item.endTime).format("HH:mm")
                });
                n += 1;
            });
            //console.log(listTime)
            listTime.sort(compareTime);

            listTime.forEach(function (item) {
                $('#time-pc').append(new Option(item.name, item.name, 1, false, false));
            });
        }
    }
}
var wait = () => {
    $("#parent-consulting-button-wait").addClass("parent-button-container-active")
    $("#parent-consulting-button-accept").removeClass("parent-button-container-active")
    $("#parent-consulting-button-done").removeClass("parent-button-container-active")
    $("#parent-consulting-button-cancel").removeClass("parent-button-container-active")
    $("#consulting_history_wait").removeClass("d-none")
    $("#consulting_history_accept").addClass("d-none")
    $("#consulting_history_done").addClass("d-none")
    $("#consulting_history_cancel").addClass("d-none")

    $(".pagination_default").attr("class", "navigation pagination pagination_default wait align-items-end justify-content-end");
    let element = $(".pagination_default.wait");
    pageIndex = 1;
    LoadPagingPage("booking/api/count-list-booking-by-accountId?bookingStatusId=" + systemConstant.bookingStatus_wait_accept, element, loadDataByStatusWait);
}

var accept = () => {
    $("#parent-consulting-button-wait").removeClass("parent-button-container-active")
    $("#parent-consulting-button-accept").addClass("parent-button-container-active")
    $("#parent-consulting-button-done").removeClass("parent-button-container-active")
    $("#parent-consulting-button-cancel").removeClass("parent-button-container-active")
    $("#consulting_history_accept").removeClass("d-none")
    $("#consulting_history_wait").addClass("d-none")
    $("#consulting_history_done").addClass("d-none")
    $("#consulting_history_cancel").addClass("d-none")

    $(".pagination_default").attr("class", "navigation pagination pagination_default accept align-items-end justify-content-end");
    let element = $(".pagination_default.accept");
    pageIndex = 1;
    LoadPagingPage("booking/api/count-list-booking-by-accountId?bookingStatusId=" + systemConstant.bookingStatus_wait_done, element, loadDataByStatusAccept);
}

var done = () => {
    $("#parent-consulting-button-wait").removeClass("parent-button-container-active")
    $("#parent-consulting-button-accept").removeClass("parent-button-container-active")
    $("#parent-consulting-button-done").addClass("parent-button-container-active")
    $("#parent-consulting-button-cancel").removeClass("parent-button-container-active")
    $("#consulting_history_accept").addClass("d-none")
    $("#consulting_history_wait").addClass("d-none")
    $("#consulting_history_done").removeClass("d-none")
    $("#consulting_history_cancel").addClass("d-none")

    $(".pagination_default").attr("class", "navigation pagination pagination_default done align-items-end justify-content-end");
    let element = $(".pagination_default.done");
    pageIndex = 1;
    LoadPagingPage("booking/api/count-list-booking-by-accountId?bookingStatusId=" + systemConstant.bookingStatus_done, element, loadDataByStatusDone);
}

var cancel = () => {
    $("#parent-consulting-button-wait").removeClass("parent-button-container-active")
    $("#parent-consulting-button-accept").removeClass("parent-button-container-active")
    $("#parent-consulting-button-done").removeClass("parent-button-container-active")
    $("#parent-consulting-button-cancel").addClass("parent-button-container-active")
    $("#consulting_history_accept").addClass("d-none")
    $("#consulting_history_wait").addClass("d-none")
    $("#consulting_history_done").addClass("d-none")
    $("#consulting_history_cancel").removeClass("d-none")

    $(".pagination_default").attr("class", "navigation pagination pagination_default cancel align-items-end justify-content-end");
    let element = $(".pagination_default.cancel");
    pageIndex = 1;
    LoadPagingPage("booking/api/count-list-booking-by-accountId?bookingStatusId=" + systemConstant.bookingStatus_cancel, element, loadDataByStatusCancel);
}

online.on('change', () => {
    online.prop('checked', true)
    $('.address').addClass('d-none')
    $('.phone').removeClass('d-none')
    address = '';
    bookingType = $("input[name*='radio-bookingtype']:checked").val()
})

offline.on('change', () => {
    offline.prop('checked', true)
    $('.address').removeClass('d-none')
    $('.phone').removeClass('d-none')
    //$("#booking-phone").val("")
    address = $("#booking-address").val()
    bookingType = $("input[name*='radio-bookingtype']:checked").val()
})

$('#time-pc').on('change', function (e) {
    timeselect = $("#time-pc").val();
});


var booking = async () => {
    datePcSelect = $("#date-pc").val().split('/').reverse().join('-');
    bookingStatus = $('#status').val();
    $("input[name*='radio-bookingtype']").on('change', () => {
        bookingType = $("input[name*='radio-bookingtype']:checked").val();
    });
    timeselect = $("#time-pc").val();
    timeSelectSplit = timeselect.split("-");
    start = timeSelectSplit[0];
    end = timeSelectSplit[1];
    startTime = datePcSelect + 'T' + start + ':' + '00';
    endTime = datePcSelect + 'T' + end + ':' + '00';
    var updatingObj = {
        "id": 0,
        "accountId": systemConstant.accountId,
        "bookingTypeId": parseInt(bookingType),
        "bookingStatusId": systemConstant.bookingStatus_wait_done,
        "counselorId": $("#teacher-value") != null ? $("#teacher-value").val() : systemConstant.counselorDefautId,
        "name": accountName,
        "address": parseInt(bookingType) == systemConstant.bookingType_offline ? $("#booking-address").val() : '',
        "photo": $("#booking-photo").attr('src'),
        "info": $("#booking-description").val(),
        "startTime": startTime,
        "endTime": endTime,
        "URL": $("#booking-phone").val(),
    };

    //console.log(updatingObj)
    Swal.fire({
        title: 'Đặt lịch tư vấn',
        html: "Bạn có chắc chắn muốn đặt lịch tư vấn<b>" + '</b>?',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#443',
        cancelButtonText: 'Hủy',
        confirmButtonText: 'Đồng ý',
    }).then((result) => {
        updatingObj.createdTime = new Date();
        updatingObj.active = 1
        if (result.value) {
            AddBooking(updatingObj)
        }
    })
}

var AddBooking = async (updatingObj) => {
    $("#loading").addClass("show");
    if (updatingObj.id == 0) {
        updatingObj.bookingStatusId = systemConstant.bookingStatus_wait_done;
        try {
            let response = await httpService.postAsync("booking/api/add", updatingObj);
            if (response.status == 201 && response.message === "CREATED") {
                $("#loading").removeClass("show");
                Swal.fire({
                    html: '<strong>Đặt lịch của bạn đang chờ duyệt của tư vấn viên</strong>',
                    icon: 'success'
                }).then(async () => {
                    //var url = "booking/api/send-email-booking-success?accountId=" + systemConstant.accountId;
                    //await httpService.getAsync(url);
                    location.reload();
                });
            }
            else if (response.status == 207 && response.message === "SUCCESS") {
                $("#loading").removeClass("show");
                Swal.fire({
                    html: 'Bạn đã đặt lịch trong khoảng 30 ngày qua, vui lòng thử lại sau!',
                    icon: 'warning'
                });
            }
            else {
                $("#loading").removeClass("show");
                Swal.fire({
                    html: 'Đặt lịch hẹn không thành công, vui lòng thử lại sau !',
                    icon: 'error'
                });
            }
        } catch (e) {
            $("#loading").removeClass("show");
            Swal.fire({
                html: 'Đặt lịch hẹn không thành công, vui lòng thử lại sau !',
                icon: 'error'
            });
        }

    }
    else {
        let response = await httpService.postAsync("booking/api/update", updatingObj);
        var html = updatingObj.bookingStatusId == systemConstant.bookingStatus_cancel ? 'hủy' : 'đặt';
        if (response.status == 200 && response.message === "SUCCESS") {
            $("#loading").removeClass("show");
            Swal.fire({
                html: '<strong>Xác nhận ' + html + ' lịch hẹn tư vấn</strong>',
                icon: 'success'
            }).then(async () => {
                if (html == 'hủy') {
                    $("#reason-cancel-booking").modal('hide');
                    Swal.fire({
                        html: 'Hủy lịch hẹn thành công!',
                        icon: 'success'
                    }).then(() => {
                        location.reload();
                    });
                }
                else {
                    Swal.fire({
                        html: 'Cập nhật lịch hẹn thành công!',
                        icon: 'success'
                    }).then(() => {
                        location.reload();
                    });
                }

                //window.location.href = "/user-profile#consultingHistory";
            });
        }
        else {
            $("#loading").removeClass("show");
            Swal.fire({
                html: html + ' lịch hẹn không thành công, vui lòng thử lại sau !',
                icon: 'error'
            });
        }
    }
}


var bnt = $('#btnUpdateBooking')
bnt.on('click', async () => {
    validate();
})

async function validate() {
    var errorList = [];

    //check số điện thoại
    var phone = $("#booking-phone").val();
    if (phone.trim() == '') {
        errorList.push("Số điện thoại không được để trống.");
    }
    else {
        var regex = /^0\d{9}$/;
        var checkPhoneNumber = regex.test($("#booking-phone").val());
        if (!checkPhoneNumber) {
            errorList.push("Bạn phải nhập số điện thoại có 10 kí tự là số.");
        }
        let isValid = /^(09|08|07|05|03)\d*$/.test($("#booking-phone").val());

        // If not valid, reset the input value
        if (!isValid) {
            errorList.push("Số điện thoại phải bắt đầu bằng 09, 08, 07, 05, 03.");
        }
    }
    //check thời gian
    if ($("#time-pc").val() == null || $("#time-pc").val() == '') {
        errorList.push("Bạn chưa chọn thời gian đặt lịch.");
    }
    if ($("#date-pc").val() == null || $("#date-pc").val() == '') {
        errorList.push("Bạn chưa chọn ngày đặt lịch.");
    }

    //thời điểm hiện tại
    var checkTimeBooking = moment().format("YYYY-MM-DD HH:mm");
    datePcSelect = $("#date-pc").val().split('/').reverse().join('-')
    timeselect = $("#time-pc").val();
    timeSelectSplit = timeselect.split("-");
    start = timeSelectSplit[0];
    end = timeSelectSplit[1];
    startTime = datePcSelect + ' ' + start + ':' + '00';
    endTime = datePcSelect + ' ' + end + ':' + '00';
    // Lấy hiệu giữa date2 và date1 trong đơn vị giờ
    var differenceInSeconds = moment(startTime).diff(moment(checkTimeBooking), 'seconds');
    //console.log(differenceInHours);
    if (differenceInSeconds < 3600) {
        errorList.push("Thời gian đặt lịch hẹn phải cách hiện tại tối thiểu 1 giờ.");
    }


    if (errorList.length > 0) {
        var contentError = "<ul>";
        errorList.forEach(function (item, index) {
            contentError += "<li class='text-start'>" + item + "</li>";
        })
        contentError += "</ul>";
        var swalSubTitle = "<p class='swal__admin__subtitle'>" + 'Đặt lịch' + " không thành công</p>";
        Swal.fire(
            'Quản lý lịch hẹn' + swalSubTitle,
            contentError,
            'warning'
        );
    } else {
        await booking();
    }
}

function sortTimeRanges(inputString) {
    // Bước 1: Chia chuỗi thành mảng các cặp giá trị thời gian
    const timePairs = inputString.split(', ');

    // Bước 2: Chia mỗi cặp giá trị thành thời gian bắt đầu và kết thúc
    const timeRanges = timePairs.map(pair => {
        const [startTime, endTime] = pair.split('-');
        return { startTime, endTime };
    });

    // Bước 3: Sắp xếp mảng theo thời gian bắt đầu
    const sortedTimeRanges = timeRanges.sort((a, b) => {
        // Chuyển đổi thời gian sang đối tượng Date để so sánh
        const timeA = new Date(`2000-01-01T${a.startTime}`);
        const timeB = new Date(`2000-01-01T${b.startTime}`);

        // So sánh thời gian bắt đầu
        return timeA - timeB;
    });

    return sortedTimeRanges;
}

function validateNumericInput(input) {
    // Remove non-numeric characters
    input.value = input.value.replace(/[^0-9]/g, '');
}

function compareTime(a, b) {
    var timeStartA = a.name.split('-')[0];
    var timeEndA = a.name.split('-')[1];
    var timeStartB = b.name.split('-')[0];
    var timeEndB = b.name.split('-')[1];

    if (timeStartA === timeStartB) {
        // Nếu thời gian bắt đầu giống nhau, so sánh thời gian kết thúc
        return new Date('1970/01/01 ' + timeEndA) - new Date('1970/01/01 ' + timeEndB);
    } else {
        // Nếu thời gian bắt đầu khác nhau, so sánh thời gian bắt đầu
        return new Date('1970/01/01 ' + timeStartA) - new Date('1970/01/01 ' + timeStartB);
    }
}

mobiscroll.setOptions({
    themeVariant: 'light',
    theme: 'ios',
});
async function getSchedule() {
    var events = [];
    var infoSchool = [];
    if ($("#teacher-value").val() != null) {
        infoSchool = await httpService.getAsync("counselorSchedule/api/list-all-booking-counselorId/" + $("#teacher-value").val());
    }
    else {
        infoSchool = await httpService.getAsync("counselorSchedule/api/listSchedule");
    }
    if (infoSchool.status == '200') {
        if ($("#teacher-value").val() != null) {
            infoSchool.data = infoSchool.data.filter(c => c.accountId == $("#teacher-value").val());
        }
        infoSchool.data.forEach(function (item) {
            events.push({
                "start": item.startTime,
                "end": item.endTime,
                "title": "Ca tư vấn trống",
                "color": "#" + Math.floor(Math.random() * 16777215).toString(16),
            });
        });
      
        var inst = mobiscroll.eventcalendar('#demo-daily-agenda', {
            locale: mobiscroll.localeVi,
            view: {
                calendar: { type: 'week' },
                agenda: { type: 'day' },
            },
            onEventClick: function (args) {
                $("#date-pc").val(moment(args.date).format("DD/MM/YYYY")).trigger("change");
                setTimeout(function () {
                    $("#time-pc").val(moment(args.event.start).format("HH:mm") + "-" + moment(args.event.end).format("HH:mm")).trigger("change");
                }, 200);
                mobiscroll.toast({
                    message: "Bạn đã chọn: " + moment(args.event.start).format("HH:mm") + "-" + moment(args.event.end).format("HH:mm"),
                });
            },
        });
        inst.setEvents(events);
    }
}


