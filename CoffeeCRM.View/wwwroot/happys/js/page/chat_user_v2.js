var roomIdChatUser;
var focusAccountId = 0;
const connectionMessageUser = new signalR.HubConnectionBuilder()
    .withUrl(`/ListConversation`)
    .build();

connectionMessageUser.on("ListConversation", function (obj) {
    pageIndexConversation = 1;
    if (obj == accountId) {
        obj = focusAccountId;
    }
    regenListConversation(obj);
});
connectionMessageUser.start().then(function () {
    document.getElementById("btnSendMessage-signalR").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

$("#list-conversation-end-user").on("click", '.list-conversation-item', function (e) {
    $("#btnSendMessage-signalR").attr("data-id", $(this).data("id"));
});
var connectionHubMessage;
var listConnection = [];
$(document).ready(async function () {
    listConversation();
    loadDataContact();
    $("#ul-list-conversation, #ul-list-counselor, #ul-list-phonebook").on("click", ".my-contact", function () {
        pageIndexMessage = 1;
        $(this).find(".active-message-chat-end-user-status").removeClass("active-message-chat-end-user-status");
         $("#text-send-message").val("");
        $("#text-send-message").focus();
        var username = $(this).attr("data-name");
        var imageUser = $(this).attr('data-image');
        if ($('#myTable').css('display') === 'none') {
            $("#username").text(username);
            $("#imageUser").attr("src", imageUser);
            $('#myTable').css('display', '');
            $('#myTable').attr("data-value", $(this).data("value"));

        } else {
            $("#username").text(username);
            $("#imageUser").attr("src", imageUser);
            $('#myTable').css('display', '');
            $('#myTable').attr("data-value", $(this).data("value"));
        }

        var accountId1 = $(this).data('value');
        focusAccountId = accountId1;
        var objAddAccountRoom = {
            "accountId1": accountId,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
            "accountId2": accountId1
        }
        var flagCheckConnect = false;
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
                    roomIdChatUser = responseData.data[0].id;
                    $("#btnSendMessage-signalR").attr("data-id", responseData.data[0].accountRoomId);
                    loadDataMessage(accountId1);
                    if (listConnection.length > 0) {
                        for (var i = 0; i < listConnection.length; i++) {
                            var item = listConnection[i];
                            if (item.connection.baseUrl.includes(roomIdChatUser)) {
                                flagCheckConnect = false;
                                break;
                            }
                            else {
                                flagCheckConnect = true;
                            }
                        }
                    }
                    else {
                        flagCheckConnect = true;
                    }
                    if (flagCheckConnect) {
                        connectionHubMessage = new signalR.HubConnectionBuilder()
                            .withUrl(`/AccountSendMessageHub?roomId=${roomIdChatUser}`)
                            .build();
                        connectionHubMessage.on("ReceiveMessage", function (item) {
                            var newRow = `
                                        <div class="message-themes ${item.accountId != accountId ? "" : "self"}">
                                                    <div class="message-themes-wrap">
                                                        <div class="message-themes-item">
                                                            <div class="message-themes-content">
                                                                <span>${item.text}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="message-themes-info">
                                                        <div>
                                                            <small class="text-muted">
                                                                ${timeSince(item.createdTime)}
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>
                                `;
                            //$("#text-send-message").val("");
                            if (roomIdChatUser == item.roomId) {
                                $("#list-message").append(newRow);
                            }
                            scrollSendMessgage();
                        });
                        connectionHubMessage.start().then(function () {
                            document.getElementById("btnSendMessage-signalR").disabled = false;
                        }).catch(function (err) {
                            return console.error(err.toString());
                        });
                        listConnection.push(connectionHubMessage);
                    }
                }
                //scrollSendMessgage();
            },
            error: function (e) {
                Swal.fire(
                    'Lỗi!',
                    'Đã xảy ra lỗi, vui lòng thử lại',
                    'error'
                );
            }
        });
    });
})

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
var dataCreatedTimeEndUser = [];
var checkDateEndUser = [];
function loadDataMessage(id) {
    $("#list-message").html("");
    pageIndexMessage = 1;
    dataCreatedTimeEndUser = [];
    checkDateEndUser = [];
    $.ajax({
        url: systemURL + "message/api/ListMessage/" + roomIdChatUser + "?pageIndex=" + pageIndexMessage + "&pageSize=" + pageSizeMessage,
        type: "GET",
        contentType: "application/json",
        beforeSend: function (xhr) {
            if (localStorage.token) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
            }
        },
        success: function (responseData) {
            var dataSource = responseData?.data?.sort((a, b) => a.id - b.id);
            dataSource.forEach(function (item, index) {
                dataCreatedTimeEndUser.push({ date: moment(item.createdTime).format("DD/MM/YYYY"), message: item.text, accountId: item.accountId, time: moment(item.createdTime).format("HH:mm") });

                $("#myTable .avatar").removeClass("avatar-online").addClass("avatar-away");
                $("#myTable #checkActive-chat-signalR p").text("Không trực tuyến").removeClass("text-success").addClass("text-warning");
                for (var i = 0; i < ListUserOnline.length; i++) {
                    $("#myTable[data-value=" + ListUserOnline[i].accountId + "] .avatar").removeClass("avatar-away").addClass("avatar-online");
                    $("#myTable[data-value=" + ListUserOnline[i].accountId + "] #checkActive-chat-signalR p").text("Trực tuyến").removeClass("text-warning").addClass("text-success");
                }
                if (id == systemConstant.happy_s_bot_id) {
                    $("#myTable[data-value='" + item.accountId + "'] .avatar").removeClass("avatar-away").addClass("avatar-online");
                    $("#myTable[data-value='" + item.accountId + "'] #checkActive-chat-signalR p").text("Trực tuyến").removeClass("text-warning").addClass("text-success");
                }
            });
            GroupMessage(dataCreatedTimeEndUser, "append");
            setTimeout(function () {
                scrollMessage();
            }, 200)
        }
    })
}

