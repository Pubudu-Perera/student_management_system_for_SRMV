window.addEventListener('load',function(){

    loggedUserPrivileges =  getServiceMapping("/logUserModulePrivilege/byModule/" + "User");

    refreshUserForm();

    refreshUserTable();
})



// function for disable UPDATE button at new record insertion & disable SUBMIT button when existing record is updated.
function disableButton(addSubmit,editUpdate){
    if (addSubmit && loggedUserPrivileges.insert){
        $("#userSubmit").css('pointer-events','all')
        $("#userSubmit").css('cursor','pointer')
        $("#userSubmit").removeAttr('disabled')
    }else{
        $("#userSubmit").css('pointer-events','all')
        $("#userSubmit").css('cursor','not-allowed')
        $("#userSubmit").attr('disabled','disabled')
    }

    if (editUpdate && loggedUserPrivileges.update){
        $("#userUpdate").css('pointer-events','all')
        $("#userUpdate").css('cursor','pointer')
        $("#userUpdate").removeAttr('disabled')
    }else{
        $("#userUpdate").css('pointer-events','all')
        $("#userUpdate").css('cursor','not-allowed')
        $("#userUpdate").attr('disabled','disabled')
    }
}



//refresh the form
function refreshUserForm(){

    disableButton(true,false);

//     creation of user object when adding a new user
    new_user = {};
    old_user = null;

    // role values are sent to back-end using this array

    new_user.roles = [];

    // fetch the appropriate data to the front end
    employeesWithoutUserAccount = getServiceMapping("/employee/employeesWithoutAccount");

    console.log(employeesWithoutUserAccount);

    fillingSelectElements2(selectEmployee,"Select the employee",employeesWithoutUserAccount,'id','calling_name','');



//    service to fetch roles list from database
    userRolesList = getServiceMapping('/role/list');



    //divRoles field empty every time form is refreshed
    divRoles.innerHTML = "";

    for (let index in userRolesList) {
        let divRole = document.createElement("div");
        divRole.classList.add("form-check");
        let inputCheckbox = document.createElement("input");
        inputCheckbox.type = "checkbox";
        inputCheckbox.value = index;
        inputCheckbox.classList.add("form-check-input");
        inputCheckbox.onchange = function () {
            if (this.checked) {
                console.log(this.value);
                console.log("checked");
                new_user.roles.push(userRolesList[this.value]);
                console.log(new_user.roles);
            } else {
                console.log(this.value);
                console.log("unchecked");
                new_user.roles.splice(this.value, 1);
            }
        };

        if (new_user.roles.length !== 0) {
            let extIndex = new_user.roles
                .map((e) => e.role)
                .indexOf(userRolesList[index]["name"]);
            console.log(extIndex);
        }

        let inputLabel = document.createElement("label");
        inputLabel.innerText = userRolesList[index]["name"] + " ";
        inputLabel.classList.add("form-check-label");
        inputLabel.classList.add("fw-bold");

        divRole.appendChild(inputCheckbox);
        divRole.appendChild(inputLabel);
        divRoles.appendChild(divRole);
    }



    // switch on user status when the form is refreshing
    switchStatus.checked = true;
    new_user["user_status"] = true;
}



//refresh the table
function refreshUserTable(){

    users = getServiceMapping("/user/findall");

    userDataList = ["employee.id.name_with_initials", "username",'email','role',"user_status"];

    let userDataType = [getEmployeeNameNumber,"text","text",getUserRoleList,getUserStatus];

    fillDataTable(tableUser,users,userDataList,userDataType,deleteUser,editUser,viewUser,true,loggedUserPrivileges);

    //    connect JQuery datatable plug-in
    $("#tableUser").DataTable();

}



// Password confirmation
function confirmPassword(){
    if (textPassword.value === textRePassword.value){
        textRePassword.classList.remove("is-invalid");
        textRePassword.classList.add("is-valid");
    }else {
        textRePassword.classList.add("is-invalid");
    }
}



//get the employees name and number in 2nd column of the table
// this function is used in when the table is being filling
function getEmployeeNameNumber(object){
    return object.employee_id.employee_no + " -> " + object.employee_id.name_with_initials;
}



//get user roles for the respective user
function getUserRoleList(object){
    let userRoleList = getServiceMapping("/role/getByUserID/" + object.id);

    let userRoles = "";

    for (let index in userRoleList){

        userRoles = userRoles + userRoleList[index].name + ",";
    }

    return userRoles;
}



//indicates user is Active or In-Active
function getUserStatus(object){

    let userStatus = "In-Active";
    if (object["user_status"]){
        userStatus = "Active";
    }

    return userStatus;
}



// checking if there is any invalid & null values
function checkErrors(){
    let errors = "";

    if (new_user.employee_id == null){
        errors += "Employee isn't Selected! \n";
    }

    if (new_user.username == null){
        errors += "Username isn't Entered! \n";
    }

    if(old_user == null) {
        if (new_user.password == null) {
            errors += "Password isn't Entered! \n";
        }

        if (textRePassword.value === "") {
            errors += "Please Confirm Your password! \n";
        }
    }

    if (new_user.email == null){
        errors += "E-mail isn't Entered! \n";
    }

    if (new_user.user_status == null){
        errors += "User Status isn't Selected! \n";
    }

    return errors;

}




