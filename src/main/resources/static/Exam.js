window.addEventListener("load",function (){

    loggedUserPrivileges = getServiceMapping("/logUserModulePrivilege/byModule/" + "Exam");

    refreshExamForm();

    refreshExamTable();

})


// button disable
function disableButton(addSubmit,editUpdate){
    if (addSubmit && loggedUserPrivileges.insert){
        $("#examSubmit").css('pointer-events','all')
        $("#examSubmit").css('cursor','pointer')
        $("#examSubmit").removeAttr('disabled')
    }else{
        $("#examSubmit").css('pointer-events','all')
        $("#examSubmit").css('cursor','not-allowed')
        $("#examSubmit").attr('disabled','disabled')
    }

    if (editUpdate && loggedUserPrivileges.update){
        $("#examUpdate").css('pointer-events','all')
        $("#examUpdate").css('cursor','pointer')
        $("#examUpdate").removeAttr('disabled')
    }else{
        $("#examUpdate").css('pointer-events','all')
        $("#examUpdate").css('cursor','not-allowed')
        $("#examUpdate").attr('disabled','disabled')
    }
}



//Refresh exam form
function refreshExamForm(){

    disableButton(true,false);

    new_exam = {}
    old_exam = null;

    new_exam.examHasSubjectsList = [];

    refreshInnerSubjectFormAndTable();

//  Active academic year list
    academic_years = getServiceMapping("/academic_year/activeAcademicYear");
    fillingSelectElements(selectAcaYear,"Select Academic Year",academic_years,'name',JSON.parse(getCurrentDate("year","")));



//     Grade list
    grades = getServiceMapping("/grade/list");
    fillingSelectElements(selectGrade,"Select Grade",grades,'name');

//     Exam status
    examStatuses = getServiceMapping("/exam/examStatusList");
    fillingSelectElements(selectExamStatus,"Select Exam Status",examStatuses,'name');

}



// get exam events according to the academic year
// filter function which is called in when the academic year is selected.
function getExamEventsByAcaYear(){

    //  Exam event list
    events = getServiceMapping("/event/examEventByAcaYear/" + JSON.parse(selectAcaYear.value).id);
    fillingSelectElements(selectEvent,"Select event",events,'name');

}



// get subjects according to the grade
// this filter function called in when the grade is selected.

function getSubjectsByGrade(){

    let subjectsByGrade = getServiceMapping("/subject/getByGradeID/" + JSON.parse(selectGrade.value).id);

    fillingSelectElements(selectSubject,"Select subject",subjectsByGrade,"name");
}



// function for get the min & max values for start time of exam of particular subject according to the term's time allocation
// function setTimeMinMax(){
//
//         dateStartTime.min = dateStart.value;
//         dateEndTime.max = dateEnd.value;
//
//         console.log(dateStartTime.min);
//         console.log(dateEndTime.max);
// }



// Auto generate the exam name
function examNameAutoGeneration(){
    if (selectAcaYear.value != null && selectEvent.value != null && selectGrade.value != null){
        textName.value = JSON.parse(selectAcaYear.value).name + "-" + JSON.parse(selectEvent.value).name + "- Grade" + JSON.parse(selectGrade.value).name;
        new_exam["name"] = textName.value;

        if (old_exam != null && old_exam["name"] !== new_exam["name"]){
            textName.style.borderColor = "orange";
        }else {
            textName.classList.add("is-valid");
        }
    }else {
        textName.value = "";
        new_exam["name"] = null;
    }
}



//Refresh exam table
function refreshExamTable(){

    exams = getServiceMapping("/exam/list");

    examProperties = ["name","start_date","end_date","examHasSubjectsList","exam_status_id.name"];

    examDataTypes = ["text","text","text",getExamSubjects,"object"];

    fillDataTable(tableExam,exams,examProperties,examDataTypes,deleteExamRecord,editExamRecord,viewExamRecord,true,loggedUserPrivileges);

    $("#tableExam").DataTable();
}



// getting the list of subjects an exam has
function getExamSubjects(object){
    let subjectNames = "";
    for (let index in object.examHasSubjectsList){
        if (object.examHasSubjectsList.length -1 === index){
            subjectNames += object.examHasSubjectsList[index].subjects_id.name;
        }else {
            subjectNames += object.examHasSubjectsList[index].subjects_id.name + ", ";
        }
    }
    return subjectNames;
}



// check updates
function checkUpdates(){
    let updates = "";

    if (old_exam["academic_year_id"].name !== new_exam["academic_year_id"].name){
        updates += "Academic Year has been changed from " + old_exam["academic_year_id"].name + " to " + new_exam["academic_year_id"].name + "\n";
    }

    if (old_exam["event_id"].name !== new_exam["event_id"].name ){
        updates += "Event has been changed from " + old_exam["event_id"].name + " to " + new_exam["event_id"].name + "\n";
    }

    if (old_exam["grade_id"].name !== new_exam["grade_id"].name ){
        updates += "Grade has been changed from " + old_exam["grade_id"].name + " to " + new_exam["grade_id"].name + "\n";
    }

    if (old_exam["start_date"] !== new_exam["start_date"]){
        updates += "Exam start date has been changed from " + old_exam["start_date"]+ " to " + new_exam["start_date"] + "\n";
    }

    if (old_exam["end_date"] !== new_exam["end_date"] ){
        updates += "Exam end date has been changed from " + old_exam["end_date"] + " to " + new_exam["end_date"] + "\n";
    }

    if (old_exam["exam_status_id"].name !== new_exam["exam_status_id"].name ){
        updates += "Exam status has been changed from " + old_exam["exam_status_id"] + " to " + new_exam["exam_status_id"] + "\n";
    }

    return updates;
}



