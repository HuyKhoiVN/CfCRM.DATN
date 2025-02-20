$(document).ready(async function () {
    loadData.call();
    loadPostCategoryOnHomePage();
    $(document).on("click", ".list-post-layout", function () {
        var id = $(this).data("id");
        window.location.href = "/chi-tiet-bai-viet?id=" + id;
    })
})

var postCategoryId = postCategory;

var pageIndex = 1;
var loadData = async function loadPostOnHomePage() {
    var obj = {
        pageIndex: pageIndex,
        pageSize: 6,
        postCategoryId: postCategoryId,
        postTypeId: systemConstant.library_type_Id,
    };
    try {
        // Nếu là 30 ngày
        if (obj.postCategoryId == 1000081) {
            var result = await httpService.postAsync("post/api/list-post-by-category-authen", obj);
            if (result.status == 200) {
                var data = result.data[0].dataSource;
                $("#list-post").html("");
                if (data.length > 0) {
                    $(".title-library").remove();
                    var newRo3 = `<div class="title-library"><p class="library-name">${data[0].postCategoryName}</p> </div>`;
                    $("#result-post").prepend(newRo3);
                    data.forEach(function (item, index) {
                        // Nếu là post lock
                        if (!item.isLock) {
                            var currentValue = item.unlockTime
                            if (!currentValue.includes("T")) return
                            var date = new Date(currentValue);
                            var newValue = date.toLocaleDateString('vi-VN')
                            if (date.getDate() == new Date().getDate() && date.getMonth() == new Date().getMonth() && date.getFullYear() == new Date().getFullYear()) {
                                var newRow = `<div class="detail-post-today" data-id="${item.id}">
                                            <div class="div-text-post">
                                            <div class="post-description">
                                                <p class="title-post">${item.name}</p>
                                                <p class="description-detail">${item.description} </p>
                                            </div>
                                      
                                            </div>
                                            <div class="img-post">
                                                <img class="img-post-dtl" src="/assets/media/images/item-unlock-today.png" />
                                            </div>
                                        </div>`
                            }
                            else {
                                var newRow = `<div class="detail-post" data-id="${item.id}">
                                            <div class="div-text-post">
                                            <div class="post-description">
                                                <p class="title-post">${item.name}</p>
                                                <p class="description-detail">${item.description} </p>
                                            </div>
                                            </div>
                                            <div class="img-post">
                                                <img class="img-post-dtl" src="/assets/media/images/item-unlock.png" />
                                            </div>
                                        </div>`
                            }


                            $(newRow).appendTo($("#list-post"));
                            $("#layout-list-post").trigger('click')
                        }
                        else {
                            var currentValue = item.unlockTime
                            if (!currentValue.includes("T")) return
                            var date = new Date(currentValue);
                            var newValue = date.toLocaleDateString('vi-VN')
                            var newRow = `<div class="detail-post-lock" data-id="${item.id}">
                                <div class="div-text-post lock-post-style">
                                <img class="icon-lock" src="/assets/media/images/padlock.png"/>
                                  <div class="post-description">
                                        <p class="title-post">${item.name}</p>
                                        <p class="description-detail lock-description">Mở khóa vào ngày ${newValue}</p>
                                  </div>
                                </div>
                                <div class="img-post">
                                    <img class="img-post-dtl" src="/assets/media/images/item-lock.png" />
                                </div>
                            </div>`
                            $(newRow).appendTo($("#list-post"));
                            $("#layout-list-post").trigger('click')
                        }
                    })
                    var lastUnLock = $(".detail-post").last();
                    lastUnLock.removeClass("detail-post").addClass("detail-post-today");
                    $(".detail-post-today img").attr("src", "/assets/media/images/item-unlock-today.png")

                } else {
                    var newRow2 = `<div class='text-center mt-3'>Không có dữ liệu để hiển thị</div>`
                    $(newRow2).appendTo($("#list-post"));
                }

                initPagination(result.data[0].totalPages, '#pagination-post');
                $(".detail-post").on("click", async function () {
                    window.location.href = "/chi-tiet-bai-viet-thu-vien?id=" + $(this).data("id") + "";
                });
                $(".detail-post-today").on("click", function () {
                    window.location.href = "/chi-tiet-bai-viet-thu-vien?id=" + $(this).data("id") + "";
                });
                $(".detail-post-lock").on("click", async function () {
                    var obj = {
                        active: 1,
                        accountId: systemConstant.accountId,
                        guId: "Log",
                        name: "Log",
                        entityCode: "DOCUMENT_LOG",
                        info: "activeLogLibrary",
                        objectOld: "",
                        objectNew: "",
                        url: "/chi-tiet-bai-viet-thu-vien?id=" + $(this).data("id") + "",
                        urlSource: document.referrer,
                        ipAddress: "Log",
                        device: jscd.mobile ? "MOBILE" : "PC",
                        browser: jscd.browser + "-" + jscd.browserMajorVersion,
                        os: jscd.os + "-" + jscd.osVersion,
                        userAgent: navigator.userAgent,
                        description: "Log",
                        createdTime: "2018-12-10 00:00:00",
                        id: 0
                    };

                    var result = await httpService.postAsync("activityLog/api/Add-Activity-Log", obj);
                    if (result.status == 201) {

                        window.location.href = "/chi-tiet-bai-viet-thu-vien?id=" + $(this).data("id") + "";
                        
                    }
                    else {
                        Swal.fire({
                            title: "Tài liệu bị khóa!",
                            text: "Tài liệu bạn đang truy cập hiện chưa được mở khóa, xin truy cập vào tài liệu khác",
                            icon: "warning"
                        });
                    }

                });
            }
        }
        else {
            var result = await httpService.postAsync("post/api/list-post-by-category", obj);
            if (result.status == 200) {
                var data = result.data[0].dataSource;
                $("#list-post").html("");
                if (data.length > 0) {
                    $(".reuslt-post-category").html("");
                    var newRo3 = `<h4 class="reuslt-post-category">Kết quả tìm kiếm :  ${data[0].postCategoryName}</h4>`;
                    $("#result-post").prepend(newRo3);
                    data.forEach(function (item, index) {
                        var currentValue = item.createdTime
                        if (!currentValue.includes("T")) return
                        var date = new Date(currentValue);
                        var newValue = date.toLocaleDateString('vi-VN');
                        var newRow = `<div class="grid-post-layout w-100" data-id="${item.id}">
                        <div class="blog_grid_post shadow-sm wow fadeInUp post-item" style="visibility: visible; animation-name: fadeInUp;">
                            <div class="photo-post ">
                               <a href="/chi-tiet-bai-viet-thu-vien?id=${item.id}"><img src="${item.photo != null ? item.photo : "/happys/img/blog-grid/test1.jpg"}" alt=""></a>
                            </div>
                            <div class="grid_post_content ">
                                <a class="b_title" href="/chi-tiet-bai-viet-thu-vien?id=${item.id}">
                                    <h4 style="height: 42px;">${item.name}</h4>
                                </a>
                                <span class="b-overview">${item.description}</span>
                                
                            </div>
                        </div>
                    </div>`
                        $(newRow).appendTo($("#list-post"));
                        $("#layout-list-post").trigger('click')
                    })
                } else {
                    var newRow2 = `<div class='text-center mt-3'>Không có dữ liệu để hiển thị</div>`
                    $(newRow2).appendTo($("#list-post"));
                }
                initPagination(result.data[0].totalPages, '#pagination-post');
            }
        }

    } catch (e) {
        var newRow2 = `<div class='text-center mt-3'>Không có dữ liệu để hiển thị</div>`
        $(newRow2).appendTo($("#list-post"));

    }
}
async function loadPostCategoryOnHomePage() {
    var result = await httpService.getAsync("post/api/filter-library");
    if (result.status == 200) {
        var data = result.data[0].postCategoryData;
        data.forEach(function (item, index) {
            console.log(item.photoCategory);
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
function initPagination(totalPage, element) {
    if (totalPage > 0) {
        let html = "";
        let startPage;
        if (totalPage <= 4) {
            startPage = 1;
        }
        else {
            if (totalPage == pageIndex) {
                startPage = totalPage - 1;
            }
            else {
                startPage = pageIndex == 1 ? 1 : pageIndex - 1;
            }

        }
        let endPage = startPage + 3 <= totalPage ? startPage + 3 : totalPage;
        if (pageIndex > 1) {
            html += `<li class="page-item paging-first-item"><a href="#!" aria-label="Previous"  class="page-link"><i class="fa fa-angle-double-left"></i></a></li>
                                    <li class="page-item paging-previous"><a href="#!" aria-label="Previous"  class="page-link"><i class="fa fa-angle-left"></i></a></li>`;
        }
        for (var i = startPage; i <= endPage; i++) {
            if (i > 0) {
                html += `<li class="page-item ${i == pageIndex ? 'active' : ''}" aria-current="page">
                                    <a class="page-link">${i}</a>
                                </li>`
            }
        }
        if (pageIndex < totalPage) {
            html += `<li class="page-item paging-next"><a href="#!" aria-label="Next"  class="page-link"><i class="fa fa-angle-right"></i></a></li>
                                    <li class="page-item paging-last-item"><a href="#!" aria-label="Next"  class="page-link"><i class="fa fa-angle-double-right"></i></a></li>`;
        }
        $(element).html(html);
    }
    else {
        $(element).html("");
    }

}

$("#pagination-post").on("click", ".page-item", function (e) {
    e.preventDefault();
    window.scrollTo(0, 200);

    if ($(this).hasClass('paging-first-item')) {
        pageIndex = 1;
        loadData.call();
    }
    else if ($(this).hasClass('paging-last-item')) {
        pageIndex = dataSources.totalPages;
        loadData.call();
    }
    else if ($(this).hasClass('paging-next')) {
        pageIndex = pageIndex + 1;
        loadData.call();
    }
    else if ($(this).hasClass('paging-previous')) {
        pageIndex = pageIndex - 1;
        loadData.call();
    }
    else {
        if (!($(this).attr('class').includes('active'))) {
            $(".page-item").removeClass("active");
            $(this).addClass("active");
            pageIndex = parseInt($(this).text());
            loadData.call();
        }
    }
});
