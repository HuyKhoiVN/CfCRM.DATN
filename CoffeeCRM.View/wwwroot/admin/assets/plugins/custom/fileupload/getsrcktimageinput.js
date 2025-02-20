function getSrcKTImageInput(src) {
    var type = '';
    if (src.indexOf(".png") > 0) {
        type = '.png';
    }
    if (src.indexOf(".jpg") > 0) {
        type = '.jpg';
    }
    if (src.indexOf(".jpeg") > 0) {
        type = '.jpeg';
    }
    return src.substring(src.indexOf("assets"), src.indexOf(type) + 4);
}