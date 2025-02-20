/**
 * Author: HoanNK
 * CreatedTime : 08/09/2024
 */
$(document).ready(function () {
    loadData();
    loadJob();
    $("#btnAddNew").on("click", function () {
        editItem(0);
    })

    $("#tableData").on("click", ".btn-admin-edit", function () {
        var id = parseInt($(this).attr("data-idItem"));
        editItem(id);
    })

    $("#tableData").on("click", ".btn-admin-delete", function () {
        var id = parseInt($(this).attr("data-idItem"));
        deleteItem(id);
    })

    $("#submitButton").on("click", function () {
        validateJobSkill();
    })

    $("#form-submit-top-job-extra").on("submit", function (e) {
        e.preventDefault();
        validateJobSkill();
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
            $("#btnTableSearch").click();
        }
    })


    $("#btnTableResetSearch").click(function () {
        $("#searchJobName").val("");
        $("#searchDescription").val("");
        $("#fillter_startDate_value").val("");
        $("#fillter_endDate_value").val("");
        linked1.clear();
        linked2.clear();
        reGenTable();
    });

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

    autosize.destroy($('#topJobExtraDescription'));
    autosize($('#topJobExtraDescription'));

    $("#loading").addClass("show");

    if (id > 0) {
        await getItemById(updatingId);

        if (updatingObj != null && updatingObj != undefined) {
            
            $("#selectJob").val(updatingObj.jobId).trigger("change");
            $("#orderSort").val(updatingObj.orderSort).trigger("change");
            $("#topJobExtraDescription").val(updatingObj.description).trigger("change");
            $("#createdTime").val(moment(updatingObj.createdTime).format("DD/MM/YYYY HH:mm:ss"));
        }
        else {
            swal.fire(
                'Việc làm tốt nhất',
                'không thể cập nhật việc làm tốt nhất, hãy kiểm tra lại thông tin.',
                'error'
            );
        }
        //var strLengthDes = $("#menuTypeModalDescription").val().split('\n').length;
        //$("#menuTypeModalDescription").attr('rows', strLengthDes < 2 ? 2 : strLengthDes);

    } else {
        $("#selectJob").val("").trigger("change");
        $("#topJobExtraDescription").val("").trigger("change");
        $("#createdTime").val(moment().format("DD/MM/YYYY HH:mm:ss"));
    }


    $("#topJobExtraModalTitle").text(id > 0 ? "Cập nhật việc làm tốt nhất" : "Thêm mới việc làm tốt nhất");
    $("#loading").removeClass("show");
    $("#topJobExtraModal").modal("show");

}

async function getItemById(id) {
    await $.ajax({
        url: systemConfig.defaultAPIURL + "api/top-job-extra/detail/" + id,
        type: "GET",
        success: function (responseData) {
            if (responseData.isSucceeded) {
                updatingObj = responseData.resources;
            }
        },
        error: function (e) {
            swal.fire(
                'Việc làm tốt nhất',
                'Đã có lỗi xảy ra, hãy kiểm tra lại thông tin.',
                'error'
            );
        },
    })
}

var sub = [];
function loadData() {
    $.ajax({
        url: systemConfig.defaultAPIURL + "api/top-job-extra/list",
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            if (response.isSucceeded) {
                dataSource = response.resources;
                sub = dataSource;
                loadTable();
                if (tableUpdating === 0) {
                    initTable();
                }
            }
        },
        error: function (e) {
            initTable();
        }
    });
}

