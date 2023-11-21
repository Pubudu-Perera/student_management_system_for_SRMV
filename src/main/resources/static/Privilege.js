window.addEventListener("load",function (){

    loggedUserPrivileges = getServiceMapping("/logUserModulePrivilege/byModule/" + "Privilege");
    refreshPrivilegeForm();

    refreshPrivilegeTable();
})

//
function disableButton(addSubmit,editUpdate){
    if (addSubmit && loggedUserPrivileges.insert){
        $("#privilegeSubmit").css('pointer-events','all')
        $("#privilegeSubmit").css('cursor','pointer')
        $("#privilegeSubmit").removeAttr('disabled')
    }else{
        $("#privilegeSubmit").css('pointer-events','all')
        $("#privilegeSubmit").css('cursor','not-allowed')
        $("#privilegeSubmit").attr('disabled','disabled')
    }

    if (editUpdate && loggedUserPrivileges.update){
        $("#privilegeUpdate").css('pointer-events','all')
        $("#privilegeUpdate").css('cursor','pointer')
        $("#privilegeUpdate").removeAttr('disabled')
    }else{
        $("#privilegeUpdate").css('pointer-events','all')
        $("#privilegeUpdate").css('cursor','not-allowed')
        $("#privilegeUpdate").attr('disabled','disabled')
    }
}



//Refresh Privilege form
function refreshPrivilegeForm(){

    new_privilege = {}
    old_privilege = null;


    roles = getServiceMapping("/role/list");
    fillingSelectElements(selectRole,"Select Role",roles,"name");

    modules = getServiceMapping("/module/list");
    fillingSelectElements(selectModule,"Select Module",modules,"name");

    disableButton(true,false);
}



//refresh privilege table
function refreshPrivilegeTable(){

    privileges = getServiceMapping("/privilege/list");

    privilegeDataList = ["roles_id.name","module_id.name","select_permit","update_permit","insert_permit","delete_permit"];

    let privilegeDataType = ["object","object",selectPrivilege,updatePrivilege,insertPrivilege,deletePrivilege];

    fillDataTable(privilegeTable,privileges,privilegeDataList,privilegeDataType,deletePrivilegeRecord,editPrivilegeRecord,viewPrivilegeRecord,true,loggedUserPrivileges);

    $("#privilegeTable").DataTable();
}



// illustrate select privilege granted or not according to the boolean value
function selectPrivilege(object){
    let privilege = "Not-Granted";

    if (object["select_permit"]){
        privilege = "Granted";
    }

    return privilege;
}



// illustrate update privilege granted or not according to the boolean value
function updatePrivilege(object){
    let privilege = "Not-Granted";

    if (object["update_permit"]){
        privilege = "Granted";
    }

    return privilege;
}



// illustrate insert privilege granted or not according to the boolean value
function insertPrivilege(object){
    let privilege = "Not-Granted";

    if (object["insert_permit"]){
        privilege = "Granted";
    }

    return privilege;
}



// illustrate delete privilege granted or not according to the boolean value
function deletePrivilege(object){
    let privilege = "Not-Granted";

    if (object["delete_permit"]){
        privilege = "Granted";
    }

    return privilege;
}



function deletePrivilegeRecord(object,rowID){

    let privilege = object;

    let userResponse = window.confirm("Are you sure to delete this privilege record? ");

    if (userResponse){
        let serverResponse = getHttpRequestService("/privilege","DELETE",privilege);
        if (serverResponse === "0"){
            alert("You have successfully deleted the record! ");
            refreshPrivilegeTable();
            refreshPrivilegeForm();
        }else {
            alert("Error! You can not delete the record! " + serverResponse);
        }
    }
}



function editPrivilegeRecord(object,rowID){
    new_privilege = getServiceMapping("/privilege/getByID?id=" + object.id);
    old_privilege = getServiceMapping("/privilege/getByID?id=" + object.id);

    fillingSelectElements(selectRole,"",roles,"name",new_privilege.roles_id.name);

    fillingSelectElements(selectModule,"",modules,"name",new_privilege.module_id.name);

    if(new_privilege["select_permit"]){
        switchSelectYes.checked = true;
        label_select_granted.style.color = "green";
    }else{
        switchSelectNo.checked = true;
        label_select_Notgranted.style.color = "green";
    }

    if(new_privilege["update_permit"]){
        switchUpdateYes.checked = true;
        label_update_granted.style.color = "green";
    }else{
        switchUpdateNo.checked = true;
        label_update_notGranted.style.color = "green";
    }

    if(new_privilege["insert_permit"]){
        switchInsertYes.checked = true;
        label_insert_granted.style.color = "green";
    }else{
        switchInsertNo.checked = true;
        label_insert_Notgranted.style.color = "green";
    }

    if(new_privilege["delete_permit"]){
        switchDeleteYes.checked = true;
        label_delete_granted.style.color = "green";
    }else{
        switchDeleteNo.checked = true;
        label_delete_notGranted.style.color = "green";
    }

    disableButton(false,true);
}



