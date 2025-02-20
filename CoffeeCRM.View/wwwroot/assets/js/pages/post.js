$(document).ready(function () {
    loadPostType();
    loadPostCategory();
    loadPostStatus();
    loadData();

    $('#postIsApprovedTable').val("").trigger("change");
    $("#postIsApprovedTable").select2({
        language: "vi",
        allowClear: true,
        placeholder: "",
        language: "vi"
    });
    $("#btnAddNew").on("click", function () {
        editItem(0);
        window.open("/post/create", '_blank').focus();
    })

    $("#tableData").on("click", ".btn-admin-edit", function () {
        var id = parseInt($(this).attr("data-idItem"));
        window.open("/post/update/" + id, '_blank').focus();

    })

    $("#tableData").on("click", ".btn-admin-delete", function () {
        var id = parseInt($(this).attr("data-idItem"));
        deleteItem(id);
    })

    $("#submitButton").on("click", function () {
        validatepost();
    })

    $("#form-submit-post").on("submit", function (e) {
        e.preventDefault();
        validatepost();
    })

    $("#table_search_all").on('keyup', function (e) {
        if (e.keyCode == 13) {
            table.search($(this).val()).draw();
        }
    });
    $("#btnTableSearch").click(function () {
        tableSearch();
    });


    $("#tableData thead:nth-child(2)").find("input").keypress(function (e) {
        let key = e.which;
        if (key == 13) {
            tableSearch();
        }
    })


    $("#btnTableResetSearch").click(function () {
        $("#searchPostName").val("");
        $("#fillter_startDate_value").val("");
        $("#fillter_endDate_value").val("");
        $(".tableHeaderFilter").val("").trigger("change");
        linked1.clear();
        linked2.clear();
        tableSearch();
    });

    $("#tableData").on("change", ".checkboxIsApproved", function () {
        var id = parseInt($(this).attr("data-approved-id"));
        //console.log(id);
        var actionName = $(this).is(":checked") ? "Duyệt" : "Bỏ duyệt";
        let objName = $("#row" + id + "-column-name").text();
        var obj = {
            id: id,
            isApproved: $(this).is(":checked"),
        }

        swal.fire({
            title: "Quản lý bài viết",
            html: "Bạn có chắc chắn muốn " + actionName.toLowerCase() + " bài viết <strong>" + objName + "</strong> không?",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#443',
            cancelButtonText: 'Hủy',
            confirmButtonText: 'Lưu'
        }).then((result) => {
            if (result.isConfirmed) {
                $("#loading").addClass("show");

                $.ajax({
                    url: systemConfig.defaultAPIURL + "api/post/approved",
                    type: "PUT",
                    contentType: "application/json",
                    data: JSON.stringify(obj),
                    success: function (response) {
                        // debugger;

                        if (response.isSucceeded) {
                            Swal.fire(
                                'Quản lý bài viết',
                                'Bài viết <b>' + objName + '</b> đã được cập nhật thành công.',
                                'success'
                            );
                        } else {

                            var swalSubTitle = "<p class='swal__admin__subtitle'>" + actionName.toLowerCase() + " không thành công</p>";

                            if (response.errors != null) {
                                var contentError = "<ul>";
                                response.errors.forEach(function (item, index) {
                                    contentError += "<li class='text-start'>" + item + "</li>";
                                })
                                contentError += "</ul>";


                                Swal.fire(
                                    'Bài viết' + swalSubTitle,
                                    contentError,
                                    'warning'
                                );

                            } else {
                                var contentError = `<ul>
                                                <li class='text-start'>`+ response.message + `</li>
                                </ul>`;


                                Swal.fire(
                                    'Bài viết' + swalSubTitle,
                                    contentError,
                                    'warning'
                                );
                            }

                            $(this).prop('checked', !obj.isApproved);


                        }
                        $("#loading").removeClass("show");


                    },
                    error: function (e) {
                        //console.log(e.message);
                        $("#loading").removeClass("show");

                        if (e.status === 401) {
                            Swal.fire(
                                'Quản lý bài viết',
                                'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                                'error'
                            ).then(function () {
                                window.location.href = "";
                            });
                        }
                        else if (e.status == 403) {
                            Swal.fire(
                                'Quản lý bài viết',
                                'Bạn không có quyền sử dụng tính năng này.',
                                'error'
                            );
                        }
                        else {
                            Swal.fire({
                                title: "Quản lý bài viết",
                                html: $(this).is(":checked") ? "Duyệt" : "Bỏ duyệt" + ' bài viết không thành công, vui lòng thử lại sau !',
                                icon: 'error'
                            });

                        }
                        $(this).prop('checked', !obj.isApproved);
                    }
                });


            } else {
                $(this).prop('checked', !obj.isApproved);

            }
        })
    })

    $("#tableData").on("change", ".checkboxIsApproved", function () {



    })


    const linkedPicker1Element = document.getElementById("fillter_startDate");
    linked1 = new tempusDominus.TempusDominus(linkedPicker1Element, datePickerOption);
    linked2 = new tempusDominus.TempusDominus(document.getElementById("fillter_endDate"), datePickerOption);
    // updateOption
    linked2.updateOptions({
        useCurrent: false,
    });
    //using event listeners
    linkedPicker1Element.addEventListener(tempusDominus.Namespace.events.change, (e) => {
        var minDate = $("#fillter_startDate_value").val() == "" ? undefined : new Date(moment(e.detail.date).add(-1, "d"));
        linked2.updateOptions({
            restrictions: {
                minDate: minDate
            },
        });
    });
    //using subscribe method
    const subscription = linked2.subscribe(tempusDominus.Namespace.events.change, (e) => {
        var maxdate = $("#fillter_endDate_value").val() == "" ? undefined : new Date(moment(e.date).add(1, "d"));
        linked1.updateOptions({
            restrictions: {
                maxDate: maxdate
            },
        });
    });
})


