window.addEventListener("load",function (){

    loggedUserPrivileges = getServiceMapping("/logUserModulePrivilege/byModule/" + "AcademicYear");

    refreshAcaYearForm();

    refreshAcaYearTable();
})



// button disable
function disableButton(addSubmit,editUpdate){
    if (addSubmit && loggedUserPrivileges.insert){
        $("#acaYearSubmitButton").css('pointer-events','all')
        $("#acaYearSubmitButton").css('cursor','pointer')
        $("#acaYearSubmitButton").removeAttr('disabled')
    }else{
        $("#acaYearSubmitButton").css('pointer-events','all')
        $("#acaYearSubmitButton").css('cursor','not-allowed')
        $("#acaYearSubmitButton").attr('disabled','disabled')
    }

    if (editUpdate && loggedUserPrivileges.update){
        $("#acaYearUpdateButton").css('pointer-events','all')
        $("#acaYearUpdateButton").css('cursor','pointer')
        $("#acaYearUpdateButton").removeAttr('disabled')
    }else{
        $("#acaYearUpdateButton").css('pointer-events','all')
        $("#acaYearUpdateButton").css('cursor','not-allowed')
        $("#acaYearUpdateButton").attr('disabled','disabled')
    }
}



//refresh academic year form
function refreshAcaYearForm(){
    new_aca_year = {}
    old_aca_year = null;

//creating an array to store the values of academicYearHasEventsList
    new_aca_year.academicYearHasEventsList = [];

    //calling the inner form & table refreshing function
    refreshInnerFormAndTable();


//     academic year status list
    aca_year_statuses = getServiceMapping("academic_year/aca_status_list");
    fillingSelectElements(selectAcaStatus,'Select academic year status',aca_year_statuses,'name');

    disableButton(true,false);
}



// check errors
function checkErrors(){
    let errors = "";

    if (new_aca_year["name"] == null){
        errors += "\n Please enter academic year name \n";
    }

    if (new_aca_year["start_date"] == null){
        errors += "Please select academic year starting date\n";
    }

    if (new_aca_year["end_date"] == null){
        errors += "Please select academic year ending date \n";
    }

    if (new_aca_year["aca_status_id"] == null){
        errors += "Please select academic year status \n";
    }

    if (new_aca_year.academicYearHasEventsList.length === 0){
        errors += "Please enter appropriate events";
    }

    return errors;
}



// submit aca year form
function submitAcaYear(){
    let error = checkErrors();

    if (error === ""){
        let userResponse = window.confirm("Are you sure to add this academic year record? ");
        if (userResponse){
            let serverResponse = getHttpRequestService("/academic_year","POST",new_aca_year);
            if (serverResponse === "0"){
                alert("Academic year record added successfully!");
                refreshAcaYearTable();
                refreshAcaYearForm();
            }else {
                alert("Server error! " + serverResponse);
            }
        }
    }else {
        alert("Please correct following errors! \n" + error);
    }
}



//refresh academic year table
function refreshAcaYearTable(){

    academic_years = getServiceMapping("/academic_year/list");

    academic_year_properties = ["name","start_date","end_date","academicYearHasEventsList","aca_status_id.name"];

    academic_year_data_types = ["text","text","text",getEvents,"object"];

    fillDataTable(tableAcademicYear,academic_years,academic_year_properties,academic_year_data_types,deleteAcaRecord,editAcaRecord,viewAcaRecord,true,loggedUserPrivileges);

    $("#tableAcademicYear").DataTable();
}



// Getting events related to particular academic year
// called at refreshAcaYearTable()
function getEvents(object){
    let eventName = "";
    for (let index in object.academicYearHasEventsList){
        if (object.academicYearHasEventsList.length - 1 === index){
            eventName += object.academicYearHasEventsList[index].event_id.name;
        }else {
            eventName += object.academicYearHasEventsList[index].event_id.name + ", ";
        }
    }
    return eventName;
}



function deleteAcaRecord(object,rowID){

    let deletingAcaYear = object;

    let userResponse = window.confirm("Are you sure to delete this academic year record? ");

    if (userResponse){

        let serverResponse = getHttpRequestService("/academic_year","DELETE",deletingAcaYear);
        if (serverResponse === "0"){
            alert("Academic Year record successfully deleted!");
            refreshAcaYearForm();
            refreshAcaYearTable();
        }else {
            alert("Server error! " + serverResponse);
        }
    }

}



function editAcaRecord(){

    disableButton(false,true);
}



function viewAcaRecord(){

}



//refresh events inner form
function refreshInnerFormAndTable(){

    // Inner form area
    new_academicYearHasEvents = {}
    old_academicYearHasEvents = null;

    let innerEvents = getServiceMapping("/event/list");
    fillingSelectElements(selectEvent,"Select Event",innerEvents,'name');

    dateEventStart.value = "";
    dateEventStart.classList.remove("is-valid");

    dateEventEnd.value = "";
    dateEventEnd.classList.remove("is-valid");

    selectEvent.classList.remove("is-valid");

    //inner table area
    let innerEventProperties = ["event_id.name","start_date","end_date"];

    let innerEventDataTypes = ["object","text","text"];

    fillInnerDataTable(innerTableEvent,new_aca_year.academicYearHasEventsList,innerEventProperties,innerEventDataTypes,deleteInnerEvent);
}



function deleteInnerEvent(object,rowID){
    new_aca_year.academicYearHasEventsList.splice(rowID,1);
    refreshInnerFormAndTable();
}



function submitInnerEventForm(){

    new_aca_year.academicYearHasEventsList.push(new_academicYearHasEvents);
    refreshInnerFormAndTable();
}



// update academic year record
function updateAcaYear(){

}