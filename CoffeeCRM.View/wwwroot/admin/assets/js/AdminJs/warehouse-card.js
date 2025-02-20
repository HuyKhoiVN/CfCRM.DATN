var tableWarehouseCard;
var tableWarehouseCardDetail;


function initTableWareHouseCard(productId) {
    if (tableWarehouseCard != undefined) {
        tableWarehouseCard.destroy().draw();
    }
    tableWarehouseCard = $('#tableDataWarehouseCard').DataTable({
        processing: true,
        serverSide: true,
        paging: true,
        searching: { regex: true },
        order: [2, 'desc'],
        "oLanguage": {
            "sUrl": "/js/Vietnamese.json"
        },
        ajax: {
            url: systemURL + "warehouseCard/api/list-server-side-card",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: function (d) {
                d.searchAll = $("#search-input").val();
                d.warehouseStatusIds = $("#filterWarehouseStatusId").val();
                d.warehouseTypeIds = $("#filterWarehouseTypeId").val();
                d.productId = productId;
                d.warehouseId = $('#select-warehouseId').val();
                return JSON.stringify(d);
            }
        },
        columns: [
            {
                data: "warehouseName",
                render: function (data, type, row, meta) {
                    return "<span id='row" + row.id + "-column-id'>" + data + "<span>";
                },
            },
            {
                data: "code",
                render: function (data, type, row, meta) {
                    return "<a href='javascript:void(0)' onclick='showModal(" + row.id + ", " + productId + ")'><span id='row" + row.id + "-column-id'>" + data + "<span></a>";
                },
            },
            {
                data: "createdTime",
                render: function (data) {
                    var tempDate = new Date(data);
                    var displayValue = moment(data).format("DD/MM/YYYY HH:mm:ss");
                    return displayValue;
                }
            },
            {
                data: "name",
                render: function (data, type, row, meta) {
                    return "<span id='row" + row.id + "-column-id'>" + data + "<span>";
                },
            },
            {
                data: "quantityOrder",
                render: function (data, type, row, meta) {
                    return "<span id='row" + row.id + "-column-id'>" + data + "<span>";
                },
            },
            {
                data: "quantityWarehouse",
                render: function (data, type, row, meta) {
                    return "<span id='row" + row.id + "-column-id'>" + data + "<span>";
                },
            },
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
            $('#tableDataWarehouseCard tfoot').html("");
            $("#tableDataWarehouseCard thead:nth-child(1) tr").clone(true).appendTo("#tableDataWarehouseCard tfoot");
            $('#tableDataWarehouseCard tfoot tr').addClass("border-top");
        }
    });
}
async function loadDataWarehouse() {
    await $.ajax({
        url: systemURL + 'warehouse/api/list',
        type: 'GET',
        async: 'true',
        contentType: 'application/json',
        success: function (responseData) {
            console.log(new Date().getSeconds() + ':' + new Date().getMilliseconds() + ' - loaded account');
            // debugger;
            var data = responseData.data;
            data.forEach(function (item) {
                $('#select-warehouseId').append(new Option(item.name, item.id, false, false));
            });
        },
        error: function (e) {
            //console.log(e.message);
        }
    });
}
$(document).ready(function () {
    loadDataWarehouse();

});
$("#btnTableSearchWarehouseCard").click(function () {
    tableWarehouseCard.draw();
});
function showModal(id, productId) {
    $("#modal-warhouse-card-detail").modal("show");
    if (tableWarehouseCardDetail != undefined) {
        tableWarehouseCardDetail.destroy();
    }
    initTableWareHouseCardDetail(id, productId);
}
function initTableWareHouseCardDetail(id, productId) {
    tableWarehouseCardDetail = $('#tableDataWarehouseCardDetail').DataTable({
        processing: true,
        serverSide: true,
        paging: true,
        searching: { regex: true },
        order: [1, 'desc'],
        "oLanguage": {
            "sUrl": "/js/Vietnamese.json"
        },
        ajax: {
            url: systemURL + "warehouseCardDetail/api/list-server-side",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: function (d) {
                d.searchAll = $("#search-input").val();
                d.warehouseCardId = id;
                //d.productId = productId;
                return JSON.stringify(d);
            }
        },
        columns: [
            {
                data: "productCode",
                render: function (data, type, row, meta) {
                    return "<span id='row" + row.id + "-column-id'>" + data + "<span>";
                },
            },
            {
                data: "createdTime",
                render: function (data) {
                    var tempDate = new Date(data);
                    var displayValue = moment(data).format("DD/MM/YYYY HH:mm:ss");
                    return displayValue;
                }
            },

            {
                data: "productName",
                render: function (data, type, row, meta) {
                    return "<span id='row" + row.id + "-column-id'>" + data + "<span>";
                },
            },
            {
                data: "supplierName",
                render: function (data, type, row, meta) {
                    return "<span id='row" + row.id + "-column-id'>" + data + "<span>";
                },
            },
            {
                data: "name",
                render: function (data, type, row, meta) {
                    return "<span id='row" + row.id + "-column-id'>" + data + "<span>";
                },
            },
            {
                data: "statusName",
                render: function (data, type, row, meta) {
                    return "<span id='row" + row.id + "-column-id'>" + data + "<span>";
                },
            },
            {
                data: "quantity",
                render: function (data, type, row, meta) {
                    return "<span id='row" + row.id + "-column-id'>" + (row.sign ?? '') + "" + formatNumberCurrency(data.toString()) + "<span>";
                },
            },

            {
                data: "quantityRemain",
                render: function (data, type, row, meta) {
                    return "<span id='row" + row.id + "-column-id'>" + formatNumberCurrency(data.toString()) + "<span>";
                },
            },
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
            $('#tableDataWarehouseCardDetail tfoot').html("");
            $("#tableDataWarehouseCardDetail thead:nth-child(1) tr").clone(true).appendTo("#tableDataWarehouseCardDetail tfoot");
            $('#tableDataWarehouseCardDetail tfoot tr').addClass("border-top");
            tableWarehouseCardDetail.rows().every(function () {
                var data = this.data();
                if (data.productId == productId) {
                    $(this.node()).addClass("active");
                }
            });
            loadDataOrder(id);
        }
    });
}
async function loadDataOrder(warehouseCardId) {
    $(".prepend").remove();
    var orderId = 0;
    var warehouseEntryRequestId = 0;
    tableWarehouseCard.rows().every(function () {
        var data = this.data();
        if (data.id == warehouseCardId) {
            orderId = data.orderId;
            warehouseEntryRequestId = data.warehouseEntryRequestId;
        }
    });
    var action = "";
    if (orderId != 0) {
        action = "?partialView=orders&id=" + orderId;
    }
    if (warehouseEntryRequestId != 0) {
        action = "?partialView=warehouseEntryRequest&id=" + warehouseEntryRequestId;
    }
    await $.ajax({
        url: systemURL + 'partialview/api/render-patialview' + action,
        type: 'GET',
        async: 'true',
        contentType: 'application/json',
        success: function (responseData) {
            if (responseData != null) {
                $("#modal-warhouse-card-detail .modal-body").prepend(responseData);
            }
        },
        error: function (e) {
            //console.log(e.message);
        }
    });
}