async function editItem(id) {
    updatingId = id;

    autosize.destroy($('#postDescription'));
    autosize($('#postDescription'));


    $("#loading").addClass("show");

    if (id > 0) {
        updatingObj = getItemById(updatingId);

        if (updatingObj != null && updatingObj != undefined) {
            //set value obj to form
            //console.log(updatingObj);
            $("#postName").val(updatingObj.name).trigger("change");
            $("#postDescription").val(updatingObj.description).trigger("change");
            $("#postColor").val(updatingObj.color).trigger("change");
            $("#createdTime").val(moment(updatingObj.createdTime).format("DD/MM/YYYY HH:mm:ss"));


        }
        else {
            swal.fire(
                'Quản lý bài viết',
                'không thể cập nhật bài viết, hãy kiểm tra lại thông tin.',
                'error'
            );
        }
        //var strLengthDes = $("#postDescription").val().split('\n').length;
        //$("#postDescription").attr('rows', strLengthDes < 2 ? 2 : strLengthDes);

    } else {
        $("#postName").val("").trigger("change");
        $("#postDescription").val("").trigger("change");
        $("#postColor").val("").trigger("change");

        $("#createdTime").val(moment().format("DD/MM/YYYY HH:mm:ss"));
    }


    $("#postModalTitle").text(id > 0 ? "Cập nhật bài viết" : "Thêm mới bài viết");
    $("#loading").removeClass("show");
    $("#postModal").modal("show");

}

async function getItemById(id) {
    return (await $.ajax({
        url: systemConfig.defaultAPIURL + "api/post/detail/" + id,
        type: "GET",
        success: function (responseData) {
        },
        error: function (e) {
        },
    })).resources;
}


