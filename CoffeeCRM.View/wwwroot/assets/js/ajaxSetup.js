"use strict";
$.ajaxSetup({
    beforeSend: function (xhr) {
        if (localStorage.token) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
        }
    },
});