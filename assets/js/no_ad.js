window.onload = function () {
    window.setTimeout( function () {
        var body = document.getElementsByTagName('body')[0];
        var found = false;
        var cur = 0;
        for (var i = 0; i < body.childNodes.length; i++) {
            if (body.childNodes[i].id == 'last') {
                cur = i;
                found = true;
            }
            else if (found && i > cur + 1) {
                body.removeChild(body.childNodes[i--]);
            }
        }
    }, 100);
}