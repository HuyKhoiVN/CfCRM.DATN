/**
 * Author: ThanhND
 * CreatedTime : 27/07/2024
 */
$(document).ready(function () {
    loadData();
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

    $("#form-submit-job-skill").on("submit", function (e) {
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
        $("#searchJobSkillName").val("");
        $("#searchJobSkillDescription").val("");
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

    autosize.destroy($('#jobSkillDescription'));
    autosize($('#jobSkillDescription'));


    $("#loading").addClass("show");

    if (id > 0) {
        await getItemById(updatingId);

        if (updatingObj != null && updatingObj != undefined) {
            //set value obj to form
            //console.log(updatingObj);
            $("#jobSkillName").val(updatingObj.name).trigger("change");
            $("#jobSkillDescription").val(updatingObj.description).trigger("change");
            $("#createdTime").val(moment(updatingObj.createdTime).format("DD/MM/YYYY HH:mm:ss"));


        }
        else {
            swal.fire(
                'Loại kỹ năng',
                'không thể cập nhật kỹ năng, hãy kiểm tra lại thông tin.',
                'error'
            );
        }
        //var strLengthDes = $("#jobSkillDescription").val().split('\n').length;
        //$("#jobSkillDescription").attr('rows', strLengthDes < 2 ? 2 : strLengthDes);

    } else {
        $("#jobSkillName").val("").trigger("change");
        $("#jobSkillDescription").val("").trigger("change");
        $("#jobSkillColor").val("").trigger("change");

        $("#createdTime").val(moment().format("DD/MM/YYYY HH:mm:ss"));
    }


    $("#jobSkillModalTitle").text(id > 0 ? "Cập nhật kỹ năng" : "Thêm mới kỹ năng");
    $("#loading").removeClass("show");
    $("#jobSkillModal").modal("show");

}

async function getItemById(id) {
    //return (await $.ajax({
    //    url: systemConfig.defaultAPIURL + "api/job-skill/detail/" + id,
    //    type: "GET",
    //    success: function (responseData) {
    //    },
    //    error: function (e) {
    //        swal.fire(
    //            'Loại kỹ năng',
    //            'không thể cập nhật kỹ năng, hãy kiểm tra lại thông tin.',
    //            'error'
    //        );
    //    },
    //})).resources;
    await $.ajax({
        url: systemConfig.defaultAPIURL + "api/job-skill/detail/" + id,
        type: "GET",
        success: function (responseData) {
            updatingObj = responseData.resources;
        },
        error: function (e) {
            swal.fire(
                'Loại kỹ năng',
                'Đã có lỗi xảy ra, hãy kiểm tra lại thông tin.',
                'error'
            );
        },
    })
}

function loadData() {
    $.ajax({
        url: systemConfig.defaultAPIURL + "api/job-skill/list",
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
        //showItem.forEach(function (key) {
        //    if (item[key]) {
        //        if (key == "createdTime") {
        //            rowContent += "<td class=' row-" + item.id + "-column column-" + key + "' property='" + key + "'>" + moment(item[key], "YYYY-MM-DD hh:mm:ss").format("DD/MM/YYYY hh:mm:ss") + "</td>"
        //        }
        //        else {
        //            rowContent += "<td class='row" + item.id + "-column column-" + key + "' property='" + key + "'>" + item[key] + "</td>";
        //        }
        //    }
        //    else {
        //        rowContent += "<td class='row" + item.id + "-column column-" + key + "' property='" + key + "'>" + "</td>";
        //    }
        //})
        rowContent += "<td>" + item.name + "</td>";
        rowContent += "<td>" + (item.description != null ? item.description : "") + "</td>";
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
    await getItemById(id);
    swal.fire({
        title: 'Xóa kỹ năng',
        html: 'Bạn có chắc chắn muốn xóa kỹ năng <b>' + updatingObj.name + '</b>?',
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
                url: systemConfig.defaultAPIURL + "api/job-skill/delete?id=" + id,
                type: "DELETE",
                success: function (response) {
                    $("#loading").removeClass("show");
                    if (response.isSucceeded) {
                        Swal.fire(
                            'Xóa loại kỹ năng',
                            'Loại kỹ năng <b>' + updatingObj.name + ' </b> đã được xóa thành công.',
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
                                    'Kỹ năng <p class="swal__admin__subtitle"> Xóa không thành công </p>',
                                    contentError,
                                    'warning'
                                );
                            } else {
                                Swal.fire(
                                    'Lưu ý',
                                    res.message,
                                    'warning'
                                )
                            }
                        }
                        else {
                            Swal.fire(
                                'Lưu ý',
                                res.message,
                                'warning'
                            )
                        }
                    }
                },
                error: function (e) {
                    $("#loading").removeClass("show");
                    if (e.status === 401) {
                        Swal.fire(
                            'Loại kỹ năng',
                            'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                            'error'
                        ).then(function () {
                            window.location.href = "/home/login";
                        });
                    }
                    else if (e.status == 403) {
                        Swal.fire(
                            'Loại kỹ năng',
                            'Bạn không có quyền sử dụng tính năng này.',
                            'error'
                        );
                    }
                    else {
                        Swal.fire(
                            'Xóa kỹ năng',
                            'Xóa kỹ năng không thành công, <br> vui lòng thử lại sau!',
                            'error'
                        );
                    }

                }
            })
        }
    })
}

