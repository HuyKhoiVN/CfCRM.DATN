var showItem = ['id', 'accountId', 'rankId', 'fullName', 'firstName', 'middleName', 'lastName', 'photo', 'phone', 'email', 'citizenId', 'idCardNumberPhoto1', 'idCardNumberPhoto2', 'doB', 'zipCode', 'addressCity', 'addressDistrictt', 'addressWard', 'addressDetail', 'createdTime', 'search'];
var dataSource = [];
var updatingItemId = 0;
var editObj;
var tableUpdating = 0;
var table;
var tableOrdersHistory;
let regexPhone = /^((84|0)[3|5|7|8|9])\d{8}\b/;
let regexUserName = /^(?=.*[a-zA-Z])[a-zA-Z0-9_.]+$/;
let regexFullName = /^[a-zA-ZÀ-Ỹà-ỹ\s']+$/;
const submitButton = document.getElementById('btnUpdateItem');
const enableBtnSubmit = () => {
    submitButton.setAttribute('data-kt-indicator', 'off');
    submitButton.disabled = false;
}
submitButton.addEventListener('click', function (e) {
    e.preventDefault();
    submitButton.setAttribute('data-kt-indicator', 'on');
    // Disable button to avoid multiple click
    submitButton.disabled = true;
    // Simulate form submission. For more info check the plugin's official documentation: https://sweetalert2.github.io/
    updateItem(updatingItemId);
});
$('#search-input').on("input", function () {
    table.search($(this).val()).draw();
});
function getListWard() {
    return new Promise(function (resolve, reject) {
        $('#customer-addressWard').empty();
        let districtId = $("#customer-addressDistrictt").val();
        $.ajax({
            url: systemURL + `ward/api/listbyparentid/${districtId}`,
            type: "GET",
            async: true,
            contentType: "application/json",
            success: function (responseData) {
                // debugger;
                if (responseData.status == 200 && responseData.message === "SUCCESS") {
                    let wardData = responseData.data;
                    wardData.forEach(function (item) {
                        $('#customer-addressWard').append(new Option(item.name, item.id, false, false));
                    });
                    resolve(); // Giải quyết promise khi dữ liệu đã được tải thành công
                } else {
                    reject("Không thể lấy dữ liệu phường/xã."); // Từ chối promise nếu có lỗi
                }
            },
            error: function (e) {
                reject("Lỗi khi gọi API lấy dữ liệu phường/xã."); // Từ chối promise nếu có lỗi
            }
        });
    });
}

function getListDistrict() {
    return new Promise(function (resolve, reject) {
        let provinceId = $("#customer-addressCity").val();
        $('#customer-addressDistrictt').empty();
        $('#customer-addressWard').empty();
        $.ajax({
            url: systemURL + `district/api/listbyparentid/${provinceId}`,
            type: "GET",
            async: true,
            contentType: "application/json",
            success: function (responseData) {
                // debugger;
                if (responseData.status == 200 && responseData.message === "SUCCESS") {
                    let districtData = responseData.data;
                    districtData.forEach(function (item, index) {
                        if (index == districtData.length - 1) {
                            $('#customer-addressDistrictt').append(new Option(item.name, item.id, false, false)).trigger("change");
                        } else {
                            $('#customer-addressDistrictt').append(new Option(item.name, item.id, false, false));
                        }
                    });
                    resolve(); // Giải quyết promise khi dữ liệu đã được tải thành công
                } else {
                    reject("Không thể lấy dữ liệu quận/huyện."); // Từ chối promise nếu có lỗi
                }
            },
            error: function (e) {
                reject("Lỗi khi gọi API lấy dữ liệu quận/huyện."); // Từ chối promise nếu có lỗi
            }
        });
    });
}
function getProvince() {
    var provinceData = [];
    $.ajax({
        url: systemURL + 'province/api/list',
        type: 'GET',
        async: 'true',
        contentType: 'application/json',
        success: function (responseData) {
            // debugger;
            var data = responseData.data;
            provinceData = data;
            provinceData.forEach(function (item) {
                $('#customer-addressCity').append(new Option(item.name, item.id, false, false));
            })
        },
        error: function (e) {
            //console.log(e.message);
        }
    });
}

$(document).ready(function () {
    // Load data
    loadData();
    getProvince();
    getListDistrict();
    getListWard();
    $("#customer-addressCity").change(() => {
        getListDistrict()
    })
    $("#customer-addressDistrictt").change(() => {
        getListWard()
    })
    // Datetime picker
    //document.querySelectorAll(".datepicker").forEach(function (item) {
    //    new tempusDominus.TempusDominus(item, datePickerOption);
    //})
    $(".datepicker").on('dp.change', function (e) {
        // console.log(this.value);
        this.value = moment(this.value).format("YYYY-MM-DD HH:mm:ss");
        // console.log(this.value);
    });
    //Flat pickr format
    $("#filterCreatedTime_input").flatpickr({
        dateFormat: "d/m/Y",
        mode: "range",
    });
    $("#open-flatpickr").click(function () {
        $("#filterCreatedTime_input").click();
    });
    $("#clear-flatpickr").click(function () {
        $("#filterCreatedTime_input").val("");
    });

    $("#filterDoB_input").flatpickr({
        dateFormat: "d/m/Y",
        mode: "range",
    });
    $("#open-flatpickr-DoB").click(function () {
        $("#filterDoB_input").click();
    });
    $("#clear-flatpickr-DoB").click(function () {
        $("#filterDoB_input").val("");
    });

    $('.dataSelect').select2();

    $('.historyCustomer').click(function () {
        $('#kt_tab_pane_6').addClass('active show');
    })
    $('.infoCustomer').click(function () {
        $('#kt_tab_pane_6').removeClass('active show');
    })
    $("#btnTableSearch").click(function () {
        tableSearch();
    });

    $("#tableData thead:nth-child(2) tr th input").keypress(function (e) {
        let key = e.which;
        if (key == 13) {
            $("#btnTableSearch").click();
        }
    });
    $("#btnTableResetSearch").click(function () {
        $(".tableheaderFillter").val("").trigger("change");
        tableSearch();
    });
    $('.datepicker').flatpickr({
        dateFormat: 'd/m/Y',
    });

    tableAttribute = $("#tableDataAttribute").DataTable({
        "oLanguage": {
            "sUrl": "/js/Vietnamese.json"
        },
        "bLengthChange": false,
        "bInfo": false,
        "bPaginate": false,
        columns: [
            {
                data: "fullName",
                render: function (data, type, row, meta) {
                    return `<input type='text' class='form-control addCustomer-name' id='addCustomer-name' value='${(data != undefined ? data : "")}' placeholder='Tên khách hàng' />`;
                },
            },

            {
                data: "phone",
                render: function (data, type, row, meta) {
                    return `<input type='text' class='form-control addCustomer-phone' id="addCustomer-phone" value='${(data != undefined ? data : "")}' placeholder='Số điện thoại' />`;
                },
            },

            {
                data: "gender",
                render: function (data, type, row, meta) {
                    return `<select class="form-select dataSelect addCustomer-gender" id="addCustomer-gender" value='${(data != undefined ? data : "")}' data-placeholder="" data-dropdown-parent="#modal-id">
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                    </select>`;
                },
            },

            {
                data: "doB",
                render: function (data, type, row, meta) {
                    return `<input type='datetime' class='form-control account-doB datepicker flatpickr-input' id='account-doB' value='${(data != undefined ? data : "")}' placeholder='Ngày sinh' />`;
                },
            },

            {
                data: "addressDetail",
                render: function (data, type, row, meta) {
                    return `<input type='text' class='form-control addCustomer-addressDetail'  id='addCustomer-description' value='${(data != undefined ? data : "")}' placeholder='Địa chỉ' />`;
                },
            },

            {
                data: "id",
                render: function (data, type, row, meta) {
                    return `<a title="Xóa" onclick="deleteItemAttribute(this)" class="me-2 btn_manage cursor-pointer"><i class="ki-duotone ki-trash-square fs-2x text-danger"><span class="path1"></span><span class="path2"> </span><span class="path3"></span><span class="path4"> </span></i></a>`;
                },
            },
        ],
        columnDefs: [
            { targets: "no-sort", orderable: false },
            { targets: "no-search", searchable: false },
            { orderable: false, targets: [-1, 0, 1, 2] },
        ],
        drawCallback: async function () {
            $('.datepicker').flatpickr({
                dateFormat: 'd/m/Y',
            });
        }
    });
});
function loadData() {
    initTable();
    //initTableOrderHistory();
}
function formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(\d{4})(\d{3})(\d{3})$/);
    if (match) {
        return match[1] + ' ' + match[2] + ' ' + match[3];
    }
    return "";
}
function initTable() {
    table = $('#tableData').DataTable({
        processing: true,
        serverSide: true,
        paging: true,
        searching: { regex: true },
        order: [4, 'desc'],
        "oLanguage": {
            "sUrl": "/js/Vietnamese.json"
        },
        ajax: {
            url: systemURL + "customer/api/list-server-side",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: function (d) {
                d.searchAll = $("#search-input").val();
                d.accountIds = $("#filterAccountId").val();
                d.rankIds = $("#filterRankId").val();
                //d.fullName = $("filterFullName_input").val();
                table.columns().visible().each(function (item, index) {
                    d.columns[index].visible = item;
                });
                return JSON.stringify(d);
            }
        },
        columns: [
            {
                data: 'id',
                render: function (data, type, row, meta) {
                    var info = table.page.info();
                    var stt = meta.row + 1 + info.page * info.length;
                    return `<div class='text-center'>` + stt + `</div>`;
                }
            },

            {
                data: "zipCode",
                render: function (data, type, row, meta) {
                    return "<span id='row" + row.id + "-column-id'>" + "KH-" + row.id + "<span>";
                },
            },

            {
                data: "fullName",
                render: function (data, type, row, meta) {
                    return "<span id='row" + row.id + "-column-id'>" + data + "<span>";
                },
            },

            {
                data: "phone",
                render: function (data, type, row, meta) {
                    return "<span id='row" + row.id + "-column-id'>" + formatPhoneNumber(data) + "<span>";
                },
            },
            {
                data: "address",
                render: function (data, type, row, meta) {
                    return "<span id='row" + row.id + "-column-id'>" + data + "<span>";
                },
            },
            {
                data: "createdTime",
                render: function (data) {
                    var tempDate = new Date(data);
                    var displayValue = moment(data).format("DD/MM/YYYY HH:mm:ss");
                    return `<div class='text-center'>` + displayValue + `</div>`;
                }
            },
            {
                data: 'id',
                render: function (data, type, row, meta) {
                    return "<div class='d-flex justify-content-center gap-2'>"
                        + "<a title='Cập nhật' onclick='editItem(" + row.id + ")' class='me-2 btn_manage'><span class='svg-icon-success svg-icon  svg-icon-1 svg_teh009'><span class='svg-icon-primary svg-icon  svg-icon-1'> <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path opacity='0.3' fill-rule='evenodd' clip-rule='evenodd' d='M2 4.63158C2 3.1782 3.1782 2 4.63158 2H13.47C14.0155 2 14.278 2.66919 13.8778 3.04006L12.4556 4.35821C11.9009 4.87228 11.1726 5.15789 10.4163 5.15789H7.1579C6.05333 5.15789 5.15789 6.05333 5.15789 7.1579V16.8421C5.15789 17.9467 6.05333 18.8421 7.1579 18.8421H16.8421C17.9467 18.8421 18.8421 17.9467 18.8421 16.8421V13.7518C18.8421 12.927 19.1817 12.1387 19.7809 11.572L20.9878 10.4308C21.3703 10.0691 22 10.3403 22 10.8668V19.3684C22 20.8218 20.8218 22 19.3684 22H4.63158C3.1782 22 2 20.8218 2 19.3684V4.63158Z' fill='currentColor'></path><path d='M10.9256 11.1882C10.5351 10.7977 10.5351 10.1645 10.9256 9.77397L18.0669 2.6327C18.8479 1.85165 20.1143 1.85165 20.8953 2.6327L21.3665 3.10391C22.1476 3.88496 22.1476 5.15129 21.3665 5.93234L14.2252 13.0736C13.8347 13.4641 13.2016 13.4641 12.811 13.0736L10.9256 11.1882Z' fill='currentColor'></path><path d='M8.82343 12.0064L8.08852 14.3348C7.8655 15.0414 8.46151 15.7366 9.19388 15.6242L11.8974 15.2092C12.4642 15.1222 12.6916 14.4278 12.2861 14.0223L9.98595 11.7221C9.61452 11.3507 8.98154 11.5055 8.82343 12.0064Z' fill='currentColor'></path></svg></span></span></a>"
                        + "<a title='Cập nhật' onclick='deleteItem(" + row.id + ")' class='me-2 btn_manage'><span class='svg-icon-success svg-icon  svg-icon-1 svg_teh009'><span class='svg-icon-danger svg-icon  svg-icon-1'><svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z' fill='currentColor'></path><path opacity='0.5' d='M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z' fill='currentColor'></path><path opacity='0.5' d='M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z' fill='currentColor'></path></svg></span></a>"
                }
            },

        ],
        columnDefs: [
            { targets: "no-sort", orderable: false },
            { targets: "no-search", searchable: false },
            { orderable: false, targets: [-1, 0] },

            { className: "customer-index-res", "targets": [0] },
            { className: "customer-code-res", "targets": [1] },
            { className: "customer-name-res", "targets": [2] },
            { className: "customer-phone-res", "targets": [3] },
            { className: "customer-addressDetail-res", "targets": [4] },
            { className: "customer-createdTime-res", "targets": [5] },
        ],
        //order: [4, 'desc'],
        aLengthMenu: [
            [10, 25, 50, 100],
            [10, 25, 50, 100]
        ],
        drawCallback: async function () {
            $('#tableData tfoot').html("");
            $("#tableData thead:nth-child(1) tr").clone(true).appendTo("#tableData tfoot");
            $('#tableData tfoot tr').addClass("border-top");
            
            var dataProperty = table.settings().ajax.json().dataProperty;
            appendHtmlDataProperty(dataProperty);
            
            table.columns().visible().each(function (item, index) {
                if (!item) {
                    $($("#tableData #filter-container tr th")[index]).css("display", "none");
                }
                else {
                    $($("#tableData #filter-container tr th")[index]).attr("style", "");
                }
            });
            $(".form-check-input[data-kt-docs-datatable-subtable=template_checkbox_tbl]").on("change", function () {
                toggleToolbar();
            });
            $(".form-check-input[data-kt-docs-datatable-subtable=template_checkbox_tbl_all]").on("change", function () {
                if ($(this).is(":checked")) {
                    $(".form-check-input[data-kt-docs-datatable-subtable=template_checkbox_tbl").prop("checked", true);
                }
                else {
                    $(".form-check-input[data-kt-docs-datatable-subtable=template_checkbox_tbl").prop("checked", false);
                }
                toggleToolbar();
            });
        }
    });
}
$("[data-kt-docs-table-filter='filter']").on("click", function () {
    $(".form-check-input[name=filter-options]").each(function () {
        if ($(this).is(":checked")) {
            var columnIndex = $(this).val();
            $($("#tableData #filter-container tr th")[columnIndex]).attr("style", "");
            table.column(columnIndex).visible(true);
            table.draw();
            toggleToolbar();
        }
        else {
            var columnIndex = $(this).val();
            $($("#tableData #filter-container tr th")[columnIndex]).css("display", "none");
            table.column(columnIndex).visible(false);
            table.draw();
        }

    });
    setTimeout(function () {
        toggleToolbar();
    }, 200);

});
$("[data-kt-docs-table-filter=reset]").on("click", async function () {
    table.clear().destroy();
    await initTable();
});
function appendHtmlDataProperty(data) {
    var element = $('[data-kt-docs-table-filter="filter-options"]');
    $(element).html("");
    if (data.length > 0) {
        data.forEach(function (item) {
            $(element).append(`<label class="form-check form-check-sm form-check-custom form-check-solid mb-3 me-5">
                                                                                    <input class="form-check-input" type="checkbox" name="filter-options" target="${item.propertyName}" value="${item.columnIndex}" ${item.isChecked ? 'checked' : ''}>
                                                                                <span class="form-check-label text-gray-600">
                                                                                    ${item.displayName}
                                                                                </span>
                                                                            </label>`);
        });
    }
}
function toggleToolbar() {
    // Define variables
    const container = document.querySelector('#tableData');
    const toolbarSelected = document.querySelector('[data-kt-docs-table-toolbar="selected"]');
    // const toolbarBase = document.querySelector('[data-kt-docs-table-toolbar="base"]');
    const selectedCount = document.querySelector('[data-kt-docs-table-select="selected_count"]');

    // Select refreshed checkbox DOM elements
    const allCheckboxes = container.querySelectorAll('tbody [type="checkbox"]');

    // Detect checkboxes state & count
    let checkedState = false;
    let count = 0;

    // Count checked boxes
    allCheckboxes.forEach(c => {
        if (c.checked) {
            checkedState = true;
            count++;
        }
    });

    // Toggle toolbars
    if (checkedState) {
        selectedCount.innerHTML = count;
        // toolbarBase.classList.add('d-none');
        toolbarSelected.classList.remove('d-none');
    } else {
        // toolbarBase.classList.remove('d-none');
        toolbarSelected.classList.add('d-none');
    }
}

