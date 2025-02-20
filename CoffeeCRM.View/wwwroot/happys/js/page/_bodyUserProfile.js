$(document).ready(function () {
    var hashURL = window.location.hash;
    if (hashURL != "") {
        $("a[aria-controls=" + hashURL.replace("#","") + "]").click()
    }
});
