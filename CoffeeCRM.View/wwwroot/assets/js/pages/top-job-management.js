/**
 * Author: HoanNK
 * CreatedTime : 8/09/2024
 */
$(document).ready(function () {
    loadData();
    loadDataJobSelect();
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
        validateJobSuitable();
    })

    $("#form-submit-job-suitable").on("submit", function (e) {
        e.preventDefault();
        validateJobSuitable();
    })


    $("#table_search_all").on('keyup', function (e) {
        if (e.keyCode == 13) {
            table.search($(this).val()).draw();
        }
    });
    $("#btnTableSearch").click(function () {
        tableSearch();
    });

    function tableSearch() {
        table.column(1).search($("#tableData thead:nth-child(2) tr th:nth-child(2) input").val());
        table.column(2).search($("#tableData thead:nth-child(2) tr th:nth-child(3) input").val());
        table.search($("#table_search_all").val().trim()).draw();
    }

    $("#tableData thead:nth-child(2)").find("input").keypress(function (e) {
        let key = e.which;
        if (key == 13) {
            $("#btnTableSearch").click();
        }
    })


    $("#btnTableResetSearch").click(function () {
        $("#searchJob").val("").trigger('change');
        $("#searchDescription").val("").trigger('change');
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

    autosize.destroy($('#description'));
    autosize($('#description'));


    $("#loading").addClass("show");

    if (id > 0) {
        await getItemById(updatingId);

        if (updatingObj != null && updatingObj != undefined) {
            //set value obj to form
            //console.log(updatingObj);
            $("#searchJobId").val(updatingObj.jobId).trigger("change");
            $("#description").val(updatingObj.description);
            $("#createdTime").val(moment(updatingObj.createdTime).format("DD/MM/YYYY HH:mm:ss"));
        }
        else {
            swal.fire(
                'danh sách việc làm quản lý',
                'không thể cập nhật danh sách việc làm quản lý, hãy kiểm tra lại thông tin.',
                'error'
            );
        }

    } else {
        $("#searchJobId").val("").trigger("change");
        $("#description").val("").trigger("change");
        $("#createdTime").val(moment().format("DD/MM/YYYY HH:mm:ss"));
    }

    $("#topJobManagementModalTitle").text(id > 0 ? "Cập nhật danh sách việc làm" : "Thêm mới danh sách việc làm");
    $("#loading").removeClass("show");
    $("#topJobManagementModal").modal("show");
}

async function getItemById(id) {
    await $.ajax({
        url: systemConfig.defaultAPIURL + "api/top-job-management/detail/" + id,
        type: "GET",
        success: function (responseData) {
            if (responseData.isSucceeded) {
                if (responseData.status == 200 && responseData.message == "Success") {
                    updatingObj = responseData.resources;
                }
            }
        },
        error: function (e) {
            if (e.status === 401) {
                Swal.fire(
                    'Nhà tuyền dụng có thể bạn quan tâm',
                    'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                    'error'
                ).then(function () {
                    window.location.href = "/home/login";
                });
            }
            else if (e.status == 403) {
                Swal.fire(
                    'Nhà tuyền dụng có thể bạn quan tâm',
                    'Bạn không có quyền sử dụng tính năng này.',
                    'error'
                );
            }
            else {
                Swal.fire(
                    'Xóa nhà tuyền dụng có thể bạn quan tâm',
                    'Xóa nhà tuyền dụng có thể bạn quan tâm không thành công, <br> vui lòng thử lại sau!',
                    'error'
                );
            }
        },
    })
}

function loadData() {
    $.ajax({
        url: systemConfig.defaultAPIURL + "api/top-job-management/list-aggregates",
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            if (response.isSucceeded) {
                if (response.status == 200 && response.message == "Success") {
                    //console.log(response);
                    dataSource = response.resources;
                    loadTable();
                    if (tableUpdating === 0) {
                        initTable();
                    }
                }
            }
        },
        error: function (e) {
            initTable();
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
            [3, 'desc']
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
        var rowContent = "<tr>";
        rowContent += "<td style='text-align: center;'>" + (index + 1) + "</td>";
        rowContent += "<td>" + "<span style='display : none;'>" + (item.jobId != null ? item.jobId : "") + "</span>" + (item.jobName != null ? item.jobName : "") + "</td>";

        rowContent += "<td>" + (item.description != null ? item.description : "") + "</td>";
        rowContent += "<td class='column-date row-" + item.id + "'>" + moment(item.createdTime, "YYYY-MM-DD hh:mm:ss").format("DD/MM/YYYY hh:mm:ss") + "</td>";
        rowContent += "<td class='row" + item.id + "-column column-' property=''>"
            + "<div class='d-flex justify-content-center'>";

        rowContent += "<button  type='button' class='btn btn-icon btn-admin-edit' data-idItem='" + item.id + "'><span class='svg-icon-primary svg-icon  svg-icon-1'> " + systemConfig.editIcon + " </span></button>"

        rowContent += "<button type='button' class='btn btn-icon btn-admin-delete' data-idItem='" + item.id + "' ><span class='svg-icon-danger svg-icon  svg-icon-1'>" + systemConfig.deleteIcon + "</span></button></div>";

        rowContent += "</div></td ></tr>";
        $(rowContent).appendTo($("#tableData tbody"));
    })
}

async function deleteItem(id) {
    let item = dataSource.find(c => c.id == id);
    swal.fire({
        title: 'Xóa danh sách việc làm quản lý',
        html: 'Bạn có chắc chắn muốn xóa danh sách việc làm quản lý <b>' + item.jobName + '</b>?',
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
                url: systemConfig.defaultAPIURL + "api/top-job-management/delete?id=" + id,
                type: "DELETE",
                success: function (response) {
                    $("#loading").removeClass("show");
                    if (response.isSucceeded) {
                        Swal.fire(
                            'Xóa danh sách việc làm quản lý',
                            'Danh sách việc làm quản lý <b>' + item.jobName + ' </b> đã được xóa thành công.',
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
                                    'Danh sách việc làm <p class="swal__admin__subtitle"> Xóa không thành công </p>',
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
                            'Danh sách việc làm quản lý',
                            'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                            'error'
                        ).then(function () {
                            window.location.href = "/home/login";
                        });
                    }
                    else if (e.status == 403) {
                        Swal.fire(
                            'Danh sách việc làm quản lý',
                            'Bạn không có quyền sử dụng tính năng này.',
                            'error'
                        );
                    }
                    else {
                        Swal.fire(
                            'Xóa danh sách việc làm quản lý',
                            'Xóa danh sách việc làm quản lý không thành công, <br> vui lòng thử lại sau!',
                            'error'
                        );
                    }

                }
            })
        }
    })
}