function popularTemplate($row, data) {
    $('tr[data-kt-docs-datatable-subtable="subtable_template"]').remove();
    var rowIndex = $row.rowIndex;
    var $nextSibling = $row.nextSibling;
    var newTemplate = '';
    var isShowAction = false;
    var productParentId = table.row($row).data().id;
    var listProperties = table.settings().ajax.json().dataProperty;
    data.forEach(function (item) {
        var tdTemplate = '';
        isShowAction = productParentId == item.id ? false : true;
        listProperties.forEach(function (prop) {
            if (prop.isChecked) {
                switch (prop.propertyName) {
                    case 'Id':
                        tdTemplate += isShowAction == true ? `<td class="customer-index-res"><div class="form-check form-check-custom form-check-solid form-check-sm ms-4" id="row${item.id}-column-id">
                                                                <input class="form-check-input" type="checkbox" value="${item.id}" id="flexCheckChecked" data-kt-docs-datatable-subtable="template_checkbox_tbl">
                                                                                </div></td>` : `<td></td>`;
                        break;
                    case 'Code':
                        tdTemplate += `  <td class="  customer-code-res"><div class="d-flex flex-row gap-2 align-items-center ms-4"><a href="javascript:void(0)" onclick="editItem(${item.id})" class="fw-bold">${item.code}<a></div>
                                                                    </td>`;
                        break;
                    case 'Name':
                        tdTemplate += ` <td class="customer-name-res"><span id="row${item.id}-column-id">${item.name} - ${item.attributeValue}<span></span></span></td>`;
                        break;
                    
                    case 'Phone':
                        tdTemplate += ` <td class="  customer-phone-res"><span id="row${item.id}-column-id">${item.phone ?? ''}<span></span></span></td>`;
                        break;
                    case 'AddressDetail':
                        tdTemplate += `<td class="  customer-addressDetail-res">${item.addressDetail}</td>`;
                        break;
                    case 'CreatedTime':
                        tdTemplate += `<td class="  customer-createdTime-res">${moment(item.createdTime).format("DD/MM/YYYY HH:mm:ss")}</td>`;
                        break;
                    // Thêm các case khác tương ứng với các thuộc tính bạn muốn hiển thị
                    default:
                        tdTemplate += `<td>${item[prop.propertyName]}</td>`;
                        break;
                }
            }
        });
        newTemplate += `<tr data-target='${rowIndex}' data-kt-docs-datatable-subtable='subtable_template'>${tdTemplate}</tr>`;
    });
    const tbody = $row.parentElement;
    $(newTemplate).each(function () {
        tbody.insertBefore(this, $nextSibling);
    });
    $(".form-check-input[data-kt-docs-datatable-subtable=template_checkbox_tbl]").on("change", function () {
        toggleToolbar();
    });

}

