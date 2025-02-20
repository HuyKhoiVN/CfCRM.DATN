/**
 * Author: Nam Anh
 * CreatedTime: 07/09/2024
 */

var showItem = ["name", "color", "description", "createdTime"];
var dataSource = [];
var table, linked1, linked2;
var tableUpdating = 0;
var updatingObj;

$(document).ready(async function () {
    await loadData();
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

    $("#form-submit-recruitment-campaign-status").on("submit", function (e) {
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
        $("#fillter_startDate_value").val("");
        $("#fillter_endDate_value").val("");
        $("#searchName").val("");
        $("#searchDescription").val("");
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
$("#recruitmentCampaignStatusName").on("keypress", function (e) {
    if (e.keyCode == 13) {

        e.preventDefault();
        validate();

    }
});
function tableSearch() {
    table.column(1).search($("#searchName").val());
    table.column(3).search($("#searchDescription").val());
    table.search($("#table_search_all").val().trim()).draw();
}

async function editItem(id) {
    if (id > 0) {
        try {
            let result = await httpService.getAsync(`api/recruitment-campaign-status/detail/${id}`);
            if (result.isSucceeded) {
                if (result.status == 200) {
                    updatingObj = result.resources;
                }
            }
            else {
                //console.error(result);
            }
        }
        catch (e) {
            //console.error(e);
        }
    }
    else {
        updatingObj = {};
    }


    $("#recruitmentCampaignStatusName").val(id > 0 ? updatingObj.name : "").trigger("change");
    $("#recruitmentCampaignStatusDescription").val(id > 0 ? updatingObj.description : "").trigger("change");
    $("#recruitmentCampaignStatusColor").val(id > 0 ? updatingObj.color : "").trigger("change");
    $("#createdTime").val(id > 0 ? moment(updatingObj.createdTime).format("DD/MM/YYYY HH:mm:ss") : moment().format("DD/MM/YYYY HH:mm:ss")).trigger("change");
    $("#recruitmentCampaignStatusModalTitle").text(id > 0 ? "Cập nhật trạng thái chiến dịch tuyển dụng" : "Thêm mới trạng thái chiến dịch tuyển dụng");
    $("#loading").removeClass("show");
    $("#recruitmentCampaignStatusModal").modal("show");
}


async function loadData() {
    try {
        let res = await httpService.getAsync("api/recruitment-campaign-status/list");
        if (res.isSucceeded) {
            dataSource = res.resources;
            loadTable();
            initTable();
        }
    } catch (e) {
        dataSource = [];
        loadTable();
        initTable();
        //console.error(e);
    }

}

function initTable() {
    table = $('#tableData').DataTable({
        language: systemConfig.languageDataTable,
        searching: {
            regex: true
        },
        columnDefs: [
            { targets: "no-sort", orderable: false },
            { targets: [0, -1, 2], orderable: false },
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
            [4, 'desc']
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
        showItem.forEach(function (key) {
            if (item[key]) {
                if (key == "createdTime") {
                    rowContent += "<td class=' row-" + item.id + "-column column-" + key + "' property='" + key + "'>" + moment(item[key], "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm:ss") + "</td>"

                }
                else if (key == "color") {
                    rowContent += "<td class='column-color row-" + item.id + "-column column-" + key + "'><div class='btn' style='background-color:" + item[key] + ";'></div></td>";
                }
                else {
                    rowContent += "<td class='row" + item.id + "-column column-" + key + "' property='" + key + "'>" + item[key] + "</td>";
                }
            }
            else {
                rowContent += "<td class='row" + item.id + "-column column-" + key + "' property='" + key + "'>" + "</td>";
            }
        });
        rowContent += "<td class='row" + item.id + "-column column-' property=''>"
            + "<div class='d-flex justify-content-center'>";
        rowContent += "<button  type='button' class='btn btn-icon btn-admin-edit' data-idItem='" + item.id + "'><span class='svg-icon-primary svg-icon  svg-icon-1'> " + systemConfig.editIcon + " </span></button>";
        rowContent += "<button type='button' class='btn btn-icon btn-admin-delete' data-idItem='" + item.id + "' ><span class='svg-icon-danger svg-icon  svg-icon-1'>" + systemConfig.deleteIcon + "</span></button></div>";
        rowContent += "</div></td></tr>";
        $(rowContent).appendTo($("#tableData tbody"));
    });
}


function refreshTable() {
    reGenDataTable(table, function () {
        $("#table_search_all").val(null).trigger("change");
        $("#tableData .tableHeaderFilter").val(null).trigger("change");
        linked1.clear();
        linked2.clear();
        loadData();
    })
}
async function deleteItem(id) {
    let item = dataSource.find(c => c.id == id);
    swal.fire({
        title: 'Xóa trạng thái chiến dịch tuyển dụng',
        html: 'Bạn có chắc chắn muốn xóa trạng thái chiến dịch tuyển dụng <b>' + item.name + '</b>',
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
                let result = await httpService.deleteAsync(`api/recruitment-campaign-status/delete/${id}`)
                if (result.isSucceeded) {
                    if (result.status == 200) {
                        Swal.fire(
                            'Trạng thái chiến dịch tuyển dụng',
                            'Trạng thái chiến dịch tuyển dụng <b>' + item.name + ' </b> đã được xóa thành công.',
                            'success'
                        );
                        refreshTable();
                    }
                }
                else {
                    Swal.fire(
                        'Trạng thái chiến dịch tuyển dụng',
                        'Xóa trạng thái chiến dịch tuyển dụng không thành công, <b> vui lòng thử lại sau.',
                        'error'
                    );
                }
                $("#loading").removeClass("show");
            } catch (e) {
                if (e.status === 401) {
                    Swal.fire(
                        'Trạng thái chiến dịch tuyển dụng',
                        'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                        'error'
                    ).then(function () {
                        window.location.href = "/home/login";
                    });
                }
                else if (e.status == 403) {
                    Swal.fire(
                        'Trạng thái chiến dịch tuyển dụng',
                        'Bạn không có quyền sử dụng tính năng này.',
                        'error'
                    );
                }
                else {
                    Swal.fire(
                        'Trạng thái chiến dịch tuyển dụng',
                        'Xóa trạng thái chiến dịch tuyển dụng không thành công, <br> vui lòng thử lại sau!',
                        'error'
                    );
                }
                $("#loading").removeClass("show");
            }
        }
    })
}

function submit() {

    updatingObj.name = $("#recruitmentCampaignStatusName").val().trim();
    updatingObj.description = $("#recruitmentCampaignStatusDescription").val();
    updatingObj.color = $("#recruitmentCampaignStatusColor").val();

    let actionName = updatingObj.id != undefined ? "Cập nhật" : "Thêm mới";

    Swal.fire({
        title: actionName + " trạng thái chiến dịch tuyển dụng",
        html: "Bạn có chắc chắn muốn " + actionName.toLowerCase() + " trạng thái chiến dịch tuyển dụng <b>" + $("#recruitmentCampaignStatusName").val() + '</b>?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#443',
        confirmButtonText: 'Lưu',
        cancelButtonText: 'Hủy'
    }).then(async (result) => {
        if (result.isConfirmed) {
            $("#loading").addClass("show");
            //CALL AJAX TO CREATE
            if (updatingObj) {
                try {
                    let result;
                    if (updatingObj.id > 0) {
                        result = await httpService.putAsync("api/recruitment-campaign-status/update", updatingObj);
                    } else {
                        result = await httpService.postAsync("api/recruitment-campaign-status/add", updatingObj);
                    }

                    if (result.isSucceeded) {
                        Swal.fire(
                            'Trạng thái chiến dịch tuyển dụng',
                            'Trạng thái chiến dịch tuyển dụng <b>' + updatingObj.name + `</b> đã được ${actionName.toLowerCase()} thành công.`,
                            'success'
                        ).then((result) => {
                            $("#recruitmentCampaignStatusModal").modal("hide");
                            refreshTable();
                        });
                    } else {
                        if (result.status == 400) {
                            let swalSubTitle = "<p class='swal__admin__subtitle'>" + actionName.toLowerCase() + " không thành công</p>";
                            if (result.errors != null) {
                                let contentError = "<ul>";
                                result.errors.forEach(function (item, index) {
                                    contentError += "<li class='text-start'>" + item + "</li>";
                                })
                                contentError += "</ul>";
                                Swal.fire(
                                    'Trạng thái chiến dịch tuyển dụng' + swalSubTitle,
                                    contentError,
                                    'warning'
                                );

                            } else {
                                let contentError = `<ul>
                                                <li class='text-start'>`+ result.message + `</li>
                                </ul>`;
                                Swal.fire(
                                    'Trạng thái chiến dịch tuyển dụng' + swalSubTitle,
                                    contentError,
                                    'warning'
                                );
                            }
                        }
                        else {
                            Swal.fire(
                                'Trạng thái chiến dịch tuyển dụng',
                                `${actionName} quyền không thành công, <br> vui lòng thử lại sau!`,
                                'error'
                            );
                        }
                    }
                    $("#loading").removeClass("show");
                } catch (e) {
                    console.error(e);
                    if (e.status === 401) {
                        Swal.fire(
                            'Trạng thái chiến dịch tuyển dụng',
                            'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                            'error'
                        ).then(function () {
                            window.location.href = "/home/login";
                        });
                    }
                    else if (e.status == 403) {
                        Swal.fire(
                            'Trạng thái chiến dịch tuyển dụng',
                            'Bạn không có trạng thái chiến dịch tuyển dụng sử dụng tính năng này.',
                            'error'
                        );
                    }
                    else {
                        swal.fire(
                            'Trạng thái chiến dịch tuyển dụng',
                            `${actionName} trạng thái chiến dịch tuyển dụng không thành công, <br> vui lòng thử lại sau!`,
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

function validate(obj) {
    var errorList = [];

    if (errorList.length > 0) {
        var contentError = "<ul>";
        errorList.forEach(function (item, index) {
            contentError += "<li class='text-start'>" + item + "</li>";
        })
        contentError += "</ul>";
        var actionName = (updatingId > 0 ? "Cập nhật" : "Thêm mới");
        var swalSubTitle = "<p class='swal__admin__subtitle'>" + actionName + "không thành công</p>";
        Swal.fire(
            'Trạng thái chiến dịch tuyển dụng' + swalSubTitle,
            contentError,
            'warning'
        );
    } else {
        submit();
    }
}

$.fn.dataTable.ext.search.push(
    function (settings, data, dataIndex) {
        var date = new Date(moment(data[4], "DD/MM/YYYY HH:mm:ss"));
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