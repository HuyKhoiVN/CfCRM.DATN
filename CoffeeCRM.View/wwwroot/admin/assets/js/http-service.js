"use strict";
class HttpService {

    /**
     * perform GET ajax request with token
     * @param url url to send ajax request
     * @returns {Promise<*>}
     */

    getAsync(url) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: systemURL + url,
                beforeSend: function (xhr) {
                    if (localStorage.token) {
                        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
                    }
                },
                success: function (data) {
                    resolve(data);
                },
                error: function (jqXHR, textStatus, err) {
                    reject(jqXHR)
                }
            });
        })
    }

    /**
     * perform POST ajax request with token
     * @param url url to send ajax request
     * @param data data to send in body
     * @returns {Promise<*>}
     */
    postAsync(url, data, contentType = "application/json") {
        // if data is not string, serialize it
        if (typeof data != "string") {
            data = JSON.stringify(data);
        }
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'POST',
                url: systemURL + url,
                data: data,
                contentType: contentType,
                beforeSend: function (xhr) {
                    if (localStorage.token) {
                        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
                    }
                },
                success: function (data) {
                    resolve(data);
                },
                error: function (jqXHR, textStatus, err) {
                    reject(jqXHR)
                }
            });
        })
    }

    /**
     * perform PUT ajax request with token
     * @param url url to send ajax request
     * @param data data to send in body
     * @returns {Promise<*>}
     */
    putAsync(url, data, contentType = "application/json") {
        // if data is not string, serialize it
        if (typeof data != "string") {
            data = JSON.stringify(data);
        }
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'PUT',
                url: systemURL + url,
                data: data,
                contentType: contentType,
                beforeSend: function (xhr) {
                    if (localStorage.token) {
                        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
                    }
                },
                success: function (data) {
                    resolve(data);
                },
                error: function (jqXHR, textStatus, err) {
                    reject(jqXHR)
                }
            });
        })
    }

    /**
     * perform DELETE ajax request with token
     * @param url url to send ajax request
     * @returns {Promise<*>}
     */
    deleteAsync(url) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'DELETE',
                url: systemURL + url,
                beforeSend: function (xhr) {
                    if (localStorage.token) {
                        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
                    }
                },
                success: function (data) {
                    resolve(data);
                },
                error: function (jqXHR, textStatus, err) {
                    reject(jqXHR)
                }
            });
        })
    }

    /**
     * perform POST Form Data ajax request with token
     * @param url url to send ajax request
     * @param data data to send in body
     * @returns {Promise<*>}
     */
    postFormDataAsync(url, data) {

        if (!(data instanceof FormData)) {
            throw "data must be Form Data";
        }

        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'POST',
                url: systemURL + url,
                data: data,
                processData: false,
                contentType: false,
                beforeSend: function (xhr) {
                    if (localStorage.token) {
                        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
                    }
                },
                success: function (data) {
                    resolve(data);
                },
                error: function (jqXHR, textStatus, err) {
                    reject(jqXHR)
                }
            });
        })
    }
}
const httpService = new HttpService();