////end fillter
async function editItem(id) {
    updatingItemId = id;
    $("#modal-id").modal('show');
    //$("#modal-id .nav-item:first-child .nav-link").tab("show");
    //$("#modal-id .nav-item:not(:first-child)").css("display", "none");
    $(".modal-title").text(id > 0 ? "Cập nhật khách hàng" : "Tạo mới khách hàng");
    tableAttribute.clear().draw();
    $("#tableDataAttribute").removeClass("d-none");
    if (id > 0) {
        if (tableOrdersHistory != undefined) {
            tableOrdersHistory.clear().draw().destroy();
        }
        await initTableOrderHistory(id);
        editObj = await getItemById(id);
        $(".hide-on-create").removeClass('d-none')
        $('#customer-zipCode').prop("disabled", true);
        if (editObj.customerChildren.length > 0) {
           
            editObj.customerChildren.forEach(function (item, index) {
                var rowAdded = tableAttribute.row.add({
                    "fullName": item.fullName,
                    "phone": item.phone,
                    "gender": item.gender,
                    "dob": item.doB,
                    "addressDetail": item.addressDetail,
                }).draw();
                loadDataSelectAttribute(rowAdded.node());
                $($(tableAttribute.row(rowAdded.index()).node()).find(".addCustomer-gender")).select2().val(item.gender).trigger("change");
                $(tableAttribute.row(rowAdded.index()).node()).find(".account-doB").val(moment(item.doB).format('DD/MM/YYYY')).trigger("change");
            })
        }
        $("#modal-id .nav-item").css("display", "block");
    } else if (id == 0) {
        $("#modal-id .nav-item:not(:first-child)").css("display", "none");
        $(".hide-on-create").addClass('d-none')
        $('#customer-zipCode').prop("disabled", true);
        $("#tableDataAttribute").addClass("d-none");
    }


    //$("#account-addressCity").val(id > 0 ? (editObj.cityId) : "").trigger("change");
    //if (id > 0 && editObj.districtId && editObj.wardId) {
    //    $.when(getListDistrict()).done(async function () {
    //        $("#account-addressDistrictt").val(editObj.districtId).trigger("change");
    //        $.when(getListWard()).done(async function () {
    //            $("#account-addressWard").val(editObj.wardId).trigger("change");
    //        });
    //    });
    //}
    $("#customer-id").val(id > 0 ? editObj.id : "0");
    $("#customer-accountId").val(id > 0 ? editObj.accountId : "").trigger("change");
    $("#customer-rankId").val(id > 0 ? editObj.rankId : "").trigger("change");
    $("#customer-fullName").val(id > 0 ? editObj.fullName : "");
    $("#customer-phone").val(id > 0 ? editObj.phone : "");
    $("#customer-categoryId").val(id > 0 ? editObj.customerCategoryId : "").trigger("change");
    $("#customer-zipCode").val(id > 0 ? "KH-" + editObj.id : "");

    $("#customer-addressCity").val(id > 0 ? (editObj.cityId) : "").trigger("change");
    if (id > 0 && editObj.districtId && editObj.wardId) {
        $.when(getListDistrict()).done(async function () {
            $("#customer-addressDistrictt").val(editObj.districtId).trigger("change");
            $.when(getListWard()).done(async function () {
                $("#customer-addressWard").val(editObj.wardId).trigger("change");
            });
        });
    }
    $("#customer-addressDetail").val(id > 0 ? editObj.addressDetail : "");
    $("#customer-totalFinalPriceOrderComplete").val(id > 0 ? editObj.totalFinalPriceOrderComplete : "");
    $("#customer-totalOrder").val(id > 0 ? editObj.totalOrder : "");
    //$("#customer-lastOrder").val(id > 0 ? moment(editObj.dateOfLastOrder).format("DD-MM-YYYY") : "");
    $("#customer-lastOrder").val(id > 0 ? (editObj.dateOfLastOrder === "0001-01-01 00:00:00.0000000" ? "Chưa có dữ liệu mua hàng" : moment(editObj.dateOfLastOrder).format("DD-MM-YYYY")) : "");
}
function validateInput(id) {
    let updatingItemId = id
    let addressCity = $("#customer-addressCity").val();
    let addressDistrict = $("#customer-addressDistrictt").val();
    let addressWard = $("#customer-addressWard").val();
    let addressDetail = $("#customer-addressDetail").val();
    let customerRank = $("#customer-rankId").val();
    let fullName = $("#customer-fullName").val();
    let phone = $("#customer-phone").val();
    let customerChildFullName = $(".addCustomer-name");
    let customerChildPhone = $(".addCustomer-phone");
    let customerChildAddressDetail = $(".addCustomer-addressDetail");
    let customerChildDob = $(".account-doB");

    var errorList = [];
    if (fullName == "") {
        errorList.push("Họ và tên không được để trống.");
    }
    else if (!fullName.match(regexFullName)) {
        errorList.push("Họ và tên không được chứa kí tự đặc biệt.");
    }
    if (phone == "") {
        errorList.push("Số điện thoại không được để trống.");
    } else if (!phone.match(regexPhone)) {
        errorList.push("Số điện thoại không hợp lệ.");
    }
    if (customerRank == null) {
        errorList.push("Bậc không được để trống.");
    }
    customerChildFullName.each(function () {
        if (!$(this).val()) {
            errorList.push("Tên thông tin người thân không được để trống.");
        }
    });
    customerChildPhone.each(function () {
        if (!$(this).val()) {
            errorList.push("Số điện thoại người thân không được để trống.");
        }
    });
    customerChildDob.each(function () {
        if (!$(this).val()) {
            errorList.push("Ngày sinh người thân không được để trống.");
        }
    });
    customerChildAddressDetail.each(function () {
        if (!$(this).val()) {
            errorList.push("Địa chỉ người thân không được để trống.");
        }
    });
    //if (customerChildFullName == "") {
    //    errorList.push("Tên thông tin người thân không được để trống.")
    //}
    if (addressCity == null) {
        errorList.push("Tỉnh(thành phố) không được để trống.");
    }
    if (addressDistrict == null) {
        errorList.push("Quận(huyện) không được để trống.");
    }
    if (addressWard == null) {
        errorList.push("Phường(xã) không được để trống.");
    }
    if (addressDetail == '') {
        errorList.push("Địa chỉ cụ thể không được để trống.");
    }
    if (errorList.length > 0) {
        var contentError = "<ul>";
        errorList.forEach(function (item, index) {
            contentError += "<li class='text-start'>" + item + "</li>";
        });
        contentError += "</ul>";
        var swalSubTitle = "<p class='swal__admin__subtitle'>" + (updatingItemId > 0 ? "Cập nhật" : "Thêm mới") + " không thành công</p>";

        Swal.fire(
            'Quản lý khách hàng' + swalSubTitle,
            contentError,
            'warning'
        );
        enableBtnSubmit()
        return false;
    }
    else {
        return true;
    }
}
async function updateItem(id) {
    var actionName = (id == 0 ? "Bạn muốn tạo mới" : "Cập nhật");
    var obj;
    var customerChildId = 0;
    if (id > 0) {
        obj = await getItemById(id);
    }
    validateInputNumber();
    var customerName = $(".addCustomer-name");
    var customerPhone = $(".addCustomer-phone");
    var customerGender = $(".addCustomer-gender");
    var customerDob = $(".account-doB");
    var customerAddress = $(".addCustomer-addressDetail");
    var customerChildren = [];
    function formatDateTime(dateTime) {
        var dateList = dateTime.split('/');
        if (dateList.length > 2) {
            let temp = dateList[0];
            dateList[0] = dateList[1];
            dateList[1] = temp;
        }
        return dateList.join('-')
    }
    $(".addCustomer-name").each(function (index) {
        if (id > 0) {
            customerChildId = obj.customerChildren[index] != null ? obj.customerChildren[index].id : 0;
            var customerChildObj = {
                "fullName": $(this).val(),
                "phone": customerPhone[index].value,
                "firstName": "",
                "middleName": "",
                "lastName": "",
                "addressDetail": customerAddress[index].value,
                "customerId": id,
                "dob": formatDateTime(customerDob[index].value),
                "active": 1,
                "gender": customerGender[index].value,
                "id": customerChildId
            }
            customerChildren.push(customerChildObj);
        } else {
            var customerChildObj = {
                "fullName": $(this).val(),
                "phone": customerPhone[index].value,
                "firstName": "",
                "middleName": "",
                "lastName": "",
                "addressDetail": customerAddress[index].value,
                "customerId": id,
                "dob": formatDateTime(customerDob[index].value),
                "active": 1,
                "gender": customerGender[index].value,
                //"id": customerChildId
            }
            customerChildren.push(customerChildObj);
        }
        
    })
    
    var updatingObj = [{
        id: obj != null ? obj.id : 0,
        rankId: Number($("#customer-rankId").val()),
        customerCategoryId: Number($("#customer-categoryId").val()),
        fullName: $("#customer-fullName").val(),
        phone: $("#customer-phone").val(),
        addressCity: $("#customer-addressCity").val(),
        addressDistrict: $("#customer-addressDistrictt").val(),
        active: 1,
        addressDetail: $("#customer-addressDetail").val(),
        customerChildren: customerChildren,
        "Description": "",
        "firstName": "",
        "middleName": "",
        "lastName": "",
        "createdTime": "2024-07-01",
        "zipCode": $("#customer-zipCode").val(),

    }];
    let objName = id > 0 ? obj.fullName : $("#customer-fullName").val();
    if (validateInput(id)) {
        Swal.fire({
            title: 'Xác nhận thay đổi?',
            text: "" + actionName + " " + objName + "",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#443',
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Huỷ'
        }).then((result) => {
            if (result.value) {
                //CALL AJAX TO UPDATE
                if (id > 0) {
                    $.ajax({
                        url: systemURL + "customer/api/update",
                        type: "POST",
                        contentType: "application/json",
                        data: JSON.stringify(updatingObj),
                        success: function (responseData) {
                            // debugger;
                            if (responseData.status == 207 && responseData.message === "IS_EXIST_PHONE_NUMBER") {
                                Swal.fire(
                                    'Thất bại!',
                                    'Số điện thoại đã được sử dụng',
                                    'warning'
                                );
                                enableBtnSubmit()
                            }
                            if (responseData.status == 200 && responseData.message === "SUCCESS") {
                                Swal.fire(
                                    'Thành Công!',
                                    'Đã cập nhật "' + objName + '" ',
                                    'success'
                                );
                                reGenTable();
                                enableBtnSubmit();
                                $("#modal-id").modal('hide');
                            }
                        },
                        error: function (e) {
                            //console.log(e.message);
                            Swal.fire(
                                'Lỗi!',
                                'Đã xảy ra lỗi, vui lòng thử lại',
                                'error'
                            );
                            // Remove loading indication
                            submitButton.removeAttribute('data-kt-indicator');
                            // Enable button
                            submitButton.disabled = false;
                        }
                    });
                };
                //CALL AJAX TO CREATE
                if (id == 0) {
                    updatingObj.id = 1;
                    delete updatingObj["id"]
                    updatingObj.active = true;
                    updatingObj.createdTime = new Date();
                    $.ajax({
                        url: systemURL + "customer/api/add3",
                        type: "POST",
                        contentType: "application/json",
                        data: JSON.stringify(updatingObj),
                        success: function (responseData) {
                            
                            if (responseData.status == 207 && responseData.message === "IS_EXIST_PHONE_NUMBER") {
                                Swal.fire(
                                    'Thất bại!',
                                    'Số điện thoại đã được sử dụng',
                                    'warning'
                                );
                                enableBtnSubmit()
                            }
                            if (responseData.status == 201 && responseData.message === "CREATED") {
                                Swal.fire(
                                    'Thành công!',
                                    'Đã tạo mới "' + objName + '"',
                                    'success'
                                );
                                reGenTable();
                                enableBtnSubmit();
                                $("#modal-id").modal('hide');
                            }
                        },
                        error: function (e) {
                            //console.log(e.message);
                            Swal.fire(
                                'Lỗi!',
                                'Đã xảy ra lỗi, vui lòng thử lại',
                                'error'
                            );
                            // Remove loading indication
                            submitButton.removeAttribute('data-kt-indicator');
                            // Enable button
                            submitButton.disabled = false;
                        }
                    });
                }
            }
            else {
                // Remove loading indication
                submitButton.removeAttribute('data-kt-indicator');
                // Enable button
                submitButton.disabled = false;
            }
        })
    }
}
async function deleteItem(id) {
    updatingObj = table.ajax.json().data.find(c => c.id == id);
    let objName = id > 0 ? updatingObj.fullName : "khách hàng";
    Swal.fire({
        title: 'Xác nhận thay đổi?',
        text: "Xóa " + objName + "",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Xoá',
        cancelButtonText: 'Huỷ'
    }).then((result) => {
        if (result.value) {
            //CALL AJAX TO DELETE
            $.ajax({
                url: systemURL + "customer/api/delete",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({ "id": id }),
                success: function (responseData) {
                    // debugger;
                    if (responseData.status == 200 && responseData.message === "SUCCESS") {
                        Swal.fire(
                            'Thành công!',
                            'Đã xoá ' + objName + '.',
                            'success'
                        );
                        reGenTable();
                    }
                },
                error: function (e) {
                    //console.log(e.message);
                    Swal.fire(
                        'Lỗi!',
                        'Đã xảy ra lỗi, vui lòng thử lại',
                        'error'
                    );
                }
            });

        }
        else {
            // Remove loading indication
            submitButton.removeAttribute('data-kt-indicator');
            // Enable button
            submitButton.disabled = false;
        }
    })
}
async function getItemById(id) {
    var data;
    await $.ajax({
        url: systemURL + "customer/api/detail-view-model/" + id,
        method: "GET",
        success: function (responseData) {
            data = responseData.data[0];
        },
        error: function (e) {
        },
    });
    return data;
    console.log(data);
}
function reGenTable() {
    tableUpdating = 0;
    table.destroy();
    $(".tableHeaderFilter").val(null).trigger("change");
    $("#tableData tbody").html('');
    loadData();
}
function tableSearch() {
    table.column(1).search($("#filterId_input").val());
    table.column(2).search($("#filterFullName_input").val());
    table.column(3).search($("#filterPhone_input").val());
    table.column(4).search($("#filterAddress_input").val());
    table.column(5).search($("#filterCreatedTime_input").val());


    table.draw();
}

