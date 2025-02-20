/**
 * Author: ThanhND
 * CreatedTime : 09/08/2024
 */
var linked1, linked2, linked1_1, linked2_1;
var linked3;
var dataSource = [];
var roleSource = [];
var showItem = ["userName", "roles", "email", "phone", "createdTime"];
var updatingObj = {};
var table;
var updattingObjESPEB = {};
var arrTempBenefit = [];
var updatingIdESPED = 0;
$(document).ready(function () {
    loadData();
    loadDataESPEB();
    loadDataServicePackageType();
    loadDataServicePackageGroup();

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
        validateEmployerServicePackage();
    })

    $("#form-submit-employer-service-package").on("submit", function (e) {
        e.preventDefault();
        validateEmployerServicePackage();
    })

    $("#tableServiceAndBenefit tbody").on("click", ".checkIsApproved", function () {
        quickDisplay($(this).is(":checked"), $(this).attr("data-id"));
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

    $("#employerBenefitId").select2();

    $("#btnTableResetSearch").click(function () {
        $("#searchEmployerServicePackageName").val("");
        $("#searchEmployerServicePackageDescription").val("");
        $("#searchEmployerServicePackageGroup").val('').trigger('change');
        $("#searchEmployerServicePackageType").val('').trigger('change');
        $("#fillter_startDate_value").val("");
        $("#fillter_endDate_value").val("");
        $("#fillter_startDate_value_1").val("");
        $("#fillter_endDate_value_1").val("");
        linked1.clear();
        linked2.clear();
        linked1_1.clear();
        linked2_1.clear();
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


    //search hạn giảm giá
    const linkedPicker1Element_1 = document.getElementById("fillter_startDate_1");
    linked1_1 = new tempusDominus.TempusDominus(linkedPicker1Element_1, datePickerOption);
    linked2_1 = new tempusDominus.TempusDominus(document.getElementById("fillter_endDate"), datePickerOption);
    // updateOption
    linked2_1.updateOptions({
        useCurrent: false,
    });
    //using event listeners
    linkedPicker1Element_1.addEventListener(tempusDominus.Namespace.events.change, (e) => {
        var minDate = $("#fillter_startDate_value_1").val() == "" ? undefined : new Date(moment(e.detail.date).add(-1, "d"));
        linked2_1.updateOptions({
            restrictions: {
                minDate: minDate
            },
        });
    });
    //using subscribe method
    const subscription_1 = linked2_1.subscribe(tempusDominus.Namespace.events.change, (e) => {
        var maxdate = $("#fillter_endDate_value_1").val() == "" ? undefined : new Date(moment(e.date).add(1, "d"));
        linked1.updateOptions({
            restrictions: {
                maxDate: maxdate
            },
        });
    });

    //const pickerDiscountEndate = new tempusDominus.TempusDominus(document.getElementById('div_discountEndDate'));
    //linked3 = new tempusDominus.TempusDominus(pickerDiscountEndate, datePickerOption);
    linked3 = new tempusDominus.TempusDominus(document.getElementById("div_discountEndDate"), {
        display: {
            icons: {
                time: "bi bi-alarm",
                date: "bi bi-calendar-date",
                up: "bi bi-arrow-up",
                down: "bi bi-arrow-down",
                previous: "bi bi-arrow-left",
                next: "bi bi-arrow-right",
                today: "bi bi-calendar-check",
                clear: "bi bi-calendar-x",
                close: "bi bi-x",
            },
            buttons: {
                today: true,
                clear: true,
                close: true,
            },
        }
    });


    $("#btnAddBenefit").click(function () {
        editItemBenefit(0);
    });

    $("#tableServiceAndBenefit").on("click", ".btn-admin-edit", function () {
        var id = parseInt($(this).attr("data-idItem"));
        editItemBenefit(id);
    })

    $("#tableServiceAndBenefit").on("click", ".btn-admin-delete", function () {
        var id = parseInt($(this).attr("data-idItem"));
        deleteItemBenefit(id);
    })


})
$("#employerServicePackageModal").on('shown.bs.modal', function () {
    $(this).find('.nav-tabs a:first').tab('show');
    autosize.destroy($('#employerServicePackageDescription'));
    autosize($('#employerServicePackageDescription'));
})
$("#employerServicePackageModal").on('hiden.bs.modal', function () {
    $(this).find('.nav-tabs a:first').tab('show');
    autosize.destroy($('#employerServicePackageDescription'));
})
function loadDataESPEB() {
    $.ajax({
        url: systemConfig.defaultAPIURL + "api/benefit/list",
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            //console.log(response)
            //dataSource = response.resources;
            if (response.isSucceeded) {
                if (response.resources.length > 0) {
                    response.resources.forEach(function (item, index) {
                        //console.log(item);

                        $('#employerBenefitId').append(new Option(item.name, item.id, false, false)).trigger('change');

                    })
                }
            }

        },
        error: function (e) {
        }
    });
}
async function editItemBenefit(id) {
    //let arrBenefitId = [];
    //if (dataESPEB.length > 0) {
    //    dataESPEB.forEach(function (item) {
    //        arrBenefitId.push(item.employerBenefitId);
    //    })
    //}
    //$("#employerBenefitId").empty()
    //if (arrBenefitId.length > 0 || id > 0) {
    //    $.ajax({
    //        url: systemConfig.defaultAPIURL + "api/employer-benefit/list-exept",
    //        type: "POST",
    //        contentType: "application/json",
    //        data: JSON.stringify(arrBenefitId),
    //        success: function (response) {
    //            //console.log(response)
    //            //dataSource = response.resources;
    //            if (response.resources.length > 0) {
    //                response.resources.forEach(function (item, index) {
    //                    //console.log(item);

    //                    $('#employerBenefitId').append(new Option(item.name, item.id, false, false)).trigger('change');

    //                })
    //            }


    //        },
    //        error: function (e) {
    //        }
    //    });
    //}
    //else {

    //}
    updatingIdESPED = id;
    if (id > 0) {
        await getItemESPEBById(id);
        if (updattingObjESPEB != null && updattingObjESPEB != undefined) {
            $("#employerBenefitId").val(updattingObjESPEB.benefitId).trigger('change');
            $("#benefitValue").val(updattingObjESPEB.value);
            $("#ESPEBDescription").val(updattingObjESPEB.description);
            $("#ESPEBCreatedTime").val(moment(updattingObjESPEB.createdTime).format("DD/MM/YYYY HH:mm:ss"))
        }
        $("#benefitModalTitle").text("Cập nhật quyền lợi")
    }
    else {
        $("#employerBenefitId").val(null).trigger('change');
        $("#benefitValue").val("");
        $("#ESPEBDescription").val("");
        $("#ESPEBCreatedTime").val(moment().format("DD/MM/YYYY HH:mm:ss"))
        $("#benefitModalTitle").text("Thêm mới quyền lợi")
    }

    $("#benefitModal").modal('show')
}


async function editItem(id) {
    updatingId = id;
    $("#employerServicePackageModal").find('.nav-tabs a:first').tab('show');

    autosize.destroy($('#employerServicePackageDescription'));
    autosize($('#employerServicePackageDescription'));


    $("#loading").addClass("show");
    $(".nav-item-2").removeClass('d-none')
    if (id > 0) {
        await getItemById(updatingId);

        if (updatingObj != null && updatingObj != undefined) {
            //set value obj to form
            //console.log(updatingObj);
            $("#employerServicePackageName").val(updatingObj.name).trigger("change");
            $("#employerServicePackagePrice").val(updatingObj.price).trigger("change");
            $("#employerServicePackageDiscountPrice").val(updatingObj.discountPrice).trigger("change");
            $("#employerServicePackageDiscountEndDate").val(updatingObj.discountEndDate != null && updatingObj.discountEndDate != "" ? moment(updatingObj.discountEndDate).format("HH:mm DD/MM/YYYY") : "").trigger("change");
            $("#employerServicePackageExpiryTime").val(updatingObj.expiryTime).trigger("change");
            $("#employerServicePackageDescription").val(updatingObj.description).trigger("change");
            $("#createdTime").val(moment(updatingObj.createdTime).format("DD/MM/YYYY HH:mm:ss"));
            $("#employerServicePackageGroup").val(updatingObj.servicePackageGroupId).trigger('change');
            $("#employerServicePackageType").val(updatingObj.servicePackageTypeId).trigger('change');
            //dành cho tab bên cạnh
            //await getEmployerServicePackageEmployerBenefitByEmployerServicePackageId(updatingId);
            await getServicePackageBenefit(updatingId)
            if (dataESPEB != null && dataESPEB != undefined) {
                reGenTableESPEB();
            }
        }
        else {
            $("#loading").removeClass("show");

            swal.fire(
                'gói dịch vụ',
                'không thể cập nhật gói dịch vụ, hãy kiểm tra lại thông tin.',
                'error'
            );
        }
        //var strLengthDes = $("#employerServicePackageDescription").val().split('\n').length;
        //$("#employerServicePackageDescription").attr('rows', strLengthDes < 2 ? 2 : strLengthDes);

    } else {
        $(".nav-item-2").addClass('d-none')

        $("#employerServicePackageName").val("").trigger("change");
        $("#employerServicePackagePrice").val("").trigger("change");
        $("#employerServicePackageDiscountPrice").val("").trigger("change");
        $("#employerServicePackageDiscountEndDate").val("").trigger("change");
        $("#employerServicePackageExpiryTime").val("").trigger("change");
        $("#employerServicePackageName").val("").trigger("change");
        $("#employerServicePackageDescription").val("").trigger("change");
        $("#employerServicePackageColor").val("").trigger("change");

        $("#createdTime").val(moment().format("DD/MM/YYYY HH:mm:ss"));
        dataESPEB = [];
        reGenTableESPEB();
    }


    $("#employerServicePackageModalTitle").text(id > 0 ? "Cập nhật gói dịch vụ" : "Thêm mới gói dịch vụ");
    $("#loading").removeClass("show");
    $("#employerServicePackageModal").modal("show");

}

async function getItemById(id) {
    //return (await $.ajax({
    //    url: systemConfig.defaultAPIURL + "api/employer-service-package/detail/" + id,
    //    type: "GET",
    //    success: function (responseData) {
    //    },
    //    error: function (e) {
    //    },
    //})).resources;

    await $.ajax({
        url: systemConfig.defaultAPIURL + "api/employer-service-package/detail/" + id,
        type: "GET",
        success: function (responseData) {
            if (responseData.isSucceeded) {
                updatingObj = responseData.resources;
            }
        },
        error: function (e) {
            $("#loading").removeClass("show");

            swal.fire(
                'gói dịch vụ',
                'Đã có lỗi xảy ra, hãy kiểm tra lại thông tin.',
                'error'
            );
        },
    })
}

async function getItemESPEBById(id) {
    try {
        let res = await httpService.getAsync('api/service-package-benefit/detail/' + id);
        if (res.isSucceeded) {
            //console.log(res.resources);
            updattingObjESPEB = res.resources;
        }
        else {
            console.error(res);

        }
    } catch (e) {
        console.error(e);
    }
}
function loadData() {
    $.ajax({
        url: systemConfig.defaultAPIURL + "api/employer-service-package/list-aggregate",
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            if (response.isSucceeded) {
                dataSource = response.resources;
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
            [7, 'desc']
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
        rowContent += "<td>" + item.name + "</td>";
        rowContent += "<td><span class='d-none'>" + item.servicePackageGroupId+ "</span>" + item.servicePackageGroupName + "</td>";
        rowContent += "<td><span class='d-none'>" + item.servicePackageTypeId + "</span>" + item.servicePackageTypeName + "</td>";
        rowContent += "<td class='column-price'>" + formatNumberToString(item.price) + "</td>";
        rowContent += "<td class='column-price'>" + formatNumberToString(item.discountPrice) + "</td>";
        rowContent += `<td data-sort="${moment(item.discountEndDate).format("YYYYMMDDHHmmss")}">${(item.discountEndDate != null ? moment(item.discountEndDate, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm:ss") : "")}</td>`;
        //rowContent += "<td class='colum-price'>" + item.expiryTime + "</td>";
        rowContent += `<td data-sort="${moment(item.createdTime).format("YYYYMMDDHHmmss")}">${moment(item.createdTime, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm:ss")}</td>`;
        rowContent += "<td class='row" + item.id + "-column column-' property=''>"
            + "<div class='d-flex justify-content-center'>";

        rowContent += "<button  type='button' class='btn btn-icon btn-admin-edit' data-idItem='" + item.id + "'><span class='svg-icon-primary svg-icon  svg-icon-1'> " + systemConfig.editIcon + " </span></button>"

        rowContent += "<button type='button' class='btn btn-icon btn-admin-delete' data-idItem='" + item.id + "' ><span class='svg-icon-danger svg-icon  svg-icon-1'>" + systemConfig.deleteIcon + "</span></button></div>";

        rowContent += "</div></td ></tr>";
        $(rowContent).appendTo($("#tableData tbody"));
    })
}

function deleteItemBenefit(id) {
    swal.fire({
        title: 'Xóa gói quyền lợi gói dịch vụ',
        html: 'Bạn có chắc chắn muốn xóa quyền lợi gói dịch vụ?',
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
                url: systemConfig.defaultAPIURL + "api/employer-service-package-employer-benefit/delete?id=" + id,
                type: "DELETE",
                success: async function (response) {
                    $("#loading").removeClass("show");
                    if (response.isSucceeded) {
                        Swal.fire(
                            'Xóa quyền lợi gói dịch vụ',
                            'Quyền lợi gói dịch vụ <b>' + updatingObj.name + ' </b> đã được xóa thành công.',
                            'success'
                        );
                        //await getEmployerServicePackageEmployerBenefitByEmployerServicePackageId(updatingId);
                        await getServicePackageBenefit(updatingId)
                        reGenTableESPEB();
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
                                    'gói dịch vụ <p class="swal__admin__subtitle"> Xóa không thành công </p>',
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
                            'gói dịch vụ',
                            'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                            'error'
                        ).then(function () {
                            window.location.href = "/home/login";
                        });
                    }
                    else if (e.status == 403) {
                        Swal.fire(
                            'gói dịch vụ',
                            'Bạn không có quyền sử dụng tính năng này.',
                            'error'
                        );
                    }
                    else {
                        Swal.fire(
                            'Xóa gói dịch vụ',
                            'Xóa gói dịch vụ không thành công, <br> vui lòng thử lại sau!',
                            'error'
                        );
                    }

                }
            })
        }
    })
}