//update exam form
function updateExamForm(){

    let error = checkErrors();

    let update = checkUpdates();

    if (error === ""){
        if (update !== "") {
            let userResponse = window.confirm("Are you sure to make the changes? ");
            if (userResponse){
                let serverResponse = getHttpRequestService("/exam","PUT",new_exam);
                if (serverResponse === "0"){
                    alert("Successfully updated!");
                    refreshExamTable();
                    refreshExamForm();
                }else {
                    alert("Can not update the record! " + serverResponse);
                }
            }
        } else {
            alert("Nothing has been changed!");
        }
    }else {
        alert("You can not update the examination record! Please correct following errors & Try again! " + error);
    }
}



// check errors
function checkErrors(){

    let errors = "";

    if (new_exam["academic_year_id"] == null){
        errors += "\n Please select the academic year! \n";
        selectAcaYear.classList.add("is-invalid");
    }

    if (new_exam["event_id"] == null){
        errors += "Please select the event! \n";
        selectEvent.classList.add("is-invalid");
    }

    if (new_exam["grade_id"] == null){
        errors += "\n Please select the grade! \n";
        selectGrade.classList.add("is-invalid");
    }

    if (new_exam["name"] == null){
        textName.classList.add("is-invalid");
    }

    if (new_exam["start_date"] == null){
        errors += "Please select starting date of the examination! \n";
        dateStart.classList.add("is-invalid");
    }

    if (new_exam["end_date"] == null){
        errors += "Please select ending date of the examination! \n";
        dateEnd.classList.add("is-invalid");
    }

    if (new_exam["exam_status_id"] == null){
        errors += "\n Please select exam status! \n";
        selectExamStatus.classList.add("is-invalid");
    }

    return errors;
}



// submit exam form
function submitExamForm(){
    let error = checkErrors();

    let userResponse = window.confirm("Are you sure to add this examination record ?");
    if (userResponse){
        if (error === ""){
            let serverResponse = getHttpRequestService("/exam","POST",new_exam);
            if (serverResponse === "0"){
                alert("Examination record successfully added!");
                refreshExamTable();
                refreshExamForm();
            }else {
                alert("You can't add now! " + serverResponse);
            }
        }else {
            alert("You can not submit the examination record! Please correct following errors & Try again! " + error);
        }
    }



}



function deleteExamRecord(object,rowID){

    let userResponse = window.confirm("Are you sure to delete this examination record? ");

    if (userResponse){

        let serverResponse = getHttpRequestService("/exam","DELETE",object);
        if (serverResponse === "0"){
            alert("Examination record successfully deleted!");
            refreshExamTable();
            refreshExamForm();
        }else {
            alert("Error! Can't delete examination record!");
        }
    }
}



function editExamRecord(object,rowID){

    disableButton(false,true);

    let new_exam = getServiceMapping("/exam/getByID?id=" + object.id);


    fillingSelectElements(selectAcaYear,'',academic_years,'name',new_exam.academic_year_id.name);

    fillingSelectElements(selectEvent,'',events,'name',new_exam.event_id.name);

    fillingSelectElements(selectGrade,'',grades,'name',new_exam.grade_id.name);

    textName.value = new_exam.name;
    textName.classList.add("is-valid");

    dateStart.value = new_exam.start_date;
    dateStart.classList.add("is-valid");

    dateEnd.value = new_exam.end_date;
    dateEnd.classList.add("is-valid");

    fillingSelectElements(selectExamStatus,'',examStatuses,'name',new_exam.exam_status_id.name);

}



function viewExamRecord(object,rowID){

}


//refresh inner form & table
function refreshInnerSubjectFormAndTable(){

//     refresh inner form area
    new_examHasSubjects = {}
    old_examHasSubjects = null;

    let subjects = getServiceMapping("/subject/list");
    fillingSelectElements(selectSubject,"Select the subject",subjects,'name');

    let paperTypes = getServiceMapping("/exam/paperTypeList");
    fillingSelectElements(selectPaperType,"Select paper type",paperTypes,'name');

    selectSubject.value = "";
    selectSubject.classList.remove("is-valid");

    selectPaperType.value = "";
    selectPaperType.classList.remove("is-valid");

    dateStartTime.value = "";
    dateStartTime.classList.remove("is-valid");

    dateEndTime.value = "";
    dateEndTime.classList.remove("is-valid");


    // refresh inner table
    let innerTableSubjectProperties = ["subjects_id.name","paper_type_id.name","start","end"];

    let innerTableSubjectDataTypes = ["object","object","text","text"];

    fillInnerDataTable(innerTableSubject,new_exam.examHasSubjectsList,innerTableSubjectProperties,innerTableSubjectDataTypes,deleteInnerSubjectRecord)
}


//submit function for inner table
function submitInnerSubjectForm(){
    new_exam.examHasSubjectsList.push(new_examHasSubjects);
    refreshInnerSubjectFormAndTable();
}



function deleteInnerSubjectRecord(object,rowID){
    new_exam.examHasSubjectsList.splice(rowID,1);
    refreshInnerSubjectFormAndTable();
}
