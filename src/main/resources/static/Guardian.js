window.addEventListener('load',function(){

    loggedUserPrivileges = getServiceMapping("/logUserModulePrivilege/byModule/" + "Guardian");

    refreshGuardianForm();

    refreshGuardianTable();

});



// function for disable UPDATE button at new record insertion & disable SUBMIT button when existing record is updated.
function disableButton(addSubmit,editUpdate){
    if (addSubmit && loggedUserPrivileges.insert){
        $("#guardianSubmit").css('pointer-events','all')
        $("#guardianSubmit").css('cursor','pointer')
        $("#guardianSubmit").removeAttr('disabled')
    }else{
        $("#guardianSubmit").css('pointer-events','all')
        $("#guardianSubmit").css('cursor','not-allowed')
        $("#guardianSubmit").attr('disabled','disabled')
    }

    if (editUpdate && loggedUserPrivileges.update){
        $("#guardianUpdate").css('pointer-events','all')
        $("#guardianUpdate").css('cursor','pointer')
        $("#guardianUpdate").removeAttr('disabled')
    }else{
        $("#guardianUpdate").css('pointer-events','all')
        $("#guardianUpdate").css('cursor','not-allowed')
        $("#guardianUpdate").attr('disabled','disabled')
    }
}




// refresh form
function refreshGuardianForm(){
	
	new_guardian = {};
	old_guardian = null;
	
	//need to load all the relationship data from relationship table to the Relationship select element
    relationships = getServiceMapping("/relationship/list");
    fillingSelectElements(selectRelationship,"Select relationship with student",relationships,"name");

    guardian_statuses = getServiceMapping("/guardian/guardian_status_list");
    fillingSelectElements(selectGuardianStatus,"Select Guardian Status",guardian_statuses,"name");


    // remove validations & values when the form is refreshed
    textFullName.value = ""
    textFullName.classList.remove("is-valid");

    textInitials.value = ""
    textInitials.classList.remove("is-valid");

    textNIC.value = ""
    textNIC.classList.remove("is-valid");

    dateDOB.value = ""
    dateDOB.classList.remove("is-valid");

    selectRelationship.value = ""
    selectRelationship.classList.remove("is-valid");

    textOccupation.value = "";
    textOccupation.classList.remove("is-valid");

    textMobile.value = ""
    textMobile.classList.remove("is-valid");

    textLandline.value = ""
    textLandline.classList.remove("is-valid");

    textEmail.value = ""
    textEmail.classList.remove("is-valid");

    textPermanent_address.value = ""
    textPermanent_address.classList.remove("is-valid");

    textCurrent_address.value = "";
    textCurrent_address.classList.remove("is-valid");

    textWhatsapp.value = ""
    textWhatsapp.classList.remove("is-valid");

    textTelegram.value = ""
    textTelegram.classList.remove("is-valid");

    selectGuardianStatus.value = "";
    selectGuardianStatus.classList.remove("is-valid");

    disableButton(true,false);

}



//refresh the guardian table every time page is loaded.
//refresh table
function refreshGuardianTable() {

    //"guardians" store the all data fetch from the guardian table of database
    let guardians = getServiceMapping("/guardian/findall");

    // property list to be showed in the guardian table
    // Those values in the array should exactly be same as the variable names which defined in entity class GuardianController.java
    let guardianProperties = ["name_with_initials", "mobile", "permanent_address" ,"relationship_id.name","guardian_status_id.name"];


    // types of attributes in  guardianProperties array
    let typeGuardianProperties = ["text", "text", "text","object","object"];

    fillDataTable(tableGuardian, guardians, guardianProperties, typeGuardianProperties, deleteGuardianRecord, editGuardianRecord, viewGuardianRecord,true,loggedUserPrivileges);

//    connect JQuery datatable plug-in
    $("#tableGuardian").DataTable();
}



//delete record from guardian table when clicking delete icon in Modify column of Guardian table(Actually what happen is change Guardian status into DELETE)
function deleteGuardianRecord(object, rowID) {
    let guardian = object;
    let userResponse = window.confirm("Are you sure to delete Guardian " + guardian.name_with_initials + " from the table?");

    if (userResponse) {

        let serverResponse = getHttpRequestService("/guardian", "DELETE", guardian);
        if (serverResponse === "0") {
            alert("You have successfully deleted the record!");
            refreshGuardianTable();
        } else {
            alert("Error! You can't delete the record \n" + serverResponse);
        }
    }

}



