/**
 * Author: ThanhND
 * CreatedTime : 03/08/2024
 */
$(document).ready(function () {
    loadData();
    loadDataCompanySize();
    loadDataCompanyServicePackage();
    loadDataAccountStatus();
    loadDataPosition();
    //loadDataExperienceRange();
    //loadDataSalaryRange();
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
        validateCouponType();
    })

    $("#form-submit-coupon-type").on("submit", function (e) {
        e.preventDefault();
        validateCouponType();
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

    $("#searchActivated").val("").trigger('change')
    $("#searchActivated").select2({
        placeholder: ""
    });
    $("#tableData tbody").on("click", ".checkIsApproved", function () {
        quickActivated($(this).is(":checked"), $(this).attr("data-id"));
    })
    $("#btnTableResetSearch").click(function () {
        $("#searchFullName").val("");
        $("#searchUserName").val("");
        $("#searchLevel").val("").trigger('change');
        $("#searchStatus").val("").trigger('change');
        $("#searchActivated").val("").trigger('change');
        $("#fillter_startDate_value").val("");
        $("#fillter_endDate_value").val("");
        linked1.clear();
        linked2.clear();
        //tableSearch();
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
    $("#companyModal").find('.nav-tabs a:first').tab('show');

    //autosize.destroy($('#companyObjective'));
    //autosize.destroy($('#companyInterests'));
    //autosize.destroy($('#companyInfo'));
    //autosize($('#companyObjective'));
    //autosize($('#companyInterests'));
    //autosize($('#companyInfo'));
    updatingId = id;
    //$("#divCompanyJobPosition").removeClass('d-none')
    //$("#divCompanyDoB").removeClass('d-none')
    //$("#divCompanyAddress").removeClass('d-none')
    $("#loading").addClass("show");
    if (id > 0) {
        await getItemById(updatingId);
        $("#isActiveVerify").removeClass('d-none')

        if (updatingObj != null && updatingObj != undefined) {

            //thông tin chung
            $("#CompanyName").text(updatingObj.name)
            $("#CompanyEmail").text(updatingObj.emailAddress)
            $("#CompanyPhone").text(formatPhoneNumber(updatingObj.phone));
            $("#companyLogo").prop("src", updatingObj.logo != null ? systemConfig.defaultStorageURL + updatingObj.logo : systemConfig.defaultStorageURL + "")
            $("#CompanyAddress").text(updatingObj.addressDetail)
            $("#CompanyWebsite").text(updatingObj.website)
            $("#CompanyTaxCode").text(updatingObj.taxCode)
            $("#foundedIn").val(updatingObj.foundedIn)
            $("#createdTime").val(moment(updatingObj.createdTime, "YYYY-MM-DDTHH:mm:ss").format("DD/MM/YYYY HH:mm:ss"))
            //MXH
            $("#tiktokLink").val(updatingObj.tiktokLink)
            $("#youtubeLink").val(updatingObj.youtubeLink)
            $("#facebookLink").val(updatingObj.facebookLink)
            $("#twitterLink").val(updatingObj.twitterLink)
            $("#linkedInLink").val(updatingObj.linkedinLink)

            //Tab nhà tuyển dụng
            $("#employerPhoto").prop("src", updatingObj.employer.photo != null ? systemConfig.defaultStorageURL + updatingObj.employer.photo : systemConfig.defaultStorageURL + "/assets/media/images/avatar1.jpg")
            $("#isActiveVerify").addClass(updatingObj.employer.isActivated ? " " : "d-none");
            $("#EmployerName").text(updatingObj.employer.fullname);
            $("#EmployerEmail").text(updatingObj.employer.email);
            $("#EmployerPhone").text(formatPhoneNumber(updatingObj.employer.phone));
            if (updatingObj.employer.skypeAccount != null && updatingObj.employer.skypeAccount != "") {
                $("#EmployerSkype").text(updatingObj.employer.skypeAccount);
            }
            else {
                $("#divEmployerSkype").addClass("d-none");
            }
            $("#selectEmployerPosition").val(updatingObj.employer.positionId).trigger('change');
            $("#selectEmployerStatus").val(updatingObj.employer.employerStatusId).trigger('change');
            $("#selectEmployerLevel").val(updatingObj.employer.employerServicePackageId).trigger('change');
            $("#employerGender").val(updatingObj.employer.gender).trigger('change');
            $("#employerServicePackageEfficiencyExpiry").val(updatingObj.employer.employerServicePackageEfficiencyExpiry != null && updatingObj.employer.employerServicePackageEfficiencyExpiry != "" ? moment(updatingObj.employer.employerServicePackageEfficiencyExpiry, "YYYY-MM-DDTHH:mm:ss").format("DD/MM/YYYY HH:mm:ss") : "");
            $("#employerCreatedTime").val(moment(updatingObj.employer.createdTime ,"YYYY-MM-DDTHH:mm:ss").format("DD/MM/YYYY HH:mm:ss"));

        }
        else {
            swal.fire(
                'Nhà tuyển dụng',
                'Không thể xem chi tiết tổ chức tuyển dụng, hãy kiểm tra lại thông tin.',
                'error'
            );
        }
    }
    $("#companyGender").select2();
    $("#companyModalTitle").text(id > 0 ? "Chi tiết tổ chức tuyển dụng" : "Thêm mới tổ chức tuyển dụng");
    $("#loading").removeClass("show");
    $("#companyModal").modal("show");
}
$("companyModal").on('shown.bs.modal', function () {
    $(this).find('.nav-tabs a:first').tab('show');
    autosize.destroy($('#companyInterests'));
    autosize.destroy($('#companyObjective'));
    autosize.destroy($('#companyInfo'));

    autosize($('#companyInterests'));
    autosize($('#companyObjective'));
    autosize($('#companyInfo'));

})
$("#companyModal").on('hiden.bs.modal', function () {
    $(this).find('.nav-tabs a:first').tab('show');
    autosize.destroy($('#companyInfo'));
    autosize.destroy($('#companyInterests'));
    autosize.destroy($('#companyObjective'));

})
async function getItemById(id) {
    try {
        let res = await httpService.getAsync('api/company/detail-admin/' + id);
        if (res.isSucceeded) {
            updatingObj = res.resources;
        }
        else {
            console.error(res);

        }
    } catch (e) {
        console.error(e);
    }
}


function loadData() {
    table = $("#tableData").DataTable({
        language: systemConfig.languageDataTable,
        processing: true,
        serverSide: true,
        paging: true,
        searching: { regex: true },
        ajax: {
            url: systemConfig.defaultAPIURL + "api/company/list-company-aggregates",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: function (d) {
                return JSON.stringify(d);
            },
        },
        columns: [
            {
                data: "id",
                render: function (data, type, row, meta) {
                    return meta.row + 1;
                }
            },
            {
                data: "logo",
                render: function (data, type, row, meta) {
                    return "<div>" + data != null && data != "" ? "<img style='width:70px; max-width: 70px; height: auto; max-height: 70px;' src='" + (systemConfig.defaultStorageURL + data) + "' />" : "<img src='" + (systemConfig.defaultStorageURL + "/images/default") +"' />" + "</div>";
                }
            },
            {
                data: "name",
                render: function (data, type, row, meta) {
                    return data;
                }
            },
            {
                data: "taxCode",
                render: function (data, type, row, meta) {
                    return data;
                }
            },
            {
                data: "addressDetail",
                render: function (data, type, row, meta) {
                    return data;
                }
            },
            {
                data: "website",
                render: function (data, type, row, meta) {
                    return data;
                }
            },


            {
                data: "createdTime",
                render: function (data, type, row, meta) {
                    return `<div class='text-center'>` + moment(data).format("DD/MM/YYYY HH:mm:ss") + `</div>`;
                }
            },
            
            {
                data: "id",
                render: function (data, type, row, meta) {
                    return `<div class='d-flex justify-content-center'>`
                        + `<button class="btn-admin-edit btn btn-icon" title='Cập nhật' data-idItem='` + data + `'><span class='svg-icon-primary svg-icon  svg-icon-1'> ` + systemConfig.editIcon + ` </span></button>`;
                    /*+ `<button class="btn-admin-delete btn btn-icon"  title='Xóa' data-idItem='` + data + `' ><span class='svg-icon-danger svg-icon  svg-icon-1'>` + systemConfig.deleteIcon + `</span></button></div>`;*/
                }
            }
        ],
        columnDefs: [

            { targets: [0, -1], orderable: false },

        ],
        'order': [
            [6, 'desc']
        ],
        drawCallback: function () {
            $('#tableData tfoot').html("");
            $("#tableData thead:nth-child(1) tr").clone(true).appendTo("#tableData tfoot");
            $("#rowSearch").removeClass("d-none");
        }

    });
    table.on('draw', function (e) {
        dataExport = table.ajax.json().allData;
    });
}

function componentToHex(c) {
    var hex = c.toString(16);
    //console.log(hex)
    return hex.length == 1 ? "0" + hex + "10" : hex + "10";
}
function colorToHex(color) {
    return color + "10";
}

function validateCouponType() {
    var errorList = [];
    if ($("#couponName").val().length == 0) {
        errorList.push("Code không được bỏ trống.");
    } else if ($("#couponName").val().length > 50) {
        errorList.push("Code không được dài quá 50 ký tự.");
    }

    if ($("#couponEffiencyTime").val().length == 0) {
        errorList.push("Thời hạn không được bỏ trống.");

    }
    else if ($("#couponEffiencyTime").val() == 0) {
        errorList.push("Thời hạn không thể bằng 0.");

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
            'Mã coupon' + swalSubTitle,
            contentError,
            'warning'
        );
    } else {
        submit();
    }
}
function submit() {
    var obj = {
        code: ($("#couponName").val() != '' ? $("#couponName").val().trim() : ""),
        couponTypeId: $("#searchCouponTypeId").val(),
        efficiencyTime: $("#couponEffiencyTime").val(),
    }

    if (updatingId > 0) {
        obj.id = updatingId;
    }

    var actionName = (updatingId > 0 ? "Cập nhật" : "Thêm mới");

    swal.fire({
        title: actionName + " mã coupon",
        html: "Bạn có chắc chắn muốn " + actionName.toLowerCase() + " mã coupon <b>" + $("#couponName").val() + '</b>?',
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
                    url: systemConfig.defaultAPIURL + "api/coupon/update",
                    type: "PUT",
                    contentType: "application/json",
                    data: JSON.stringify(obj),
                    success: function (response) {
                        $("#loading").removeClass("show");

                        // debugger;
                        if (response.isSucceeded) {
                            Swal.fire(
                                'Cập nhật mã coupon',
                                'Mã coupon <b>' + $("#couponName").val() + '</b> đã được cập nhật thành công.',
                                'success'
                            ).then((result) => {
                                $("#couponModal").modal("hide");
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
                                        'Mã coupon <p class="swal__admin__subtitle"> Cập nhật không thành công </p>',
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
                                'Mã coupon',
                                'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                                'error'
                            ).then(function () {
                                window.location.href = "/home/login";
                            });
                        }
                        else if (e.status == 403) {
                            Swal.fire(
                                'Mã coupon',
                                'Bạn không có quyền sử dụng tính năng này.',
                                'error'
                            );
                        }
                        else {
                            swal.fire(
                                'Mã coupon',
                                'không thể cập nhật mã coupon, hãy kiểm tra lại thông tin.',
                                'error'
                            );
                        }

                    }
                });
            };

            //CALL AJAX TO CREATE
            if (updatingId == 0) {
                $.ajax({
                    url: systemConfig.defaultAPIURL + "api/coupon/add",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(obj),
                    success: function (response) {
                        $("#loading").removeClass("show");

                        if (response.isSucceeded) {
                            Swal.fire(
                                'Thêm mới mã coupon',
                                'Mã coupon <b>' + $("#couponName").val() + '</b> đã được thêm mới thành công.',
                                'success'
                            ).then(function () {
                                $("#couponModal").modal("hide");
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
                                        'Mã coupon <p class="swal__admin__subtitle"> Thêm mới không thành công </p>',
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
                                'Quản lý mã coupon',
                                'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                                'error'
                            ).then(function () {
                                window.location.href = "/home/login";
                            });
                        }
                        else if (e.status == 403) {
                            Swal.fire(
                                'Quản lý mã coupon',
                                'Bạn không có quyền sử dụng tính năng này.',
                                'error'
                            );
                        }
                        else {

                            Swal.fire(
                                'Quản lý mã coupon',
                                'Không thể thêm mới mã coupon, hãy kiểm tra lại thông tin.',
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
    table.column(2).search($("#searchName").val());
    table.column(3).search($("#searchTax").val());
    table.column(4).search($("#searchAddress").val());
    table.column(5).search($("#searchWebsite").val());

    if ($("#fillter_startDate_value").val().length > 0 || $("#fillter_endDate_value").val().length > 0) {
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
        table.column(6).search(searchDateArrs.toString());
    }
    else {
        table.column(6).search("")
    }
    table.column(6).search($("#searchActivated").val());

    table.draw();
}

async function quickActivated(isApproved, id) {
    var titleName = "Quản lý tổ chức tuyển dụng";
    var actionName = isApproved ? "kích hoạt" : "bỏ kích hoạt";
    await getItemById(id);
    var obj = { "id": id, "IsApproved": isApproved }
    Swal.fire({
        title: titleName,
        html: "Bạn có chắc chắn muốn " + actionName + " tổ chức tuyển dụng <strong>" + updatingObj.fullname + "</strong> không?",
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
                url: systemConfig.defaultAPIURL + "api/company/quick-activated?id=" + id,
                type: "PUT",
                contentType: "application/json",
                success: function (response) {
                    $("#loading").removeClass('show');
                    if (response.isSucceeded) {
                        Swal.fire(
                            'Kích hoạt tổ chức tuyển dụng',
                            'Nhà tuyển dụng <b>' + updatingObj.fullname + ' </b> đã được ' + actionName + ' thành công.',
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
                                    'Nhà tuyển dụng <p class="swal__admin__subtitle"> Kích hoạt không thành công </p>',
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
                            'Nhà tuyển dụng',
                            'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                            'error'
                        ).then(function () {
                            window.location.href = "/home/login";
                        });
                    }
                    else if (e.status == 403) {
                        Swal.fire(
                            'Nhà tuyển dụng',
                            'Bạn không có quyền sử dụng tính năng này.',
                            'error'
                        );
                    }
                    else {
                        Swal.fire(
                            'Nhà tuyển dụng',
                            'Kích hoạt nhanh tổ chức tuyển dụng không thành công, <br> vui lòng thử lại sau!',
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
$("#couponEffiencyTime").on("keypress keyup", function (e) {
    $(this).attr('type', 'text');

    // skip for arrow keys
    if (e.which >= 37 && e.which <= 40) return;

    // format number
    $(this).val(function (index, value) {
        return value
            .replace(/\D/g, '')
            .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    });
})
$("#exportExcel").click(function (e) {
    e.preventDefault();
    $("#loading").addClass("show");
    $.ajax({
        url: systemConfig.defaultAPIURL + "api/company/export-excel",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(dataExport),
        success: function (res) {
            $("#loading").removeClass("show");
            //console.log(res);
            //debugger;
            if (!res.isSucceeded) {
                Swal.fire(
                    'Danh sách tổ chức tuyển dụng!',
                    'Không có dữ liệu để xuất Excel.',
                    'warning'
                );
            }
            else {
                window.location = systemConfig.defaultAPIURL + "api/Company/download-excel?fileGuid=" + res.resources.fileGuid + "&fileName=" + res.resources.fileName;
            }
        },
        error: function (e) {
            $("#loading").removeClass("show");
            Swal.fire(
                'Danh sách tổ chức tuyển dụng!',
                'Không có dữ liệu để xuất Excel.',
                'warning'
            );
        }
    })
})
$("#accountPassword").on('keyup keypress', function (e) {
    if (e.keyCode == 13) {
        e.preventDefault();
    }
    if ($(this).val().length > 0) {
        $("#spanNewPass").removeClass('d-none')
    }
    else {
        $("#spanNewPass").addClass('d-none')

    }
})
$("#accountConfirmPassword").on('keyup keypress', function (e) {
    if (e.keyCode == 13) {
        e.preventDefault();
    }
    if ($(this).val().length > 0) {
        $("#spanConfirmNewPass").removeClass('d-none')
    }
    else {
        $("#spanConfirmNewPass").addClass('d-none')

    }
})
$("#changePassword").click(function (e) {
    e.preventDefault();
    var listErr = [];
    if ($("#accountPassword").val().length == 0) {
        listErr.push("Mật khẩu không được để trống")
    }
    else {
        if ($("#accountPassword").val().length < 8) {
            listErr.push("Mật khẩu phải lớn hơn 8 ký tự")
        }
    }

    if ($("#accountConfirmPassword").val() != $("#accountPassword").val()) {
        listErr.push("Nhập lại mật khẩu phải trùng khớp với mật khẩu mới")
    }

    if (listErr.length > 0) {
        var content = "<ul>";
        listErr.forEach(function (item) {
            content += "<li class='text-start'>" + item + "</li>";
        })
        content += "</ul>";
        swal.fire({
            title: "Cập nhật mật khẩu",
            html: content,
            icon: "warning",
        })
    }
    else {
        $("#loading").addClass("show");

        var obj = {
            id: updatingObj.employer.id,
            newPassword: $("#accountPassword").val(),
            confirmPassword: $("#accountConfirmPassword").val(),
            oldPassword: "000"
        }
        $.ajax({
            url: systemConfig.defaultAPIURL + "api/employer/change-password-admin",
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(obj),
            success: function (res) {
                $("#loading").removeClass("show");
                if (!res.isSucceeded) {
                    if (res.status == 400) {
                        if (res.errors != null) {
                            var contentError = "<ul>";
                            res.errors.forEach(function (item, index) {
                                contentError += "<li class='text-start pb-2'>" + item + "</li>";
                            })
                            contentError += "</ul>";
                            Swal.fire(
                                'Nhà tuyển dụng <p class="swal__admin__subtitle"> Đặt lại mật khẩu không thành công </p>',
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
                else {
                    Swal.fire(
                        'Cập nhật mật khẩu!',
                        'Cập nhật mật khẩu cho nhà tuyển dụng ' + updatingObj.employer.fullname + ' thành công!',
                        'success'
                    );
                    $("#accountPassword").val('');
                    $("#accountConfirmPassword").val('');
                }
            },
            error: function (e) {
                //console.log(e);
                $("#loading").removeClass("show");
                Swal.fire(
                    'Cập nhật mật khẩu!',
                    'Đã có lỗi xảy ra khi cập nhật mật khẩu.',
                    'warning'
                );
            }
        })
    }
})
$("#form-company").on('submit', function (e) {
    e.preventDefault();
})
async function loadDataCompanySize() {
    try {
        let res = await httpService.getAsync('api/company-size/list');
        if (res.isSucceeded) {
            res.resources.forEach(function (item, index) {
                $('#selectCompanySize').append(new Option(item.name, item.id, false, false)).trigger('change');

            })
            $("#selectCompanySize").select2();
        }
        else {
            console.error(res);

        }
    } catch (e) {
        console.error(e);
    }
}

async function loadDataPosition() {
    try {
        let res = await httpService.getAsync('api/position/list');
        if (res.isSucceeded) {
            res.resources.forEach(function (item, index) {
                //console.log(item);

                $('#selectEmployerPosition').append(new Option(item.name, item.id, false, false)).trigger('change');

            })
            $("#selectEmployerPosition").select2();
        }
        else {
            console.error(res);

        }
    } catch (e) {
        console.error(e);
    }
}

async function loadDataAccountStatus() {
    try {
        let res = await httpService.getAsync('api/account-status/list');
        if (res.isSucceeded) {
            //dataSource = response.resources;
            res.resources.forEach(function (item, index) {
                //console.log(item);
                $('#selectEmployerStatus').append(new Option(item.name, item.id, false, false)).trigger('change');

            })
            $("#selectEmployerStatus").select2();
        }
        else {
            console.error(res);

        }
    } catch (e) {
        console.error(e);
    }
}
async function loadDataCompanyServicePackage() {
    try {
        let res = await httpService.getAsync('api/employer-service-package/list');
        if (res.isSucceeded) {
            //dataSource = response.resources;
            res.resources.forEach(function (item, index) {
                //console.log(item);
                $('#selectEmployerLevel').append(new Option(item.name, item.id, false, false)).trigger('change');

            })
            $("#selectEmployerLevel").select2();
        }
        else {
            console.error(res);

        }
    } catch (e) {
        console.error(e);
    }
}
