$(document).ready(function () {
    loadNotificationData();
});

var detailNoti = [];
var notiId;
var notificationData = [];
var notiSectionPageIndex = 1;
var notiSectionPageSize = 5;
async function loadNotificationData() {
    $("#noti-sec .loading").show();
    if (notiSectionPageIndex === 1) {
        $("#ulNotification").empty();
    }
    if (notificationData.length == 0) {
        notiSectionPageIndex = 1;
    }
    var lang;
    var currentLanguage = window.localStorage.getItem("language");
    lang = !currentLanguage ? "vi" : currentLanguage;
    try {
        var result = await httpService.getAsync("notification/api/list-notification-by-accountId?pageIndex=" + notiSectionPageIndex + "&pageSize=" + notiSectionPageSize + "");
        if (result.status == 200) {
            var data = result.data;
            notificationData.push(...data);
            //Update data lên giao diện
            data.forEach(function (item, index) {
                var currentValue = item.createdTime
                if (!currentValue.includes("T")) return
                var date = new Date(currentValue);
                var newValue = date.toLocaleTimeString("vi-VN") + " - " + date.toLocaleDateString('vi-VN');
                if (item.notificationStatusId == 1000002) {
                    var divRow = `<li class="noti notification order-noti" order-id="${item.description}" data-id="${item.id}">
                                          <a href="/app${item.linkDetail}?token=${localStorage.token}" class="noti-link" id="order-detail">
                                          <img src="/happys/img/Rectangle_888.png"/>      
                                          <div class="noti-textbox">
                                                    <span>`+ item.name + `</span>
                                                    <p style="height:24px;">`+ newValue + `</p>
                                                </div>
                                          </a>
                                     </li>`
                    $(divRow).appendTo($("#ulNotification"));
                } else if (item.notificationStatusId == 1000001) {
                    var divRow = `<li class="noti notification order-noti deactive" order-id="${item.description}" data-id="${item.id}">
                                          <a href="/app${item.linkDetail}?token=${localStorage.token}" class="noti-link" id="order-detail">
                                          <img src="/happys/img/Rectangle_888.png"/>   
                                          <div class="noti-textbox">
                                                    <span>`+ item.name + `</span>
                                                    <p style="height:24px;">`+ newValue + `</p>
                                                </div>
                                          </a>
                                     </li>`
                    $(divRow).appendTo($("#ulNotification"));
                }
            });
            $("#noti-sec .loading").hide();
            if (data.length < notiSectionPageSize) {
                $("#notiSectionLoadMore").hide();
            }
            else {
                $("#notiSectionLoadMore").show();
            }

        }
    } catch (e) {
        $("#noti-sec .loading").hide();
        $("#notiSectionLoadMore").hide();
            //console.log(e.message);
    }
}

$("#notiSectionLoadMore").click(function (e) {
    e.preventDefault();
    notiSectionPageIndex++;
    loadNotificationData();
})

var orderIdByNotificationId;
$("#ulNotification").on("click", ".notification", async function () {
    var notificationId = $(this).attr("data-id");
    let element = $(this);
    let data = {
        "id": notificationId,
    }
    var result = await httpService.postAsync("notification/api/setNotificationReadStatus", data);
    if (result.status == 200) {
        element.addClass("deactive");
        window.location.href = "/app" + result.data[0].linkDetail + "?token=" + localStorage.token;
    }
});

$("#read-noti-all").on("click", async function () {
    var result = await httpService.putAsync("notification/api/MakeAsReadAll");
    if (result.status == 200) {
        $(".noti").addClass("deactive");
    }
});

