window.addEventListener('load',function (){

    loggedUserPrivileges = getServiceMapping("/logUserModulePrivilege/byModule/" + "Employee");

    refreshEmployeeForm();

    refreshEmployeeTable();
})


function disableButton(addSubmit,editUpdate){
    if (addSubmit && loggedUserPrivileges.insert){
        $("#employeeSubmit").css('pointer-events','all')
        $("#employeeSubmit").css('cursor','pointer')
        $("#employeeSubmit").removeAttr('disabled')
    }else{
        $("#employeeSubmit").css('pointer-events','all')
        $("#employeeSubmit").css('cursor','not-allowed')
        $("#employeeSubmit").attr('disabled','disabled')
    }

    if (editUpdate && loggedUserPrivileges.update){
        $("#employeeUpdate").css('pointer-events','all')
        $("#employeeUpdate").css('cursor','pointer')
        $("#employeeUpdate").removeAttr('disabled')
    }else{
        $("#employeeUpdate").css('pointer-events','all')
        $("#employeeUpdate").css('cursor','not-allowed')
        $("#employeeUpdate").attr('disabled','disabled')
    }
}



//Refresh the employee form
function refreshEmployeeForm(){

    new_employee = {}
    old_employee = null;

    designationList = getServiceMapping("/designation/list");
    fillingSelectElements(selectDesignation,"Select Employee's Designation",designationList,'name');


    civilStatusList = getServiceMapping(("/civil_status/list"));
    fillingSelectElements(selectCivilStatus,"Select Civil Status",civilStatusList,'name');

    new_employee["employee_status"] = true;

    disableButton(true,false);


    textFullName.value = "";
    textFullName.classList.remove("is-valid");

    textInitials.value = "";
    textInitials.classList.remove("is-valid");

    textCallingName.value = "";
    textCallingName.classList.remove("is-valid");

    textNIC.value = "";
    textNIC.classList.remove("is-valid");

    dateDOB.value = "";
    dateDOB.classList.remove("is-valid");

    selectCivilStatus.value = "";
    selectCivilStatus.classList.remove("is-valid");

    textMobile.value = "";
    textMobile.classList.remove("is-valid");

    textLandline.value = "";
    textLandline.classList.remove("is-valid");

    textEmail.value = "";
    textEmail.classList.remove("is-valid");

    textPermanent_address.value = "";
    textPermanent_address.classList.remove("is-valid");

    textCurrent_address.value = "";
    textCurrent_address.classList.remove("is-valid");

    textWhatsapp.value = "";
    textWhatsapp.classList.remove("is-valid");

    textTelegram.value = "";
    textTelegram.classList.remove("is-valid");

    selectDesignation.value = "";
    selectDesignation.classList.remove("is-valid");

    dateRecruitment.value = "";
    dateRecruitment.classList.remove("is-valid");
}

//Refresh the employee table
function refreshEmployeeTable(){

    employees = getServiceMapping("/employee/findall");

    employeeProperties = ["employee_no","name_with_initials","calling_name","designation_id.name","nic","mobile","employee_status"];

    employeeDataTypes = ["text","text","text","object","text","text",getEmployeeStatus];

    fillDataTable(tableEmployee,employees,employeeProperties,employeeDataTypes,deleteEmployee,editEmployee,viewEmployee,true,loggedUserPrivileges);

    $("#tableEmployee").DataTable();

}


//This function is defined for get the employee status whether Active or In-active according to the boolean value
function getEmployeeStatus(object){

    let employee_status_label = "In-active";

    if (object["employee_status"] === true){
        employee_status_label = "Active";
    }

    return employee_status_label;
}



//Delete an employee record from the employee table
function deleteEmployee(object,rowID){
    let deletingEmployee = object;

    let userResponse = window.confirm("Are you to delete this employee record?");

    if ((userResponse)){

        let serverResponse = getHttpRequestService("/employee", "DELETE", deletingEmployee);
        if (serverResponse === "0"){
            window.alert("Employee Delete Successfully!")
        }else {
            alert("Error! You can't delete this employee record \n" + serverResponse);
        }
    }

}



