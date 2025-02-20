/**
 * @author: NhatVi
 * @CreatedTime: 01/08/2024
 * @description: add and edit post
 */
$(document).ready(function () {
    $("#btn_submit").on("click", function (e) {
        attachObj();
    });
    $("#formPost").on("submit", function (e) {
        e.preventDefault();
    });
    $("#postStatus").on("change", function (e) {
        if ($(this).val() == postStatusPendingApprovedId) {
            $("#postApproveTime").val("");
            $("#postIsApproved").prop("checked", false);
        }
        else {
            $("#postApproveTime").val(moment().format("DD/MM/YYYY HH:mm:ss"));
            $("#postIsApproved").prop("checked", true);

        }
    })


    $("#postIsApproved").on("change", function (e) {

        if (!$(this).is(":checked")) {
            $("#postApproveTime").val("");
            $("#postStatus").val(postStatusPendingApprovedId).trigger("change");

        }
        else {
            $("#postApproveTime").val(moment().format("DD/MM/YYYY HH:mm:ss"));
            $("#postStatus").val(postStatusApprovedId).trigger("change");

        }
    })

    $("#postIsPublish").on("change", function (e) {

        if (!$(this).is(":checked")) {
            $("#postPublishTime").val("");
        }
        else {
            $("#postPublishTime").val(moment().format("DD/MM/YYYY HH:mm:ss"));
        }
    })
    $("#btn_exit").on("click", function (e) {
        Swal.fire({
            title: attachObjId == 0 ? "Thêm mới bài viết" : "Cập nhật bài viết",
            html: 'Bạn có chắc chắn muốn hủy!',
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#443',
            cancelButtonText: 'Không',
            confirmButtonText: 'Có'
        }).then(function (result) {
            if (result.isConfirmed) {
                location.href = "/post/list";
            }
        });
    });



    setTimeout(function () {
        $.when(loadPostLayout(), loadCategories(), loadTypes(), loadPostStatus(), getDetail(attachObjId)).done(function () {//set up layout
            $("#postTag").select2({//remote data tag
                language: "vi",
                ajax: {
                    url: systemConfig.defaultAPIURL + "api/tag/list-tag-select",
                    dataType: 'json',
                    type: "GET",
                    delay: 250,
                    data: function (params) {
                        var keyword = $.trim(params.term);
                        if (keyword != undefined && keyword != null && keyword != "" && keyword.startsWith('#')) {
                            keyword = keyword.slice(1);
                        }
                        return {
                            keyWord: keyword, // search term
                            pageIndex: params.page,
                            pageSize: 20, //page size
                            tagTypeId: tagTypeId,
                        };
                    },
                    processResults: function (data, params) {
                        params.page = params.page || 1;
                        return {
                            results: data.listData,
                            pagination: {
                                more: (params.page * 20) < data.totalRecord//20 is page size
                            }
                        };
                    },
                    cache: true
                },
                placeholder: {
                    id: '-1', // the value of the option
                    text: 'Chọn tag..'
                },
                allowClear: true,
                tags: true,
                templateResult: formatResult,
                templateSelection: formatSelection,
                createTag: function (params) {
                    var term = $.trim(params.term);
                    if (term === '') {
                        return null;
                    }
                    if (!term.startsWith('#') || term.length < 2) {//check # in created tag
                        return null;
                    }
                    else {
                        term = term.slice(1);
                    }
                    return {
                        id: term,
                        text: term,
                        newTag: true // add additional parameters
                    }
                }
            }).on("select2:select", function (e) {
                for (var i = 0; i < e.target.length; i++) {
                    var target = e.target[i];
                    if ($(target).attr("data-select2-tag")) {
                        $.ajax({
                            url: systemConfig.defaultAPIURL + "api/tag/add-tag-for-post",
                            type: "POST",
                            contentType: "application/json",
                            dataType: "json",
                            data: JSON.stringify({ name: $(target).text() }),
                            async: false,
                            success: function (res) {
                                if (res.isSucceeded) {
                                    var obj = res.resources;
                                    $(target).attr("value", obj.id);
                                    $(target).prop("data-select2-tag", false);
                                }
                            },
                            error: function (e) {
                                $(target).remove();
                            }
                        })
                    }
                }
            })

        });
    }, 1000)


})


//load post status
function loadPostStatus() {
    $.ajax({
        url: systemConfig.defaultAPIURL + "api/post-status/list",
        type: "GET",
        success: function (res) {
            let layouts = res.resources;
            layouts.forEach(function (item) {
                $("#postStatus").append(new Option(item.name, item.id)).trigger("change");
            });
        }
    })
}