function GroupMessage(dataCreatedTimeEndUser, action) {
    var dataArray = groupBy(dataCreatedTimeEndUser, "date");
    var arrayFromObjectList = Object.values(dataArray);
    arrayFromObjectList.forEach(function (item, index) {
        var dateGroup = "";
        item.forEach(function (itemData) {
            var data = itemData.item;
            var dateGroupString = "";
            if (dateGroup == "") {
                if (!checkDateEndUser.some(x => x.date == data.date)) {
                    dateGroupString = `<div class='group' data-date='` + data.date + `'><p>` + data.date + `</p></div>`;
                    checkDateEndUser.push({ date: data.date });
                }
            }
            else if (dateGroup != data.date) {
                dateGroupString = `<div class='group' data-date='` + data.date + `'><p>` + data.date + `</p></div>`;
                checkDateEndUser.push({ date: data.date });
            }
            if (data.accountId == accountId) {
                var newRow = `
                            <div class="message-themes self">
                                <div class="message-themes-wrap">
                                    <div class="message-themes-item">
                                        <div class="message-themes-content">
                                            <span>${data.message}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="message-themes-info">
                                    <div>
                                        <small class="text-muted">
                                            ${data.time}
                                        </small>
                                    </div>
                                </div>
                            </div>
                    `
                if (action == "append") {
                    $("#list-message").append(dateGroupString);
                    $(`.group[data-date='${data.date}']`).append(newRow);
                }
                else {
                    $("#list-message").prepend(dateGroupString);
                    $(`.group[data-date='${data.date}']`).prepend(newRow);
                }

            }
            else {
                var newRow = `
                                      <div class="message-themes">
                                <div class="message-themes-wrap">
                                    <div class="message-themes-item">
                                        <div class="message-themes-content">
                                            <span>${data.message}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="message-themes-info">
                                    <div>
                                        <small class="text-muted">
                                            ${data.time}
                                        </small>
                                    </div>
                                </div>
                            </div>
                    `
                if (action == "append") {
                    $("#list-message").append(dateGroupString);
                    $(`.group[data-date='${data.date}']`).append(newRow);
                }
                else {
                    $("#list-message").prepend(dateGroupString);
                    $(`.group[data-date='${data.date}']`).prepend(newRow);
                    //$("#chatMessageSignalR").prepend(newRow);
                }
            }
            dateGroup = data.date;
        });
    });


}
function loadDataMessagePrevious() {
    dataCreatedTimeEndUser = [];
    $.ajax({
        url: systemURL + "message/api/ListMessage/" + roomIdChatUser + "?pageIndex=" + pageIndexMessage + "&pageSize=" + pageSizeMessage,
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
                var checkValid = dataCreatedTimeEndUser.find(x => x.message == item.text && x.time == moment(item.createdTime).format("HH:mm"));
                if (!checkValid) {
                    dataCreatedTimeEndUser.push({ date: moment(item.createdTime).format("DD/MM/YYYY"), message: item.text, accountId: item.accountId, time: moment(item.createdTime).format("HH:mm") });
                }
            });
            GroupMessage(dataCreatedTimeEndUser, "prepend");
            $('.chat-content').scrollTop(200);
        }
    })
}

let scrollContainer = document.getElementById("scroll-container");

