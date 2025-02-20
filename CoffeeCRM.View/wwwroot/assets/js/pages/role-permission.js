/**
 * Author: Ha Thanh Nguyen
 * Created: 08/08/2024
 * Description: role permission javascript
 */
"use strict";
var roleSource = [], permissionSource = [], rolePermissionSource=[];
var showItem = ["name"];
var addItems = [], deleteItem = [];
var table;
$(document).ready(async function () {
    $.when(await getRole(), await getPermission(), await getRolePermission())
        .done(function () {
            loadTable();
            initTable();
            $("#btn_submit").on("click", function () {
                submit();
            })
            $(document).on("keypress", ".tbl_fillter", function (e) {
                if (e.which == 13) {
                    tableSearch();
                }
            })
            $(document).on("click", ".btn_search", function (e) {
                tableSearch();
            })
            $(document).on("click", ".btn_reset", function (e) {
                $("#tbl_role_permission thead:nth-child(2) tr th:nth-child(2) .tbl_fillter").val(null).trigger("change");
                table.page.len(10).column(1).search("").draw();
            })
        })
})
function tableSearch() {
    table.column(1).search($("#tbl_role_permission thead:nth-child(2) tr th:nth-child(2) .tbl_fillter").val().trim()).draw();
}
/**
 * Author: Ha Thanh Nguyen
 * Created: 08/08/2024
 * Description: get list role
 */
async function getRole() {
    try {
        let result = await httpService.getAsync("api/role/list-all");
        if (result.isSucceeded) {
            roleSource = result.resources;
            showItem = showItem.concat(roleSource.map(c => c.id));
        }
    } catch (e) {
        roleSource = [];
        showItem = ["name"];
        swal.fire({
            icon: "error",
            title: "Phân quyền vai trò",
            text: "Đã có lỗi xảy ra, xin vui lòng thử lại sau!"
        })
        console.error(e);
    }
}
/**
 * Author: Ha Thanh Nguyen
 * Created: 08/08/2024
 * Description: get list permission
 */
async function getPermission() {
    try {
        let result = await httpService.getAsync("api/permission/list-all");
        if (result.isSucceeded) {
            permissionSource = result.resources;
        }
    } catch (e) {
        permissionSource = [];
        swal.fire({
            icon: "error",
            title: "Phân quyền vai trò",
            text: "Đã có lỗi xảy ra, xin vui lòng thử lại sau!"
        })
        console.error(e);
    }
}
/**
 * Author: Ha Thanh Nguyen
 * Created: 08/08/2024
 * Description: get list permission
 */
async function getRolePermission() {
    try {
        let result = await httpService.getAsync("api/role-permission/list");
        if (result.isSucceeded) {
            rolePermissionSource = result.resources;
        }
    } catch (e) {
        rolePermissionSource = [];
        swal.fire({
            icon: "error",
            title: "Phân quyền vai trò",
            text: "Đã có lỗi xảy ra, xin vui lòng thử lại sau!"
        })
        console.error(e);
    }
}
/**
 * Author: Ha Thanh Nguyen
 * Created: 08/08/2024
 * Description: Load table role permission
 */
function loadTable() {
    roleSource.forEach(function (item) {
        $("#tbl_role_permission thead:nth-child(1) tr").append(`<th class="text-center">${item.name}</th>`)
        $("#tbl_role_permission thead:nth-child(2) tr").append(`<th class="p-3">
                            <div class="form-check d-flex justify-content-center align-items-center ">
                                <input class="form-check-input check_column_all" title="Chọn theo cột" type="checkbox" data-role-id="${item.id}" value="" />
                            </div>
                        </th>`);
        $('#tbl_role_permission tfoot').html("");
        $("#tbl_role_permission thead:nth-child(1) tr").clone(true).appendTo("#tbl_role_permission tfoot");
    })
    permissionSource.forEach(function (item, index) {
        let rowContent = `<tr><td class='text-center' property='action'>
        <div class="form-check d-flex justify-content-center align-items-center">
                                <input class="form-check-input check_row_all" title="Chọn theo hàng" type="checkbox" data-permission-id="${item.id}"  value="" />
                            </div>
        </td>`;
        rowContent += `<td class='text-center'>${index + 1}</td>`;
        showItem.forEach(function (key) {
            if (key == "name") {
                rowContent += `<td class='row-${item.id}-column column-${key}' property='${key}'>${item[key]}</td>`;
            }
            else {
                rowContent += `<td class='no-sort text-center row-${item.id}-column column-${key}' property='${key}' data>
                            <div class="form-check d-flex justify-content-center align-items-center">
                                <input class="form-check-input role_permission_check" type="checkbox" data-permission-id="${item.id}" data-role-id="${key}" value="" />
                            </div>
                        </td>`;
            }
        })
        rowContent += "</tr>";
        $(rowContent).appendTo($("#tbl_role_permission tbody")).trigger("change");
    });
    rolePermissionSource.forEach(function (item) {
        let element = $(`.role_permission_check[data-permission-id=${item.permissionId}][data-role-id=${item.roleId}]`);
        element.prop("checked", true);
        element.attr("data-role-permission-id", item.id);
    });
}
/**
 * Author: Ha Thanh Nguyen
 * Created: 08/08/2024
 * Description: init datatable
 */
