$(document).ready(function () {
    loadDetailPost();
    loadPostCategoryOnHomePage();
    loadPostTagOnHomePage();
});

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
                                <a href="/thong-tin-ca-nhan/${data.authorUserName}">${data.authorName}</a>
                            </div>
                            <div class="schedule">
                                <div class="des-schedule" style="margin-right: 12px;">
                                    ${data.postCategoryName}
                                </div>

                                <div class="des-schedule">
                                   `+ newValue +`
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

async function loadPostCategoryOnHomePage() {
    var result = await httpService.getAsync("post/api/filter-post");
    if (result.status == 200) {
        var data = result.data[0].postCategoryData;
        data.forEach(function (item, index) {
            var newRow = `<div class="category-parent">
                            <div class="category-image-text align-items-center">
                                <div class="category-image">
                                     <img src="${item.photoCategory}" />
                                </div>
                                <span class="text-category" data-value=${item.id}><a href="/tin-tuc/danh-muc/` + item.id + "-" + item.slug + `">${item.name}</a></span>
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

async function loadPostTagOnHomePage() {
    var result = await httpService.getAsync("post/api/filter-post");
    if (result.status == 200) {
        var data = result.data[0].postTagsData;
        data.forEach(function (item, index) {
            var newRow = `<li><a href="/tin-tuc/hastag/` + item.id + "-" + item.slugTag + `" class="tagSelect" data-tagId="${item.tagId}">${item.tagName}</a></li>`
            $(newRow).appendTo($("#ul-list-tag"));
        })
    }
}

$(document).on("click", ".text-category", function () {
    var categoryId = $(this).data("value")
    window.location.href = "/list-post-by-category?postCategoryId=" + categoryId;
})

$(document).on("click", ".tagSelect", function () {
    var postTagId = $(this).data("tagid")
    window.location.href = "/list-post-by-tag?postTagId=" + postTagId;
})