$("#btnAddCustomer").click(function () {
    var x = document.getElementById("add-customerForm");
    if (x.style.display === "none") {
        x.style.display = "flex";
    } else {
        x.style.display = "none";
    }
    $("#customerFullName").val("");
    $("#customerPhone").val("");
    $("#customerCccd").val("");
    $("#customerEmail").val("");
    $("#customerAddressDetail").val("");
    $("#isActivated").prop("checked", true);
    $("#customerCreatedTime").val(moment().format("DD/MM/YYYY HH:mm:ss"));
    $("#customerDescription").val("");
    $("#modalAddCustomer").modal("show");
});
function resetInsertNewCustomer() {
    //Hide Modal
    $("#add-customerForm").hide();
    // Refresh Data insert
    $("#addCustomer-name").val("");
    $("#addCustomer-phone").val("");
    $("#addCustomer-gender").val("Nam").trigger("change");
    $("#addCustomer-rankId").val("1001").trigger("change");
    $("#addCustomer-description").val("");

}

function ValidatePhone(e) {
    return !!/^[0-9\-\+]{9,15}$/.test(e)
}



function AddNewCustomerChild() {
    var fullname = $("#addCustomer-name").val();
    var phone = $("#addCustomer-phone").val();
    if (fullname.length == 0) {
        Swal.fire({
            title: "Nhập tên khách hàng",
            text: "Vui lòng nhập tên khách hàng",
            icon: "warning"
        });
        return;
    }
    if (!ValidatePhone(phone)) {
        Swal.fire({
            title: "Nhập số điện thoại",
            text: "Số điện thoại không hợp lệ",
            icon: "warning"
        });
        return;
    }
    var formattedDob = new Date($('#account-doB').val()).toLocaleDateString('fr-CA');
    var gender = $("#addCustomer-gender").val();
    var rankId = $("#addCustomer-rankId").val();
    var customerDescription = $("#addCustomer-description").val();
    


    var updatingObj = {
        "id": $("#customer-id").val(),
        "rankId": rankId,
        "fullName": fullname,
        "firstName": "",
        "middleName": "",
        "lastName": "",
        "phone": phone,
        "email": "",
        "address": "",
        "citizenId": "",
        "description": customerDescription,
        "photo": "",
        "iDCardNumberPhoto1": "",
        "iDCardNumberPhoto2": "",
        "dob": formattedDob,
        "zipCode": "",
        "addressCity": "",
        "addressDistrict": "",
        "addressWard": "",
        "addressDetail": "",
        "search": "",
        "active": 1,
        "createdTime": "2023-11-03T15:05:42",
        "gender": gender,
        "customerRankId": rankId,
        "customerChildren": customerChildren
    };
    // if (@ViewBag.RoleId == @SystemConstant.ROLE_SYSTEM_ADMIN) {
    //     customerAccountId = $("#addCustomer-saleAccountId").val();
    //     if (customerAccountId == null) {
    //         Swal.fire({
    //             title: "Chưa chọn Sale",
    //             text: "Vui lòng chọn sale phụ trách khách hàng",
    //             icon: "warning"
    //         });
    //         return;
    //     }
    // }

    Swal.fire({
        title: 'Thêm khách hàng mới?',
        text: "Thêm khách hàng " + fullname,
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#443',
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Huỷ'
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: systemURL + "customer/api/add",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(updatingObj),
                beforeSend: function (xhr) {
                    if (localStorage.token) {
                        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
                    }
                },
                success: function (responseData) {
                    if (responseData.status == 201 && responseData.message === "CREATED") {
                        Swal.fire(
                            'Thành công!',
                            'Đã cập nhật dữ liệu',
                            'success'
                        )
                        isNewCustomer = 1;
                        newCustomer.push(responseData.data[0].fullName);
                        newCustomer.push(responseData.data[0].phone)
                        // Reset Data
                        resetInsertNewCustomer();
                        // Bỏ disable địa chỉ giao hàng
                        removeDisabledShip();
                        // $('#customerId').append(new Option(responseData.data[0].fullName, responseData.data[0].id, false, false)).trigger('change');

                        let customer = {
                            id: responseData.data[0].id,
                            fullName: responseData.data[0].fullName,
                            phone: responseData.data[0].phone,
                        }
                        $("#customerId").select2("trigger", "select", {
                            data: customer
                        });
                        // // // Add số điện thoại vào địa chỉ giao
                        // $("#order-recipientName").val(responseData.data[0].fullName);
                        // $("#order-recipientPhone").val(responseData.data[0].phone);
                    }
                },
                error: function (e) {
                    //console.log(e.message);
                    Swal.fire(
                        'Thêm khách hàng không thành công',
                        "" + e.responseJSON.data[0] + "",
                        'warning'
                    );
                }
            });
        }
    })
}