function loadJob() {
    $.ajax({
        url: systemConfig.defaultAPIURL + "api/job/list",
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

                $("#searchJobName").append(new Option(data.text, data.id, false, false)).trigger('change');
                $("#selectJob").append(new Option(data.text, data.id, false, false)).trigger('change');


                //$("#loading").removeClass("show");

            });
            $('#searchJobName').val("").trigger("change");
            $('#searchJobName').select2({
                allowClear: true,
                placeholder: "",
                language: "vi"
            });

        },
        error: function (e) {
            if (e.status === 401) {
                Swal.fire(
                    'Quản lý công việc',
                    'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                    'error'
                ).then(function () {
                    window.location.href = "/home/login";
                });
            }
            else if (e.status == 403) {
                Swal.fire(
                    'Quản lý công việc',
                    'Bạn không có quyền sử dụng tính năng này.',
                    'error'
                );
            }
            else {
                Swal.fire(
                    'Quản lý công việc',
                    'Không thể hiển thị loại bài viết, hãy kiểm tra lại thông tin.',
                    'error'
                );
            }
        }
    });
}


function initTable() {
    table = $('#tableData').DataTable({
        language: systemConfig.languageDataTable,
        searching: {
            regex: true
        },
        columnDefs: [
            { targets: "no-sort", orderable: false },
            { targets: [0, -1], orderable: false },
            { targets: "no-search", searchable: false },
            {
                targets: "trim",
                render: function (data, type, full, meta) {
                    if (type === "display") {
                        data = strtrunc(data, 10);
                    }

                    return data;
                }
            },
            { targets: "date-type", type: "date-eu" },

        ],

        'order': [
            [6, 'desc']
        ],

        aLengthMenu: [
            [10, 25, 50, 100],
            [10, 25, 50, 100]
        ],
        drawCallback: function () {
            $('#tableData tfoot').html("");
            $("#tableData thead:nth-child(1) tr").clone(true).appendTo("#tableData tfoot");
            $("#rowSearch").removeClass("d-none");
        }


    });

    table.on('order.dt search.dt', function () {
        table.column(0, {
            search: 'applied',
            order: 'applied'
        }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();
}

function loadTable() {
    var index = 0;
    $("#tableData tbody").html("");
    dataSource.forEach(function (item, index) {
        //console.log(item);
        var rowContent = "<tr>";
        rowContent += "<td style='text-align: center;'>" + (index + 1) + "</td>";
        rowContent += "<td>" + "<span style='display : none;'>" + (item.jobId != null ? item.jobId : "") + "</span>" + (item.jobName != null ? item.jobName : "") + "</td>";
        rowContent += "<td>" + item.orderSort + "." + item.subOrderSort + "</td>";
        rowContent += "<td>" + (item.description != null ? item.description : "") + "</td>";
        rowContent += '<td class="text-center order-section-change-up" data-id-row="' + item.id + '" data-event="upper-order-' + item.id + '"><span class="svg-icon svg-icon-success svg-icon-2hx">' + upperIcon + '</span></td>';
        rowContent += '<td class="text-center order-section-change-down" data-id-row="' + item.id + '" data-event="lower-order-' + item.id + '"><span class="svg-icon svg-icon-danger svg-icon-2hx">' + lowerIcon + '</span></td>';
        rowContent += "<td>" + moment(item.createdTime, "YYYY-MM-DD hh:mm:ss").format("DD/MM/YYYY hh:mm:ss") + "</td>";

        rowContent += "<td class='row" + item.id + "-column column-' property=''>"
            + "<div class='d-flex justify-content-center'>";

        rowContent += "<button  type='button' class='btn btn-icon btn-admin-edit' data-idItem='" + item.id + "'><span class='svg-icon-primary svg-icon  svg-icon-1'> " + systemConfig.editIcon + " </span></button>"

        rowContent += "<button type='button' class='btn btn-icon btn-admin-delete' data-idItem='" + item.id + "' ><span class='svg-icon-danger svg-icon  svg-icon-1'>" + systemConfig.deleteIcon + "</span></button></div>";

        rowContent += "</div></td ></tr>";
        $(rowContent).appendTo($("#tableData tbody"));
    })
}

async function deleteItem(id) {
    let item = dataSource.find(c => c.id = id);
    swal.fire({
        title: 'Xóa việc làm tốt nhất',
        html: 'Bạn có chắc chắn muốn xóa việc làm tốt nhất <b>' + item.jobName + '</b>?',
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
                url: systemConfig.defaultAPIURL + "api/top-job-extra/delete?id=" + id,
                type: "DELETE",
                success: function (response) {
                    $("#loading").removeClass("show");
                    if (response.isSucceeded) {
                        Swal.fire(
                            'Xóa loại việc làm tốt nhất',
                            'Việc làm tốt nhất <b>' + updatingObj.name + ' </b> đã được xóa thành công.',
                            'success'
                        );
                        reGenTable();
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
                                    'Việc làm tốt nhất <p class="swal__admin__subtitle"> Xóa không thành công </p>',
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
                            'Việc làm tốt nhất',
                            'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                            'error'
                        ).then(function () {
                            window.location.href = "/home/login";
                        });
                    }
                    else if (e.status == 403) {
                        Swal.fire(
                            'Việc làm tốt nhất',
                            'Bạn không có quyền sử dụng tính năng này.',
                            'error'
                        );
                    }
                    else {
                        Swal.fire(
                            'Xóa việc làm tốt nhất',
                            'Xóa việc làm tốt nhất không thành công, <br> vui lòng thử lại sau!',
                            'error'
                        );
                    }

                }
            })
        }
    })
}