//Scroll listMessage
const elementlistMessage = $('.chat-content');
let lastScrollToplistMessage = 0;

elementlistMessage.on('scroll', async function (e) {
    if (elementlistMessage.scrollTop() <= lastScrollToplistMessage) {
        pageIndexMessage += 1;
        await loadDataMessagePrevious();
    }
});



var pageIndexConversation = 1;
var pageSizeConversation = 6;
function listConversation() {
    $.ajax({
        url: systemURL + "AccountRoom/api/ListConversationForWeb?pageIndex=" + pageIndexConversation + "&pageSize=" + pageSizeConversation,
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

                var newRow = `
                                        <li class="card contact-item mb-3 my-contact list-conversation-item" data-id=${item.id} data-value=${item.accountId} data-name="${item.accountName}" data-image="${item.photo}">
                                            <div class="card-body">
                                                <div class="d-flex align-items-center">
                                                    <!-- Avatar -->
                                                    <div class="avatar avatar-away me-4">
                                                        <img class="avatar-label" src="${item.photo}" />
                                                    </div>
                                                    <!-- Avatar -->
                                                    <!-- Content -->
                                                    <div class="flex-grow-1 overflow-hidden">
                                                        <div class="d-flex align-items-center mb-1">
                                                            <h5 class="text-truncate mb-0 me-auto">${item.accountName}</h5>
                                                            <p class="small text-muted text-nowrap ms-4 mb-0">${timeSince(item.createdTime)}</p>
                                                        </div>
                                                        <div class="d-flex align-items-center">
                                                            <div class="${item.messageStatusId == 1000001 ? "active-message-chat-end-user-status" : ""} line-clamp me-auto">${item.textMessage}</div>
                                                        </div>
                                                    </div>
                                                    <!-- Content -->
                                                </div>
                                            </div>
                                        </li>
                 `
                $("#ul-list-conversation").append(newRow);

                for (var i = 0; i < ListUserOnline.length; i++) {
                    $(".list-conversation-item[data-value=" + ListUserOnline[i].accountId + "] .avatar").removeClass("avatar-away").addClass("avatar-online");
                }
                if (item.accountId == systemConstant.happy_s_bot_id) {
                    $(".list-conversation-item[data-value='" + item.accountId + "'] .avatar").removeClass("avatar-away").addClass("avatar-online");
                }
                else {
                    $(".list-conversation-item[data-value='" + item.accountId + "'] .avatar").removeClass("avatar-online").addClass("avatar-away");
                }
            })
        }
    })
}

//Scroll ListConversation
const elementListConversation = $('#ul-list-conversation');
let lastScrollTopListConversation = 0;

elementListConversation.on('scroll', function (e) {
    if (elementListConversation.scrollTop() < lastScrollTopListConversation) {
        // upscroll
        return;
    }
    lastScrollTopListConversation = elementListConversation.scrollTop() <= 0 ? 0 : elementListConversation.scrollTop();
    if (elementListConversation.scrollTop() + elementListConversation.height() >= elementListConversation[0].scrollHeight) {
        pageIndexConversation += 1;
        listConversation();
    }
});


var pageIndexDataContact = 1;
var pageSizeDataContact = 5;
function loadDataContact() {
    $.ajax({
        //url: systemURL + "Account/api/ListContact?pageIndex=" + pageIndexDataContact + "&pageSize=" + pageSizeDataContact,
        url: systemURL + "Account/api/ListContact",
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
            var dataListCounselor = dataSource.listConselor;
            dataListCounselor.forEach(function (item, index) {
                if (item.id == counsulorId) {
                    $("#username").text(item.name);
                    $("#imageUser").attr("src", item.photo);
                }
                newRowCounselor += `<li class="card contact-item my-contact item-scroll-counselor" data-value=${item.id} data-name="${item.name}" data-image="${item.photo}">
                                                    <div class="card-body">
                                                        <div class="d-flex align-items-center">
                                                            <!-- Avatar -->
                                                            <div class="avatar avatar-away me-4">
                                                                <img class="avatar-label bg-soft-primary text-primary" src="${item.photo}" />
                                                            </div>
                                                            <!-- Avatar -->
                                                            <!-- Content -->
                                                            <div class="flex-grow-1 overflow-hidden">
                                                                <div class="d-flex align-items-center mb-1">
                                                                    <h5 class="text-truncate mb-0 me-auto">
                                                                        ${item.name}
                                                                    </h5>
                                                                </div>
                                                            </div>
                                                            <!-- Content -->
                                                        </div>
                                                    </div>
                                                </li>`

            })
            $("#ul-list-counselor").append(newRowCounselor);
            var newRowStudent = '';
            var dataListStudent = dataSource.listStudent
            dataListStudent.forEach(function (item, index) {
                newRowStudent += `<li class="card contact-item my-contact item-scroll-counselor" data-value=${item.id} data-name="${item.name}" data-image="${item.photo}">
                                                    <div class="card-body">
                                                        <div class="d-flex align-items-center">
                                                            <!-- Avatar -->
                                                            <div class="avatar avatar-away me-4">
                                                                <img class="avatar-label bg-soft-primary text-primary" src="${item.photo}" />
                                                            </div>
                                                            <!-- Avatar -->
                                                            <!-- Content -->
                                                            <div class="flex-grow-1 overflow-hidden">
                                                                <div class="d-flex align-items-center mb-1">
                                                                    <h5 class="text-truncate mb-0 me-auto">
                                                                        ${item.name}
                                                                    </h5>
                                                                </div>
                                                            </div>
                                                            <!-- Content -->
                                                        </div>
                                                    </div>
                                                </li>`

            })
            $("#ul-list-phonebook").append(newRowStudent);
        }
    })
}