function initTable() {
    let disabledOrder = [0,1];
    for (var i = 0; i < roleSource.length; i++) {
        disabledOrder.push(i + 3);
    }
    table = $('#tbl_role_permission').DataTable({
        language: systemConfig.languageDataTable,
        searching: {
            regex: true
        },
        columnDefs: [
            { targets: "no-sort", orderable: false },
            { targets: disabledOrder, orderable: false },
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
            [1, 'desc']
        ],

        aLengthMenu: [
            [10, 25, 50, 100,200,500,-1],
            [10, 25, 50, 100,200,500,"Tất cả"]
        ],
        drawCallback: function () {
            $('#tbl_role_permission tfoot').html("");
            $("#tbl_role_permission thead:nth-child(1) tr").clone(true).appendTo("#tbl_role_permission tfoot");
        }
    });
    table.on("draw", function () {
        $(".check_row_all,.check_column_all").prop("checked", false);
    })
    table.on('order.dt search.dt', function () {
        table.column(1, {
            search: 'applied',
            order: 'applied'
        }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();
}
/**
 * Autthor: Ha Thanh Nguyen
 * Created: 09/08/2024
 * Description: check all column event
 */
$(document).on("click", ".check_column_all", function (e) {
    let element = $(this);
    let roleId = element.attr("data-role-id");
    let checked = element.is(":checked");
    if (roleId) {
        $(`.role_permission_check[data-role-id=${roleId}]`).prop("checked", checked).trigger("change");
    }
});
/**
 * Autthor: Ha Thanh Nguyen
 * Created: 09/08/2024
 * Description: check all row event
 */
$(document).on("click", ".check_row_all", function (e) {
    let element = $(this);
    let permissionId = element.attr("data-permission-id");
    let checked = element.is(":checked");
    if (permissionId) {
        $(`.role_permission_check[data-permission-id=${permissionId}]`).prop("checked", checked).trigger("change");
    }
});
/**
 * Author: Ha Thanh Nguyen
 * Crerate: 09/08/2024
 * Description: role permission check box change event
 */
$(document).on("change", ".role_permission_check", function (e) {
    let element = $(this);
    let rolePermissionId = element.attr("data-role-permission-id");
    let roleId = element.attr("data-role-id");
    let permissionId = element.attr("data-permission-id");
    let checked = element.is(":checked");
    try {

        if (rolePermissionId) {
            let index = deleteItem.findIndex(c => c == rolePermissionId);
            if (checked) {
                deleteItem.splice(index, 1);
            }
            else {
                if (index < 0) {
                    deleteItem.push(rolePermissionId)
                }
            }
        }
        else {
            if (roleId != undefined && permissionId != undefined) {
                let index = addItems.findIndex(c => c.roleId == roleId && c.permissionId == permissionId);
                if (checked) {
                    if (index < 0) {
                        addItems.push({
                            "roleId": roleId,
                            "permissionId": permissionId
                        })
                    }
                }
                else {
                    addItems.splice(index, 1);
                }
            }
            else {
                element.prop("checked", false);
            }
        }
    } catch (e) {
        element.prop("checked", false);
        console.error(e);
    }
})
/**
 * Author: Ha Thanh Nguyen
 * Created: 09/08/2024
 * Description: submit update list role permission
 */
async function submit() {
    swal.fire({
        title: "Phân quyền vai trò",
        html: "Bạn có chắc chắn muốn cập nhật danh sách phân quyền vai trò?",
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#443',
        cancelButtonText: 'Hủy',
        confirmButtonText: 'Lưu'
    }).then(async (result) => {
        if (result.isConfirmed) {
            $("#loading").addClass("show");
            try {
                let data = {
                    'addItems': addItems,
                    'deleteItems': deleteItem
                };
                let result = await httpService.postAsync("api/role-permission/update-list", data);
                if (result.isSucceeded) {
                    $("#loading").removeClass("show");
                    Swal.fire(
                        'Phân quyền vai trò',
                        'Danh sách phân quyền vai trò đã được cập thành công.',
                        'success'
                    ).then((result) => {
                        if (result) {
                            window.location.reload();
                        }
                    });
                }
            } catch (e) {
                $("#loading").removeClass("show");
                Swal.fire(
                    "Phân quyền vai trò",
                    "Đã có lỗi xảy ra, xin vui lòng thử lại sau!",
                    "error"
                );
                console.error(e);
            }
        }
    })
}