function validateEmployerServicePackage() {
    var errorList = [];
    if ($("#employerServicePackageName").val().length == 0) {
        errorList.push("Tên không được bỏ trống.");
    } else if ($("#employerServicePackageName").val().length > 255) {
        errorList.push("Tên không được dài quá 255 ký tự.");
    }
    if ($("#employerServicePackageDescription").val().length > 500) {
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
            'gói dịch vụ' + swalSubTitle,
            contentError,
            'warning'
        );
    } else {
        submit();
    }
}

function submit() {
    var obj = {
        name: ($("#employerServicePackageName").val() != '' ? $("#employerServicePackageName").val().trim() : ""),
        price: $("#employerServicePackagePrice").val().replaceAll(',', ''),
        discountPrice: $("#employerServicePackageDiscountPrice").val() != "" ? $("#employerServicePackageDiscountPrice").val().replaceAll(',', '') : 0,
        discountEndDate: ($("#employerServicePackageDiscountEndDate").val() != "" ? moment($("#employerServicePackageDiscountEndDate").val(), "HH:mm DD/MM/YYYY").format("YYYY-MM-DD HH:mm:ss") : ""),
        expiryTime: $("#employerServicePackageExpiryTime").val(),
        description: ($("#employerServicePackageDescription").val() != '' ? $("#employerServicePackageDescription").val() : ""),
        servicePackageGroupId: $("#employerServicePackageGroup").val(),
        servicePackageTypeId: $("#employerServicePackageType").val()
    }
    console.log(obj)
    if (updatingId > 0) {
        obj.id = updatingId;
    }

    var actionName = (updatingId > 0 ? "Cập nhật" : "Thêm mới");

    swal.fire({
        title: actionName + " gói dịch vụ",
        html: "Bạn có chắc chắn muốn " + actionName.toLowerCase() + " gói dịch vụ <b>" + $("#employerServicePackageName").val() + '</b>?',
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
                    url: systemConfig.defaultAPIURL + "api/employer-service-package/update",
                    type: "PUT",
                    contentType: "application/json",
                    data: JSON.stringify(obj),
                    success: function (response) {
                        $("#loading").removeClass("show");
                        // debugger;
                        if (response.isSucceeded) {
                            Swal.fire(
                                'Cập nhật gói dịch vụ',
                                'gói dịch vụ <b>' + $("#employerServicePackageName").val() + '</b> đã được cập nhật thành công.',
                                'success'
                            ).then((result) => {
                                $("#employerServicePackageModal").modal("hide");
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
                                        'gói dịch vụ <p class="swal__admin__subtitle"> Cập nhật không thành công </p>',
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
                                'gói dịch vụ',
                                'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                                'error'
                            ).then(function () {
                                window.location.href = "/home/login";
                            });
                        }
                        else if (e.status == 403) {
                            Swal.fire(
                                'gói dịch vụ',
                                'Bạn không có quyền sử dụng tính năng này.',
                                'error'
                            );
                        }
                        else {
                            swal.fire(
                                'gói dịch vụ',
                                'không thể cập nhật gói dịch vụ, hãy kiểm tra lại thông tin.',
                                'error'
                            );
                        }

                    }
                });
            };

            //CALL AJAX TO CREATE
            if (updatingId == 0) {
                $.ajax({
                    url: systemConfig.defaultAPIURL + "api/employer-service-package/add",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(obj),
                    success: function (response) {
                        $("#loading").removeClass("show");

                        if (response.isSucceeded) {
                            Swal.fire(
                                'Thêm mới gói dịch vụ',
                                'gói dịch vụ <b>' + $("#employerServicePackageName").val() + '</b> đã được thêm mới thành công.',
                                'success'
                            ).then(function () {
                                $("#employerServicePackageModal").modal("hide");
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
                                        'gói dịch vụ <p class="swal__admin__subtitle"> Thêm mới không thành công </p>',
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
                                'Quản lý gói dịch vụ',
                                'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                                'error'
                            ).then(function () {
                                window.location.href = "/home/login";
                            });
                        }
                        else if (e.status == 403) {
                            Swal.fire(
                                'Quản lý gói dịch vụ',
                                'Bạn không có quyền sử dụng tính năng này.',
                                'error'
                            );
                        }
                        else {

                            Swal.fire(
                                'Quản lý gói dịch vụ',
                                'Không thể thêm mới gói dịch vụ, hãy kiểm tra lại thông tin.',
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
    table.column(1).search($("#searchEmployerServicePackageName").val());
    //table.column(2).search($("#searchEmployerServicePackageGroup").val().toString());
    //table.column(3).search($("#searchEmployerServicePackageType").val().toString());
    table.column(4).search($("#searchEmployerServicePackagePrice").val());
    table.column(5).search($("#searchEmployerServicePackageDiscountPrice").val());
    table.draw();
}

$.fn.dataTable.ext.search.push(
    function (settings, data, dataIndex) {
        var date = new Date(moment(data[8], "DD/MM/YYYY HH:mm:ss"));
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

$.fn.dataTable.ext.search.push(
    function (settings, data, dataIndex) {
        var date = new Date(moment(data[7], "DD/MM/YYYY HH:mm:ss"));
        var startDate = $("#fillter_startDate_value_1").val();
        var endDate = $("#fillter_endDate_value_1").val();
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


$.fn.dataTable.ext.search.push(
    function (settings, data, dataIndex) {
        var columnSearch = data[2];
        var dataSearch = $("#searchEmployerServicePackageGroup").val();
        if (dataSearch.length == 0) {
            return true;
        }
        for (let i = 0; i < dataSearch.length; i++) {
            if (columnSearch.includes(dataSearch[i].toString())) {
                return true;
            }
        }
        return false;
    }
);

$.fn.dataTable.ext.search.push(
    function (settings, data, dataIndex) {
        var columnSearch = data[3];
        var dataSearch = $("#searchEmployerServicePackageType").val();
        if (dataSearch.length == 0) {
            return true;
        }

        for (let i = 0; i < dataSearch.length; i++) {
            if (columnSearch.includes(dataSearch[i].toString())) {
                return true;
            }
        }
        return false;
    }
);

var dataESPEB = [];
//async function getEmployerServicePackageEmployerBenefitByEmployerServicePackageId(id) {
//    try {
//        let res = await httpService.getAsync('api/employer-service-package-employer-benefit/list-by-employer-service-package-id/' + id);
//        if (res.isSucceeded) {
//            dataESPEB = res.resources;
//        }
//        else {
//            console.error(res);

//        }
//    } catch (e) {
//        console.error(e);
//    }
//}

async function getServicePackageBenefit(id) {
    try {
        let res = await httpService.getAsync('api/service-package-benefit/list-by-service-package-id/' + id);
        if (res.isSucceeded) {
            dataESPEB = res.resources;
        }
        else {
            console.error(res);

        }
    } catch (e) {
        console.error(e);
    }
}

var tableESPEB;
function reGenTableESPEB() {

    if (tableESPEB != null) {
        tableESPEB.destroy();
    }
    $("#tableServiceAndBenefit tbody").html('');
    loadTableESPEB();
}
function loadTableESPEB() {
    $("#tableServiceAndBenefit tbody").html("");
    if (dataESPEB != null) {
        dataESPEB.forEach(function (item, index) {
            var rowContent = "<tr>";
            rowContent += "<td class='column-index' style='text-align: center;'>" + (index + 1) + "</td>";
            rowContent += "<td>" + item.benefitName + "</td>";
            rowContent += "<td>" + (item.value != null && item.value != "" ? item.value : "") + "</td>";
           
            rowContent += "<td class='column-dateTime'>" + moment(item.createdTime).format("DD/MM/YYYY HH:mm:ss") + "</td>";
            rowContent += "<td class='row" + item.id + "-column column-' property=''>"
                + "<div class='d-flex justify-content-center'>";

            rowContent += "<button  type='button' class='btn btn-icon btn-admin-edit' data-idItem='" + item.id + "'><span class='svg-icon-primary svg-icon  svg-icon-1'> " + systemConfig.editIcon + " </span></button>"

            rowContent += "<button type='button' class='btn btn-icon btn-admin-delete' data-idItem='" + item.id + "' ><span class='svg-icon-danger svg-icon  svg-icon-1'>" + systemConfig.deleteIcon + "</span></button></div>";
            rowContent += "</td></tr>";
            $(rowContent).appendTo($("#tableServiceAndBenefit tbody"));
        })
    }
    initTableESPEB();
}
function initTableESPEB() {
    tableESPEB = $('#tableServiceAndBenefit').DataTable({
        language: systemConfig.languageDataTable,
        searching: {
            regex: true
        },
        autoWidth: false,

        columnDefs: [
            { targets: "no-sort", orderable: false },
            { targets: [0], orderable: false },
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
            $('#tableServiceAndBenefit tfoot').html("");
            $("#tableServiceAndBenefit thead:nth-child(1) tr").clone(true).appendTo("#tableServiceAndBenefit tfoot");
        }
    });

    tableESPEB.on('order.dt search.dt', function () {
        tableESPEB.column(0, {
            search: 'applied',
            order: 'applied'
        }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();
}


function validateESPEB() {
    var errorList = [];
    if (dataESPEB.length > 0) {
        dataESPEB.forEach(function (item) {
            arrTempBenefit.push(item.benefitId);
        })
    }
    if ($("#employerBenefitId").val().length == 0) {
        errorList.push("Quyền lợi không được bỏ trống.");
    }
    if (updatingIdESPED == 0 && arrTempBenefit.includes(parseInt($("#employerBenefitId").val()))) {
        errorList.push("gói dịch vụ đã có quyền lợi này rồi.");

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
            'gói dịch vụ' + swalSubTitle,
            contentError,
            'warning'
        );
    } else {
        submitESPEB();
    }
}
async function submitESPEB() {
    var obj = {
        employerServicePackageId: updatingId,
        benefitId: $("#employerBenefitId").val(),
        value: $("#benefitValue").val(),
        description: $("#ESPEBDescription").val(),
    }
    
    if (updatingIdESPED > 0) {
        obj.id = updatingIdESPED;
    }

    var actionName = (updatingIdESPED > 0 ? "Cập nhật" : "Thêm mới");

    swal.fire({
        title: actionName + " quyền lợi cho gói dịch vụ",
        html: "Bạn có chắc chắn muốn " + actionName.toLowerCase() + " quyền lợi cho gói dịch vụ ?",
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
            if (updatingIdESPED > 0) {
                $.ajax({
                    url: systemConfig.defaultAPIURL + "api/service-package-benefit/update",
                    type: "PUT",
                    contentType: "application/json",
                    data: JSON.stringify(obj),
                    success: async function (response) {
                        $("#loading").removeClass("show");
                        // debugger;
                        if (response.isSucceeded) {
                            Swal.fire(
                                'Cập nhật quyền lợi cho gói dịch vụ',
                                'Quyền lợi đã được cập nhật thành công.',
                                'success'
                            ).then((result) => {
                                $("#benefitModal").modal("hide");
                                
                            });
                            //await getEmployerServicePackageEmployerBenefitByEmployerServicePackageId(updatingId);
                            await getServicePackageBenefit(updatingId)

                            reGenTableESPEB();
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
                                        'Quyền lợi cho gói dịch vụ <p class="swal__admin__subtitle"> Cập nhật không thành công </p>',
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
                                'Quyền lợi cho gói dịch vụ',
                                'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                                'error'
                            ).then(function () {
                                window.location.href = "/home/login";
                            });
                        }
                        else if (e.status == 403) {
                            Swal.fire(
                                'Quyền lợi cho gói dịch vụ',
                                'Bạn không có quyền sử dụng tính năng này.',
                                'error'
                            );
                        }
                        else {
                            swal.fire(
                                'Quyền lợi cho gói dịch vụ',
                                'không thể cập nhật quyền lợi cho gói dịch vụ, hãy kiểm tra lại thông tin.',
                                'error'
                            );
                        }

                    }
                });
            };

            //CALL AJAX TO CREATE
            if (updatingIdESPED == 0) {
                $.ajax({
                    url: systemConfig.defaultAPIURL + "api/service-package-benefit/add",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(obj),
                    success: async function (response) {
                        $("#loading").removeClass("show");

                        if (response.isSucceeded) {
                            Swal.fire(
                                'Thêm mới quyền lợi gói dịch vụ',
                                'Quyền lợi gói dịch vụ đã được thêm mới thành công.',
                                'success'
                            ).then(function () {
                                $("#benefitModal").modal("hide");
                                //window.location.reload();
                                

                            });
                            //await getEmployerServicePackageEmployerBenefitByEmployerServicePackageId(updatingId);
                            await getServicePackageBenefit(updatingId)
                            reGenTableESPEB();
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
                                        'Quyền lợi gói dịch vụ <p class="swal__admin__subtitle"> Thêm mới không thành công </p>',
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
                                'Quyền lợi gói dịch vụ',
                                'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                                'error'
                            ).then(function () {
                                window.location.href = "/home/login";
                            });
                        }
                        else if (e.status == 403) {
                            Swal.fire(
                                'Quyền lợi gói dịch vụ',
                                'Bạn không có quyền sử dụng tính năng này.',
                                'error'
                            );
                        }
                        else {

                            Swal.fire(
                                'Quyền lợi gói dịch vụ',
                                'Không thể thêm mới gói dịch vụ, hãy kiểm tra lại thông tin.',
                                'error'
                            );
                        }
                    }
                });
            }
        }
    });

}

async function deleteItem(id) {
    await getItemById(id);
    swal.fire({
        title: 'Xóa gói dịch vụ',
        html: 'Bạn có chắc chắn muốn xóa gói dịch vụ <b>' + updatingObj.name + '</b>?',
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
                url: systemConfig.defaultAPIURL + "api/employer-service-package/delete?id=" + id,
                type: "DELETE",
                success: function (response) {
                    $("#loading").removeClass("show");
                    if (response.isSucceeded) {
                        Swal.fire(
                            'Xóa gói dịch vụ',
                            'gói dịch vụ <b>' + updatingObj.name + ' </b> đã được xóa thành công.',
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
                                    'gói dịch vụ <p class="swal__admin__subtitle"> Xóa không thành công </p>',
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
                            'gói dịch vụ',
                            'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                            'error'
                        ).then(function () {
                            window.location.href = "/home/login";
                        });
                    }
                    else if (e.status == 403) {
                        Swal.fire(
                            'gói dịch vụ',
                            'Bạn không có quyền sử dụng tính năng này.',
                            'error'
                        );
                    }
                    else {
                        Swal.fire(
                            'Xóa gói dịch vụ',
                            'Xóa gói dịch vụ không thành công, <br> vui lòng thử lại sau!',
                            'error'
                        );
                    }

                }
            })
        }
    })
}

$("#submitButtonESPEB").click(function (e) {
    e.preventDefault();
    validateESPEB();
})

async function quickDisplay(isApproved, id) {
    var titleName = "Quyền lợi gói dịch vụ";
    var actionName = isApproved ? "hiển thị" : "không hiển thị";
    await getItemById(id);
    var obj = { "id": id, "IsApproved": isApproved }
    Swal.fire({
        title: titleName,
        html: "Bạn có chắc chắn muốn " + actionName + " quyền lợi này không?",
        icon: 'info',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#443',
        cancelButtonText: 'Hủy',
        confirmButtonText: 'Lưu',
        showCancelButton: true
    }).then((result) => {
        if (result.isConfirmed) {
            $("#loading").addClass('show');

            //CALL AJAX TO UPDATE
            $.ajax({
                url: systemConfig.defaultAPIURL + "api/employer-service-package-employer-benefit/update-has-benefit/" + id,
                type: "PUT",
                contentType: "application/json",
                success: function (response) {
                    $("#loading").removeClass('show');
                    if (response.isSucceeded) {
                        Swal.fire(
                            'Hiển thị quyền lợi',
                            'Đã hiển thị quyền lợi thành công.',
                            'success'
                        );
                        
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
                                    'Quyền lợi gói dịch vụ <p class="swal__admin__subtitle"> Kích hoạt không thành công </p>',
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
                    //console.log(e)
                    $("#loading").removeClass('show');
                    if (e.status === 401) {
                        Swal.fire(
                            'Quyền lợi gói dịch vụ',
                            'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                            'error'
                        ).then(function () {
                            window.location.href = "/home/login";
                        });
                    }
                    else if (e.status == 403) {
                        Swal.fire(
                            'Quyền lợi gói dịch vụ',
                            'Bạn không có quyền sử dụng tính năng này.',
                            'error'
                        );
                    }
                    else {
                        Swal.fire(
                            'Quyền lợi gói dịch vụ',
                            'Kích hoạt nhanh quyền lợi gói dịch vụ không thành công, <br> vui lòng thử lại sau!',
                            'error'
                        );
                    }


                }
            });
        }
        else {
            $(".checkIsApproved[data-id=" + id + "]").prop("checked", !isApproved);
        }
    })
}


async function loadDataServicePackageGroup() {
    try {
        let res = await httpService.getAsync('api/service-package-group/list');
        if (res.isSucceeded) {

            res.resources.forEach(function (item, index) {
                $('#searchEmployerServicePackageGroup').append(new Option(item.name, item.id, false, false));
                $('#employerServicePackageGroup').append(new Option(item.name, item.id, false, false));

            })
            $("#employerServicePackageGroup").select2();
            $("#searchEmployerServicePackageGroup").select2({
                allowClear: true,
                placeholder: "",
            });
        }
        else {
            console.error(res);

        }
    } catch (e) {
        console.error(e);
    }
}

async function loadDataServicePackageType() {
    try {
        let res = await httpService.getAsync('api/service-package-type/list');
        if (res.isSucceeded) {

            res.resources.forEach(function (item, index) {
                $('#searchEmployerServicePackageType').append(new Option(item.name, item.id, false, false));
                $('#employerServicePackageType').append(new Option(item.name, item.id, false, false));
            })
            $("#employerServicePackageType").select2();
            $("#searchEmployerServicePackageType").select2({
                placeholder : "",
                allowClear: true,
            });
        }
        else {
            console.error(res);

        }
    } catch (e) {
        console.error(e);
    }
}