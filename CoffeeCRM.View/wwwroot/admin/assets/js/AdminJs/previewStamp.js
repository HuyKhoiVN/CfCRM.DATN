async function previewStamp(type) {
    var listPrinting = [];
    var errorList = [];
    tableStamp.rows().every(async function () {
        var flagProductCode = $("#steper-productCode :selected").val();
        var flagPrice = $("#steper-productPriceType :selected").val();
        var data = this.data();
        if (data[flagProductCode] == null) {
            errorList.push("Mã vạch không tồn tại");
        }
        if (flagPrice != "none" && data[flagPrice].length == 0) {
            errorList.push("Giá tiền không tồn tại");
        }
        var objPrint = {
            'code': data[flagProductCode],
            'price': flagPrice != 'none' ? formatNumberCurrency(data[flagPrice].toString()) : "",
            'name': data.name + ' - ' + data.attributeValue,
            'quantity': data.quantity,
            'type': type
        };
        listPrinting.push(objPrint);
    });
    if (errorList.length > 0) {
        var contentError = "<ul>";
        errorList.forEach(function (item, index) {
            contentError += "<li class='text-start'>" + item + "</li>";
        })
        contentError += "</ul>";
        var actionName = (updatingItemId > 0 ? "Cập nhật" : "In mã vạch");
        var swalSubTitle = "<p class='swal__admin__subtitle'>" + actionName + " không thành công</p>";
        Swal.fire(
            'In mã vạch sản phẩm' + swalSubTitle,
            contentError,
            'warning'
        );
    } else {
        var pdfBlob = await previewBarcode(listPrinting);
        var pdfUrl = URL.createObjectURL(pdfBlob);
        printJS(pdfUrl);
    }
}
function previewBarcode(data) {
    return $.ajax({
        url: systemURL + 'barcode/api/generate',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        xhrFields: {
            responseType: 'blob'
        },
        success: function (data) {
            return data;
        },
        error: function (err) {
            console.error('Error fetching PDF:', err);
        }
    });
}

$("body").on('keyup', '.quantity-stamp', function () {
    var row = $(this).closest("tr");
    tableStamp.row(row).data().quantity = parseInt($(this).val());
});
