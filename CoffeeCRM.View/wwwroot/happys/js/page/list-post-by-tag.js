﻿$(document).ready(async function () {
    loadDataByTag.call();
    loadPostCategoryOnHomePage();
    loadPostTagOnHomePage();
    $(document).on("click", ".list-post-layout", function () {
        var id = $(this).data("id");
        window.location.href = "/chi-tiet-bai-viet/" + id;
    })
})


var postTagId = postTagId;


var pageIndex = 1;
var loadDataByTag = async function loadPostOnHomePageByTag() {
    var obj = {
        pageIndex: pageIndex,
        pageSize: 10,
        postTagId: postTagId,
        postTypeId: systemConstant.post_type_Id,
    };
    try {
        var result = await httpService.postAsync("post/api/list-post-by-tag", obj);
        if (result.status == 200) {
            var data = result.data[0].dataSource;
            $("#list-post").html("");
            if (data.length > 0) {
                $(".reuslt-post-category").html("");
                var newRo3 = `<h4 class="reuslt-post-category">Kết quả tìm kiếm :  ${"#"+data[0].tagName}</h4>`;
                $("#result-post").prepend(newRo3);
                data.forEach(function (item, index) {
                    var currentValue = item.createdTime
                    if (!currentValue.includes("T")) return
                    var date = new Date(currentValue);
                    var newValue = date.toLocaleDateString('vi-VN') + "-" + date.toLocaleTimeString("vi-VN");
                    var newRow = `
                    <div class="grid-post-layout w-100" data-id="${item.id}">
                        <div class="blog_grid_post shadow-sm wow fadeInUp post-item w-100" style="visibility: visible; animation-name: fadeInUp;">
                            <div class="photo-post ">
                               <img src="${item.photo != null ? item.photo : "/happys/img/blog-grid/test1.jpg"}" alt="">
                            </div>
                            <div class="grid_post_content ">
                                 <a class="b_title m-0" href="/chi-tiet-bai-viet/${item.id}">
                                    <h4 style="height: 42px;">${item.name}</h4>
                                </a>
                                <span class="b-overview">${item.description}</span>
                                <div class="media post_author">
                                    <div class="round_img">
                                        <img src="${item.authorImage != null ? (item.authorImage != "" ? item.authorImage : "/happys/img/blog-grid/author_1.jpg") : "/happys/img/blog-grid/author_1.jpg"}" alt="">
                                    </div>
                                    <div class="media-body author_text">
                                        <span class="user-name-post"><a href="/thong-tin-ca-nhan/${item.authorUserName}">${item.authorName}</a></span>
                                    </div>
                                    <div class="date">`+ newValue + `</div>
                                </div>
                            </div>
                        </div>
                    </div>`
                    $(newRow).appendTo($("#list-post"));
                    $("#layout-list-post").trigger('click')
                })
            } else {
                var newRow2 = `
                    <div class='text-center mt-3'>
                        Không có dữ liệu để hiển thị
                    </div>
                `
                $(newRow2).appendTo($("#list-post"));
            }

            initPagination(result.data[0].totalPages, '#pagination-post');
        }
    } catch (e) {
        var newRow2 = `<div class='text-center mt-3'>Không có dữ liệu để hiển thị</div>`
        $(newRow2).appendTo($("#list-post"));

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
            html += `<li class="page-item paging-previous"><a href="#!" aria-label="Previous"  class="page-link"><i class="fa fa-angle-left"></i></a></li>`;
        }
        for (var i = startPage; i <= endPage; i++) {
            if (i > 0) {
                html += `<li class="page-item ${i == pageIndex ? 'active' : ''}" aria-current="page">
                                    <a class="page-link">${i}</a>
                                </li>`
            }
        }
        if (pageIndex < totalPage) {
            html += `<li class="page-item paging-next"><a href="#!" aria-label="Next"  class="page-link"><i class="fa fa-angle-right"></i></a></li>`;
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
        loadDataByTag.call();
    }
    else if ($(this).hasClass('paging-last-item')) {
        pageIndex = dataSources.totalPages;
        loadDataByTag.call();
    }
    else if ($(this).hasClass('paging-next')) {
        pageIndex = pageIndex + 1;
        loadDataByTag.call();
    }
    else if ($(this).hasClass('paging-previous')) {
        pageIndex = pageIndex - 1;
        loadDataByTag.call();
    }
    else {
        if (!($(this).attr('class').includes('active'))) {
            $(".page-item").removeClass("active");
            $(this).addClass("active");
            pageIndex = parseInt($(this).text());
            loadDataByTag.call();
        }
    }
});

function convertToSlug(input) {

    var slug = input.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9\s]/g, '');

    slug = slug.replace(/\s+/g, '-').toLowerCase();

    return slug;
}