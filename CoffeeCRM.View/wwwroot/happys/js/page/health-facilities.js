"use strict";
var loadData = async function LoadHealthFacities() {
    var result = await httpService.getAsync("healthfacility/api/listpaging?pageIndex=" + pageIndex + "&pageSize=" + pageSize + "");
    $(".list_health_facilities").html('');
    if (result.status == "200") {
        console.log(result.data)
        result.data.forEach(function (item) {
            $(".list_health_facilities").append(`
            <a class="card d-flex flex-row card-item" href="chi-tiet-co-so-tham-van?id=`+item.id+`">
                 <div class="card_item_img">
                     <img src="`+ item.photo + `" />
                 </div>
                 <div class="card_item_content d-flex flex-column">
                     <div class="card_item_img_xs d-flex-xs gap-16px-xs">
                         <span class="d-flex flex-row d-flex-xs flex-column-xs gap-5px-xs">
                             <b class="ellipsis2 ellipsis2-xs">`+ item.name + `</b>
                             <span class="dash-xs">-</span>
                             <span>`+ item.healthFacilityType.name + `</span>
                         </span>
                     </div>
                     <div class="hf_label_container d-flex flex-row gap-10px-xs">
                         <label class="lblLabel">Hotline: `+ item.phone + `</label>
                         <label class="lblLabel d-none-xs">Địa chỉ cụ thể: `+ item.addressDetail + `</label>
                         <label class="lblLabel d-none-xs">Giờ mở cửa: `+ item.openDate + `</label>
                     </div>
                     <div class="hf_content">
                         <span class="ellipsis2">
                             `+ item.info + `
                         </span>
                     </div>
                 </div>
            </a>
        `)
        });
    }
}
$(document).ready(async function () {
    //await loadData.call();
    let element = $(".doc_health_facilities .pagination_default");
    LoadPagingPage("healthfacility/api/count", element, loadData);
});