$("#tableData").on('click', '.order-section-change-up', function () {
    var clickedElementId = $(this).attr('data-id-row');

    // Sử dụng findIndex để tìm index của phần tử trong mảng dataSource dựa trên giá trị id
    var index = dataSource.findIndex(x => x.id == clickedElementId);

    if (index != 0) {
        objSectionOrderUp = dataSource[index];
        objSectionOrderDown = dataSource[index - 1];
        var obj = {
            slideUp: objSectionOrderUp,
            slideDown: objSectionOrderDown,
        }

        swal.fire({
            title: "Thay đổi thứ tự",
            html: "Bạn có chắc chắn muốn thay đổi thứ tự này",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#443',
            cancelButtonText: 'Hủy',
            confirmButtonText: 'Lưu'
        }).then(async (result) => {
            if (result.isConfirmed) {
                $("#loading").addClass("show");
                //CALL AJAX TO CREATE
                if (obj) {
                    try {
                        let result;
                        result = await httpService.postAsync("api/top-job-extra/change-order-slide", obj);

                        if (result.isSucceeded) {
                            Swal.fire(
                                'Thay đổi thứ tự ',
                                'Thay đổi thứ tự thành công.',
                                'success'
                            ).then((result) => {
                                reGenTable();
                            });
                        } else {
                            if (result.status == 400) {
                                Swal.fire(
                                    'Thay đổi thứ tự',
                                    `Thay đổi thứ tự không thành công, <br> vui lòng thử lại sau!`,
                                    'error'
                                );
                            }
                            else {
                                Swal.fire(
                                    'Thay đổi thứ tự ',
                                    `Thay đổi thứ tự không thành công, <br> vui lòng thử lại sau!`,
                                    'error'
                                );
                            }
                        }
                        $("#loading").removeClass("show");
                    } catch (e) {
                        console.error(e);
                        if (e.status === 401) {
                            Swal.fire(
                                'Thay đổi thứ tự',
                                'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                                'error'
                            ).then(function () {
                                window.location.href = "/home/login";
                            });
                        }
                        else if (e.status == 403) {
                            Swal.fire(
                                'Thay đổi thứ tự',
                                'Bạn không có quyền sử dụng tính năng này.',
                                'error'
                            );
                        }
                        else {
                            swal.fire(
                                'Thay đổi thứ tự',
                                `Thay đổi thứ tự không thành công, <br> vui lòng thử lại sau!`,
                                'error'
                            );
                        }
                        $("#loading").removeClass("show");
                    }
                }
                $("#loading").removeClass("show");
            }
        });
    }
    else {
        swal.fire({
            title: "Thay đổi thứ tự",
            html: "Học phần này đã ở vị trí đầu tiên, không thể thay đổi lên trên được",
            icon: 'info',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Đồng ý'
        })
    }
})
$("#tableData").on('click', '.order-section-change-down', function () {
    var clickedElementId = $(this).attr('data-id-row');
    // Sử dụng findIndex để tìm index của phần tử trong mảng dataSource dựa trên giá trị id
    var index = dataSource.findIndex(x => x.id == clickedElementId);
    if (index != dataSource.length - 1) {
        objSectionOrderUp = dataSource[index];
        objSectionOrderDown = dataSource[index + 1];
        var obj = {
            slideUp: objSectionOrderUp,
            slideDown: objSectionOrderDown,
        }

        swal.fire({
            title: "Thay đổi thứ tự",
            html: "Bạn có chắc chắn muốn thay đổi thứ tự này",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#443',
            cancelButtonText: 'Hủy',
            confirmButtonText: 'Lưu'
        }).then(async (result) => {
            if (result.isConfirmed) {
                $("#loading").addClass("show");
                //CALL AJAX TO CREATE
                if (obj) {
                    try {
                        let result;
                        result = await httpService.postAsync("api/top-job-extra/change-order-slide", obj);
                        if (result.isSucceeded) {
                            Swal.fire(
                                'Thay đổi thứ tự ',
                                'Thay đổi thứ tự thành công.',
                                'success'
                            ).then((result) => {
                                reGenTable();
                            });
                        } else {
                            if (result.status == 400) {
                                Swal.fire(
                                    'Thay đổi thứ tự ',
                                    `Thay đổi thứ tự không thành công, <br> vui lòng thử lại sau!`,
                                    'error'
                                );
                            }
                            else {
                                Swal.fire(
                                    'Thay đổi thứ tự',
                                    `Thay đổi thứ tự không thành công, <br> vui lòng thử lại sau!`,
                                    'error'
                                );
                            }
                        }
                        $("#loading").removeClass("show");
                    } catch (e) {
                        console.error(e);
                        if (e.status === 401) {
                            Swal.fire(
                                'Thay đổi thứ tự',
                                'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                                'error'
                            ).then(function () {
                                window.location.href = "/home/login";
                            });
                        }
                        else if (e.status == 403) {
                            Swal.fire(
                                'Thay đổi thứ tự',
                                'Bạn không có quyền sử dụng tính năng này.',
                                'error'
                            );
                        }
                        else {
                            swal.fire(
                                'Thay đổi thứ tự ',
                                `Thay đổi thứ tự không thành công, <br> vui lòng thử lại sau!`,
                                'error'
                            );
                        }
                        $("#loading").removeClass("show");
                    }
                }
                $("#loading").removeClass("show");
            }
        });
    }
    else {
        swal.fire({
            title: "Thay đổi thứ tự",
            html: "Học phần này đã ở vị trí cuối cùng, không thể thay đổi xuống dưới được",
            icon: 'info',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Đồng ý'
        })
    }
})