//load post layout
function loadPostLayout() {
    $.ajax({
        url: systemConfig.defaultAPIURL + "api/post-layout/list",
        type: "GET",
        success: function (res) {
            let layouts = res.resources;
            layouts.forEach(function (item) {
                $("#postLayout").append(new Option(item.name, item.id)).trigger("change");
            });
        }
    })
}


//load post type
function loadTypes() {
    $.ajax({
        url: systemConfig.defaultAPIURL + "api/post-type/list",
        type: "GET",
        success: function (res) {
            let categories = res.resources;
            categories.forEach(function (item) {
                $("#postTypeModal").append(new Option(item.name, item.id)).trigger("change");
            });
        }
    })
}
//load post category

function loadCategories() {
    $.ajax({
        url: systemConfig.defaultAPIURL + "api/post-category/list",
        type: "GET",
        success: function (res) {
            var courseCategories = res.resources;
            courseCategories.forEach(function (item) {
                $("#postCategoryModal").append(new Option(item.name, item.id)).trigger("change");
            });

        }
    })
}
//detail post

function getDetail(id) {
    if (id != 0) {
        $.ajax({
            url: systemConfig.defaultAPIURL + "api/post/detail/" + id,
            type: "GET",
            data: { id: attachObjId },
            success: function (response) {
                if (response.isSucceeded) {
                    updatingObj = response.resources;
                    loadDetail();
                } else {
                    let textName = attachObjId > 0 ? "cập nhật" : "thêm mới";
                    if (response.status == 400) {
                        if (response.errors != null) {
                            var contentError = "<ul>";
                            response.errors.forEach(function (item, index) {
                                contentError += "<li class='text-start pb-2'>" + item + "</li>";
                            })
                            contentError += "</ul>";
                            Swal.fire(
                                'Bài viết <p class="swal__admin__subtitle"> ' + textName + ' không thành công </p>',
                                contentError,
                                'warning'
                            );
                        } else {
                            Swal.fire(
                                'Lưu ý',
                                response.message,
                                'warning'
                            )
                        }
                    }
                    else {
                        Swal.fire(
                            'Lưu ý',
                            response.message,
                            'warning'
                        )
                    }
                }

            }
        });
    }
    else {
        updatingObj = {};
    }
}
//set post detail to input

function loadDetail() {
    updatingObj.listTag.forEach(function (item) {
        $("#postTag").append(new Option(item.name, item.id, false, true));
    })
    updatingObj.photo != "" ? $("#postPhoto").attr("src", systemConfig.defaultStorageURL +  updatingObj.photo) : $("#postPhoto").attr("src", "/assets/media/images/blog/NoImage.png");
    updatingObj.photo != "" ? $("#postPhoto").attr("file-path", systemConfig.defaultStorageURL + updatingObj.photo) : $("#postPhoto").attr("file-path", "");
    $("#postOverview").val(updatingObj.overview);
    $("#postContent").val(updatingObj.description).trigger("change");
    $("#postTypeModal").val(updatingObj.postTypeId).trigger('change');
    $("#postCategoryModal").val(updatingObj.postCategoryId).trigger('change');
    $("#postLayout").val(updatingObj.postLayoutId).trigger('change');
    $("#postStatus").val(updatingObj.postStatusId).trigger('change');

    $("#postIsDraft").prop("checked", updatingObj.isDraft);
    $("#postIsApproved").prop("checked", updatingObj.isApproved);
    $("#postIsPublish").prop("checked", updatingObj.isPublish);
    $("#postName").val(updatingObj.name);

    if (CKEDITOR.instances["postContent"].getData() == "" && updatingObj.description !="") {
        CKEDITOR.instances["postContent"].setData(updatingObj.description);
    }

    $("#postCreatedTime").val(moment(updatingObj.createdTime, "YYYY-MM-DDTHH:mm:ss").format("DD/MM/YYYY HH:mm:ss"));
    $("#postApproveTime").val((updatingObj.approvalDate != null && updatingObj.isApproved) ? moment(updatingObj.approvalDate, "YYYY-MM-DDTHH:mm:ss").format("DD/MM/YYYY HH:mm:ss") : "");
    $("#postPublishedTimeValue").val((updatingObj.publishedTime != null && updatingObj.postStatusId == 1002) ? moment(updatingObj.publishedTime, "YYYY-MM-DDTHH:mm:ss").format("DD/MM/YYYY HH:mm:ss") : "01/01/1970 00:00:00");
}

//format select select2
function formatSelection(item) {
    return item.text;
}

//format layout select2
function formatResult(item) {
    if (item.loading) {
        return item.text;
    }
    return item.text;
}