//bảng customerChild
function addRowTable() {
    appendHtmlAttribute();
}
var tableAttribute;
function appendHtmlAttribute() {
    $("#tableDataAttribute").removeClass("d-none");
    var rowIndex = tableAttribute.data().length + 1;
    var rowAdded = tableAttribute.row.add({
        id: 0,
        fullName: '',
        phone: '',
        gender: '',
        dob: '',
        addressDetail: '',
    }).draw();
    loadDataSelectAttribute(rowAdded.node());
}
async function loadDataSelectAttribute(target) {
    var rowIndex = target.rowIndex;
    var selected = $(target).find(`.addCustomer-gender`);
    $(selected).select2();
    var gender = [];

    dataAttribute.forEach(function (item) {
        selected.append(new Option(item.name, item.id, false, false)).trigger('change');
    });
}
function deleteItemAttribute(element) {
    var rowSelect = element.closest("tr");
    tableAttribute.row(rowSelect.rowIndex - 1).remove().draw();
    if (tableAttribute.data().length == 0) {
        $("#tableDataAttribute").addClass("d-none");
        tableAttribute.destroy().draw();
    }
}

//giới tính
var dataAttribute = [];
async function loadDataAttribute() {
    await $.ajax({
        url: systemURL + 'attributes/api/list',
        type: 'GET',
        async: 'true',
        contentType: 'application/json',
        success: function (responseData) {
            var data = responseData.data;
            dataAttribute = data;

        },
        error: function (e) {
            //console.log(e.message);
        }
    });
}