//update an employee record from the employee table
function editEmployee(object,rowID){

    disableButton(false,true);

    new_employee = getServiceMapping("/employee/getByID?id=" + object.id);
    old_employee = getServiceMapping("/employee/getByID?id=" + object.id);

    textFullName.value = new_employee.full_name;
    textFullName.classList.add("is-valid") ;

    textInitials.value = new_employee.name_with_initials;
    textInitials.classList.add("is-valid");

    textCallingName.value = new_employee.calling_name;
    textCallingName.classList.add("is-valid");

    textNIC.value = new_employee.nic;
    textNIC.classList.add("is-valid");

    dateDOB.value = new_employee.birth_date;
    dateDOB.classList.add("is-valid");



    if (new_employee.gender === "Male"){
        genderMale.checked = true;
        genderFemale.checked = false;
        label_male.style.color = "green";
        label_female.style.color = "rgb(115,20,18)";
    }
    else {
        genderMale.checked = false;
        genderFemale.checked = true;
        label_male.style.color = "rgb(115,20,18)";
        label_female.style.color = "green";
    }



    fillingSelectElements(selectCivilStatus,"Select the civil status",civilStatusList,"name",new_employee.civil_status_id.name);
    selectCivilStatus.classList.add("is-valid");




    textMobile.value = new_employee.mobile;
    textMobile.classList.add("is-valid");



    if (new_employee["landline"] !== undefined) {
        textLandline.value = new_employee["landline"];
        textLandline.classList.add("is-valid");
    }else {
        textLandline.style.borderColor = "rgb(115,20,18)";
    }



    if (new_employee["email"] !== undefined) {
        textEmail.value = new_employee["email"];
        textEmail.classList.add("is-valid");
    }else {
        textEmail.style.borderColor = "rgb(115,20,18)";
    }


    textPermanent_address.value = new_employee.permanent_address;
    textPermanent_address.classList.add("is-valid");



    if(new_employee["current_address"] !== undefined){
        textCurrent_address.value = new_employee["current_address"];
        textCurrent_address.classList.add("is-valid");
    }else {
        textCurrent_address.style.borderColor = "rgb(115,20,18)";
    }


    if (new_employee["whatsapp"] !== undefined) {
        textWhatsapp.value = new_employee.whatsapp;
        textWhatsapp.classList.add("is-valid");
    }else {
        textWhatsapp.style.borderColor = "rgb(115,20,18)";
    }



    if (new_employee["telegram"] !== undefined) {
        textTelegram.value = new_employee.telegram;
        textTelegram.classList.add("is-valid");
    }else {
        textTelegram.style.borderColor = "rgb(115,20,18)";
    }



    fillingSelectElements(selectDesignation,"Select designation",designationList,"name",new_employee.designation_id.name);
    selectDesignation.classList.add("is-valid");


    dateRecruitment.value = new_employee.recruitment_date;
    dateRecruitment.classList.add("is-valid");
}



//view an employee record from the employee table
function viewEmployee(object,rowID){

    let employee = object;

    tdId.innerHTML = employee["id"];

    tdEmployeeFullName.innerHTML = employee["full_name"];

    tdEmployeeNameWithIni.innerHTML = employee["name_with_initials"];

    tdEmployeeCallingName.innerHTML = employee["calling_name"];

    tdNIC.innerHTML = employee["nic"];

    tdDOB.innerHTML = employee["birth_date"];

    tdGender.innerHTML = employee["gender"];

    tdCivilStatus.innerHTML = employee.civil_status_id.name;

    if (employee["description"] !== undefined) {
        tdDescription.innerHTML = employee["description"];
    }else {
        tdDescription.innerHTML = "-";
    }

    tdMobile.innerHTML = employee["mobile"];

    if (employee["landline"] !== undefined) {
        tdLandline.innerHTML = employee["landline"];
    }else {
        tdLandline.innerHTML = "-";
    }

    if (employee["email"] !== undefined) {
        tdEmail.innerHTML = employee["email"];
    }else {
        tdEmail.innerHTML = "-";
    }

    tdPermanentAddress.innerHTML = employee["permanent_address"];

    if (employee["current_address"] !== undefined){
        tdCurrentAddress.innerHTML = employee.current_address;
    }else{
        tdCurrentAddress.innerHTML = "-";
    }

    if (employee["employee_status"] === true){
        tdStatus.innerHTML = "Active";
    }else{
        tdStatus.innerHTML = "In-active";
    }

    tdWhatsApp.innerHTML = employee["whatsapp"];

    if (employee["telegram"] !== undefined){
        tdTelegram.innerHTML = employee["telegram"];
    }else{
        tdTelegram.innerHTML = "-";
    }

    tdDesignation.innerHTML = employee.designation_id.name;

    if (employee["recruitment_date"] !== undefined){
        tdRecruitment.innerHTML = employee["recruitment_date"];
    }else{
        tdRecruitment.innerHTML = "-";
    }

    $("#modalViewEmployee").modal("show");

}


// Checking is their any empty required fields or the user going to submit invalid data.
function checkErrors(){

    let errors = "";

    if (textFullName.value === ""){
        errors += "Please enter employee's full name \n";
        textFullName.classList.add("is-invalid");
    }

    if (textInitials.value === ""){
        errors += "Please enter employee's name with initials \n";
        textInitials.classList.add("is-invalid");
    }

    if (textCallingName.value === ""){
        errors += "Please enter employee's calling name \n";
        textCallingName.classList.add("is-invalid");
    }

    if (textNIC.value === ""){
        errors += "Please enter employee's NIC \n";
        textNIC.classList.add("is-invalid");
    }

    if (new_employee.civil_status_id == null){
        errors += "Please enter employee's civil status \n";
    }

    if (textMobile.value === ""){
        errors += "Please enter employee's mobile number \n";
        textMobile.classList.add("is-invalid");
    }

    if (new_employee.designation_id == null){
        errors += "Please enter employee's designation \n";
    }

    if (textPermanent_address.value === ""){
        errors += "Please enter employee's permanent address \n";
        textPermanent_address.classList.add("is-invalid");
    }


return errors;


}


