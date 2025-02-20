/**
 * Author: Nam Anh
 * CreatedTime : 14/08/2024
 */
$(document).ready(function () {
    loadData();
    loadDataCompany();
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
        validate();
    })

    $("#form-submit-top-company").on("submit", function (e) {
        e.preventDefault();
        validate();
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
        $("#searchTopCompanyName").val("");
        $("#searchTopCompanyOrderSort").val("");
        $("#fillter_startDate_value").val("");
        $("#fillter_endDate_value").val("");
        linked1.clear();
        linked2.clear();
        tableSearch();
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

    $("#loading").addClass("show");

    if (id > 0) {
        $("#topCompanyName").prop("disabled", true);
        updatingObj = await getItemById(updatingId);

        if (updatingObj != null && updatingObj != undefined) {
            //set value obj to form
            //console.log(updatingObj);
            $("#topCompanyName").val(updatingObj.companyId).trigger("change");
            $("#topCompanyOrderSort").val(updatingObj.orderSort).trigger("change");
            $("#createdTime").val(moment(updatingObj.createdTime).format("DD/MM/YYYY HH:mm:ss"));
        }
        else {
            swal.fire(
                'Top công việc hàng đầu',
                'Không thể cập nhật top công ty hàng đầu, hãy kiểm tra lại thông tin.',
                'error'
            );
        }

    } else {
        $("#topCompanyName").prop("disabled", false);
        $("#topCompanyName").val("").trigger("change");
        $("#topCompanyOrderSort").val("").trigger("change");
        $("#createdTime").val(moment().format("DD/MM/YYYY HH:mm:ss"));
    }


    $("#topCompanyModalTitle").text(id > 0 ? "Cập nhật top công ty hàng đầu" : "Thêm mới top công ty hàng đầu");
    $("#loading").removeClass("show");
    $("#topCompanyModal").modal("show");

}

function getItemById(id) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: systemConfig.defaultAPIURL + "api/top-company/detail/" + id,
            type: "GET",
            success: function (responseData) {
                resolve(responseData.resources);
            },
            error: function (e) {
                swal.fire(
                    'Top công ty hàng đầu',
                    'Đã có lỗi xảy ra, hãy kiểm tra lại thông tin.',
                    'error'
                );
                reject(e); // Tùy vào cách bạn muốn xử lý lỗi
            },
        })
    });
}


function loadData() {
    $.ajax({
        url: systemConfig.defaultAPIURL + "api/top-company/list",
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            dataSource = response.resources;
            loadTable();
            if (tableUpdating === 0) {
                initTable();
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
            [2, 'asc']
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
        rowContent += "<td>" + (item.companyName != null ? item.companyName : "") + "</td>";
        rowContent += "<td>" + (item.orderSort != null ? item.orderSort : "") + "</td>";
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
    var companyName = dataSource.find(item => item.id === id).companyName;
    updatingObj = await getItemById(id);
    swal.fire({
        title: 'Xóa top công ty hàng đầu',
        html: 'Bạn có chắc chắn muốn xóa top công ty hàng đầu <b>' + companyName + '</b>?',
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
                url: systemConfig.defaultAPIURL + "api/top-company/delete?id=" + id,
                type: "DELETE",
                success: function (response) {
                    $("#loading").removeClass("show");
                    if (response.isSucceeded) {
                        Swal.fire(
                            'Xóa top công ty hàng đầu',
                            'Top công ty hàng đầu <b>' + $("#topCompanyName option:selected").text() + ' </b> đã được xóa thành công.',
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
                                    'Top công ty hàng đầu <p class="swal__admin__subtitle"> Xóa không thành công </p>',
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
                            'Top công ty hàng đầu',
                            'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                            'error'
                        ).then(function () {
                            window.location.href = "/home/login";
                        });
                    }
                    else if (e.status == 403) {
                        Swal.fire(
                            'Top công ty hàng đầu',
                            'Bạn không có quyền sử dụng tính năng này.',
                            'error'
                        );
                    }
                    else {
                        Swal.fire(
                            'Top công ty hàng đầu',
                            'Top công ty hàng đầu không thành công, <br> vui lòng thử lại sau!',
                            'error'
                        );
                    }

                }
            })
        }
    })
}

function loadDataCompany() {
    $.ajax({
        url: systemConfig.defaultAPIURL + "api/top-company/List-Company-Selected",
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            //console.log(response);
            $('#searchTopCompanyName, #topCompanyName').empty().trigger('change');
            response.resources.forEach(function (item) {
                var option = new Option(item.text, item.value, false, false);
                $('#searchTopCompanyName, #topCompanyName').append(option);
            });

            $("#topCompanyName, #searchTopCompanyName").select2({
                allowClear: true,
                placeholder: ""
            });

            $("#searchTopCompanyName").val("").trigger('change');
        },
        error: function (e) {
            console.error('An error occurred:', e);
        }
    });
}


