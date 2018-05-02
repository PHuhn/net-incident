// File: BaseController.js
//
// Hide the message box, may have more than one class "errors" on
// the form (for example a ValidationSummary control).
$(document).ready(function () {
    $("#nsg-alerts").click(function () {
        ClearAlertMessages();
    });
});
// Show the message box: apply style and display it,
// then add a client side item to all class "errors".
function AddAlertMessages(msg) {
    if (msg !== '') {
        $("#nsg-alerts").show('fast');
        $("#nsg-alerts-ul").append("<li>" + msg + "</li>");
        $("#nsg-alerts").click(function () {
            ClearAlertMessages();
        });
    }
};
//
function ClearAlertMessages() {
    $("#nsg-alerts").hide("slow");
    $("#nsg-alerts-ul").empty();
};
//
