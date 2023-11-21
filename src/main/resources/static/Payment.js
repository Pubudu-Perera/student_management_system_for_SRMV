window.addEventListener('load',function(){

    loggedUserPrivileges = getServiceMapping("/logUserModulePrivilege/byModule/" + "Payment");

    refreshPaymentForm();

    refreshPaymentTable();

});



//refresh payment form
function refreshPaymentForm(){

    new_payment = {}
    old_payment = null;

    registered_students = getServiceMapping("/student_registration/list");
    fillDataList(studentDataList,selectInputStudent,"",registered_students,'student_id.full_name','');
}



function totalAmountForAca(){

    textTotal.value = new_payment.student_registration_id.total_fees;

    new_payment["total_amount"] = textTotal.value;
    textTotal.classList.add("is-valid");

}


// Get the total amount student has to pay

function getBalance(){
    if (textTotal.value != null && textPaid.value != null ){
        textBalance.value = new_payment["total_amount"] - new_payment["paid_amount"];
        new_payment["balance_amount"] = textBalance.value;
    }
}



//refresh payment table
function refreshPaymentTable(){

    payments = getServiceMapping("/payment/list");

    paymentProperties = ["bill_number","student_registration_id.student_id.name_with_initials",'total_amount','paid_amount','balance_amount'];

    paymentDataTypes = ["text","object","text","text","text"];

    fillDataTable(tablePayment,payments,paymentProperties,paymentDataTypes,deletePaymentRecord,editPaymentRecord,viewPaymentRecord,true,loggedUserPrivileges);

    $('#tablePayment').DataTable();
}



// check errors
function checkErrors(){
    let errors = "";

    if (new_payment["student_registration_id"] == null){
        errors += "Please select student's registration number + \n";
    }

    if (new_payment["paid_amount"] == null){
        errors += "Please enter the paid amount + \n";
    }

    return errors;
}



//submit payment form
function submitPaymentForm(){

    console.log(new_payment);

    let error = checkErrors();

    if (error === ""){
        let userResponse = window.confirm("Are you sure to add this payment?");
        if (userResponse){
            let serverResponse = getHttpRequestService("/payment","POST",new_payment);
            if (serverResponse === "0"){
                alert("Payment record successfully added! ");
                refreshPaymentTable();
                refreshPaymentForm();
            }else {
                alert(serverResponse);
            }
        }
    }else {
        alert("you have following errors! Please correct them. " + error)
    }

}


function deletePaymentRecord(object,rowID){
    let payment = object;

    let userResponse = window.confirm("Are you sure that you want to delete the record?");

    if (userResponse){

        let serverResponse = getHttpRequestService("/payment","DELETE",payment);

        if (serverResponse === "0"){
            alert("Payment record successfully deleted!");
            refreshPaymentForm();
            refreshPaymentTable();
        }else {
            alert("Error! you can't delete the record!" + serverResponse);
        }
    }
}



function editPaymentRecord(object,rowID){

    $("#paymentAddModal").modal('show');


}



function viewPaymentRecord(){

}