//attach post
function attachObj() {
    var objName = attachObjId > 0 ? updatingObj.name : $("#postName").val();
    let titleName = attachObjId > 0 ? "Cập nhật bài viết" : "Thêm mới bài viết";
    let textName = attachObjId > 0 ? "cập nhật" : "thêm mới";
    var urlImgPost;

    if ($("#postPhoto").attr("file-path") != undefined && $("#postPhoto").attr("file-path") != "") {
        urlImgPost=new URL($("#postPhoto").attr("file-path"))
    }

    var obj = {
        id: attachObjId,
        postTypeId: $("#postTypeModal").val(),
        postCategoryId: $("#postCategoryModal").val(),
        postLayoutId: $("#postLayout").val(),
        postStatusId: $("#postStatus").val(),
        photo: urlImgPost !=undefined ? urlImgPost.pathname : "",
        name: $("#postName").val(),
        description: CKEDITOR.instances["postContent"].getData(),
        overview: $("#postOverview").val(),
        tagIds: ($("#postTag").val()).join(" "),
        isDraft: $("#postIsDraft").prop("checked"),
        isPublish: $("#postIsPublish").prop("checked"),
        isApproved: $("#postIsApproved").prop("checked"),
        PublishedTime: moment($("#postPublishedTimeValue").val(), "HH:mm:ss DD/MM/YYYY").format("YYYY-MM-DD HH:mm:ss"),

    };
    Swal.fire({
        title: titleName,
        html: "Bạn có chắc chắn muốn " + textName + " bài viết <strong>" + objName + "</strong> không?",
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#443',
        cancelButtonText: 'Hủy',
        confirmButtonText: 'Lưu'
    }).then(result => {
        if (result.isConfirmed) {
            if (valiationPost(obj)) {
                submit(obj);
            }
        }
    });

}

//validate post
function valiationPost(obj) {
    listErr = [];
    if (!obj.photo) {
        listErr.push("Ảnh bài viết không được để trống");
    }
    if (obj.name.length == 0) {
        listErr.push("Tên bài viết không được để trống");
    }
    if (obj.description.length == 0) {
        listErr.push("Nội dung bài viết không được để trống");
    }
    if (obj.overview.length == 0) {
        listErr.push("Tóm tắt không được để trống");
    }
    if (listErr.length > 0) {
        var content = "<ul class='text-start'>";
        listErr.forEach(function (item) {
            content += "<li>" + item + "</li>";
        })
        content += "</ul>";
        var action = (attachObjId > 0 ? "Cập nhật" : "Thêm mới");
        Swal.fire({
            title: action + ' bài viết',
            html: content,
            icon: 'warning',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Xác nhận'
        });
        return false;
    }
    return true;
}

//submit post
function submit(obj) {
    var objName = attachObjId > 0 ? updatingObj.name : $("#postName").val();
    let titleName = (attachObjId > 0 ? "Cập nhật bài viết" : "Thêm mới bài viết");
    let textName = (attachObjId > 0 ? "cập nhật" : "thêm mới");
    $('#loading').addClass("show");
    $.ajax({
        url: obj.id > 0 ? systemConfig.defaultAPIURL + "api/post/update" : systemConfig.defaultAPIURL + "api/post/add",
        type: obj.id > 0 ? "PUT" : "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(obj),
        success: function (response) {
            setTimeout(function () {
                $('#loading').removeClass("show");
                if (response.isSucceeded) {
                    Swal.fire({
                        title: titleName,
                        html: 'Bài viết <strong>' + objName + '</strong> được ' + textName + ' thành công!',
                        icon: 'success'
                    }).then(function (result) {
                        if (result.isConfirmed) {
                            location.href = "/post/list";
                        }
                    });
                    $("#modal_post").modal('hide');
                }
                else {
                    if (response.status == 400) {
                        if (response.errors != null) {
                            var contentError = "<ul>";
                            response.errors.forEach(function (item, index) {
                                contentError += "<li class='text-start pb-2'>" + item + "</li>";
                            })
                            contentError += "</ul>";
                            Swal.fire(
                                'Bài viết <p class="swal__admin__subtitle"> ' + textName +' không thành công </p>',
                                contentError,
                                'warning'
                            );
                        } else {
                            Swal.fire(
                                'Lưu ý',
                                response.message,
                                'warning'
                            )
                        }
                    }
                    else {
                        Swal.fire(
                            'Lưu ý',
                            response.message,
                            'warning'
                        )
                    }
                }
            })

        },
        error: function (e) {
            setTimeout(function () {
                $('#loading').removeClass("show");
                Swal.fire({
                    title: titleName,
                    html: titleName + ' bài viết không thành công, vui lòng thử lại sau !',
                    icon: 'error'
                });
            })
        }
    })
}
