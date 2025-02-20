"use strict";
var calendar;
var listEvents = [];
$(document).ready(function () {
    
    loadListEvent();
});

function initCalendar() {
    calendar = new FullCalendar.Calendar($("#calendar")[0], {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',

        },
        buttonText: {
            today: 'Hôm nay',
            month: 'Tháng',
            week: 'Tuần',
            day: 'Ngày',
            list: 'Lịch biểu',
            //prev: 'Trước',
            //next: 'Tiếp',
            //prevYear: '&laquo;',
            //nextYear: '&raquo;',
        },
        windowResize: function (arg) {
            //console.log(arg);
            calendar.updateSize();

        },
        allDayText: 'Cả ngày',
        /*timeZone: 'Asia/Ho_Chi_Minh',*/
        locale: 'vi',
        events: listEvents,
        eventColor: '#2F57EF21',
        eventTextColor: '#2F57EF',
        //eventClick: function (info) {
        //    info.jsEvent.preventDefault();
        //    $("#eventModal").modal("show");
        //    $("#eventModal .modal-title").text(info.event.title);
        //    $("#eventStatus").text(info.event.extendedProps.eventStatusName);
        //    if (info.event.extendedProps.eventStatusId == 1000015) {
        //        $("#eventStatus").addClass("bg-success text-white");
        //        $("#eventStatus").removeClass("bg-color-warning-opacity color-warning");
        //        $("#eventStatus").removeClass("bg-danger text-white");
        //    } else if (info.event.extendedProps.eventStatusId == 1000002) {
        //        $("#eventStatus").removeClass("bg-success text-white");
        //        $("#eventStatus").addClass("bg-primary text-white");
        //        $("#eventStatus").removeClass("bg-danger text-white");
        //        $("#eventStatus").removeClass("bg-secondary text-white");
        //    }
        //    else if (info.event.extendedProps.eventStatusId == 1000001) {
        //        $("#eventStatus").removeClass("bg-success text-white");
        //        $("#eventStatus").addClass("bg-color-warning-opacity color-warning");
        //        $("#eventStatus").removeClass("bg-danger text-white");
        //    } else if (info.event.extendedProps.eventStatusId == 1000003) {
        //        $("#eventStatus").removeClass("bg-success text-white");
        //        $("#eventStatus").addClass("bg-secondary text-white");
        //        $("#eventStatus").removeClass("bg-danger text-white");
        //        $("#eventStatus").removeClass("bg-color-warning-opacity color-warning");
        //    }
        //    else {
        //        $("#eventStatus").removeClass("bg-success text-white");
        //        $("#eventStatus").removeClass("bg-color-warning-opacity color-warning");
        //        $("#eventStatus").addClass("bg-danger text-white");
        //    }
        //    if (info.event.url != "") {
        //        if (info.event.extendedProps.eventTypeId == 1001 || info.event.extendedProps.eventTypeId == 1002) {
        //            $("#btnLinkEvent").text("Tham gia bằng " + info.event.extendedProps.eventTypeName);

        //        }
        //        else {
        //            $("#btnLinkEvent").text("Tham gia");
        //        }
        //        $("#btnLinkEvent").attr("url", info.event.url);


        //        $("#btnLinkEvent").removeClass("d-none");
        //        $("#linkDiv").removeClass("d-none");
        //        $("#btnCopyLinkEvent").removeClass("d-none");
        //        $("#eventLink").removeClass("d-none");
        //        $("#eventLink").text(info.event.url);
        //    } else {
        //        $("#btnLinkEvent").addClass("d-none");
        //        $("#linkDiv").addClass("d-none");
        //        $("#btnCopyLinkEvent").addClass("d-none");
        //        $("#eventLink").addClass("d-none");
        //        $("#eventLink").text("");
        //        $("#btnLinkEvent").removeAttr("url");
        //    }

        //    if (info.event.extendedProps.location != "") {
        //        $("#eventLocation").text(info.event.extendedProps.location);
        //        $("#eventLocationDiv").removeClass("d-none");
        //    } else {
        //        $("#eventLocationDiv").addClass("d-none");
        //    }

        //    if (info.event.extendedProps.description != "") {
        //        $("#eventDescription").text(info.event.extendedProps.description);
        //        $("#eventDescriptionDiv").removeClass("d-none");
        //    } else {
        //        $("#eventDescriptionDiv").addClass("d-none");

        //    }

        //    if (info.event.start != null && info.event.end != null) {
        //        var date1 = moment(info.event.start);
        //        var date2 = moment(info.event.end);

        //        if (date1.isSame(date2, 'day')) {
        //            $('#eventTime').text(moment(info.event.start).format('dddd') + ", " + moment(info.event.start).format("DD") + " tháng " + moment(info.event.start).format("MM") + ", " + moment(info.event.start).format("HH:mm") + " - " + moment(info.event.end).format("HH:mm"));
        //        } else {
        //            $('#eventTime').text(moment(info.event.start).format('dddd') + ", " + moment(info.event.start).format("DD") + " tháng " + moment(info.event.start).format("MM, HH:mm") + " - " + moment(info.event.end).format('dddd') + ", " + moment(info.event.end).format("DD") + " tháng " + moment(info.event.end).format("MM, HH:mm"));
        //        }

        //    } else if (info.event.start != null && info.event.end == null) {
        //        $('#eventTime').text(moment(info.event.start).format("DD") + " tháng " + moment(info.event.start).format("MM, HH:mm"));

        //    } else {
        //        $('#eventTime').text(moment(info.event.end).format("DD") + moment(info.event.end).format("MM, HH:mm"));
        //    }
        //},
        eventDidMount: function (info) {
            if (info.event.extendedProps.background) {
                info.el.style.background = info.event.extendedProps.background;
            }
        },
        //eventDidMount: function (info) {
        //    //$(info.el).find(".fc-event-title").html(info.event.title + " - " + info.event.extendedProps.eventStatusName);
        //}
    });
    calendar.render();
    $(".fc-next-button").attr("title", "Tiếp");
    $(".fc-prev-button").attr("title", "Trước");
    $(".fc-today-button").attr("title", "Hôm nay");
    $(".fc-dayGridMonth-button").attr("title", "Tháng");
    $(".fc-timeGridWeek-button").attr("title", "Tuần");
    $(".fc-timeGridDay-button").attr("title", "Ngày");
    $(".fc-listWeek-button").attr("title", "Lịch biểu");
}
var dataTest
function loadListEvent() {
    //var params = new URL(document.location).searchParams;
    //var counselorId = params.get("counselorId");
    //$("#loading").addClass("show");
    $.ajax({
        url: systemURL + "booking/api/lich-cua-tu-van-nien-web-view/" + counselorId,
        type: "GET",
        async: true,
        success: function (response) {
            //console.log(response);
            var data = response.data;
            listEvents = data.map(item => ({
                id: item.id,
                title: "Lịch hẹn tư vấn",
                start: (item.startTime != null ? item.startTime : ""),
                end: (item.endTime != null ? item.endTime : ""),
                url: (""),//(item.url != null ? item.url : "")
                background: item.bookingStatusId == 1000001 ? "#FEF3C7" : (item.bookingStatusId == 1000002 ? "#E0F2FE" : (item.bookingStatusId == 1000003 ? "#B5B5C3" : (item.bookingStatusId == 1000005 ? "#FFE4E6" : "rgba(16, 185, 129, 0.1)"))),
                extendedProps: {
                    description: item.description,
                    location: item.address,
                    eventStatusName: item.bookingStatusName,
                    eventStatusId: item.bookingStatusId,
                    createdTime: item.createdTime,
                    eventTypeName: item.bookingTypeName,
                    eventTypeId: item.bookingTypeId,
                },
            })
            );
            initCalendar();
            //$("#loading").removeClass("show");
        },
        error: function (e) {
            //console.log(e);
            initCalendar();
            //$("#loading").removeClass("show");
        }
    })
}

//$("#btnLinkEvent").on("click", function () {
//    window.open($(this).attr("url"), "_blank");
//})

//$("#btnCopyLinkEvent").on("click", function () {
//    navigator.clipboard.writeText($("#btnLinkEvent").attr("url"));
//    Toast.fire("Sự kiện", "Đường dẫn đã được sao chép thành công!", "success");
//})