// to submit the form to the database
function submitUser(){

    let checkedErrors = checkErrors();

    if (checkedErrors === ""){
        let userResponse = window.confirm("Are you sure to add following user? \n" + "Username : " + new_user.username + "\n E-mail : " + new_user.email);

        if (userResponse){
            let postResponse = getHttpRequestService("/user","POST",new_user);

            if (postResponse === "0"){
                alert("User has been added successfully!");
                refreshUserForm();
                refreshUserTable();
            }else {
                alert(postResponse);
            }
        }
    }else {
        alert("Please correct following errors! \n" + checkedErrors);
    }
}



//delete user record from the table
function deleteUser(object,rowID){

    let user = object;

    let userResponse = window.confirm("Are you sure that you want to delete this user record? ");

    if (userResponse){

        let serverResponse = getHttpRequestService("/user","DELETE",user);

        if (serverResponse === "0"){
            alert("You have successfully deleted the user record!");
            refreshUserTable();
        }else {
            alert("You can't delete the user record. Try again!");
        }
    }

}



//edit user record in the user table
function editUser(object,rowID){

    disableButton(false,true);

    new_user = JSON.parse(JSON.stringify(object));
    old_user = JSON.parse(JSON.stringify(object));


    new_user.roles = getServiceMapping("/role/getByUserID/" + new_user.id) ;
    old_user.roles = getServiceMapping("/role/getByUserID/" + new_user.id) ;


    employeesWithoutUserAccount.push(new_user.employee_id);

    fillingSelectElements2(selectEmployee,"select employee",employeesWithoutUserAccount,'id','calling_name',new_user.employee_id.id);
    selectEmployee.classList.add("is-valid");

    textUsername.value = new_user["username"];
    textUsername.classList.add("is-valid");

    textPassword.disabled = true;
    textRePassword.disabled = true;

    textEmail.value = new_user["email"];
    textEmail.classList.add("is-valid");


    if (new_user.user_status){
        switchStatus.checked = true;
        labelUserStatus.innerText = "User account is active! ";
    }else {
        switchStatus.checked = false;
        labelUserStatus.innerText = "User account is in-active! ";
    }


    userRolesList = getServiceMapping("/role/list");
    divRoles.innerHTML = "";

    for (let index in userRolesList){
        let divRole = document.createElement("div");
        divRole.classList.add("form-check");
        let inputCheckbox = document.createElement("input");
        inputCheckbox.type = "checkbox";
        inputCheckbox.classList.add("form-check-input");
        inputCheckbox.value = index;

        inputCheckbox.onchange = function () {
            if (this.checked) {
                new_user.roles.push(userRolesList[this.value]);
            } else {
                new_user.roles.splice(this.value, 1);
            }
        }

        if (new_user.roles.length !== 0) {
            let extIndex = new_user.roles
                .map(e => e.name)
                .indexOf(userRolesList[index]["name"]);
            if (extIndex !== -1) {
                inputCheckbox.checked = true;
            }
        }

        checkboxLabel = document.createElement("label");
        checkboxLabel.innerHTML = userRolesList[index]['name'];
        checkboxLabel.classList.add("form-check-label");
        checkboxLabel.classList.add("fw-bold");

        divRole.appendChild(inputCheckbox);
        divRole.appendChild(checkboxLabel);
        divRoles.appendChild(divRole);
    }
}



//view user record in the user table
function viewUser(object,rowID){
    let user = object;

    tdId.innerHTML = user.id;
    tdNameWithInitials.innerHTML = user.employee_id.name_with_initials;
    tdEmail.innerHTML = user.email;
    tdUsername.innerHTML = user.username;
    tdRoles.innerHTML = user.getUserRoleList(user);
    tdStatus.innerHTML = user.getUserStatus(user);


    $('#modalViewUser').modal("show");
}



// check updates
function checkUpdates(){
    let updates = "";
    //
    if (old_user != null && old_user["username"] !== new_user["username"]){
        updates += "Username has been changed from " + old_user["username"] + " to " + new_user["username"];
    }


    if (old_user != null && old_user["email"] !== new_user["email"]){
        updates += "E-mail has been changed from " + old_user["email"] + " to " + new_user["email"];
    }

    if (old_user != null && old_user["user_status"] !== new_user["user_status"]){
        updates += "User Status has been changed from " + old_user["user_status"] + " to " + new_user["user_status"];
    }

    return updates;
}



// update an user record
function updateUser(){

    let errors = checkErrors();
    if (errors === "") {

        let updatedData = checkUpdates();
        if (updatedData !== "") {
            let userResponse = window.confirm("Are you sure that you want to make following changes to the particular record? " + updatedData);
            if (userResponse) {
                let serverResponse = getHttpRequestService("/user", "PUT", new_user);

                if (serverResponse === "0") {
                    alert("User record is updated successfully!");
                    refreshUserForm();
                    refreshUserTable();
                } else {
                    alert("Error! Can not update the user record! " + serverResponse);
                }
            }
        } else {
            alert("No updates have been made to the previous data of the particular record!");
        }
    }else {
        alert("Please correct following errors! " + errors);
    }

}