function validateJobSuitable() {
    var errorList = [];
    if ($("#searchJobId").val() == null || $("#searchJobId").val() == 0) {
        errorList.push("Tên không được bỏ trống.");
    }
    if ($("#description").val().length > 500) {
        errorList.push("Mô tả không được dài quá 500 ký tự.");
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
            'Danh sách việc làm' + swalSubTitle,
            contentError,
            'warning'
        );
    } else {
        submit();
    }
}

function submit() {
    var obj = {
        jobId: $("#searchJobId").val(),
        description: ($("#description").val() != '' ? $("#description").val() : ""),

    }

    if (updatingId > 0) {
        obj.id = updatingId;
    }

    var actionName = (updatingId > 0 ? "Cập nhật" : "Thêm mới");

    swal.fire({
        title: actionName + " danh sách việc làm quản lý",
        html: "Bạn có chắc chắn muốn " + actionName.toLowerCase() + " danh sách việc làm quản lý <b>" + $("#searchJobId option:selected").text() + '</b>?',
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
                    url: systemConfig.defaultAPIURL + "api/top-job-management/update",
                    type: "PUT",
                    contentType: "application/json",
                    data: JSON.stringify(obj),
                    success: function (response) {
                        $("#loading").removeClass("show");

                        // debugger;
                        if (response.isSucceeded) {
                            Swal.fire(
                                'Cập nhật danh sách việc làm quản lý',
                                'Danh sách việc làm quản lý <b>' + $("#searchJobId option:selected").text() + '</b> đã được cập nhật thành công.',
                                'success'
                            ).then((result) => {
                                $("#topJobManagementModal").modal("hide");
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
                                        'Danh sách việc làm <p class="swal__admin__subtitle"> Cập nhật không thành công </p>',
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
                                'Danh sách việc làm quản lý',
                                'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                                'error'
                            ).then(function () {
                                window.location.href = "/home/login";
                            });
                        }
                        else if (e.status == 403) {
                            Swal.fire(
                                'Danh sách việc làm quản lý',
                                'Bạn không có quyền sử dụng tính năng này.',
                                'error'
                            );
                        }
                        else {
                            swal.fire(
                                'Danh sách việc làm quản lý',
                                'không thể cập nhật danh sách việc làm quản lý, hãy kiểm tra lại thông tin.',
                                'error'
                            );
                        }

                    }
                });
            };

            //CALL AJAX TO CREATE
            if (updatingId == 0) {
                $.ajax({
                    url: systemConfig.defaultAPIURL + "api/top-job-management/add",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(obj),
                    success: function (response) {
                        $("#loading").removeClass("show");

                        if (response.isSucceeded) {
                            Swal.fire(
                                'Thêm mới danh sách việc làm quản lý',
                                'Danh sách việc làm quản lýanh sách việc làm quản lý <b>' + $("#searchJobId option:selected").text() + '</b> đã được thêm mới thành công.',
                                'success'
                            ).then(function () {
                                $("#topJobManagementModal").modal("hide");
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
                                        'Danh sách việc làm quản lý <p class="swal__admin__subtitle"> Thêm mới không thành công </p>',
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
                                'Quản lý danh sách việc làm',
                                'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                                'error'
                            ).then(function () {
                                window.location.href = "/home/login";
                            });
                        }
                        else if (e.status == 403) {
                            Swal.fire(
                                'Quản lý danh sách việc làm',
                                'Bạn không có quyền sử dụng tính năng này.',
                                'error'
                            );
                        }
                        else {

                            Swal.fire(
                                'Quản lý danh sách việc làm',
                                'Không thể thêm mới danh sách việc làm, hãy kiểm tra lại thông tin.',
                                'error'
                            );
                        }
                    }
                });
            }
        }
    });
}

$.fn.dataTable.ext.search.push(
    function (settings, data, dataIndex) {
        var date = new Date(moment(data[3], "DD/MM/YYYY HH:mm:ss"));
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

function loadDataJobSelect() {
    $.ajax({
        url: systemConfig.defaultAPIURL + "api/top-job-management/list-job-selected",
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            if (response.isSucceeded) {
                /*console.log(response);*/
                if (response.status == 200 && response.message == "Success") {
                    response.resources.forEach(function (item, index) {
                        //console.log(item);
                        $('#searchJob').append(new Option(item.text, item.value, false, false)).trigger('change');
                        $('#searchJobId').append(new Option(item.text, item.value, false, false)).trigger('change');
                    })
                    $("#searchJob").val("").trigger('change')
                    $("#searchJobId").select2();
                    $("#searchJob").select2({
                        allowClear: true,
                        placeholder: ""
                    });
                }
            }

        },
        error: function (e) {
        }
    });
}