function validateJobSkill() {
    var errorList = [];
    if ($("#jobSkillName").val().length == 0) {
        errorList.push("Tên không được bỏ trống.");
    } else if ($("#jobSkillName").val().length > 255) {
        errorList.push("Tên không được dài quá 255 ký tự.");
    }
    if ($("#jobSkillDescription").val().length > 500) {
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
            'Loại kỹ năng' + swalSubTitle,
            contentError,
            'warning'
        );
    } else {
        submit();
    }
}

function submit() {
    var obj = {
        name: ($("#jobSkillName").val() != '' ? $("#jobSkillName").val().trim() : ""),
        description: ($("#jobSkillDescription").val() != '' ? $("#jobSkillDescription").val() : ""),
    }

    if (updatingId > 0) {
        obj.id = updatingId;
    }

    var actionName = (updatingId > 0 ? "Cập nhật" : "Thêm mới");

    swal.fire({
        title: actionName + " kỹ năng",
        html: "Bạn có chắc chắn muốn " + actionName.toLowerCase() + " kỹ năng <b>" + $("#jobSkillName").val() + '</b>?',
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
                    url: systemConfig.defaultAPIURL + "api/job-skill/update",
                    type: "PUT",
                    contentType: "application/json",
                    data: JSON.stringify(obj),
                    success: function (response) {
                        $("#loading").removeClass("show");

                        // debugger;
                        if (response.isSucceeded) {
                            Swal.fire(
                                'Cập nhật kỹ năng',
                                'Loại kỹ năng <b>' + $("#jobSkillName").val() + '</b> đã được cập nhật thành công.',
                                'success'
                            ).then((result) => {
                                $("#jobSkillModal").modal("hide");
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
                                        'Kỹ năng <p class="swal__admin__subtitle"> Cập nhật không thành công </p>',
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
                                'Loại kỹ năng',
                                'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                                'error'
                            ).then(function () {
                                window.location.href = "/home/login";
                            });
                        }
                        else if (e.status == 403) {
                            Swal.fire(
                                'Loại kỹ năng',
                                'Bạn không có quyền sử dụng tính năng này.',
                                'error'
                            );
                        }
                        else {
                            swal.fire(
                                'Loại kỹ năng',
                                'không thể cập nhật kỹ năng, hãy kiểm tra lại thông tin.',
                                'error'
                            );
                        }

                    }
                });
            };

            //CALL AJAX TO CREATE
            if (updatingId == 0) {
                $.ajax({
                    url: systemConfig.defaultAPIURL + "api/job-skill/add",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(obj),
                    success: function (response) {
                        $("#loading").removeClass("show");

                        if (response.isSucceeded) {
                            Swal.fire(
                                'Thêm mới kỹ năng',
                                'Loại kỹ năng <b>' + $("#jobSkillName").val() + '</b> đã được thêm mới thành công.',
                                'success'
                            ).then(function () {
                                $("#jobSkillModal").modal("hide");
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
                                        'Kỹ năng <p class="swal__admin__subtitle"> Thêm mới không thành công </p>',
                                        contentError,
                                        'warning'
                                    );
                                } else {
                                    Swal.fire(
                                        'Lưu ý',
                                        res.message,
                                        'warning'
                                    )
                                }
                            }
                            else {
                                Swal.fire(
                                    'Lưu ý',
                                    res.message,
                                    'warning'
                                )
                            }
                        }
                    },
                    error: function (e) {
                        $("#loading").removeClass("show");
                        if (e.status === 401) {
                            Swal.fire(
                                'Quản lý kỹ năng',
                                'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                                'error'
                            ).then(function () {
                                window.location.href = "/home/login";
                            });
                        }
                        else if (e.status == 403) {
                            Swal.fire(
                                'Quản lý kỹ năng',
                                'Bạn không có quyền sử dụng tính năng này.',
                                'error'
                            );
                        }
                        else {

                            Swal.fire(
                                'Quản lý kỹ năng',
                                'Không thể thêm mới kỹ năng, hãy kiểm tra lại thông tin.',
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
    table.column(1).search($("#searchJobSkillName").val());
    table.column(2).search($("#searchJobSkillDescription").val());
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