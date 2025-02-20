"use strict";

var roomAdminId;
var accountRoomId = [];
var focusAccountIdAdmin = 0;

const connectionMessageAdmin = new signalR.HubConnectionBuilder()
    .withUrl(`/ListConversation`)
    .build();

connectionMessageAdmin.on("ListConversation", function (obj) {
    pageIndexListConversation = 1;
    if (obj == accountId) {
        obj = focusAccountIdAdmin;
    }
    regenListConversation(obj);
});
connectionMessageAdmin.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

$("#list-conversation-end-user").on("click", '.list-conversation-item', function (e) {
    $("#sendButton").attr("data-id", $(this).data("id"));
})
var connectionHubMessageAdmin;
var listConnectionAdmin = [];
$(document).ready(async function () {
    await loadDataContact();
    listConversation();
    //Khi ấn vào người tư vấn viên hoặc thanh thiếu niên
    // sẽ gọi đến API và add họ vào phòng
    //Nếu chưa có phòng thì sẽ thêm họ vào phòng
    //Nếu chưa có phòng thì return roomAdminId
    $(document).on("click", ".my-contact", function () {
        pageIndexMessage = 1;
        $(this).parent().find(".active-message-status").removeClass("active-message-status");
        var userName = $(this).attr('data-name');

        if ($('#myTable').css('display') === 'none') {
            $("#userName").text(userName);
            $('#myTable').css('display', 'table');
        } else {
            $("#userName").text(userName);
            $('#myTable').css('display', 'table');
        }

        var accountId1 = $(this).data('value');
        focusAccountIdAdmin = accountId1;
        $("#checkActive").attr("data-value", accountId1);
        var objAddAccountRoom = {
            "accountId1": accountId,
            "accountId2": accountId1
        }
        var flagCheckConnectAdmin = false;
        $.ajax({
            url: systemURL + "Room/api/AddAccountRoomMobile",
            type: "POST",
            contentType: "application/json",
            beforeSend: function (xhr) {
                if (localStorage.token) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
                }
            },
            data: JSON.stringify(objAddAccountRoom),
            success: function (responseData) {
                if (responseData.status == 201 && responseData.message === "CREATED") {
                    roomAdminId = responseData.data[0].id;
                    $("#sendButton").attr("data-id", responseData.data[0].accountRoomId);
                    loadDataMessage(accountId1);
                    if (listConnectionAdmin.length > 0) {
                        for (var i = 0; i < listConnectionAdmin.length; i++) {
                            var item = listConnectionAdmin[i];
                            if (item.connection.baseUrl.includes(roomAdminId)) {
                                flagCheckConnectAdmin = false;
                                break;
                            } else {
                                flagCheckConnectAdmin = true;
                            }
                        }
                    } else {
                        flagCheckConnectAdmin = true;
                    }
                    if (flagCheckConnectAdmin) {
                        connectionHubMessageAdmin = new signalR.HubConnectionBuilder()
                            .withUrl(`/AccountSendMessageHub?roomId=${roomAdminId}`)
                            .build();
                        connectionHubMessageAdmin.on("ReceiveMessage", function (obj) {
                            if (obj.accountId == accountId) {
                                var newRow = `
                                                <div class="d-flex justify-content-end mb-10">
                                                    <span style="margin-top: 15px; margin-right: 5px;" class="text-muted fs-7 mb-1">${timeSince(obj.createdTime)}</span>
                                                    <div class="d-flex flex-column align-items-end">
                                                        <div class="p-5 rounded bg-light-primary text-dark fw-semibold mw-lg-400px text-end" data-kt-element="message-text" id="messagesList">
                                                            ${obj.text}
                                                        </div>
                                                    </div>
                                                </div>
                                `

                                $("#chatMessage").val("");
                                $("#chatMessageSignalR").append(newRow);
                            } else {
                                var newRow = `
                            <div class="d-flex justify-content-start mb-10 ">
                                <div class="d-flex justify-content-start mb-10">
                                 <!--begin::Avatar-->
                                 <div class="symbol  symbol-35px symbol-circle ">
                                    <img style="margin-top: 5px;" alt="Pic" src="/admin/assets/media/avatars/300-25.jpg"/>
                                 </div><!--end::Avatar-->
                                <div class="d-flex flex-column align-items-start">
                                    <div class="p-5 rounded bg-light-info text-dark fw-semibold mw-lg-400px text-start" data-kt-element="message-text" id="messagesList">
                                    ${obj.text}
                                    </div>
                                </div>
                               <span style="margin-top: 15px; margin-left: 5px;" class="text-muted fs-7 mb-1">${timeSince(obj.createdTime)}</span>
                            </div>
                            </div>
            `

                                //$("#chatMessage").val("");
                                if (roomAdminId == item.roomId) {
                                    $("#chatMessageSignalR").append(newRow);
                                }
                                scrollSendMessgageAdmin();
                                //xử lý khi nhận tin nhắn mới
                                $(`.my-parent[data-value= ${accountId1}] .text-muted`).text(obj.text);
                                $(`.my-parent[data-value= ${accountId1}]`).parent().parent().find('.item-createdTime').text(timeSince(obj.createdTime));
                            }
                        });
                        connectionHubMessageAdmin.start().then(function () {
                            document.getElementById("sendButton").disabled = false;
                        }).catch(function (err) {
                            return console.error(err.toString());
                        });
                        listConnectionAdmin.push(connectionHubMessageAdmin);
                    }
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
    });
});

document.getElementById("sendButton").disabled = true;

//Danh sách tin nhắn trong phòng
var pageIndexMessage = 1;
var pageSizeMessage = 30;
const groupBy = (array, key) => {
    return array.reduce((result, item) => {
        const groupKey = item[key];

        // If the group doesn't exist yet, create it
        if (!result[groupKey]) {
            result[groupKey] = [];
        }

        // Add the current item to the group
        result[groupKey].push({ item });

        return result;
    }, {});
};
var dataCreatedTime = [];
var checkDate = [];
async function loadDataMessage(id) {
    $("#chatMessageSignalR").html("");
    pageIndexMessage = 1;
    dataCreatedTime = [];
    checkDate = [];
    await $.ajax({
        url: systemURL + "message/api/ListMessage/" + roomAdminId + "?pageIndex=" + pageIndexMessage + "&pageSize=" + pageSizeMessage,
        type: "GET",
        contentType: "application/json",

        success: function (responseData) {

            var dataSource = responseData?.data?.sort((a, b) => a.id - b.id);
            dataSource.forEach(function (item, index) {
                dataCreatedTime.push({ date: moment(item.createdTime).format("DD/MM/YYYY"), message: item.text, accountId: item.accountId, time: moment(item.createdTime).format("HH:mm") });
            });
            GroupMessage(dataCreatedTime, "append");
            setTimeout(function () {
                scroll2();
            }, 200)
        }
    })
}
function GroupMessage(dataCreatedTime, action) {
    var dataArray = groupBy(dataCreatedTime, "date");
    var arrayFromObjectList = Object.values(dataArray);
    arrayFromObjectList.forEach(function (item, index) {
        var dateGroup = "";
        item.forEach(function (itemData) {
            var data = itemData.item;
            var dateGroupString = "";
            if (dateGroup == "") {
                if (!checkDate.some(x => x.date == data.date)) {
                    dateGroupString = `<div class='group' data-date='` + data.date + `'><p>` + data.date + `</p></div>`;
                    checkDate.push({ date: data.date });
                }
            }
            else if (dateGroup != data.date) {
                dateGroupString = `<div class='group' data-date='` + data.date + `'><p>` + data.date + `</p></div>`;
                checkDate.push({ date: data.date });
            }
            if (data.accountId == accountId) {
                var newRow = `
                            <div class="d-flex justify-content-end mb-10">
                                    <div class="d-flex flex-column align-items-end">
                                        <div class="d-flex align-items-center mb-2">
                                             <span style="margin-right: 5px;" class="text-muted fs-7 mb-1">${(data.time)}</span>
                                            <div class="p-5 rounded bg-light-primary text-dark fw-semibold mw-lg-400px text-end" data-kt-element="message-text" id="messagesList">
                                            ${data.message}
                                            </div>
                                        </div>
                                    </div>
                    `
                if (action == "append") {
                    $("#chatMessageSignalR").append(dateGroupString);
                    $(`.group[data-date='${data.date}']`).append(newRow);
                }
                else {
                    $("#chatMessageSignalR").prepend(dateGroupString);
                    $(`.group[data-date='${data.date}']`).prepend(newRow);
                    //$("#chatMessageSignalR").prepend(newRow);
                }
                //append:  

            } else {
                var newRow = `
                                     <div class="d-flex justify-content-start mb-10">
                                         <!--begin::Avatar-->
                                         <div class="symbol  symbol-35px symbol-circle ">
                                            <img style="margin-top: 5px;" alt="Pic" src="/admin/assets/media/avatars/300-25.jpg"/>
                                         </div><!--end::Avatar-->
                                        <div class="d-flex flex-column align-items-start">
                                            <div class="p-5 rounded bg-light-info text-dark fw-semibold mw-lg-400px text-start" data-kt-element="message-text" id="messagesList">
                                            ${data.message}
                                            </div>
                                        </div>
                                       <span style="margin-top: 15px; margin-left: 5px;" class="text-muted fs-7 mb-1">${(data.time)}</span>
                                    </div>
                    `
                if (action == "append") {
                    $("#chatMessageSignalR").append(dateGroupString);
                    $(`.group[data-date='${data.date}']`).append(newRow);
                }
                else {
                    $("#chatMessageSignalR").prepend(dateGroupString);
                    $(`.group[data-date='${data.date}']`).prepend(newRow);
                    //$("#chatMessageSignalR").prepend(newRow);
                }
            }
            dateGroup = data.date;
        });
    })
}
async function loadDataMessagePrevious() {
    dataCreatedTime = [];
    await $.ajax({
        url: systemURL + "message/api/ListMessage/" + roomAdminId + "?pageIndex=" + pageIndexMessage + "&pageSize=" + pageSizeMessage,
        type: "GET",
        contentType: "application/json",
        success: function (responseData) {
            var dataSource = responseData.data;
            dataSource.forEach(function (item, index) {
                var checkValidAdmin = dataCreatedTime.find(x => x.message == item.text && x.time == moment(item.createdTime).format("HH:mm"));
                if (!checkValidAdmin) {
                    dataCreatedTime.push({ date: moment(item.createdTime).format("DD/MM/YYYY"), message: item.text, accountId: item.accountId, time: moment(item.createdTime).format("HH:mm") });
                }
            });
            GroupMessage(dataCreatedTime, "prepend");
            $('#chatMessageSignalR').scrollTop(200);
        }
    })
}

let scrollContainer = document.getElementById("scroll-container");

//Scroll listMessage
const elementlistMessage = $('#chatMessageSignalR');
let lastScrollToplistMessage = 0;

elementlistMessage.on('scroll', function (e) {
    if (elementlistMessage.scrollTop() <= lastScrollToplistMessage) {
        pageIndexMessage += 1;
        loadDataMessagePrevious();
    }
});

//Danh sách những người liên hệ
var pageIndexDataContact = 1;
var pageSizeDataContact = 3;
async function loadDataContact() {

    await $.ajax({
        url: systemURL + "Account/api/ListContact?pageIndex=" + pageIndexDataContact + "&pageSize=" + pageSizeDataContact,
        type: "GET",
        contentType: "application/json",
        beforeSend: function (xhr) {
            if (localStorage.token) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
            }
        },
        success: function (responseData) {
            var dataSource = responseData.data[0];
            var newRowCounselor = '';
            var countCounselor = dataSource.countConselor;
            $("#countCounselor").text(" (" + countCounselor + ")");
            var countStudent = dataSource.countStudent;
            $("#countStudent").text(" (" + countStudent + ")");
            var dataListCounselor = dataSource.listConselor;
            dataListCounselor.forEach(function (item, index) {
                newRowCounselor += `
                                    <!--begin::User-->
                                        <div class="d-flex flex-stack py-4 item-scroll-counselor">
                                            <!--begin::Details-->
                                            <div class="d-flex align-items-center">
                                                <!--begin::Avatar--><div class="symbol  symbol-45px symbol-circle "><span class="symbol-label  bg-light-danger text-danger fs-6 fw-bolder ">M</span><div class="symbol-badge bg-warning start-100 top-100 border-4 h-8px w-8px ms-n2 mt-n2"></div></div><!--end::Avatar-->
                                                <!--begin::Details-->
                                                <div class="ms-5">
                                                    <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2 toggleButton my-contact" data-value="${item.id}" data-name="${item.name}" >${item.name}</a>
                                                    <div class="fw-semibold text-muted text-list-conversation">${item.email}</div>
                                                </div>
                                                <!--end::Details-->
                                            </div>
                                            <!--end::Details-->
                                        </div>
                                <!--end::User-->
                            `

            })
            $("#kt_tab_pane_counselor").append(newRowCounselor);

            var newRowStudent = '';
            var dataListStudent = dataSource.listStudent
            dataListStudent.forEach(function (item, index) {
                newRowStudent += `
                                    <!--begin::User-->
                                        <div class="d-flex flex-stack py-4 item-scroll-student">
                                            <!--begin::Details-->
                                            <div class="d-flex align-items-center">
                                                <!--begin::Avatar--><div class="symbol  symbol-45px symbol-circle "><span class="symbol-label  bg-light-danger text-danger fs-6 fw-bolder ">M</span><div class="symbol-badge bg-warning start-100 top-100 border-4 h-8px w-8px ms-n2 mt-n2"></div></div><!--end::Avatar-->
                                                <!--begin::Details-->
                                                <div class="ms-5">
                                                    <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2 toggleButton my-contact" data-value="${item.id}" data-name="${item.name}" >${item.name}</a>
                                                    <div class="fw-semibold text-muted text-list-conversation">${item.email}</div>
                                                </div>
                                                <!--end::Details-->
                                            </div>
                                            <!--end::Details-->
                                        </div>
                                <!--end::User-->
                            `

            })
            $("#kt_tab_pane_student").append(newRowStudent);
        }
    })
}

//Scroll listCouselor
const elementCounselor = $('#kt_tab_pane_counselor');
let lastScrollTopCounselor = 0;

elementCounselor.on('scroll', function (e) {
    if (elementCounselor.scrollTop() < lastScrollTopCounselor) {
        // upscroll
        return;
    }
    lastScrollTopCounselor = elementCounselor.scrollTop() <= 0 ? 0 : elementCounselor.scrollTop();
    if (elementCounselor.scrollTop() + elementCounselor.height() >= elementCounselor[0].scrollHeight) {
        pageIndexDataContact += 1;
        loadDataContact();
    }
});


//Scroll listStudent
const elementStudent = $('#kt_tab_pane_student');
let lastScrollTopStudent = 0;

elementStudent.on('scroll', function (e) {
    if (elementStudent.scrollTop() < lastScrollTopStudent) {
        // upscroll
        return;
    }
    lastScrollTopStudent = elementStudent.scrollTop() <= 0 ? 0 : elementStudent.scrollTop();
    if (elementStudent.scrollTop() + elementStudent.height() >= elementStudent[0].scrollHeight) {
        pageIndexDataContact += 1;
        loadDataContact();
    }
});


//Danh sách đoạn hội thoại
var pageIndexListConversation = 1;
var pageSizeListConversation = 6;
function listConversation() {
    $.ajax({
        url: systemURL + "AccountRoom/api/ListConversationForWeb?pageIndex=" + pageIndexListConversation + "&pageSize=" + pageSizeListConversation,
        type: "GET",
        contentType: "application/json",
        beforeSend: function (xhr) {
            if (localStorage.token) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
            }
        },
        success: function (responseData) {
            var dataSource = responseData.data;
            dataSource.forEach(function (item, index) {
                var newRow = ` <!--begin::User-->
                                        <div class="d-flex flex-stack py-4 item-scroll-listConversation">
                                            <!--begin::Details-->
                                            <div class="d-flex align-items-center">
                                                <!--begin::Avatar--><div class="symbol  symbol-45px symbol-circle "><span class="symbol-label  bg-light-danger text-danger fs-6 fw-bolder ">M</span><div class="symbol-badge bg-warning start-100 top-100 border-4 h-8px w-8px ms-n2 mt-n2"></div></div><!--end::Avatar-->
                                                <!--begin::Details-->
                                                <div class="ms-5 my-parent list-conversation-item" data-value=${item.accountId} data-id=${item.id}>
                                                    <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2 my-contact" id="toggleButton" data-value=${item.accountId} data-roomAdminId=${item.roomAdminId} data-name="${item.accountName}">${item.accountName}</a>
                                                    <div class="${item.messageStatusId == 1000001 ? "active-message-status" : "" } fw-semibold text-muted text-list-conversation">${item.textMessage !== null ? item.textMessage : ""}</div>
                                                </div>
                                                <!--end::Details-->
                                            </div>
                                            <!--end::Details-->
                                            <!--begin::Lat seen-->
                                            `
                if (item.createdTime == '0001-01-01T00:00:00') {
                    newRow += ` <div class="d-flex flex-column align-items-end ms-2">
                                                                                                <span class="text-muted fs-7 mb-1 item-createdTime  ${item.messageStatusId == 1000001 ? "active-message-status" : "" } "></span>
                                                                                            </div>`

                } else {
                    newRow += ` <div class="d-flex flex-column align-items-end ms-2">
                                                                                                <span class="text-muted fs-7 mb-1 item-createdTime ${item.messageStatusId == 1000001 ? "active-message-status" : "" } ">${timeSince(item.createdTime)}</span>
                                                                                            </div>`

                }

                $("#kt_tab_pane_7").append(newRow);
            })
            for (var i = 0; i < ListUserOnline.length; i++) {
                $(".my-parent[data-value=" + ListUserOnline[i].accountId + "]").parent().find(".symbol-badge").removeClass("bg-warning").addClass("bg-success");
            }
        }
    })
}

//Scroll ListConversation
const elementListConversation = $('#kt_tab_pane_7');
let lastScrollTopListConversation = 0;

elementListConversation.on('scroll', function (e) {
    if (elementListConversation.scrollTop() < lastScrollTopListConversation) {
        // upscroll
        return;
    }
    lastScrollTopListConversation = elementListConversation.scrollTop() <= 0 ? 0 : elementListConversation.scrollTop();
    if (elementListConversation.scrollTop() + elementListConversation.height() >= elementListConversation[0].scrollHeight) {
        pageIndexListConversation += 1;
        listConversation();
    }
});

$("#sendButton").on("click", function (event) {
    validateAdmin();
});

//Enter send message
$("#chatMessage").on("keypress", function (event) {
    if (event.which === 13) {
        validateAdmin();
    }
});


//SendMessage
function sendMessage() {
    var message = document.getElementById("chatMessage").value;
    var accountRoomId = $("#sendButton").attr("data-id");
    var accountId1 = $('.my-contact').data('value');
    var obj = {
        accountRoomId: accountRoomId,
        messageStatusId: 1000001,
        messageTypeId: 1000001,
        text: message
    }
    $.ajax({
        url: systemURL + "message/api/SendMessage",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(obj),
        success: function (responseData) {
            if (responseData.status == 201 && responseData.message === "CREATED") {
                obj = responseData.data[0];
                $(`.my-parent[data-value= ${accountId1}] .text-muted`).text(message);
                $(`.my-parent[data-value= ${accountId1}]`).parent().parent().find('.item-createdTime').text(timeSince(obj.createdTime));
                scrollSendMessgageAdmin();
            }
        },
        error: function (e) {
            Swal.fire(
                'Lỗi!',
                'Đã xảy ra lỗi, vui lòng thử lại',
                'error'
            );
            submitButton.removeAttribute('data-kt-indicator');
            submitButton.disabled = false;
        }
    });
}

function validateAdmin() {
    var errorList = [];
    var message = document.getElementById("chatMessage").value;
    if (message == "") {
        errorList.push("Văn bản không được để trống.");
    }

    if (errorList.length > 0) {

    } else {
        sendMessage();
    }
}
function formatTimeToHHMM(dateTime) {
    var hours = dateTime.getHours().toString().padStart(2, '0');
    var minutes = dateTime.getMinutes().toString().padStart(2, '0');
    return hours + ":" + minutes;
}

//validate createdTime

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


function scroll2() {
    $('#chatMessageSignalR').animate({ scrollTop: $('#chatMessageSignalR').prop("scrollHeight") }, 1);
}

function scrollSendMessgageAdmin() {
    $('#chatMessageSignalR').animate({ scrollTop: $('#chatMessageSignalR').prop("scrollHeight") }, 1);
}

async function regenListConversation(receiveId) {
    var data = await getDataConversation();
    var dataReceiveId = data.find(x => x.accountId == receiveId);
    $(".list-conversation-item[data-value=" + dataReceiveId.accountId + "]").remove();
    var classOnline = "avatar-away";
    var checkOnline = ListUserOnline.find(x => x.accountId == dataReceiveId.accountId);
    if (checkOnline != null && checkOnline != undefined) {
        classOnline = "avatar-online";
    }
    else if (receiveId == systemConstant.happy_s_bot_id) {
        classOnline = "avatar-online";
    }
    $("#kt_tab_pane_7").prepend(`
                                <!--begin::User-->
                                        <div class="d-flex flex-stack py-4 item-scroll-listConversation">
                                            <!--begin::Details-->
                                            <div class="d-flex align-items-center">
                                                <!--begin::Avatar--><div class="symbol  symbol-45px symbol-circle "><span class="symbol-label  bg-light-danger text-danger fs-6 fw-bolder ">M</span><div class="symbol-badge bg-warning start-100 top-100 border-4 h-8px w-8px ms-n2 mt-n2"></div></div><!--end::Avatar-->
                                                <!--begin::Details-->
                                                <div class="ms-5 my-parent list-conversation-item" data-value=${dataReceiveId.accountId} data-id=${dataReceiveId.id}>
                                                    <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2 my-contact" id="toggleButton" data-value=${dataReceiveId.accountId} data-roomAdminId=${dataReceiveId.roomAdminId} data-name="${dataReceiveId.accountName}">${dataReceiveId.accountName}</a>
                    <div class="${dataReceiveId.messageStatusId == 1000001 ? "active-message-status" : ""} fw-semibold text-muted text-list-conversation">${dataReceiveId.textMessage !== null ? dataReceiveId.textMessage : ""}</div>
                                                </div>
                                                <!--end::Details-->
                                            </div>
                                            <!--end::Details-->
                                            <!--begin::Lat seen-->
                                            `)
}

async function getDataConversation() {
    var dataRollback;
    await $.ajax({
        url: systemURL + "AccountRoom/api/ListConversationForWeb?pageIndex=" + pageIndexListConversation + "&pageSize=" + pageSizeListConversation,
        type: "GET",
        contentType: "application/json",
        beforeSend: function (xhr) {
            if (localStorage.token) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
            }
        },
        success: function (responseData) {
            var dataSource = responseData.data;
            dataRollback = dataSource;
        }
    });
    return dataRollback;
}
