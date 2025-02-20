$(document).ready(function () {
    loadDetailPost();
    loadPostCategoryOnHomePage();
    loadPostTagOnHomePage();
});

var urlParams = new URLSearchParams(window.location.search);
var postId = urlParams.get('id');

async function loadDetailPost() {
    try {
        var result = await httpService.getAsync("post/api/detail-post/" + postId);
        if (result.status == 200) {
            var data = result.data[0];
            var currentValue = data.createdTime
            if (!currentValue.includes("T")) return
            var date = new Date(currentValue);
            var newValue = date.toLocaleDateString('vi-VN');

            var newRow = `
                    <div class="content">
                        <div class="content-title mb-3">
                            ${data.name}
                        </div>

                        <div class="content-img">
                            ${data.text}
                        </div>
                    </div>
                    <div class="title">
                        <div class="ava">
                            <img src="${data.authorImage}" />
                        </div>

                        <div class="w-100">
                            <div class="name">
                                ${data.authorName}
                            </div>
                            <div class="schedule">
                                <div class="des-schedule" style="margin-right: 12px;">
                                    ${data.postCategoryName}
                                </div>

                                <div class="des-schedule">
                                   `+ newValue + `
                                </div>
                            </div>
                        </div>
                        
                    </div>`

            $(newRow).appendTo($("#postDetail"));
        }
    } catch (e) {
        console.log(e.message);
    }
}
