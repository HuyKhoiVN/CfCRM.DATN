$(document).ready(function () {
    loadDetailPost();
    loadPostCategoryOnHomePage();
});

var urlParams = new URLSearchParams(window.location.search);
var postId = urlParams.get('id');

async function loadDetailPost() {
    try {
        var result = await httpService.getAsync("post/api/detail-post/" + postId);
        if (result.status == 200) {
            var data = result.data[0];
            if (data.isLock) {
                var dateUnlock = new Date(data.unlockTime).toLocaleDateString('vi-VN');
                Swal.fire({
                    icon: "warning",
                    title: "Tài liệu bị khóa",
                    text: "Bạn sẽ được mở khóa và truy cập bài viết vào ngày: " + dateUnlock,
                    showConfirmButton: false,
                    showCancelButton: false,
                    timer: 3000
                }).then(() => {
                    window.location.href = "/thu-vien"
                })
            }
            var currentValue = data.createdTime
            if (!currentValue.includes("T")) return
            var date = new Date(currentValue);
            var newValue = date.toLocaleDateString('vi-VN');
            var content_link = `<a class="btn btnHS2" target="_blank" style="border-radius=1px solid #333;" rel="noopener noreferrer" href="${data.downloadLink}"><i class="bi bi-file-earmark-text"></i>Xem tài liệu</a>`
            var photo_library = `<img src="${data.photo}" />`;
            var newRow = `
                    <div class="content">
                                        <div class="title">
                                                <div class="col-4 l_photo mb-3" id="photo_library">
                                                </div>
                                          <div>
                                            <div class="w-100 d-flex flex-column" style="gap:10px;">
                                                <div class="schedule">
                                                    <div class="des-schedule" style="margin-right: 12px;">
                                                       `+ newValue + `
                                                    </div>
                                                    <div class="des-schedule" style="margin-right: 12px;">
                                                        <a class="name-library">${data.name}</a>
                                                    </div>
                                                    <div class="content_description" style="font-style: italic;font-size: 14px;">
                                                    <span style="font-weight: 600;
                            font-size: 18px;" >Tóm tắt: </span> ${data.description}
                                                </div>
                                                </div>
                                                <div class="link_library mb-3" id="downloadLink">
                                                </div>
                                             </div>   
                                          </div>
                                         </div>
                                         </div>

                                        </div>
                                            <div class="content-img">
                                                ${data.text}
                                            </div>
                    </div>
                    
                    `

            $(newRow).appendTo($("#postDetail"));
            if (data.downloadLink != "") {
                $("#downloadLink").append(content_link);
            }
            $("#photo_library").append(photo_library);
        }
    } catch (e) {
        console.log(e.message);
    }
}

async function loadPostCategoryOnHomePage() {
    var result = await httpService.getAsync("post/api/filter-library");
    if (result.status == 200) {
        var data = result.data[0].postCategoryData;
        data.forEach(function (item, index) {
            var newRow = `<div class="category-parent">
                            <div class="category-image-text align-items-center">
                                <div class="category-image">
                                     <img src="${item.photoCategory}" />
                                </div>
                                <span class="text-category" data-value=${item.id}><a href="/thu-vien/danh-muc/` + item.id + "-" + item.slug + `">${item.name}</a></span>
                            </div>
                            <div>
                                <div class="count-list-category">
                                    <span class="number-list-category">${item.countPost}</span>
                                </div>
                            </div>
                        </div>`
            $(newRow).appendTo($("#list-category"));
        })
    }
}
