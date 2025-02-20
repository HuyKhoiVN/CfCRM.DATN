function UploadSingleFile(type, file, target) {
    let response;
    let req = new XMLHttpRequest();
    let formData = new FormData();
    formData.append("file", file);
    var async = $.ajax({
        url: systemURL + 'core/api/SingleFileUpload/' + type,
        type: 'POST',
        async: 'true',
        data: formData,
        processData: false,
        contentType: false,
        success:async function (responseData) {
            response = await responseData.data;
        },
        error: async function (e) {
            //console.log(e.message);
            response = await responseData.data;
        }
    });
    $.when(async).done(function () {
        $(target).val(response)
    });
}
function UploadMultipleFile(type, files, target) {
    let req = new XMLHttpRequest();
    let formData = new FormData();
    formData.append("file", files);
    $.ajax({
        url: systemURL + 'core/api/MultipleFileUpload' + type,
        type: 'POST',
        async: 'true',
        data: formData,
        processData: false,
        contentType: false,
        success: function (responseData) {
            return responseData;
        },
        error: function (e) {
            //console.log(e.message);
            return responseData;
        }
    });
}