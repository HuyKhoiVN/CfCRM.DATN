
/**
 * Author: Ha Thanh Nguyen
 * Created: 02/08/2024
 * Description: Admin account list javascript 
 */
"use strict";
var dataSource = [];
var roleSource = [];
var showItem = ["userName", "roles", "email", "phone", "createdTime"];
var updatingObj = {};
var table;
var linked1, linked2;
$(document).ready(async function () {
    await loadRole();
    $.when(loadData()).done(function () {
        $("#btn_add_admin_account").on("click", function () {
            edit(0);
        })
        $("#table_admin_account").on("click", ".btn_delete", function () {
            let itemid = $(this).attr("data-id");
            deleteItem(itemid);
        });
        $("#table_admin_account").on("click", ".btn_edit", function () {
            let itemid = $(this).attr("data-id");
            edit(itemid);
        })
        $("#btnChangePassword").on("click", function () {
            $("#adminAccountPassword").prop("disabled", false);
        })
        $("#saveData").on("click", function () {
            submit();
        })
        $("#table_search_all").on('keyup', function (e) {
            let text = $(this).val().trim();
            $(this).val(text)
            if (e.keyCode == 13) {
                table.search(text).draw();
            }
        });
        $("#btnTableSearch").click(function () {
            tableSearch();
        });
        $("#table_admin_account").on("keyup", "thead input", function (e) {
            if (e.which == 13) {
                tableSearch();
            }
        });
        $("#btnTableResetSearch").click(function () {
            reGenDataTable(table, function () {
                $("#table_admin_account .tableheaderFillter").val(null).trigger("change");
                $("#table_search_all").val("");
                linked1.clear();
                linked2.clear();
                loadData();
            })
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
        $("#fillterRole").select2({
            allowClear: true,
            dropdownParent: $('#my_amazing_modal')
        })
        $("#selectAccountRole").select2({
            allowClear: true,
            dropdownParent: $('#modal_admin_account')
        })
    })
});
function tableSearch() {
    table.column(1).search($("#table_admin_account thead:nth-child(2) tr th:nth-child(2) input").val());
    table.column(2).search($("#fillterRole").val().join(" ")).draw()
    table.column(3).search($("#table_admin_account thead:nth-child(2) tr th:nth-child(4) input").val());
    table.column(4).search($("#table_admin_account thead:nth-child(2) tr th:nth-child(5) input").val());
    table.draw($("#table_search_all").val().trim());
}
/**
 * Author: Ha Thanh Nguyen
 * Created: 02/08/2024
 * Descripiton: edit admin account
 * @param {Number} id admin account id  Email FullName UserName Password Phone Photo Description LockEnabled LockEndDate
 */
async function edit(id) {
    if (id > 0) {
        try {
            let result = await httpService.getAsync(`api/admin-account/detail/${id}`);
            if (result.isSucceeded) {
                if (result.status == 200) {
                    updatingObj = result.resources;
                }
            }
            else {
                console.error(result);
            }
        }
        catch (e) {
            console.error(e);
        }
    }
    else {
        updatingObj = {};
    }
    $("#adminAccountEmail").val(id > 0 ? updatingObj.email : "").trigger("change");
    $("#adminAccountFullName").val(id > 0 ? updatingObj.fullName : "").trigger("change");
    $("#adminAccountUserName").val(id > 0 ? updatingObj.userName : "").trigger("change");
    $("#adminAccountPassword").val("").trigger("change");
    $("#adminAccountPassword").attr("type", "password");
    $("#adminAccountPassword").parent().find(".btn_show_pass").html(`<i class="ki-duotone ki-eye fs-3">
                                            <span class="path1 ki-uniEC0B"></span>
                                            <span class="path2 ki-uniEC0B"></span>
                                            <span class="path3 ki-uniEC0D"></span>
                                        </i>`);
    if (id > 0) {
        $("#adminAccountPassword").prop("disabled", true);
        $("#password__title").removeClass("required");
        $("#btnChangePassword").removeClass("d-none");
    }
    else {
        $("#adminAccountPassword").prop("disabled", false);
        $("#password__title").addClass("required");
        $("#btnChangePassword").addClass("d-none");
    }
    $("#adminAccountPhone").val(id > 0 ? updatingObj.phone : "").trigger("change");
    $("#adminAccountPhoto").attr("file-path", id > 0 ? updatingObj.photo : "");
    $("#adminAccountPhoto").attr("src", id > 0 && updatingObj.photo != undefined && updatingObj.photo.trim() != "" ? systemConfig.defaultStorageURL + updatingObj.photo : "/assets/media/images/blog/NoImage.png").trigger("change");
    $("#adminAccountDescription").val(id > 0 ? updatingObj.description : "").trigger("change");
    $("#adminAccountLockEnabled").prop("checked", id > 0 ? updatingObj.lockEnabled : false).trigger("change");
    $("#selectAccountRole").val(id > 0 ? updatingObj.roles : []).trigger("change");
    $("#adminAccountCreatedTime").val(id > 0 ? moment(updatingObj.createdTime).format("DD/MM/YYYY HH:mm:ss") : moment().format("DD/MM/YYYY HH:mm:ss"));
    $("#modal_admin_account .modal-title").text(id > 0 ? 'Cập nhật tài khoản quản trị viên':"Thêm mới tài khoản quản trị viên");
    $("#modal_admin_account").modal("show");
}
/**
 * Author: Ha Thanh Nguyen
 * Created: 02/08/2024
 * Description: Load list admin account
 */
async function loadData() {
    try {
        let res = await httpService.getAsync("api/admin-account/list-all");
        if (res.isSucceeded) {
            if (res.status == 200) {
                dataSource = res.resources;
                loadTable();
                initTable();
            }
        }
    }
    catch (e) {
        dataSource = [];
        loadTable();
        initTable();
        console.error(e);
    }
}
/**
 * Author: Ha Thanh Nguyen
 * Created: 02/08/2024
 * Description: Load table admin account
 */
function loadTable() {
    var index = 0;
    $("#table_admin_account tbody").html("");
    dataSource.forEach(function (item, index) {
        var rowContent = "<tr>";
        rowContent += "<td class='text-center'>" + (index + 1) + "</td>";
        showItem.forEach(function (key) {
            if (item[key]) {
                switch (key) {
                    case "roles":
                        {
                            let roleContent = "";
                            let roles = item[key];
                            roles.forEach(function (it) {
                                let role = roleSource.find(c => c.id == it);
                                roleContent += `<span class="badge m-1 badge-secondary"><span class="d-none">${it} </span> ${role.name}</span>`;
                            })
                            rowContent += "<td class='row" + item.id + "-column column-" + key + "' property='" + key + "'>" + roleContent + "</td>";
                        }
                        break;
                    case "createdTime":
                        rowContent += "<td class='text-center row-" + item.id + "-column column-" + key + "' property='" + key + `' data-sort='${moment(item[key]).format("YYYYMMDDHHmmss")}'>` + moment(item[key], "YYYY-MM-DD hh:mm:ss").format("DD/MM/YYYY hh:mm:ss") + "</td>";
                        break;
                    case "phone":
                        rowContent += "<td class='row" + item.id + "-column column-" + key + "' property='" + key + "'>" + formatPhoneNumber(item[key]) + "</td>";
                        break;
                    default:
                        rowContent += "<td class='row" + item.id + "-column column-" + key + "' property='" + key + "'>" + item[key] + "</td>";
                        break;
                }
            }
            else {
                rowContent += "<td class='row" + item.id + "-column column-" + key + "' property='" + key + "'>" + "</td>";
            }
        })
        rowContent += "<td class='row" + item.id + "-column column-' property=''>"
            + "<div class='d-flex justify-content-center'>";
        rowContent += "<a  type='button' class='me-2 btn_edit' data-id='" + item.id + "'><span class='svg-icon-primary svg-icon  svg-icon-1'> " + systemConfig.editIcon + " </span></a>";
        rowContent += "<a type='button' class='ms-2 btn_delete' data-id='" + item.id + "' ><span class='svg-icon-danger svg-icon  svg-icon-1'>" + systemConfig.deleteIcon + "</span></a></div>";
        rowContent += "</div></td ></tr>";
        $(rowContent).appendTo($("#table_admin_account tbody")).trigger("change");
    })
}
/**
 * Author: Ha Thanh Nguyen
 * Created: 02/08/2024
 * Description: init datatable table admin account
 */
function initTable() {
    table = $('#table_admin_account').DataTable({
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
            [5, 'desc']
        ],

        aLengthMenu: [
            [10, 25, 50, 100],
            [10, 25, 50, 100]
        ],
        drawCallback: function () {
            $('#table_admin_account tfoot').html("");
            $("#table_admin_account thead:nth-child(1) tr").clone(true).appendTo("#table_admin_account tfoot");
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
/**
 * Author: Ha Thanh Nguyen
 * Created: 03/08/2024
 * Description: refresh table
 */
function refreshTable() {
    reGenDataTable(table, function () {
        $("#table_search_all").val(null).trigger("change");
        $("#table_admin_account .tableheaderFillter").val(null).trigger("change");
        linked1.clear();
        linked2.clear();
        loadData();
    })
}
/**
 * Author: Ha Thanh Nguyen
 * Created: 03/08/2024
 * Description: delete admin account by id
 * @param {any} id admin account id
 */
async function deleteItem(id) {
    let item = dataSource.find(c => c.id == id);
    swal.fire({
        title: 'Quản lý tài khoản quản trị viên',
        html: 'Bạn có chắc chắn muốn xóa tài khoản <b>' + item.userName + '</b>?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        cancelButtonText: 'Hủy',
        confirmButtonText: 'Xóa'
    }).then(async (result) => {
        if (result.isConfirmed) {
            $("#loading").addClass("show");
            try {
                let result = await httpService.deleteAsync(`api/admin-account/delete/${id}`)
                if (result.isSucceeded) {
                    if (result.status == 200) {
                        Swal.fire(
                            'Quản lý tài khoản quản trị viên',
                            'Tài khoản <b>' + item.userName + ' </b> đã được xóa thành công.',
                            'success'
                        );
                        refreshTable();
                    }
                }
                else {
                    Swal.fire(
                        'Quản lý tài khoản quản trị viên',
                        'Xóa tài khoản không thành công, <br> vui lòng thử lại sau!',
                        'error'
                    );
                }
                $("#loading").removeClass("show");
            }
            catch (e) {
                console.error(e);
                if (e.status === 401) {
                    Swal.fire(
                        'Quản lý tài khoản quản trị viên',
                        'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                        'error'
                    ).then(function () {
                        window.location.href = "/home/login";
                    });
                }
                else if (e.status == 403) {
                    Swal.fire(
                        'Quản lý tài khoản quản trị viên',
                        'Bạn không có quyền sử dụng tính năng này.',
                        'error'
                    );
                }
                else {
                    Swal.fire(
                        'Quản lý tài khoản quản trị viên',
                        'Xóa tài khoản không thành công, <br> vui lòng thử lại sau!',
                        'error'
                    );
                }
                $("#loading").removeClass("show");
            }
        }
    })
}
/**
 * Author: Ha Thanh Nguyen
 * Created: 02/08/2024
 * Description: Submit edditing admin account
 */
function submit() {
    let filePath = $("#adminAccountPhoto").attr("file-path") || "";
    filePath = filePath.replace(systemConfig.defaultStorageURL, "");
        updatingObj.email = $("#adminAccountEmail").val();
        updatingObj.fullName = $("#adminAccountFullName").val();
        updatingObj.userName = $("#adminAccountUserName").val();
        updatingObj.password = $("#adminAccountPassword").val();
        updatingObj.phone = $("#adminAccountPhone").val();
        updatingObj.photo = filePath;
        updatingObj.description = $("#adminAccountDescription").val().escape();
        updatingObj.lockEnabled = $("#adminAccountLockEnabled").is(":checked");
        updatingObj.roles = $("#selectAccountRole").val();
    let actionName = updatingObj.id != undefined ? "Cập nhật" : "Thêm mới";
    swal.fire({
        title: "Quản lý tài khoản quản trị viên",
        html: "Bạn có chắc chắn muốn " + actionName.toLowerCase() + " tài khoản <b>" + updatingObj.userName + '</b>?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#443',
        cancelButtonText: 'Hủy',
        confirmButtonText: 'Lưu'
    }).then(async (result) => {
        if (result.isConfirmed) {
            $("#loading").addClass("show");
            //CALL AJAX TO UPDATE
            if (validate(updatingObj)) {
                try {
                    let result;
                    if (updatingObj.id > 0) {
                        result = await httpService.putAsync("api/admin-account/update", updatingObj);
                    }
                    else {
                        result = await httpService.postAsync("api/admin-account/add", updatingObj);
                    }
                    if (result.isSucceeded) {
                        Swal.fire(
                            'Quản lý tài khoản quản trị viên',
                            'Tài khoản <b>' + updatingObj.userName + `</b> đã được ${actionName.toLowerCase()} thành công.`,
                            'success'
                        ).then((result) => {
                            $("#modal_admin_account").modal("hide");
                            refreshTable();
                        });
                    }
                    else {
                        if (result.status == 400) {
                            let swalSubTitle = "<p class='swal__admin__subtitle'>" + actionName.toLowerCase() + " không thành công</p>";
                            if (result.errors != null) {
                                let contentError = "<ul>";
                                result.errors.forEach(function (item, index) {
                                    contentError += "<li class='text-start'>" + item + "</li>";
                                })
                                contentError += "</ul>";
                                Swal.fire(
                                    'Quản lý tài khoản quản trị viên' + swalSubTitle,
                                    contentError,
                                    'warning'
                                );

                            } else {
                                let contentError = `<ul>
                                                <li class='text-start'>`+ result.message + `</li>
                                </ul>`;
                                Swal.fire(
                                    'Quản lý tài khoản quản trị viên' + swalSubTitle,
                                    contentError,
                                    'warning'
                                );
                            }
                        }
                        else {
                            Swal.fire(
                                'Quản lý tài khoản quản trị viên',
                                `${actionName} tài khoản không thành công, <br> vui lòng thử lại sau!`,
                                'error'
                            );
                        }
                    }
                    $("#loading").removeClass("show");
                }
                catch (e) {
                    console.error(e);
                    if (e.status === 401) {
                        Swal.fire(
                            'Quản lý tài khoản quản trị viên',
                            'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                            'error'
                        ).then(function () {
                            window.location.href = "/home/login";
                        });
                    }
                    else if (e.status == 403) {
                        Swal.fire(
                            'Quản lý tài khoản quản trị viên',
                            'Bạn không có quyền sử dụng tính năng này.',
                            'error'
                        );
                    }
                    else {
                        swal.fire(
                            'Quản lý tài khoản quản trị viên',
                            `${actionName} tài khoản không thành công, <br> vui lòng thử lại sau!`,
                            'error'
                        );
                    }
                    $("#loading").removeClass("show");
                }
            }
        }
    });
}

function validate(obj) {
    let errorList = [];
    //if (obj.userName.length == 0) {
    //    errorList.push("Tên đăng nhập được bỏ trống.");
    //} else if (obj.userName.length > 255) {
    //    errorList.push("Tên không được dài quá 255 ký tự.");
    //}
    //if (obj.description.length > 500) {
    //    errorList.push("Thông tin không được dài quá 500 ký tự.");
    //}
    //if ($("#postStatusColor").val().length == 0) {
    //    errorList.push("Màu không được bỏ trống.");

    //} else if ($("#postStatusColor").val().length > 12) {
    //    errorList.push("Màu không được dài quá 12 ký tự.");
    //}

    if (errorList.length > 0) {
        let contentError = "<ul>";
        errorList.forEach(function (item, index) {
            contentError += "<li class='text-start'>" + item + "</li>";
        })
        contentError += "</ul>";
        let actionName = (obj.id > 0 ? "Cập nhật" : "Thêm mới");
        let swalSubTitle = "<p class='swal__admin__subtitle'>" + actionName + " không thành công</p>";
        Swal.fire(
            'Quản lý tài khoản quản trị viên' + swalSubTitle,
            contentError,
            'warning'
        );
        $("#loading").removeClass("show");
        return false;
    } else {
        return true;
    }
}
async function loadRole() {
    try {
        let result = await httpService.getAsync("api/role/list-all");
        if (result.isSucceeded) {
            roleSource = result.resources;

            $('#fillterRole,#selectAccountRole').html("").trigger("change");
            result.resources.forEach(function (item, index) {
                $('#fillterRole,#selectAccountRole').append(new Option(item.name, item.id, false, false)).trigger("change");
            })
        }
    }
    catch (e) {
        console.error(e);
        $('#fillterRole,#selectAccountRole').html("").trigger("change");
    }
}
$.fn.dataTable.ext.search.push(
    function (settings, data, dataIndex) {
        var date = new Date(moment(data[5], "DD/MM/YYYY HH:mm:ss"));
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