$("#btnSendMessage-signalR").on("click", function (event) {
    validate();
});

//Enter send message
$("#text-send-message").on("keypress", function (event) {
    if (event.which === 13) {
        validate();
    }
});

//SendMessage
function sendMessage() {
    var message = document.getElementById("text-send-message").value;
    var accountRoomId = $("#btnSendMessage-signalR").attr("data-id");
    var obj = {
        accountRoomId: accountRoomId,
        messageStatusId: 1000001,
        messageTypeId: 1000001,
        text: message
    }
    $("#text-send-message").val("");
    $.ajax({
        url: systemURL + "message/api/SendMessage",
        type: "POST",
        contentType: "application/json",
        beforeSend: function (xhr) {
            if (localStorage.token) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
            }
        },
        data: JSON.stringify(obj),
        success: function (responseData) {
            if (responseData.status == 201 && responseData.message === "CREATED") {
                scrollSendMessgage();
            }
        },
        error: function (e) {
            Swal.fire(
                'Lỗi!',
                'Đã xảy ra lỗi, vui lòng thử lại',
                'error'
            );
            //submitButton.removeAttribute('data-kt-indicator');
            //submitButton.disabled = false;
        }
    });
}

function validate() {
    var errorList = [];
    var message = document.getElementById("text-send-message").value;
    if (message == "") {
        errorList.push("Văn bản không được để trống.");
    }

    if (errorList.length > 0) {

    } else {
        sendMessage();
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

function scrollMessage() {
    $('.chat-content').animate({ scrollTop: $('#list-message').prop("scrollHeight") }, 1);
    //$('.chat-content').scrollTop($('#list-message')[0].scrollHeight);

}

function scrollSendMessgage() {
    //var objDiv = document.getElementById("list-message");
    //objDiv.scrollTop = objDiv.scrollHeight;
    $('.chat-content').animate({ scrollTop: $('#list-message').prop("scrollHeight") }, 1);
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
    $("#ul-list-conversation").prepend(`
        <li class="card contact-item mb-3 my-contact list-conversation-item" data-id="${dataReceiveId.id}" data-value="${dataReceiveId.accountId}" data-name="${dataReceiveId.accountName}" data-image="${dataReceiveId.photo}">
                                            <div class="card-body">
                                                <div class="d-flex align-items-center">
                                                    <!-- Avatar -->
                                                    <div class="avatar me-4 ${classOnline}">
                                                        <img class="avatar-label" src="${dataReceiveId.photo}">
                                                    </div>
                                                    <!-- Avatar -->
                                                    <!-- Content -->
                                                    <div class="flex-grow-1 overflow-hidden">
                                                        <div class="d-flex align-items-center mb-1">
                                                            <h5 class="text-truncate mb-0 me-auto">${dataReceiveId.accountName}</h5>
                                                            <p class="small text-muted text-nowrap ms-4 mb-0">${moment(dataReceiveId.createdTime).format("HH:mm")}</p>
                                                        </div>
                                                        <div class="d-flex align-items-center">
                                                            <div class="${dataReceiveId.messageStatusId == 1000001 ? "active-message-chat-end-user-status" : ""} line-clamp me-auto">${dataReceiveId.textMessage}</div>
                                                        </div>
                                                    </div>
                                                    <!-- Content -->
                                                </div>
                                            </div>
                                        </li>
    `)
}

async function getDataConversation() {
    var dataRollback;
    await $.ajax({
        url: systemURL + "AccountRoom/api/ListConversationForWeb?pageIndex=" + pageIndexConversation + "&pageSize=" + pageSizeConversation,
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
