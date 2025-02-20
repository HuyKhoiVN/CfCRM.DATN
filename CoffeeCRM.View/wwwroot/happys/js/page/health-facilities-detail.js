"use strict";

 
const accessKey = "Authorization";
const params = new URL(document.location).searchParams;
const id = params.get("id");

const load = async () => {
    var result = await httpService.getAsync("healthfacility/api/detailbyid/" + id);
    $(".hfd_profile").html('');
    $('.hfd_info_content').html('')
    $('.hfd_map').html('')
    var address = result.addressDetail + ", " + result.ward + ", " + result.district
        $('.hfd_profile').append(
            `
                <div class="hfd_profile_img">
                                <img src="`+ result.photo + `" />
                            </div>
                            <div class="hfd_profile_contact w-100">
                                <h4>`+ result.name + `</h4>
                                <div class="hfd_profile_contact_row">
                                    <div class="hfd_profile_contact_input">
                                        <span>Tỉnh thành</span>
                                        <span class="value-content">`+ result.province + `</span>
                                    </div>
                                    <div class="hfd_profile_contact_input">
                                        <span>Hotline</span>
                                        <span class="value-content">`+ result.phone + `</span>
                                    </div>
                                </div>
                                <div class="hfd_profile_contact_row">
                                    <div class="hfd_profile_contact_input">
                                        <span>Địa chỉ</span>
                                        <span class="value-content">`+ address + `</span>
                                    </div>
                                    <div class="hfd_profile_contact_input">
                                        <span>Giờ mở cửa</span>
                                        <span class="value-content">`+ result.openDate + `</span>
                                    </div>
                                </div>
                            </div>`
        )
        $('.hfd_info_content').append(`
            <p class="hfd_info_content">`+ result.info + `</p>
            `)
        $('.hfd_map').append(`
            <h4>Bản đồ vị trí</h4>
                    `+ result.linkmap + `
            `)
    
}

$(document).ready(async function () {
    await load.call();
});