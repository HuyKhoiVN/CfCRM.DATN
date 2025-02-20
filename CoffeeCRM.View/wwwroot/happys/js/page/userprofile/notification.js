"use strict";
var detail = $(".card-item")
var loadDataNotification = async function LoadNoti() {
    try {
        var result = await httpService.getAsync("notification/api/my-notification?pageIndex=" + pageIndex + "&pageSize=" + pageSize + "");
        $(".list_noti").html('');
        var html = '';
        if (result.status == "200") {
            result.data.forEach(function (item) {
                if (item.notificationStatusId == systemConstant.notification_status_unread) {
                    html += `<a href="` + item.linkDetail +`"><div class="card card_unread d-flex flex-row card-item" data-id="` + item.id + `" onClick="test(` + item.id + `)">
                    <div class="card_item_img">
                        <img src="/happys/img/Rectangle_888.png">
                    </div>
                    <div class="card_item_content d-flex flex-column justify-content-between">
                        <div class="card_item_title ellipsis2">
                            `+ item.name + `
                        </div>
                        <div class="card_item_date">
                            `+ moment(item.createdTime).format("DD/MM/YYYY HH:mm") + `
                        </div>
                    </div>
                </div></a>`;
                }
                else {
                    html += `<a href="` + item.linkDetail +`"><div href="` + item.linkDetail +`" class="card d-flex flex-row card-item" data-id="` + item.id + `" onClick="test(` + item.id + `)">
                    <div class="card_item_img">
                        <img src="/happys/img/Rectangle_888.png">
                    </div>
                    <div class="card_item_content d-flex flex-column justify-content-between">
                        <div class="card_item_title ellipsis2">
                             `+ item.name + `

                        </div>
                        <div class="card_item_date">
                            `+ moment(item.createdTime).format("DD/MM/YYYY HH:mm") + `
                        </div>
                    </div>
                </div></a>`;
                }
            });
            $(".list_noti").html(html);
        }
    } catch (e) {
        $('#notify').html(`<div class="not-found d-flex flex-column align-items-center">
            <img style="width:400px;height:auto;" src="/images/default/not-found.png"/>
            <p>Chưa có dữ liệu hiển thị</p>
        </div>`)
    }
    
}

$("#checkbox_noti").on("change", async function () {
    var checked = $(this).is(":checked");
    if (checked) {
        var result = await httpService.putAsync("notification/api/MakeAsReadAll");
        if (result.status == "200") {
            $(".card-item").removeClass("card_unread");
        }
    }
});
function DetailNotificatioN() {

}
$(document).ready(async function () {
    await loadDataNotification.call();
});
$('body').on('click', '.card-item', async function (e) {
    var id = $(this).data("id");
    var result = await httpService.putAsync("notification/api/MakeAsRead/" + id);
    if (result.status == "200") {
        $(this).removeClass("card_unread");
    }
});

const test = async (id) => {
    var result = await httpService.getAsync("notification/api/detail/" + id);
    
}