//edit guardian record from guardian table when clicking delete icon in Modify column of Guardian table
function editGuardianRecord(object, rowID) {
    new_guardian = getServiceMapping("/guardian/getByID?id=" + object.id);
    old_guardian = getServiceMapping("/guardian/getByID?id=" + object.id);


    textFullName.value = new_guardian.full_name;
    textFullName.classList.add("is-valid") ;

    textInitials.value = new_guardian.name_with_initials;
    textInitials.classList.add("is-valid");

    textNIC.value = new_guardian.nic;
    textNIC.classList.add("is-valid");

    dateDOB.value = new_guardian.date_of_birth;
    dateDOB.classList.add("is-valid");



    if (new_guardian.gender === "Male"){
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



    fillingSelectElements(selectRelationship,"Select the relationship",relationships,"name",new_guardian.relationship_id.name);
    selectRelationship.classList.add("is-valid");



    if (new_guardian.employment_status === "Employed"){
        statusYes.checked = true;
        statusNo.checked = false;
        labelYes.style.color = "green";
        labelNo.style.color = "rgb(115,20,18)";
        textOccupation.style.visibility = "visible";
        labelOccupation.style.visibility = "visible";
    }
    else {
        statusYes.checked = false;
        statusNo.checked = true;
        labelYes.style.color = "rgb(115,20,18)";
        labelNo.style.color = "green";
        labelOccupation.style.visibility = "hidden";
        textOccupation.style.visibility = "hidden";
    }



    if (new_guardian["occupation"] !== undefined) {
        textOccupation.value = new_guardian["occupation"];
        textOccupation.classList.add("is-valid");
    }else {
        textOccupation.style.borderColor = "rgb(115,20,18)";
    }



    textMobile.value = new_guardian.mobile;
    textMobile.classList.add("is-valid");



    if (new_guardian["landline"] !== undefined) {
        textLandline.value = new_guardian["landline"];
        textLandline.classList.add("is-valid");
    }else {
        textLandline.style.borderColor = "rgb(115,20,18)";
    }



    if (new_guardian["email"] !== undefined) {
        textEmail.value = new_guardian["email"];
        textEmail.classList.add("is-valid");
    }else {
        textEmail.style.borderColor = "rgb(115,20,18)";
    }


    textPermanent_address.value = new_guardian.permanent_address;
    textPermanent_address.classList.add("is-valid");



    if(new_guardian["current_address"] !== undefined){
        textCurrent_address.value = new_guardian["current_address"];
        textCurrent_address.classList.add("is-valid");
    }else {
        textCurrent_address.style.borderColor = "rgb(115,20,18)";
    }


    if (new_guardian["whatsapp"] !== undefined) {
        textWhatsapp.value = new_guardian.whatsapp;
        textWhatsapp.classList.add("is-valid");
    }else {
        textWhatsapp.style.borderColor = "rgb(115,20,18)";
    }



    if (new_guardian["telegram"] !== undefined) {
        textTelegram.value = new_guardian.telegram;
        textTelegram.classList.add("is-valid");
    }else {
        textTelegram.style.borderColor = "rgb(115,20,18)";
    }

    fillingSelectElements(selectGuardianStatus,"Select Guardian Status",guardian_statuses,"name",new_guardian.guardian_status_id.name);
    selectGuardianStatus.classList.add("is-valid");

    disableButton(false,true);
}




//view particular guardian record from guardian table when clicking delete icon in Modify column of Guardian table
function viewGuardianRecord(object, rowID) {
    let guardian = object;

    tdId.innerHTML = guardian.id;
    tdFullName.innerHTML = guardian.full_name;
    tdNameWithInitials.innerHTML = guardian.name_with_initials;

    if (guardian.nic !== undefined){
        tdNIC.innerHTML = guardian.nic;
    }else{
        tdNIC.innerHTML = "-";
    }

    tdDOB.innerHTML = guardian.date_of_birth;
    tdGender.innerHTML = guardian.gender;

    tdPermanentAddress.innerHTML = guardian.permanent_address;

    if (guardian.current_address !== undefined){
        tdCurrentAddress.innerHTML = guardian.current_address;
    }else{
        tdCurrentAddress.innerHTML = "-";
    }

    if (guardian.guardian_status === true){
        tdStatus.innerHTML = "Active";
    }else{
        tdStatus.innerHTML = "In-active";
    }

    $("#modalViewGuardian").modal("show");

}



//checking errors. Inspect, are there any blank fields which are required due to providing null or invalidate value.
//if there are any, return the errors & illustrate which fields are having errors
function checkErrors() {

    let errors = "";

    if (new_guardian.full_name == null) {
        errors += "Guardian's full name is not entered! \n";
        textFullName.classList.add("is-invalid");

    }

    if (new_guardian.name_with_initials == null) {
        errors += "Guardian's Name with Initials is not entered! \n";
        textInitials .classList.add("is-invalid");
    }

    if (new_guardian.nic == null) {
        errors += "Guardian's NIC is not entered! \n";
        textNIC.classList.add("is-invalid");

    }

    if (selectRelationship.value === "") {
        errors += "Guardian's Relationship to the Student is not selected! \n";
        selectRelationship.classList.add("is-invalid");
    }

    if (new_guardian.employement_status == null){
        errors += "Guardian's Employment Status is not selected! \n";
        labelYes.style.color = "red";
        labelNo.style.color = "red";

    }
    if (new_guardian["mobile"] == null) {
            errors += "Guardian's Mobile Number is not entered! \n";
            textMobile.classList.add("is-invalid");

    }

    if (new_guardian.permanent_address == null) {
            errors += "Guardian's Permanent Address is not entered! \n";
            textPermanent_address.classList.add("is-invalid");
    }

    if (new_guardian["guardian_status_id"] == null){
        errors += "Guardian status is not selected! \n";
        selectGuardianStatus.classList.add("is-invalid");
    }

    return errors;
}



//submit the guardian form when clicking submit button
function submitGuardian() {

    console.log(new_guardian)
        let error = checkErrors();
        if (error === "") {
            let askConfirmation = "Are you sure to Submit " + new_guardian.name_with_initials + "\'s details?";

            let userResponse = window.confirm(askConfirmation);

            if (userResponse) {

                let serverResponse = getHttpRequestService("/guardian","POST",new_guardian);

                if (serverResponse === "0") {
                    alert("Guardian details have been submitted successfully!");
                    refreshGuardianForm();
                    refreshGuardianTable();
                } else {
                    alert("Employee record can not be added! Please correct following errors! \n" + serverResponse);
                }
            }
        } else {
            alert("Please fill out mentioned fields! \n" + error);
        }

    }



//check if there are any updates
function checkUpdates(){
    let updates = "";

        //first of all check the objects are empty or not. the function only executes if both are non-empty
    if (new_guardian != null && old_guardian != null){

            //    start to check each filed is updated or not
            if (new_guardian.full_name !== old_guardian.full_name){
                updates += "Guardian's full name has been changed from " + old_guardian.full_name + " to " + new_guardian.full_name + "\n";
            }
            if (new_guardian.name_with_initials !== old_guardian.name_with_initials){
                updates += "Guardian's name with initials has been changed from " + old_guardian.name_with_initials + " to " + new_guardian.name_with_initials + "\n";
            }
            if (new_guardian.nic !== old_guardian.nic){
                updates += "Guardian's NIC has been changed from " + old_guardian.nic + " to " + new_guardian.nic + "\n";
            }
            if (new_guardian.date_of_birth !== old_guardian.date_of_birth){
                updates += "Guardian's Date of Birth has been changed from " + old_guardian.date_of_birth + " to " + new_guardian.date_of_birth + "\n";
            }
            if (new_guardian.gender !== old_guardian.gender){
                updates += "Guardian's gender has been changed from " + old_guardian.gender + " to " + new_guardian.gender + "\n";
            }
            if (new_guardian.relationship_id.name !== old_guardian.relationship_id.name){
                updates += "Guardian's relationship to the student has been changed from " + old_guardian.relationship_id.name + " to " + new_guardian.relationship_id.name + "\n";
            }
            if (new_guardian.employement_status !== old_guardian.employement_status){
                updates += "Guardian's employment status has been changed from " + old_guardian.employement_status + " to " + new_guardian.employement_status + "\n";
            }
            if (new_guardian["mobile"] !== old_guardian["mobile"]){
                updates += "Guardian's Mobile number has been changed from " + old_guardian["mobile"] + " to " + new_guardian["mobile"] + "\n";
            }
            if (new_guardian.landline !== old_guardian.landline){
                updates += "Guardian's Landline number has been changed from " + old_guardian.landline + " to " + new_guardian.landline + "\n";
            }

            if (new_guardian.occupation !== old_guardian.occupation){
                updates += "Guardian's occupation has been changed from " + old_guardian.occupation + " to " + new_guardian.occupation + "\n";
            }
            if (new_guardian.email !== old_guardian.email){
                updates += "Guardian's E-mail has been changed from " + old_guardian.email + " to " + new_guardian.email + "\n";
            }
            if (new_guardian["permanent_address"] !== old_guardian["permanent_address"]){
                updates += "Guardian's Address has been changed from " + old_guardian["permanent_address"] + " to " + new_guardian["permanent_address"] + "\n";
            }
            if (new_guardian["current_address"] !== old_guardian["current_address"]){
                updates += "Guardian's Address has been changed from " + old_guardian["current_address"] + " to " + new_guardian["current_address"] + "\n";
            }
            if (new_guardian["whatsapp"] !== old_guardian["whatsapp"]){
                updates += "Guardian's WhatsApp number has been changed from " + old_guardian["whatsapp"] + " to " + new_guardian["whatsapp"] + "\n";
            }
            if (new_guardian.telegram !== old_guardian.telegram){
                updates += "Guardian's Telegram number has been changed from " + old_guardian.telegram + " to " + new_guardian.telegram + "\n";
            }

            if (new_guardian["guardian_status_id"].name !== old_guardian["guardian_status_id"].name){
                updates += "Guardian's status has been changed from " + old_guardian["guardian_status_id"].name + " to " + new_guardian["guardian_status_id"].name + "\n";
            }

        }

    return updates;
}



//     update the guardian form
function updateGuardian(){

    let errors = checkErrors();
    if (errors === "") {

        let updatedData = checkUpdates();
        if (updatedData !== "") {
            let userResponse = window.confirm("Are you sure that you want to make following changes to the particular record? " + updatedData);
            if (userResponse) {
                let serverResponse = getHttpRequestService("/guardian", "PUT", new_guardian);

                if (serverResponse === "0") {
                    alert("Guardian record is updated successfully!");
                    refreshGuardianForm();
                    refreshGuardianTable();
                } else {
                    alert("Error! Can not update the guardian record!");
                }
            }
        } else {
            alert("No updates have been made to the previous data of the particular record!");
        }
    }else {
        alert("Please correct following errors! " + errors);
    }
}



// auto create occupation field if the guardian is employed, radio button true
function addOccupation() {
        if (statusYes.checked) {
            textOccupation.style.visibility = "visible";
            labelOccupation.style.visibility = "visible";
        }
        if (statusNo.checked) {
            labelOccupation.style.visibility = "hidden";
            textOccupation.style.visibility = "hidden";
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
                new_guardian["gender"] = "Male";
                label_male.style.color = "green";
                label_female.style.color = "rgb(115,20,18)";
            } else {
                genderFemale.checked = true;
                new_guardian["gender"] = "Female";
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
            new_guardian["date_of_birth"] = finalBirthDate;
        } else {
            dateDOB.classList.remove("is-valid");
            dateDOB.value = "";

        }

    }



//check whether the NIC already exist in the database
function nicValidator() {
        let nicRegExp = new RegExp('^([0-9]{9}[VvXx])|([0-9]{12})$');

        if (nicRegExp.test(textNIC.value)) {

            let existingNIC = getServiceMapping("guardian/getByNIC/" + textNIC.value);

            if (existingNIC !== undefined) {
                textNIC.classList.add("is-invalid");
                alert("This NIC already exists in the database!");
            }
        }
    }



function resetGuardianForm(){
    // remove validations & values when the form is refreshed
    textFullName.value = ""
    textFullName.classList.remove("is-valid");
    textFullName.classList.remove("is-invalid");

    textInitials.value = ""
    textInitials.classList.remove("is-valid");
    textInitials.classList.remove("is-invalid");

    textNIC.value = ""
    textNIC.classList.remove("is-valid");
    textNIC.classList.remove("is-invalid");

    dateDOB.value = ""
    textNIC.classList.remove("is-valid");
    textNIC.classList.remove("is-invalid");

    selectRelationship.value = ""
    selectRelationship.classList.remove("is-valid");
    selectRelationship.classList.remove("is-invalid");

    textOccupation.value = "";
    textOccupation.classList.remove("is-valid");
    textOccupation.classList.remove("is-invalid");

    textMobile.value = ""
    textMobile.classList.remove("is-valid");
    textMobile.classList.remove("is-invalid");

    textLandline.value = ""
    textLandline.classList.remove("is-valid");
    textLandline.classList.remove("is-invalid");

    textEmail.value = ""
    textEmail.classList.remove("is-valid");
    textEmail.classList.remove("is-invalid");

    textPermanent_address.value = ""
    textPermanent_address.classList.remove("is-valid");
    textPermanent_address.classList.remove("is-invalid");

    textCurrent_address.value = "";
    textCurrent_address.classList.remove("is-valid");
    textCurrent_address.classList.remove("is-invalid");

    textWhatsapp.value = ""
    textWhatsapp.classList.remove("is-valid");
    textWhatsapp.classList.remove("is-invalid");

    textTelegram.value = ""
    textTelegram.classList.remove("is-valid");
    textTelegram.classList.remove("is-invalid");
}



function printUserDetails(){

}