function validate() {
    var errorList = [];
    if ($("#topCompanyName").val() == null) {
        errorList.push("Tên công ty không được bỏ trống.");
    }
    if ($("#topCompanyOrderSort").val().trim() === "") {
        errorList.push("Thứ tự sắp xếp không được để trống.");
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
            'Top công ty hàng đầu' + swalSubTitle,
            contentError,
            'warning'
        );
    } else {
        submit();
    }
}

function submit() {
    //var obj = {
    //    companyName: ($("#topCompanyName").val() != '' ? $("#topCompanyName").val().trim() : ""),
    //    orderSort: ($("#topCompanyOrderSort").val() != '' ? $("#topCompanyOrderSort").val() : ""),
    //}

    //if (updatingId > 0) {
    //    obj.id = updatingId;
    //}

    if (updatingId > 0 && updatingObj && updatingObj.id !== undefined) {
        var obj = {
            id: updatingObj.id,
            active: updatingObj.active,
            companyId: updatingObj.companyId,
            orderSort: ($("#topCompanyOrderSort").val() != '' ? $("#topCompanyOrderSort").val() : ""),
            createdTime: updatingObj.createdTime,
        };
    } else {
        obj = {
            companyId: $("#topCompanyName").val(),
            orderSort: ($("#topCompanyOrderSort").val() != '' ? $("#topCompanyOrderSort").val() : ""),
            createdTime: moment($("#createdTime").val(), "DD/MM/YYYY HH:mm:ss").format("YYYY-MM-DDTHH:mm:ss"),
        };
    }


    var actionName = (updatingId > 0 ? "Cập nhật" : "Thêm mới");

    swal.fire({
        title: actionName + " top công ty hàng đầu",
        html: "Bạn có chắc chắn muốn " + actionName.toLowerCase() + " top công ty hàng đầu <b>" + $("#topCompanyName option:selected").text() + '</b>?',
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
                    url: systemConfig.defaultAPIURL + "api/top-company/update",
                    type: "PUT",
                    contentType: "application/json",
                    data: JSON.stringify(obj),
                    success: function (response) {
                        $("#loading").removeClass("show");

                        // debugger;
                        if (response.isSucceeded) {
                            Swal.fire(
                                'Cập nhật top công ty hàng đầu',
                                'Top công ty hàng đầu <b>' + $("#topCompanyName option:selected").text() + '</b> đã được cập nhật thành công.',
                                'success'
                            ).then((result) => {
                                $("#topCompanyModal").modal("hide");
                                reGenTable();

                            });
                        }
                        else {
                            if (response.status == 400) {
                                if (response.errors != null) {
                                    Swal.fire(
                                        'Top công ty hàng đầu <p class="swal__admin__subtitle"> Cập nhật không thành công </p>',
                                        response.errors,
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
                                'Top công ty hàng đầu',
                                'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                                'error'
                            ).then(function () {
                                window.location.href = "/home/login";
                            });
                        }
                        else if (e.status == 403) {
                            Swal.fire(
                                'Top công ty hàng đầu',
                                'Bạn không có quyền sử dụng tính năng này.',
                                'error'
                            );
                        }
                        else {
                            swal.fire(
                                'Top công ty hàng đầu',
                                'Không thể cập nhật top công ty hàng đầu, hãy kiểm tra lại thông tin.',
                                'error'
                            );
                        }

                    }
                });
            };

            //CALL AJAX TO CREATE
            if (updatingId == 0) {
                $.ajax({
                    url: systemConfig.defaultAPIURL + "api/top-company/add",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(obj),
                    success: function (response) {
                        $("#loading").removeClass("show");

                        if (response.isSucceeded) {
                            Swal.fire(
                                'Thêm mới top công ty hàng đầu',
                                'Top công ty hàng đầu <b>' + $("#topCompanyName option:selected").text() + '</b> đã được thêm mới thành công.',
                                'success'
                            ).then(function () {
                                $("#topCompanyModal").modal("hide");
                                //window.location.reload();
                                reGenTable();

                            });
                        }
                        else {
                            if (response.status == 400) {
                                if (response.errors != null) {
                                    Swal.fire(
                                        'Top công ty hàng đầu <p class="swal__admin__subtitle"> Thêm mới không thành công </p>',
                                        response.errors,
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
                                'Top công ty hàng đầu',
                                'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                                'error'
                            ).then(function () {
                                window.location.href = "/home/login";
                            });
                        }
                        else if (e.status == 403) {
                            Swal.fire(
                                'Top công ty hàng đầu',
                                'Bạn không có quyền sử dụng tính năng này.',
                                'error'
                            );
                        }
                        else {

                            Swal.fire(
                                'Top công ty hàng đầu',
                                'Không thể thêm mới vị trí công việc, hãy kiểm tra lại thông tin.',
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
    table.column(1).search($("#searchTopCompanyName").val());
    table.column(2).search($("#searchTopCompanyOrderSort").val());
    table.draw();
}

$.fn.dataTable.ext.search.push(
    function (settings, data, dataIndex) {
        var date = new Date(moment(data[2], "DD/MM/YYYY HH:mm:ss"));
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