async function initTableOrderHistory(id) {
    tableOrdersHistory = $('#tableDataOrderHistory1').DataTable({
        processing: true,
        serverSide: true,
        paging: true,
        searching: { regex: true },
        order: [1, 'desc'],
        "oLanguage": {
            "sUrl": "/js/Vietnamese.json"
        },
        ajax: {
            url: systemURL + "orders/api/list-server-side-order-customer",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            beforeSend: function (xhr) {
                if (localStorage.token) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
                }
            },
            data: function (d) {
                d.searchAll = $("#search-input").val();
                d.orderTypeIds = $("#filterOrderTypeId").val();
                d.customerIds = $("#filterCustomerId").val();
                d.orderStatusIds = $("#filterOrderStatusId").val();
                d.orderPaymentStatusIds = $("#filterOrderPaymentStatusId").val();
                d.depositTypeIds = $("#filterDepositTypeId").val();
                d.customerCategoryId = $("#filterCustomerCategoryId").val();
                d.exportExcel = false;
                d.customerId = id;
                exportExelParams = d;
                return JSON.stringify(d);
            }
        },
        columns: [
            {
                data: "code",
                render: function (data, type, row, meta) {
                    return "<span id='row" + row.id + "-column-id'>" + data != undefined ? data : "" + "<span>";
                },
            },
            {
                data: "productsName",
                render: function (data, type, row, meta) {
                    return "<span id='row" + row.id + "-column-id'>" + data + "<span>";
                },
            },

            {
                data: "orderPaymentStatusName",
                render: function (data, type, row, meta) {
                    return `<span class="">` + data + `</span>
                                <input type="number" min="0" max="${row.totalSold}" onkeyup='if(this.value > ${row.totalSold}) this.value = ${row.totalSold};' class="text-end form-control d-none quantity-change" onchange="onChangeQuantity(this)" value="` + data + `" />
                              `;
                },
            },

            {
                data: "price",
                render: function (data, type, row, meta) {
                    return "<span id='row" + row.id + "-column-id'>" + formatNumberCurrency(data.toString()) + "<span>";
                },
            },
            //{
            //    data: "price",
            //    render: function (data, type, row, meta) {
            //        return "<span id='row" + row.id + "-column-id'>" + formatNumberCurrency(data.toString()) + "<span>";
            //    },
            //},
            
            {
                data: "finalPrice",
                render: function (data, type, row, meta) {
                    return "<span class='bold' id='row" + row.id + "-column-id'>" + formatNumberCurrency(data.toString()) + "<span>";
                },
            },
            {
                data: "createdTime",
                render: function (data, type, row, meta) {
                    return "<span id='row" + row.id + "-column-id'>" + moment(data).format('DD/MM/YYYY') + "<span>";
                },
            },
            //{
            //    data: 'id',
            //    render: function (data, type, row, meta) {
            //        return `
            //                                                                    <div class='overlay-edit-custom '>
            //                                                                                        <button type="button" title="Tra cứu tủ" class="btn btn-sm btn-admin-success ${row.isChecked != false ? '' : 'd-none'}" data-kt-docs-datatable-subtable="expand_row" data-productId="${row.productId}" '=""><i class="ki-duotone ki-search-list fs-2x text-success">
            //                                                                                 <span class="path1"></span>
            //                                                                                 <span class="path2"></span>
            //                                                                                 <span class="path3"></span>
            //                                                                                </i></button>
            //                                                                            <button title="Sửa" type='button' onclick='editOrderDetail(this)' class='btn btn-icon btn-admin-primary ${row.isEdit == false ? '' : 'd-none'}'><i class="ki-duotone ki-notepad-edit fs-2x text-primary"><span class="path1"> </span><span class="path2"></span></i></button>
            //                                                                        <button title="Sửa hoàn tất" type='button' onclick='editDoneOrderDetail(this)' class='btn btn-icon btn-admin-primary ${row.isEdit == true ? '' : 'd-none'}'><i class="fas fa-check" style="color: #007BFF; font-size: 16px;"></i></button>
            //                                                                            <button title="Xoá" type='button' onclick='deleteOrderDetail(this)' class='btn btn-icon btn-admin-danger'><i class="ki-duotone ki-trash-square fs-2x text-danger"><span class="path1"></span><span class="path2"> </span><span class="path3"></span><span class="path4"> </span></i></button>
            //                                                                    </div>
            //                                                                `;
            //    }
            //},
        ],
        columnDefs: [
            { targets: "no-sort", orderable: false },
            { targets: "no-search", searchable: false },
            { orderable: false, targets: [-1, 0] },
        ],
        aLengthMenu: [
            [10, 25, 50, 100],
            [10, 25, 50, 100]
        ],
        drawCallback: function () {
            $('#tableDataOrderHistory1 tfoot').html("");
            $("#tableDataOrderHistory1 thead:nth-child(1) tr").clone(true).appendTo("#tableDataOrderHistory1 tfoot");
            $('#tableDataOrderHistory1 tfoot tr').addClass("border-top");

        },
    });
}

