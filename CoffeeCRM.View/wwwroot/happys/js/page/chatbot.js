var roomChatBotId;
var accountRoomIdChatBot;
var pageIndexMessage = 1;
var pageSizeMessage = 4;
$("#icon-chatbot").on('click', function () {
    if (accountId != 0) {
        $("#box-chat").removeClass("card-hide")
        $("#icon-chatbot").addClass("card-hide")
    }
    pageIndexMessage = 1;
    var accountId1 = 1000001;
    var objAddAccountRoom = {
        "accountId1": accountId,
        "accountId2": accountId1
    }
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
                roomChatBotId = responseData.data[0].id;
                accountRoomIdChatBot = responseData.data[0].accountRoomId;
                loadDataMessageChatBot();
                const connectionHubMessage = new signalR.HubConnectionBuilder()
                    .withUrl(`/AccountSendMessageHub?roomId=${roomChatBotId}`)
                    .build();
                connectionHubMessage.on("ReceiveMessage", function (item) {
                    if (item.accountId == accountId) {
                        var newRow = `
                                        <div class="message-sefl div-message-chat-bot">
                                <div class="message-sefl-content">
                                    ${item.text}
                                </div>
                            </div>
                                `
                        $("#inputChatBot").val("");
                        $("#chatbotMessage").append(newRow);
                    } else {
                        var newRow = `
                                     <div class="message-bot div-message-chat-bot">
                                        <div class="message-bot-image">
                                            <img src="/upload/admin/system/logo/BotLogo.png" />
                                        </div>
                                        <div class="message-bot-content">
                                           ${item.text}
                                        </div>
                                    </div>
                    `
                        $("#inputChatBot").val("");
                        $("#chatbotMessage").append(newRow);
                    }
                    scrollSendMessgage();
                });
                connectionHubMessage.start().then(function () {
                    document.getElementById("btnSendMessage-signalR").disabled = false;
                }).catch(function (err) {
                    return console.error(err.toString());
                });
            } else {
                Swal.fire(
                    'Lưu ý!',
                    'Bạn chưa đăng nhập, vui lòng đăng nhập để sử dụng tính năng này!',
                    'warning'
                ).then(function () {
                    window.location.href = "/dang-nhap";
                });
            }
        },
        error: function (e) {
            Swal.fire(
                'Chú ý!',
                'Bạn chưa đăng nhập!',
                'warning'
            );
        }
    })
})


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
async function loadDataMessageChatBot() {
    $("#chatbotMessage").html("");
    dataCreatedTime = [];
    checkDate = [];
    await $.ajax({
        url: systemURL + "message/api/ListMessage/" + roomChatBotId + "?pageIndex=" + pageIndexMessage + "&pageSize=" + pageSizeMessage,
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
                dataCreatedTime.push({ date: moment(item.createdTime).format("DD/MM/YYYY"), message: item.text, accountId: item.accountId, time: moment(item.createdTime).format("HH:mm") });
            });
            GroupMessageChatBot(dataCreatedTime, "append");
        }
    })
    scrollMessageChatBot();
}
var checkDate = [];
function GroupMessageChatBot(dataCreatedTime, action) {
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
                            <div class="message-sefl div-message-chat-bot">
                                <div class="message-sefl-content">
                                    ${data.message}
                                </div>
                            </div>
                    `
                if (action == "append") {
                    $("#chatbotMessage").append(dateGroupString);
                    $(`.group[data-date='${data.date}']`).append(newRow);
                }
                else {
                    $("#chatbotMessage").prepend(dateGroupString);
                    $(`.group[data-date='${data.date}']`).prepend(newRow);
                    //$("#chatMessageSignalR").prepend(newRow);
                }
                //append:  

            } else {
                var newRow = `
                                     <div class="message-bot div-message-chat-bot">
                                        <div class="message-bot-image">
                                            <img src="/upload/admin/system/logo/BotLogo.png" />
                                        </div>
                                        <div class="message-bot-content">
                                           ${data.message}
                                        </div>
                                    </div>
                    `
                if (action == "append") {
                    $("#chatbotMessage").append(dateGroupString);
                    $(`.group[data-date='${data.date}']`).append(newRow);
                }
                else {
                    $("#chatbotMessage").prepend(dateGroupString);
                    $(`.group[data-date='${data.date}']`).prepend(newRow);
                    //$("#chatMessageSignalR").prepend(newRow);
                }
            }
            dateGroup = data.date;
        });
    })
}
async function loadDataMessageChatBotPrevious() {
    dataCreatedTime = [];
    await $.ajax({
        url: systemURL + "message/api/ListMessage/" + roomChatBotId + "?pageIndex=" + pageIndexMessage + "&pageSize=" + pageSizeMessage,
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
                dataCreatedTime.push({ date: moment(item.createdTime).format("DD/MM/YYYY"), message: item.text, accountId: item.accountId, time: moment(item.createdTime).format("HH:mm") });
            });
            GroupMessageChatBot(dataCreatedTime, "prepend");
            $('#chatbotMessage').scrollTop(200);
        }
    })
}

let scrollContainer = document.getElementById("scroll-container");

//Scroll listMessage
const elementlistMessage = $('#chatbotMessage');
let lastScrollToplistMessage = 0;

elementlistMessage.on('scroll', function (e) {
    if (elementlistMessage.scrollTop() <= lastScrollToplistMessage) {
        pageIndexMessage += 1;
        loadDataMessageChatBotPrevious();
    }
});

$("#btnSendMessage-signalR").on("click", function (event) {
    validate();
});

//Enter send message
$("#inputChatBot").on("keypress", function (event) {
    if (event.which === 13) {
        validate();
    }
});

//SendMessage
function sendMessageChatBot() {
    var message = document.getElementById("inputChatBot").value;
    var obj = {
        accountRoomId: accountRoomIdChatBot,
        messageStatusId: 1000001,
        messageTypeId: 1000001,
        text: message
    }
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
        }
    });
}

function validate() {
    var errorList = [];
    var message = document.getElementById("inputChatBot").value;
    if (message == "") {
        errorList.push("Văn bản không được để trống.");
    }

    if (errorList.length > 0) {

    } else {
        sendMessageChatBot();
    }
}

$("#close-chatbot").on('click', function () {
    $("#box-chat").addClass("card-hide");
    $("#icon-chatbot").removeClass("card-hide");
    pageIndexMessage = 1;
})
$(document).ready(function() {
    $("#box-chat").addClass("card-hide")
})

function scrollMessageChatBot() {
    $('#chatbotMessage').scrollTop($('#chatbotMessage')[0].scrollHeight);
}

function scrollSendMessgage() {
    var objDiv = document.getElementById("chatbotMessage");
    objDiv.scrollTop = objDiv.scrollHeight;
}