$(document).ready(function() {
    addListeners();
});

function addListeners() {
    $("#yourFileTop").on("change",
    function(e) {
        setPosition("#yourFileContainer", "top", this.value + "px");
    });

    $("#yourFileLeft").on("change",
    function(e) {
        setPosition("#yourFileContainer", "left", this.value + "px");
    });

    $("#toggleYourPdf").on("change",
    function(e) {
        var displayStatus = this.checked ? 1 : -1;
        setPosition("#yourFileContainer", "z-index", displayStatus);
    });

    $("#originFile").on("change",
    function(e) {
        if (this.value) {
            addPdfEmbed("#originFileContainer", this.value);
        } else {
            removePdfEmbed("#originFileContainer");
        }
    });

    $("#yourFile").on("change",
    function(e) {
        if (this.value) {
            addPdfEmbed("#yourFileContainer", this.value);
            $("#toggleYourPdf").attr("checked", true);
        } else {
            removePdfEmbed("#yourFileContainer");
            $("#toggleYourPdf").attr("checked", false);
        }

    });
}

function setPosition(selector, attr, value) {
    $(selector).css(attr, value);
}

function addPdfEmbed(targetElement, pdfPath) {
    removePdfEmbed(targetElement);
    var embedElement = $('<embed></embed>');
    embedElement.attr("src", pdfPath);
    $(targetElement).append(embedElement);
}

function removePdfEmbed(targetElement) {
    $(targetElement).html("");
}