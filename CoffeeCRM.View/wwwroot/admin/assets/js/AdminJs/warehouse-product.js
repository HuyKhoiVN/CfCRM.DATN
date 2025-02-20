var tableWarehouseProduct;

function initTableWareHouseProduct(productId) {
    if (tableWarehouseProduct != undefined) {
        tableWarehouseProduct.destroy().draw();
    }
    tableWarehouseProduct = $('#tableDataWarehouse').DataTable({
        processing: true,
        serverSide: true,
        paging: true,
        searching: { regex: true },
        order: [1, 'desc'],
        "oLanguage": {
            "sUrl": "/js/Vietnamese.json"
        },
        ajax: {
            url: systemURL + "warehouse/api/list-server-side-warehouse-product",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: function (d) {
                d.searchAll = $("#search-input").val();
                d.warehouseStatusIds = $("#filterWarehouseStatusId").val();
                d.warehouseTypeIds = $("#filterWarehouseTypeId").val();
                d.productId = productId;
                return JSON.stringify(d);
            }
        },
        columns: [
            {
                data: 'id',
                render: function (data, type, row, meta) {
                    var info = table.page.info();
                    var stt = meta.row + 1 + info.page * info.length;
                    return stt; // This contains the row index
                }
            },
            {
                data: "name",
                render: function (data, type, row, meta) {
                    return "<span id='row" + row.id + "-column-id'>" + data + "<span>";
                },
            },

            {
                data: "totalQuantity",
                render: function (data, type, row, meta) {
                    return "<span id='row" + row.id + "-column-id'>" + (data != null ? formatNumberCurrency(data.toString()) : 0) + "<span>";
                },
            },
            {
                data: "totalQuantityCanSell",
                render: function (data, type, row, meta) {
                    return "<span id='row" + row.id + "-column-id'>" + (data != null ? formatNumberCurrency(data.toString()) : 0) + "<span>";
                },
            },
            {
                data: "totalQuantityOrderSupplier",
                render: function (data, type, row, meta) {
                    return "<span id='row" + row.id + "-column-id'>" + (data != null ? formatNumberCurrency(data.toString()) : 0) + "<span>";
                },
            },

            {
                data: "totalQuantitySell",
                render: function (data, type, row, meta) {
                    return "<span id='row" + row.id + "-column-id'>" + (data != null ? formatNumberCurrency(data.toString()) : 0) + "<span>";
                },
            },
            {
                data: "warehouseStatusId",
                render: function (data, type, row, meta) {
                    return `<span id="row${row.id}-column-id" class="badge py-3 px-4" style="color:${row.warehouseStatusColor}; background-color:${customBagdeColor(row.warehouseStatusColor)}; font-size: 13px">${row.warehouseStatusName}<span></span></span>`;
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
            $('#tableData tfoot').html("");
            $("#tableData thead:nth-child(1) tr").clone(true).appendTo("#tableData tfoot");
            $('#tableData tfoot tr').addClass("border-top");
        }
    });
}