function viewPrivilegeRecord(object,rowID){
    let privilege = object;

    tdRole.innerHTML = privilege.roles_id.name;
    tdModule.innerHTML = privilege.module_id.name;

    if(privilege["select_permit"]){
        tdSelect.innerHTML = "Granted";
    }else{
        tdSelect.innerHTML = "Not-Granted";
    }

    if(privilege["update_permit"]){
        tdUpdate.innerHTML = "Granted";
    }else{
        tdUpdate.innerHTML = "Not-Granted";
    }

    if(privilege["insert_permit"]){
        tdInsert.innerHTML = "Granted";
    }else{
        tdInsert.innerHTML = "Not-Granted";
    }

    if(privilege["delete_permit"]){
        tdDelete.innerHTML = "Granted";
    }else{
        tdDelete.innerHTML = "Not-Granted";
    }


    $("#modalViewPrivilege").modal("show");
}



//check errors
function checkErrors(){

    let errors = "";

    if (new_privilege.roles_id == null){
        errors += "Please select the role \n";
    }

    if (new_privilege.module_id == null){
        errors += "Please select the module \n";
    }

    if (new_privilege["select_permit"] == null){
        errors += "Privilege for SELECT operation isn't selected \n";
    }

    if (new_privilege["update_permit"] == null){
        errors += "Privilege for UPDATE operation isn't selected \n";
    }

    if (new_privilege["insert_permit"] == null){
        errors += "Privilege for INSERT operation isn't selected \n";
    }

    if (new_privilege["delete_permit"] == null){
        errors += "Privilege for DELETE operation isn't selected \n";
    }

    return errors;
}



//submit form
function submitPrivilegeForm(){
    let errors = checkErrors();

    if (errors === ""){
        let userResponse = window.confirm("Are you sure to add this privilege record? ");
        if (userResponse){
            let serverResponse = getHttpRequestService("/privilege","POST",new_privilege);
            if (serverResponse === "0"){
                alert("Privilege record added successfully!");
                refreshPrivilegeTable();
                refreshPrivilegeForm();
            }else {
                alert(serverResponse);
            }
        }
    }else {
        alert("Please correct following errors! \n" + errors);
    }
}



//what has been updated
function checkUpdate(){
    let updates = "";

    if (old_privilege["roles_id"].name !== new_privilege["roles_id"].name){
        updates += "Role has been changed from " + old_privilege["roles_id"].name + " to " + new_privilege["roles_id"].name + "\n";
    }

    if (old_privilege["module_id"].name !== new_privilege["module_id"].name ){
        updates += "Module has been changed from " + old_privilege["module_id"].name + " to " + new_privilege["module_id"].name + "\n";
    }

    if (old_privilege["select_permit"] !== new_privilege["select_permit"] ){
        updates += "Privilege for SELECT operation has been changed from " + old_privilege["select_permit"] + " to " + new_privilege["select_permit"] + "\n";
    }

    if (old_privilege["update_permit"] !== new_privilege["update_permit"] ){
        updates += "Privilege for UPDATE operation has been changed from " + old_privilege["update_permit"] + " to " + new_privilege["update_permit"] + "\n";
    }

    if (old_privilege["insert_permit"] !== new_privilege["insert_permit"] ){
        updates += "Privilege for INSERT operation has been changed from " + old_privilege["insert_permit"] + " to " + new_privilege["insert_permit"] + "\n";
    }

    if (old_privilege["delete_permit"] !== new_privilege["delete_permit"] ){
        updates += "Privilege for DELETE operation has been changed from " + old_privilege["delete_permit"] + " to " + new_privilege["delete_permit"] + "\n";
    }

    return updates;
}



//update privilege form
//function is calling when the user press UPDATE button
function updatePrivilegeForm(){

    let errors = checkErrors();

    if (errors === ""){

        let updates = checkUpdate();

        if (updates !== ""){
            let userResponse = window.confirm("Are you sure to make following updates? " + updates);

            if (userResponse){
                let serverResponse = getHttpRequestService("/privilege","PUT",new_privilege);

                if (serverResponse === "0") {
                    refreshPrivilegeForm();
                    refreshPrivilegeTable();
                    alert("Privilege record has successfully been updated!");
                }else {
                    alert("Error! You can't update the privilege record!");
                }
            }

        }else {
            alert("You don't have made any change to the record!");
        }
    }else {
        alert("Please correct following errors! " + errors);
    }
}



//reset values of privilege form
function resetPrivilegeForm(){
    selectRole.value = null;
    selectRole.classList.remove("is-valid");

    selectModule.value = null;
    selectModule.classList.remove("is-valid");

    switchSelectYes.checked = false;
    label_select_granted.style.color = 'rgb(115,20,18)';

    switchSelectNo.checked = false;
    label_select_notGranted.style.color = 'rgb(115,20,18)';

    switchUpdateYes.checked = false;
    label_update_granted.style.color = 'rgb(115,20,18)';

    switchUpdateNo.checked = false;
    label_update_notGranted.style.color = 'rgb(115,20,18)';

    switchInsertYes.checked = false;
    label_insert_granted.style.color = 'rgb(115,20,18)';

    switchInsertNo.checked = false;
    label_insert_notGranted.style.color = 'rgb(115,20,18)';

    switchDeleteYes.checked = false;
    label_delete_granted.style.color = 'rgb(115,20,18)';

    switchDeleteNo.checked = false;
    label_delete_notGranted.style.color = 'rgb(115,20,18)';

}