function validateJobSkill() {
    var errorList = [];

    if (errorList.length > 0) {
        var contentError = "<ul>";
        errorList.forEach(function (item, index) {
            contentError += "<li class='text-start'>" + item + "</li>";
        })
        contentError += "</ul>";
        var actionName = (updatingId > 0 ? "Cập nhật" : "Thêm mới");
        var swalSubTitle = "<p class='swal__admin__subtitle'>" + actionName + " không thành công</p>";
        Swal.fire(
            'Việc làm tốt nhất' + swalSubTitle,
            contentError,
            'warning'
        );
    } else {
        submit();
    }
}

function submit() {
    var obj = {
        jobId: ($("#selectJob").val()),
        orderSort: ($("#orderSort").val()),
        description: ($("#topJobExtraDescription").val() != '' ? $("#topJobExtraDescription").val() : ""),
        subOrderSort: updatingObj.subOrderSort,
    }

    if (updatingId > 0) {
        obj.id = updatingId;
    }

    var actionName = (updatingId > 0 ? "Cập nhật" : "Thêm mới");

    swal.fire({
        title: actionName + " việc làm tốt nhất",
        html: "Bạn có chắc chắn muốn " + actionName.toLowerCase() + " việc làm tốt nhất  <b>" + $("#selectJob option:selected").text() + '</b>?',
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
                    url: systemConfig.defaultAPIURL + "api/top-job-extra/update",
                    type: "PUT",
                    contentType: "application/json",
                    data: JSON.stringify(obj),
                    success: function (response) {
                        $("#loading").removeClass("show");

                        // debugger;
                        if (response.isSucceeded) {
                            Swal.fire(
                                'Cập nhật việc làm tốt nhất',
                                'Việc làm tốt nhất <b>' + $("#selectJob option:selected").text() + '</b> đã được cập nhật thành công.',
                                'success'
                            ).then((result) => {
                                $("#topJobExtraModal").modal("hide");
                                reGenTable();

                            });
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
                                        'Việc làm tốt nhất <p class="swal__admin__subtitle"> Cập nhật không thành công </p>',
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
                                'Việc làm tốt nhất',
                                'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                                'error'
                            ).then(function () {
                                window.location.href = "/home/login";
                            });
                        }
                        else if (e.status == 403) {
                            Swal.fire(
                                'Việc làm tốt nhất',
                                'Bạn không có quyền sử dụng tính năng này.',
                                'error'
                            );
                        }
                        else {
                            swal.fire(
                                'Việc làm tốt nhất',
                                'không thể cập nhật việc làm tốt nhất, hãy kiểm tra lại thông tin.',
                                'error'
                            );
                        }

                    }
                });
            };

            //CALL AJAX TO CREATE
            if (updatingId == 0) {
                $.ajax({
                    url: systemConfig.defaultAPIURL + "api/top-job-extra/add",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(obj),
                    success: function (response) {
                        $("#loading").removeClass("show");

                        if (response.isSucceeded) {
                            Swal.fire(
                                'Thêm mới việc làm tốt nhất',
                                'Việc làm tốt nhất <b>' + $("#jobName").val() + '</b> đã được thêm mới thành công.',
                                'success'
                            ).then(function () {
                                $("#topJobExtraModal").modal("hide");
                                //window.location.reload();
                                reGenTable();

                            });
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
                                        'Việc làm tốt nhất <p class="swal__admin__subtitle"> Thêm mới không thành công </p>',
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
                                'Quản lý việc làm tốt nhất',
                                'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                                'error'
                            ).then(function () {
                                window.location.href = "/home/login";
                            });
                        }
                        else if (e.status == 403) {
                            Swal.fire(
                                'Quản lý việc làm tốt nhất',
                                'Bạn không có quyền sử dụng tính năng này.',
                                'error'
                            );
                        }
                        else {

                            Swal.fire(
                                'Quản lý việc làm tốt nhất',
                                'Không thể thêm mới việc làm tốt nhất, hãy kiểm tra lại thông tin.',
                                'error'
                            );
                        }
                    }
                });
            }
        }
    });

}

function tableSearch() {
    table.column(1).search($("#searchJobName").val());
    table.column(2).search($("#searchOrderSort").val());
    table.column(3).search($("#searchDescription").val());
    table.search($("#table_search_all").val().trim()).draw();
}

$.fn.dataTable.ext.search.push(
    function (settings, data, dataIndex) {
        var date = new Date(moment(data[6], "DD/MM/YYYY HH:mm:ss"));
        var startDate = $("#fillter_startDate_value").val();
        var endDate = $("#fillter_endDate_value").val();
        var min = startDate != "" ? new Date(moment(startDate, "DD/MM/YYYY ").format("YYYY-MM-DD 00:00:00")) : null;
        var max = endDate != "" ? new Date(moment(endDate, "DD/MM/YYYY").format("YYYY-MM-DD 23:59:59")) : null;
        if (
            (min === null && max === null) ||
            (min === null && date <= max) ||
            (min <= date && max === null) ||
            (min <= date && date <= max)
        ) {
            return true;
        }
        return false;
    }
);