function submitEmployee() {

    console.log(new_employee);
    let errors = checkErrors();

    if (errors === "") {
        let userResponse = window.confirm("Are you sure to add employee record?");

        if (userResponse) {
            let serverResponse = getHttpRequestService("/employee", "POST", new_employee);

            if (serverResponse === "0") {
                alert("Employee has been added successfully!");
                refreshEmployeeForm();
                refreshEmployeeTable();
            } else {
                alert(serverResponse);
            }
        }
    }else {
        window.alert(errors);
    }
}



function updateEmployee(){

    let errors = checkErrors();

    if (errors === "") {

            let userResponse = window.confirm("Are you sure to update particular record? ");
            if (userResponse) {
                let serverResponse = getHttpRequestService("/employee", "PUT", new_employee);

                if (serverResponse === "0") {
                    alert("Employee record is updated successfully!");
                    refreshEmployeeTable();
                    refreshEmployeeForm();
                } else {
                    alert("Error! Can not update the employee record!");
                }
            }

    }else {
        alert("Please correct following errors! " + errors);
    }
}



//get gender & dob through Student's nic
function genderThroughNIC() {
    let nicNo = textNIC.value;
    let pattern = "^([0-9]{9}[x|X|v|V]|[0-9]{12})$";

    let testPattern = new RegExp(pattern);

    //execute only if the nic value is validated
    if (testPattern.test(nicNo)) {
        // check whether the id number is 10 digit one. if it is, converting it to 12 number one.
        if (nicNo.length === 10) {
            // getting year digits
            yearDigits = nicNo.substring(0, 2);
            monthDayDigits = nicNo.substring(2, 5);
            restDigits = nicNo.substring(5, 9);

            nicNo = "19" + yearDigits + monthDayDigits + "0" + restDigits;
        } else {
            // if the ID number is 12 digit one
            yearDigits = nicNo.substring(0, 4);
            monthDayDigits = nicNo.substring(4, 7);
            restDigits = nicNo.substring(8, 12);
        }

        if (monthDayDigits < 500) {
            genderMale.checked = true;
            new_employee["gender"] = "Male";
            label_male.style.color = "green";
            label_female.style.color = "rgb(115,20,18)";
        } else {
            genderFemale.checked = true;
            new_employee["gender"] = "Female";
            label_female.style.color = "green";
            label_male.style.color = "rgb(115,20,18)";
        }
    }
}



// get student's date of birth through NIC
function dobThroughNIC() {
    let nicNo = textNIC.value;
    let pattern = "^([0-9]{9}[x|X|v|V]|[0-9]{12})$";

    let testPattern = new RegExp(pattern);

    //execute only if the nic value is validated
    if (testPattern.test(nicNo)) {
        // no need to check here the number of digits. because this function executes after genderThroughNIC() function.
        // yearDigits, monthDayDigits & restDigits attributes are declared globally in genderThroughNIC() function. So no need to re-declare them here.
        // for female, reduce 500 from monthDayDigits.
        if (monthDayDigits > 500) {
            monthDayDigits -= 500;
        }

        let startDate = new Date("Jan 01 " + yearDigits);

        // check the year is a leap one or not
        if (
            (yearDigits % 4 === 0 && yearDigits % 100 !== 0) ||
            yearDigits % 400 === 0
        ) {
            birthDate = startDate.setDate(monthDayDigits);
        } else {
            birthDate = startDate.setDate(monthDayDigits - 1);
        }

        dob = new Date(birthDate);
        let month = dob.getMonth() + 1;
        let date = dob.getDate();

        if (yearDigits.length === 2) {
            yearDigits = "19" + yearDigits;
        }

        if (month < 10) {
            month = "0" + month;
        }

        if (date < 10) {
            date = "0" + date;
        }

        let finalBirthDate = yearDigits + "-" + month + "-" + date;
        dateDOB.value = finalBirthDate;
        dateDOB.classList.add("is-valid");
        new_employee["birth_date"] = finalBirthDate;
    } else {
        dateDOB.classList.remove("is-valid");
        dateDOB.value = "";

    }

}



//Print an employee record
const printEmployeeDetails = () => {
    let newWindow = window.open();

    //using bootstrap CDN link (CSS)
    newWindow.document.write(
        "<!DOCTYPE html>" +
        "<link href='Resources/Bootstrap%205/bootstrap-5.0.2-dist/css/bootstrap.min.css' rel='stylesheet'>" +
        "<script src='Resources/JQuery/JQuery.js'></script>" +
        "<h2> Employee Management </h2>" +
        modalViewEmployee.outerHTML
    )

    //function to print the newly opened window
    setTimeout(function () {
        newWindow.print();
    }, 3000);
};