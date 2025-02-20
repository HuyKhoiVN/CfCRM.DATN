var detailNoti = [];
var urlParams = new URLSearchParams(window.location.search);
var notificationId = urlParams.get('id');
loadDetailNotificationData();

async function loadDetailNotificationData() {
    try {
        var result = await httpService.getAsync("notification/api/detail/" + notificationId);
        if (result.status == 200) {
            var data = result.data;
            var currentValue = data[0].createdTime
            if (!currentValue.includes("T")) return
            var date = new Date(currentValue);
            var newValue = date.toLocaleTimeString("vi-VN") + " - " + date.toLocaleDateString('vi-VN');

            if (data[0].description == null) {
                data[0].description = " Lunar New Year Festival often falls between late January and early February; it is among the most important holidays in Vietnam. Officially, the festival includes the 1st, 2nd, and 3rd day in Lunar Calendar; however, Vietnamese people often spend nearly a month celebrating this special event. Tet Holiday gets its beginning marked with the first day in the Lunar Year; however, its preparation starts long before that. The 23rd day of the last Lunar month is East Day—a ritual worshiping Kitchen Gods (Tao Cong). It thought that each year on this day, these Gods go to heaven to tell Jade Emperor about all activities of households on earth. On New Year’s Eve, they return home to";
            }

            var divRow =
                `
                        <h5 class="sub-thread">${data[0].name}</h5>
                        <div class="line"></div>
                        <div class="new-detail-status">
                            <span>
                              `+ newValue + `
                            </span>
                        </div>
                        <img src="/happys/img/image-tearcher.png" class="new-detail-img"/>
                        <p class="text-detail-noti">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                        </p>
                `
            $(divRow).appendTo($("#notificationDetail"));
        } 
    } catch (e) {
        
            console.log(e);
        
    }
}