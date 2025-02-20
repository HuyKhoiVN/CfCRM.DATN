"use strict";
async function loadCountNotificationData() {
    var noti = await httpService.getAsync("notification/api/CountUnreadByAccountId");
    var mess = await httpService.getAsync("message/api/CountUnreadByAccountId")
    $("#noti").html('');
    $("#mess").html('');
    $("#noti").append(`<span>` + noti + `</span>`)
    $("#mess").append(`<span>` + mess + `</span>`)

}

$(document).ready(async function () {
    var getName = localStorage.getItem("profile");
    var name = jQuery.parseJSON(getName);
    await loadCountNotificationData.call();
    $(".ava-banner").attr("src", name.photo);
    $(".ava-name").text(name.name);
});