"use strict";

const online = $('.booking-online')
const offline = $('.booking-offline')
const online_mobile = $('.booking-online-mobile')
const offline_mobile = $('.booking-offline-mobile')
const idSelect = 0;
var bookingType = '';
var address = ''
var start = ''
var end = ''
let timeselect = ''
var startTime = ''
var endTime = ''
var bookingStatus = ''
var m = new Date();
var counselorId = ''
var accountName = ''
var timeSelectSplit = ''
var datePcSelect = ''
var dateMobileSelect = ''
var accountName = ''
var timeSelectSplit = ''
var datePcSelect = ''
var dateMobileSelect = ''
var createdTime = '';

var userLog = '';

const load = async () => {
    var result;
    if (bookingDetailId > 0) {
        var booking_detail = await httpService.getAsync("Booking/api/Detail/" + bookingDetailId);
        var dataDetail = booking_detail.data[0];
        if (booking_detail.status == "200") {
            var nameAddress = dataDetail.bookingTypeId == systemConstant.bookingType_online ? 'Số điện thoại Zalo (dành buổi tư vấn trực tuyến)' : 'Địa chỉ tư vấn';
            var addressDetail = dataDetail.bookingTypeId == systemConstant.bookingType_online ?
                (dataDetail.url == null || dataDetail.url.trim().length == 0 ? '(Người đặt lịch chưa cập nhật số điện thoại)' : dataDetail.url) : dataDetail.address;
            
            createdTime = dataDetail.createdTime;
            result = await httpService.getAsync("Account/api/Detail/" + dataDetail.accountId);
            $(".img").html('');
            $(".address").html('')
            $(".counselorName").html('')
            $("#status").html('')
            if (result.status == "200") {
                result.data.forEach(function (item, index) {
                    $(".img").append(`
                        <img class="shadow" id='booking-photo' src="`+ item.photo + `"/>
                    `);
                    $(".accountName").append(`
                        <label class="name" name='counselorName' data-value='`+ item.id + `' data-name='` + item.name + `'>
                                    `+ item.name + `
                                </label>
                        `);
                    if (dataDetail.bookingTypeId == systemConstant.bookingType_offline) {
                        $(".address").append(`
                        <label class="title-input">`+ nameAddress + `</label>
                        <input class="input-booking booking-address" id="address" name="address" value="`+ (addressDetail == null ? '' : addressDetail) + `"/>
                        <label class="title-input">Số điện thoại</label>
                        <input class="input-booking booking-address" id="phone" name="phone" value="`+ (dataDetail.url == null ? '' : dataDetail.url) + `" disabled readOnly/>
                        `);
                    }
                    else {
                        $(".address").append(`
                        <label class="title-input">`+ nameAddress + `</label>
                        <input class="input-booking booking-address" id="address" name="address" value="`+ (addressDetail == null ? '' : addressDetail) + `"/>
                        `);
                    }

                })
            }
            if (dataDetail.bookingTypeId == systemConstant.bookingType_online) {
                online.prop('checked', true);
            } else {
                offline.prop('checked', true);
            }
            $("#date-pc").val(moment(dataDetail.startTime).format("DD/MM/YYYY"));
            $("#date-default").val(moment(dataDetail.startTime).format("DD/MM/YYYY"));
            var info = await httpService.getAsync("Account/api/Detail/" + dataDetail.accountId);

            if (info.status == "200" && info.data != null && info.data[0] != null) {
                var infoSchool = await httpService.getAsync("schoolSchedule/api/listBySchoolId/" + info.data[0].schoolId);
                if (infoSchool.data != null) {
                    //time - pc
                    $("#time-pc").html('');
                    //var arrayTime = sortTimeRanges(infoSchool.data[0].description);
                    var listTime = [];
                    var n = 0;
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
            var startTimeDetail = moment(dataDetail.startTime).format("HH:mm");
            var endTimeDetail = moment(dataDetail.endTime).format("HH:mm");
            var schedule = startTimeDetail + '-' + endTimeDetail;
            $("#time-pc").val(schedule).trigger("change");
            $("#time-default").val(schedule).trigger("change");
            if ($("#time-pc").val() == null) {
                $('#time-pc').append(new Option(schedule, schedule, false, false)).trigger('change');
                $("#time-pc").val(schedule).trigger("change");
            }
            $("#booking-description").val(dataDetail.info);

            $("#booking-description").prop("readonly", true).prop("disabled", true);
            $("#time-pc").prop("readonly", true).prop("disabled", true);
            $("#date-pc").prop("readonly", true).prop("disabled", true);
            $(':radio').attr('disabled', true);
            $("#address").prop("readonly", true).prop("disabled", true);

            //$('#btnUpdateBooking').hide();
            $('#btnUpdateBooking').html("Xác nhận");
            if (dataDetail.bookingStatusId == systemConstant.bookingStatus_wait_accept) {
                $("#wait").removeClass("d-none");
            }
            else if (dataDetail.bookingStatusId == systemConstant.bookingStatus_wait_done) {
                $("#accept").removeClass("d-none");
                $("#btnUpdateBooking").addClass("d-none");
                $("#edit-booking").addClass("d-none");
            }
            else if (dataDetail.bookingStatusId == systemConstant.bookingStatus_done) {
                var consultant = "/phieu-danh-gia-sau-buoi-tu-van/" + dataDetail.id;
                $("#consultant").attr('href', consultant);
                $("#consultant").removeClass("d-none");
                $("#done").removeClass("d-none");
                $("#btnUpdateBooking").addClass("d-none");
                $("#edit-booking").addClass("d-none");
                $("#cancel-booking").addClass("d-none");
            }
            else if (dataDetail.bookingStatusId == systemConstant.bookingStatus_cancel) {
                $("#cancel").removeClass("d-none");
                $("#reason").text(dataDetail.reason);
                $("#reason").removeClass("d-none");
                $("#btnUpdateBooking").addClass("d-none");
                $("#edit-booking").addClass("d-none");
                $("#cancel-booking").addClass("d-none");
            }
            else if (dataDetail.bookingStatusId == systemConstant.bookingStatus_reject) {
                $("#reject").removeClass("d-none");
                $("#btnUpdateBooking").addClass("d-none");
                $("#edit-booking").addClass("d-none");
                $("#cancel-booking").addClass("d-none");
            }
        }
        else {
            window.location.href = "/Error404";
        }
    }
    else {
        window.location.href = "/Error404";
    }
}


const checked = () => {
    //offline.prop('checked', true)
    $('.address').removeClass('d-none')
    address = $(".booking-address").val()
    bookingType = $("input[name*='radio-bookingtype']:checked").val();
    counselorId = $("label[name*='counselorName']").data('value');
    accountName = $("label[name*='counselorName']").data('name');
}
$(document).ready(async function () {
    $("#reason-cancel-booking").hide();
    await load.call();
    await checked.call()
})

online.on('change', () => {
    online.prop('checked', true)
    $('.address').addClass('d-none')
    address = '';
    bookingType = $("input[name*='radio-bookingtype']:checked").val()
})

offline.on('change', () => {
    offline.prop('checked', true)
    $('.address').removeClass('d-none')
    address = $(".booking-address").val()
    bookingType = $("input[name*='radio-bookingtype']:checked").val()
})

online_mobile.on('change', () => {
    online_mobile.prop('checked', true)
    $('.address').addClass('d-none')
    address = '';
})

offline_mobile.on('change', () => {
    offline_mobile.prop('checked', true)
    $('.address').removeClass('d-none')
    address = $(".booking-address").val()
})

$('#time-pc').on('change', function (e) {
    timeselect = $("#time-pc").val()
})

$('#time-mobile').on('change', function (e) {
    timeselect = $("#time-mobile").val();
})

const bntEdit = $('#edit-booking')
bntEdit.on('click', async () => {
    //$('#btnUpdateBooking').show();
    var checkValue = $("button[name*='editInfo']").data('value');
    if (checkValue == 'no') {
        $('#edit-booking').html('Bỏ sửa lịch')
        $("#time-pc").prop("readonly", false).prop("disabled", false);
        $("#date-pc").prop("readonly", false).prop("disabled", false);
        $("button[name*='editInfo']").data('value', 'yes');
    }
    else {
        $('#edit-booking').html('Sửa lịch tư vấn')
        $("#time-pc").prop("readonly", true).prop("disabled", true);
        $("#date-pc").prop("readonly", true).prop("disabled", true);
        $("#date-pc").val($("#date-default").val());
        $("#time-pc").val($("#time-default").val());
        $("button[name*='editInfo']").data('value', 'no');
    }
})

async function validate(idBooking) {
    var errorList = [];
    if ($("#time-pc").val() == null || $("#time-pc").val() == '') {
        errorList.push("Bạn chưa chọn lịch trình.");
    }
    if ($("#date-pc").val() == null || $("#date-pc").val() == '') {
        errorList.push("Bạn chưa chọn ngày đặt lịch hẹn.");
    }

    //thời điểm hiện tại
    var checkTimeBooking = moment().format("YYYY-MM-DD HH:mm");

    datePcSelect = $("#date-pc").val().split('/').reverse().join('-')
    dateMobileSelect = $("#date-mobile").val().split('/').reverse().join('-')
    if (dateMobileSelect == '') {
        timeselect = $("#time-pc").val();
        timeSelectSplit = timeselect.split("-");
        start = timeSelectSplit[0];
        end = timeSelectSplit[1];
        startTime = datePcSelect + ' ' + start + ':' + '00';
        endTime = datePcSelect + ' ' + end + ':' + '00';
    }
    else {
        timeSelectSplit = timeselect.split("-");
        start = timeSelectSplit[0];
        end = timeSelectSplit[1];
        startTime = dateMobileSelect + ' ' + start + ':' + '00';
        endTime = dateMobileSelect + ' ' + end + ':' + '00';
    }
    // Lấy hiệu giữa date2 và date1 trong đơn vị giờ
    var differenceInSeconds = moment(startTime).diff(moment(checkTimeBooking), 'seconds');
    //console.log(differenceInHours);
    if (differenceInSeconds < 21600) {
        errorList.push("Thời gian đặt lịch hẹn phải cách hiện tại tối thiểu 6 giờ");
    }

    if (errorList.length > 0) {
        var contentError = "<ul>";
        errorList.forEach(function (item, index) {
            contentError += "<li class='text-start'>" + item + "</li>";
        })
        contentError += "</ul>";
        var actionName = (idBooking > 0 ? "Thêm mới" : "Cập nhật");
        var swalSubTitle = "<p class='swal__admin__subtitle'>" + actionName + " không thành công</p>";
        Swal.fire(
            'Quản lý lịch hẹn' + swalSubTitle,
            contentError,
            'warning'
        );
    } else {
        await booking.call();
    }
}

const bnt = $('#btnUpdateBooking')
bnt.on('click', async () => {
    bookingStatus = systemConstant.bookingStatus_wait_accept;
    validate(bookingDetailId);
})



const booking = async () => {
    datePcSelect = $("#date-pc").val().split('/').reverse().join('-');
    dateMobileSelect = $("#date-mobile").val().split('/').reverse().join('-');
    //bookingStatus = $('#status').val();
    $("input[name*='radio-bookingtype']").on('change', () => {
        bookingType = $("input[name*='radio-bookingtype']:checked").val();
    });
    if (dateMobileSelect == '') {
        timeselect = $("#time-pc").val();
        timeSelectSplit = timeselect.split("-");
        start = timeSelectSplit[0];
        end = timeSelectSplit[1];
        startTime = datePcSelect + ' ' + start + ':' + '00';
        endTime = datePcSelect + ' ' + end + ':' + '00';
    }
    else {
        timeSelectSplit = timeselect.split("-");
        start = timeSelectSplit[0];
        end = timeSelectSplit[1];
        startTime = dateMobileSelect + ' ' + start + ':' + '00';
        endTime = dateMobileSelect + ' ' + end + ':' + '00';
    }

    var updatingObj = {
        "id": bookingDetailId,
        "accountId": counselorId,
        "bookingTypeId": parseInt(bookingType),
        "bookingStatusId": systemConstant.bookingStatus_wait_done,
        "counselorId": systemConstant.accountId,
        "name": accountName,
        "address": parseInt(bookingType) == systemConstant.bookingType_online ? '' : address,
        "photo": $("#booking-photo").attr('src'),
        "info": $("#booking-description").val(),
        "startTime": startTime,
        "endTime": endTime,
        "active": 1,
        "url": parseInt(bookingType) == systemConstant.bookingType_online ? address : '',
        "createdTime": createdTime
    };
    //console.log(updatingObj)
    Swal.fire({
        title: 'Đặt lịch tư vấn',
        html: "Bạn có chắc chắn muốn xác nhận thông tin đặt lịch tư vấn<b>" + '</b>?',
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

const AddBooking = async (updatingObj) => {
    $("#loading").addClass("show");
    let response = await httpService.postAsync("booking/api/update", updatingObj);
    if (response.status == 200 && response.message === "SUCCESS") {
        $("#loading").removeClass("show");
        Swal.fire({
            html: '<strong>Xác nhận cập nhật lịch hẹn tư vấn</strong>',
            icon: 'success'
        }).then(() => {
            location.reload();
        });
    }
    else {
        $("#loading").removeClass("show");
        Swal.fire({
            html: 'Cập nhật lịch hẹn không thành công, vui lòng thử lại sau !',
            icon: 'error'
        });
    }

}

const CancelBooking = async (updatingObj) => {
    $("#loading").addClass("show");
    let response = await httpService.postAsync("booking/api/Update", updatingObj);
    if (response.status == 200 && response.message === "SUCCESS") {
        $("#loading").removeClass("show");
        Swal.fire({
            html: '<strong>Hủy lịch hẹn tư vấn</strong>',
            icon: 'success'
        }).then(() => {
            location.reload();
        });
    }
    else {
        $("#loading").removeClass("show");
        Swal.fire({
            html: 'Hủy lịch hẹn không thành công, vui lòng thử lại sau !',
            icon: 'error'
        });
    }
}
const bntCancel = $('#cancel-booking')
bntCancel.on('click', () => {
    $("#reason-cancel-booking").modal('show');
})

const bntUpdateReason = $('#btnUpdateReason')
bntUpdateReason.on('click', async () => {
    var reason = $("#reason_cancel").val();
    if (reason.trim() == "" || reason == null) {
        Swal.fire({
            html: 'Chưa có lý do hủy lịch hẹn, vui lòng thử lại!',
            icon: 'error'
        });

    }
    else {
        await bookingCancel.call();
    }
})

const bookingCancel = async () => {
    datePcSelect = $("#date-pc").val().split('/').reverse().join('-');
    dateMobileSelect = $("#date-mobile").val().split('/').reverse().join('-');
    //bookingStatus = $('#status').val();
    $("input[name*='radio-bookingtype']").on('change', () => {
        bookingType = $("input[name*='radio-bookingtype']:checked").val();
    });
    if (dateMobileSelect == '') {
        timeselect = $("#time-pc").val();
        timeSelectSplit = timeselect.split("-");
        start = timeSelectSplit[0];
        end = timeSelectSplit[1];
        startTime = datePcSelect + ' ' + start + ':' + '00';
        endTime = datePcSelect + ' ' + end + ':' + '00';
    }
    else {
        timeSelectSplit = timeselect.split("-");
        start = timeSelectSplit[0];
        end = timeSelectSplit[1];
        startTime = dateMobileSelect + ' ' + start + ':' + '00';
        endTime = dateMobileSelect + ' ' + end + ':' + '00';
    }
    //Lấy ra tên tài khoản đang đăng nhập
    var info = await httpService.getAsync("Account/api/Detail/" + systemConstant.accountId);
    userLog = info.data[0].name;
    var updatingObj = {
        "id": bookingDetailId,
        "accountId": systemConstant.accountId,
        "bookingTypeId": parseInt(bookingType),
        "bookingStatusId": systemConstant.bookingStatus_cancel,
        "counselorId": counselorId,
        "name": accountName,
        "address": parseInt(bookingType) == systemConstant.bookingType_online ? '' : address,
        "photo": $("#booking-photo").attr('src'),
        "info": $("#booking-description").val(),
        "startTime": startTime,
        "endTime": endTime,
        "active": 1,
        "url": parseInt(bookingType) == systemConstant.bookingType_online ? address : '',
        "createdTime": createdTime,
        "reason": "Cán bộ tư vấn " + userLog + " đã hủy vì: " + $("#reason_cancel").val()
    };
    //console.log(updatingObj)
    Swal.fire({
        title: 'Đặt lịch tư vấn',
        html: "Bạn có chắc chắn muốn hủy lịch tư vấn của <b>" + accountName + '</b>?',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#443',
        cancelButtonText: 'Hủy',
        confirmButtonText: 'Đồng ý',
    }).then((result) => {
        updatingObj.createdTime = new Date();
        updatingObj.active = 1
        if (result.value) {
            CancelBooking(updatingObj)
        }
    })
}

const closeModalReason = $('#close-modal')
closeModalReason.on('click', () => {
    $("#reason-cancel-booking").modal('hide');
})

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