$("#btnAddCustomer").click(function () {
    $("#modal-customerCategory").modal("show");

});
async function addNewCustomerCategory() {
    var customerCategoryObj = {
        "id": 0,
        "name": $("#customerCategory-name").val(),
        "createdTime": formatDatetimeUpdate($("#customerCategory-createdTime").val()),
    };
    Swal.fire({
        title: 'Xác nhận thay đổi?',
        //text: "" + actionName + " " + objName + "",
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#443',
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Huỷ'
    }).then((result) => {
        if (result.value) {
            $("#modal-customerCategory").modal('hide');
                customerCategoryObj.id = 1;
                delete customerCategoryObj["id"]
                customerCategoryObj.active = true;
                customerCategoryObj.createdTime = new Date();
                console.log(customerCategoryObj);
                $.ajax({
                    url: systemURL + "customerCategory/api/add",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(customerCategoryObj),
                    success: async function (responseData) {
                        // debugger;
                        if (responseData.status == 201 && responseData.message === "CREATED") {
                            Swal.fire(
                                'Thành công!',
                                'Đã cập nhật dữ liệu',
                                'success'
                            );
                            customerCategoryObj = responseData.data;
                            reGenTable();
                            // Remove loading indication
                            submitButton.removeAttribute('data-kt-indicator');
                            // Enable button
                            submitButton.disabled = false;
                            $("#customerCategory-name").val('');
                            $("#customerCategory-createdTime").val('');
                            loadDataSelectCustomerCategory();
                            $.when(loadDataSelectCustomerCategory()).done(function () {
                                $("#filterCustomerCategoryId").select2();
                                customerCategoryData.forEach(function (item) {
                                    console.log(item);
                                    $('#customer-categoryId').append(new Option(item.name, item.id, false, false)).trigger('change');
                                    $('#filterCustomerCategoryId').append(new Option(item.name, item.id, false, false));
                                })
                            });
                            
                        }
                    },
                    error: function (e) {
                        //console.log(e.message);
                        Swal.fire(
                            'Lỗi!',
                            'Đã xảy ra lỗi, vui lòng thử lại',
                            'error'
                        );
                        // Remove loading indication
                        submitButton.removeAttribute('data-kt-indicator');
                        // Enable button
                        submitButton.disabled = false;
                    }
                });
            }

    })

}