async function deleteItem(id) {
    updatingObj = await getItemById(id);
    swal.fire({
        title: 'Xóa bài viết',
        html: 'Bạn có chắc chắn muốn xóa bài viết <b>' + updatingObj.name + '</b>?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        cancelButtonText: 'Hủy',
        confirmButtonText: 'Xóa'
    }).then((result) => {
        if (result.isConfirmed) {
            $("#loading").addClass("show");
            $.ajax({
                url: systemConfig.defaultAPIURL + "api/post/delete?id=" + id,
                type: "DELETE",
                success: function (response) {
                    $("#loading").removeClass("show");
                    if (response.isSucceeded) {
                        Swal.fire(
                            'Xóa bài viết',
                            'Bài viết <b>' + updatingObj.name + ' </b> đã được xóa thành công.',
                            'success'
                        );

                        regenTableServerSide();

                    } else {
                        if (response.status == 400) {
                            if (response.errors != null) {
                                var contentError = "<ul>";
                                response.errors.forEach(function (item, index) {
                                    contentError += "<li class='text-start pb-2'>" + item + "</li>";
                                })
                                contentError += "</ul>";
                                Swal.fire(
                                    'Bài viết <p class="swal__admin__subtitle"> Xóa không thành công </p>',
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
                },
                error: function (e) {
                    $("#loading").removeClass("show");
                    if (e.status === 401) {
                        Swal.fire(
                            'Quản lý bài viết',
                            'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                            'error'
                        ).then(function () {
                            window.location.href = "/home/login";
                        });
                    }
                    else if (e.status == 403) {
                        Swal.fire(
                            'Quản lý bài viết',
                            'Bạn không có quyền sử dụng tính năng này.',
                            'error'
                        );
                    }
                    else {
                        Swal.fire(
                            'Xóa bài viết',
                            'Xóa bài viết không thành công, <br> vui lòng thử lại sau!',
                            'error'
                        );
                    }

                }
            })
        }
    })
}

function validatepost() {
    var errorList = [];
    if ($("#postName").val().length == 0) {
        errorList.push("Tên không được bỏ trống.");
    } else if ($("#postName").val().length > 255) {
        errorList.push("Tên không được dài quá 255 ký tự.");
    }
    if ($("#postDescription").val().length > 500) {
        errorList.push("Mô tả không được dài quá 500 ký tự.");
    }
    if ($("#postColor").val().length == 0) {
        errorList.push("Màu không được bỏ trống.");

    } else if ($("#postColor").val().length > 12) {
        errorList.push("Màu không được dài quá 12 ký tự.");
    }


    if (errorList.length > 0) {
        var contentError = "<ul>";
        errorList.forEach(function (item, index) {
            contentError += "<li class='text-start'>" + item + "</li>";
        })
        contentError += "</ul>";
        var actionName = (updatingId > 0 ? "Cập nhật" : "Thêm mới");
        var swalSubTitle = "<p class='swal__admin__subtitle'>" + actionName + " không thành công</p>";
        Swal.fire(
            'Bài viết' + swalSubTitle,
            contentError,
            'warning'
        );
    } else {
        submit();
    }
}

function submit() {
    var obj = {
        name: ($("#postName").val() != '' ? $("#postName").val().trim() : ""),
        description: ($("#postDescription").val() != '' ? $("#postDescription").val() : ""),
        color: ($("#postColor").val() != '' ? $("#postColor").val() : ""),
    }

    if (updatingId > 0) {
        obj.id = updatingId;
    }

    var actionName = (updatingId > 0 ? "Cập nhật" : "Thêm mới");

    swal.fire({
        title: actionName + " bài viết",
        html: "Bạn có chắc chắn muốn " + actionName.toLowerCase() + " Bài viết <b>" + $("#postName").val() + '</b>?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#443',
        cancelButtonText: 'Hủy',
        confirmButtonText: 'Lưu'
    }).then((result) => {
        if (result.isConfirmed) {
            $("#loading").addClass("show");

            //CALL AJAX TO UPDATE
            if (updatingId > 0) {
                $.ajax({
                    url: systemConfig.defaultAPIURL + "api/post-category/update",
                    type: "PUT",
                    contentType: "application/json",
                    data: JSON.stringify(obj),
                    success: function (response) {
                        $("#loading").removeClass("show");

                        // debugger;
                        if (response.isSucceeded) {
                            Swal.fire(
                                'Cập nhật bài viết',
                                'Bài viết <b>' + $("#postName").val() + '</b> đã được cập nhật thành công.',
                                'success'
                            ).then((result) => {
                                $("#postModal").modal("hide");
                                reGenTable();

                            });
                        } else {

                            var swalSubTitle = "<p class='swal__admin__subtitle'>" + actionName.toLowerCase() + " không thành công</p>";

                            if (response.errors != null) {
                                var contentError = "<ul>";
                                response.errors.forEach(function (item, index) {
                                    contentError += "<li class='text-start'>" + item + "</li>";
                                })
                                contentError += "</ul>";


                                Swal.fire(
                                    'Bài viết' + swalSubTitle,
                                    contentError,
                                    'warning'
                                );

                            } else {
                                var contentError = `<ul>
                                                <li class='text-start'>`+ response.message + `</li>
                                </ul>`;


                                Swal.fire(
                                    'Bài viết' + swalSubTitle,
                                    contentError,
                                    'warning'
                                );
                            }
                        }

                    },
                    error: function (e) {
                        $("#loading").removeClass("show");

                        if (e.status === 401) {
                            Swal.fire(
                                'Quản lý bài viết',
                                'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                                'error'
                            ).then(function () {
                                window.location.href = "/home/login";
                            });
                        }
                        else if (e.status == 403) {
                            Swal.fire(
                                'Quản lý bài viết',
                                'Bạn không có quyền sử dụng tính năng này.',
                                'error'
                            );
                        }
                        else {
                            swal.fire(
                                'Quản lý bài viết',
                                'không thể cập nhật bài viết, hãy kiểm tra lại thông tin.',
                                'error'
                            );
                        }

                    }
                });
            };

            //CALL AJAX TO CREATE
            if (updatingId == 0) {
                $.ajax({
                    url: systemConfig.defaultAPIURL + "api/post-category/add",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(obj),
                    success: function (response) {
                        $("#loading").removeClass("show");

                        if (response.isSucceeded) {
                            Swal.fire(
                                'Thêm mới bài viết',
                                'Bài viết <b>' + $("#postName").val() + '</b> đã được thêm mới thành công.',
                                'success'
                            ).then(function () {
                                $("#postModal").modal("hide");
                                //window.location.reload();
                                reGenTable();

                            });
                        } else {
                            var swalSubTitle = "<p class='swal__admin__subtitle'>" + actionName.toLowerCase() + " không thành công</p>";
                            if (response.errors != null) {
                                var contentError = "<ul>";
                                response.errors.forEach(function (item, index) {
                                    contentError += "<li class='text-start'>" + item + "</li>";
                                })
                                contentError += "</ul>";
                                Swal.fire(
                                    'Bài viết' + swalSubTitle,
                                    contentError,
                                    'warning'
                                );
                            }
                            else {
                                var contentError = `<ul><li class='text-start'>` + response.message + `</li></ul>`;
                                Swal.fire(
                                    'Bài viết' + swalSubTitle,
                                    contentError,
                                    'warning'
                                );
                            }
                        }
                    },
                    error: function (e) {
                        $("#loading").removeClass("show");
                        if (e.status === 401) {
                            Swal.fire(
                                'Quản lý bài viết',
                                'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                                'error'
                            ).then(function () {
                                window.location.href = "/home/login";
                            });
                        }
                        else if (e.status == 403) {
                            Swal.fire(
                                'Quản lý bài viết',
                                'Bạn không có quyền sử dụng tính năng này.',
                                'error'
                            );
                        }
                        else {

                            Swal.fire(
                                'Quản lý bài viết',
                                'Không thể thêm mới Bài viết, hãy kiểm tra lại thông tin.',
                                'error'
                            );
                        }
                    }
                });
            }
        }
    });

}

function loadPostType() {
    $.ajax({
        url: systemConfig.defaultAPIURL + "api/post-type/list",
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            //console.log(response);
            var data = response.resources;
            data.forEach(function (item, index) {
                var data = {
                    id: item.id,
                    text: item.name
                };
                var newOption = new Option(data.text, data.id, false, false);
                $('#searchPostType').append(newOption);


                //$("#loading").removeClass("show");

            });
            $('#searchPostType').val("").trigger("change");
            $('#searchPostType').select2({
                allowClear: true,
                placeholder: "",
                language: "vi"
            });

        },
        error: function (e) {
            if (e.status === 401) {
                Swal.fire(
                    'Quản lý bài viết',
                    'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                    'error'
                ).then(function () {
                    window.location.href = "/home/login";
                });
            }
            else if (e.status == 403) {
                Swal.fire(
                    'Quản lý bài viết',
                    'Bạn không có quyền sử dụng tính năng này.',
                    'error'
                );
            }
            else {
                Swal.fire(
                    'Quản lý bài viết',
                    'Không thể hiển thị loại bài viết, hãy kiểm tra lại thông tin.',
                    'error'
                );
            }
        }
    });
}

function loadPostCategory() {
    $.ajax({
        url: systemConfig.defaultAPIURL + "api/post-category/list",
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            //console.log(response);
            var data = response.resources;
            data.forEach(function (item, index) {
                var data = {
                    id: item.id,
                    text: item.name
                };
                var newOption = new Option(data.text, data.id, false, false);
                $('#searchPostCategory').append(newOption);


                //$("#loading").removeClass("show");

            });
            $('#searchPostCategory').val("").trigger("change");
            $('#searchPostCategory').select2({
                allowClear: true,
                placeholder: "",
                language: "vi"
            });

        },
        error: function (e) {
            if (e.status === 401) {
                Swal.fire(
                    'Quản lý bài viết',
                    'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                    'error'
                ).then(function () {
                    window.location.href = "/home/login";
                });
            }
            else if (e.status == 403) {
                Swal.fire(
                    'Quản lý bài viết',
                    'Bạn không có quyền sử dụng tính năng này.',
                    'error'
                );
            }
            else {
                Swal.fire(
                    'Quản lý bài viết',
                    'Không thể hiển thị danh mục bài viết, hãy kiểm tra lại thông tin.',
                    'error'
                );
            }
        }
    });
}

function loadPostStatus() {
    $.ajax({
        url: systemConfig.defaultAPIURL + "api/post-status/list",
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            //console.log(response);
            var data = response.resources;
            data.forEach(function (item, index) {
                var data = {
                    id: item.id,
                    text: item.name
                };
                var newOption = new Option(data.text, data.id, false, false);
                $('#searchPostStatus').append(newOption);


                //$("#loading").removeClass("show");

            });
            $('#searchPostStatus').val("").trigger("change");
            $('#searchPostStatus').select2({
                allowClear: true,
                placeholder: "",
                language: "vi"
            });

        },
        error: function (e) {
            if (e.status === 401) {
                Swal.fire(
                    'Quản lý bài viết',
                    'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                    'error'
                ).then(function () {
                    window.location.href = "/home/login";
                });
            }
            else if (e.status == 403) {
                Swal.fire(
                    'Quản lý bài viết',
                    'Bạn không có quyền sử dụng tính năng này.',
                    'error'
                );
            }
            else {
                Swal.fire(
                    'Quản lý bài viết',
                    'Không thể hiển thị loại bài viết, hãy kiểm tra lại thông tin.',
                    'error'
                );
            }
        }
    });
}

function tableSearch() {

    table.column(2).search($("#searchPostName").val().trim());
    if ($("#fillter_startDate_value").val().length > 0 || $("#fillter_endDate_value").val().length > 0) {
        //debugger;
        var minDate = $("#fillter_startDate_value").val();
        var maxDate = $("#fillter_endDate_value").val();
        let searchDateArrs = [];

        if (minDate.length > 0) {
            searchDateArrs.push(moment(minDate, "DD/MM/YYYY").format("YYYY-MM-DD 00:00:00"))

        }
        else {
            searchDateArrs.push("")
        }
        if (maxDate.length > 0) {
            searchDateArrs.push(moment(maxDate, "DD/MM/YYYY").format("YYYY-MM-DD 23:59:59"))
        }
        else {
            searchDateArrs.push("")
        }
        table.column(7).search(searchDateArrs.toString());
    }
    else {
        table.column(7).search("")
    }


    table.column(3).search($("#searchPostAuthorName").val().trim());
    table.column(4).search($("#searchPostCategory").val().join('|').replace("&", "\\&").replace(/\s/g, "\\s"), true);
    table.column(5).search($("#searchPostType").val().join('|').replace("&", "\\&").replace(/\s/g, "\\s"), true);
    table.column(6).search($("#searchPostStatus").val());
    table.column(8).search($("#postIsApprovedTable").val());

    table.search($("#table_search_all").val());

    table.draw();
}
function loadData() {
    table = $("#tableData").DataTable({
        language: systemConfig.languageDataTable,
        processing: true,
        serverSide: true,
        paging: true,
        searching: { regex: true },
        ajax: {
            url: systemConfig.defaultAPIURL + "api/post/list-by-post-aggregates",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: function (d) {
                return JSON.stringify(d);
            },

        },
        columns: [
            {
                className: "column-index",
                data: 'id',
                render: function (data, type, row, meta) {
                    var info = table.page.info();
                    return meta.row + 1 + info.page * info.length;
                }
            },

            {
                data: "photo",
                render: function (data, type, row, meta) {
                    let content;
                    let defaultImg = "/assets/media/images/blog/NoImage.png";
                    if (data) {
                        content = `<div class='symbol symbol-100px symbol-lg-160px symbol-fixed position-relative imgPost'> <img src='` + (systemConfig.defaultStorageURL + data) + `' alt='image'> </div>`;
                    }
                    else {
                        content = `<div class='symbol symbol-100px symbol-lg-160px symbol-fixed position-relative imgPost'> <img src='` + defaultImg + `' alt='image'> </div>`;
                    }
                    return content;
                }
            },
            {
                data: "name",
                render: function (data, type, row, meta) {
                    return `<span id='row` + row.id + `-column-name'>` + data + `</span>`;
                }
            },

            

            {
                data: "authorName",
                render: function (data, type, row, meta) {
                    return data;
                }
            },

            {
                data: "postCategoryName",
                render: function (data, type, row, meta) {
                    return `<span id='row` + row.id + `-column-name'>` + data + `</span>`;;
                }
            },
            {
                data: "postTypeName",
                render: function (data, type, row, meta) {
                    return data;
                }
            },

            {
                data: "postStatusName",
                render: function (data, type, row, meta) {
                    return `<span id='row ` + row.id + ` -column-name' class='badge py-3 px-4 fs-7' style='color: ` + row.postStatusColor + ` ;background-color: ` + customBagdeColor(row.postStatusColor) + `'> `+ data + `</span>`;
                }
            },

            {
                data: "createdTime",
                render: function (data, type, row, meta) {
                    return moment(data).format("DD/MM/YYYY HH:mm:ss");
                }
            },
            {
                data: "isApproved",
                render: function (data, type, row, meta) {
                    let isChecked;
                    if (data) {
                        isChecked = "checked";
                    }
                    else {
                        isChecked = "";
                    }
                    let content = `<div class="form-check form-switch switch_custom text-center form-check-solid d-flex justify-content-center">
											<input data-approved-id= "`+ row.id + `" class="form-check-input checkboxIsApproved" type="checkbox" value=""  ` + isChecked + ` />
			
		                            </div>`;
                    return content;
                }
            },
            {
                data: "id",
                render: function (data, type, row, meta) {
                    return `<div class='d-flex justify-content-center'>`
                        + `<button class="btn btn-icon me-2 btn-admin-edit" title='Cập nhật' data-idItem='`+data+`'><span class='svg-icon-primary svg-icon  svg-icon-1'> ` + systemConfig.editIcon + ` </span></button>`
                        + `<button class="btn btn-icon ms-2 btn-admin-delete"  title='Xóa' data-idItem='` + data +`' ><span class='svg-icon-danger svg-icon  svg-icon-1'>` + systemConfig.deleteIcon + `</span></button></div>`;
                }
            }
        ],
        columnDefs: [
            
            { targets: [0, -1, 2], orderable: false },

        ],
        'order': [
            [7, 'desc']
        ],
        drawCallback: function () {
            $('#tableData tfoot').html("");
            $("#tableData thead:nth-child(1) tr").clone(true).appendTo("#tableData tfoot");
            $("#rowSearch").removeClass("d-none");
        }

    });
}

function regenTableServerSide() {
    table.destroy();
    $(".tableHeaderFilter").val(null).trigger("change");
    loadData();
}
$("#postModal").on('shown.bs.modal', function () {
    autosize.destroy($('#postDescription'));
    autosize($('#postDescription'));
})
$("#postModal").on('hiden.bs.modal', function () {
    autosize.destroy($('#postDescription'));
})