$(function() {
    addListeners();
});

function addListeners() {
    $("#currentPageCompare").on("click",
    function() {
        alert("a");
    });

    $("#newPageCompare").on("click",
    function() {
        var newURL = "newWindow/newWindow.html";
        chrome.tabs.create({
            url: newURL
        });
    });
}