window.addEventListener("load",function (){

    loggedUserPrivileges =  getServiceMapping("/logUserModulePrivilege/byModule/" + "Classroom");

    refreshClassroomForm();

    refreshClassroomTable();

})



// button disable
function disableButton(addSubmit,editUpdate){
    if (addSubmit && loggedUserPrivileges.insert){
        $("#classroomSubmit").css('pointer-events','all')
        $("#classroomSubmit").css('cursor','pointer')
        $("#classroomSubmit").removeAttr('disabled')
    }else{
        $("#classroomSubmit").css('pointer-events','all')
        $("#classroomSubmit").css('cursor','not-allowed')
        $("#classroomSubmit").attr('disabled','disabled')
    }

    if (editUpdate && loggedUserPrivileges.update){
        $("#classroomUpdate").css('pointer-events','all')
        $("#classroomUpdate").css('cursor','pointer')
        $("#classroomUpdate").removeAttr('disabled')
    }else{
        $("#classroomUpdate").css('pointer-events','all')
        $("#classroomUpdate").css('cursor','not-allowed')
        $("#classroomUpdate").attr('disabled','disabled')
    }
}



//refresh classroom table
function refreshClassroomForm(){

    disableButton(true,false);

    new_classroom = {}
    old_classroom = null;

    // fetch the names of all academic years;
    academic_years = getServiceMapping("/academic_year/list");
    fillingSelectElements(selectAca,"Select Academic Year",academic_years,"name");

    // fetch all grades;
    grades = getServiceMapping("/grade/list");
    fillingSelectElements(selectGrade,"Select Grade",grades,"name");

    // fetch all mediums;
    mediums = getServiceMapping("/medium/list");
    fillingSelectElements(selectMedium,"Select Medium",mediums,"name");

    // fetch class name list
    classNames = getServiceMapping("/classroom/class_name/list");
    fillingSelectElements(selectClassName,"Select Class Name",classNames,'name');

    // fetch teacher list from teacher module
    teachers = getServiceMapping("/teacher/classroom_teachers");
    fillingSelectElements(selectTeacher,"Select teacher",teachers,'name_with_initials')

    classroomStatusList = getServiceMapping("/classroom/classroomStatusList");
    fillingSelectElements(selectClassroomStatus, "Select Classroom Status", classroomStatusList,'name');

//     back to default view
    selectAca.classList.remove("is-valid");
    selectGrade.classList.remove("is-valid");
    selectMedium.classList.remove("is-valid");
    selectClassName.classList.remove("is-valid");
    selectTeacher.classList.remove("is-valid");
    selectClassroomStatus.classList.remove("is-valid");

    textClassroomName.value = "";
    textClassroomName.classList.remove("is-valid");
}



// Auto generate classroom name
function classroomNameAutoGen(){
    if (selectGrade.value != null && selectClassName.value != null){
        textClassroomName.value = JSON.parse(selectGrade.value).name + "-" + JSON.parse(selectClassName.value).name;
        new_classroom["classroom_name"] = textClassroomName.value;

        if (old_classroom != null && old_classroom["classroom_name"] !== new_classroom["classroom_name"]){
            textClassroomName.style.borderColor = "orange";
        }else{
            textClassroomName.classList.add("is-valid");
        }
    }else {
        textClassroomName.value = "";
        new_classroom["classroom_name"] = null;
    }
}



function checkErrors(){
    let errors = "";

    if (new_classroom["academic_year_id"]== null){
        errors += "Select Academic Year! \n";
    }

    if (new_classroom["grade_id"] == null){
        errors += "Select Grade! \n";
    }

    if (new_classroom["class_name_id"] == null){
        errors += "Enter Classroom No.! \n";
    }

    if (new_classroom["medium_id"] == null){
        errors += "Select Medium of the classroom! \n";
    }

    if (new_classroom["teacher_id"] == null){
        errors += "Select classroom teacher! \n";
    }

    if (new_classroom["classroom_status_id"] == null){
        errors += "Select classroom status! \n";
    }
    return errors;
}



// submit form
function submitClassroom(){
    console.log(new_classroom["academic_year_id"]);
    let errors = checkErrors();

    if (errors === ""){

        let userResponse = window.confirm("Are you sure to submit this classroom record?");
        if (userResponse){
            let serverResponse = getHttpRequestService("/classroom","POST",new_classroom);
            if (serverResponse === "0"){
                alert("Classroom added successfully!");
                refreshClassroomTable();
                refreshClassroomForm();
            }else {
                alert("Error! You can't add this classroom record!" + serverResponse);
            }
        }
    }else {
        alert("Please correct following errors! " + errors );
    }
}



// check updates
function checkUpdates(){

    let updates = "";

    if (old_classroom != null && old_classroom["academic_year_id"].name !== new_classroom["academic_year_id"].name){
        updates += "You have changed the academic year from " + old_classroom["academic_year_id"].name + " to " + new_classroom["academic_year_id"].name + "\n";

    }

    if (old_classroom != null && old_classroom["grade_id"].name !== new_classroom["grade_id"].name){
        updates += "You have changed the grade from " + old_classroom["grade_id"].name + " to " + new_classroom["grade_id"].name + "\n";

    }

    if (old_classroom != null && old_classroom["class_name_id"].name !== new_classroom["class_name_id"].name){
        updates += "You have changed the class name from " + old_classroom["class_name_id"].name + " to " + new_classroom["class_name_id"].name + "\n";

    }

    if (old_classroom != null && old_classroom["medium_id"].name !== new_classroom["medium_id"].name){
        updates += "You have changed the medium from " + old_classroom["medium_id"].name + " to " + new_classroom["medium_id"].name + "\n";


    }    if (old_classroom != null && old_classroom["teacher_id"].name !== new_classroom["teacher_id"].name){
        updates += "You have changed the class teacher from " + old_classroom["teacher_id"].employee_id.name_with_initials + " to " + new_classroom["teacher_id"].employee_id.name_with_initials + "\n";


    }    if (old_classroom != null && old_classroom["classroom_status_id"].name !== new_classroom["classroom_status_id"].name){
        updates += "You have changed the classroom status from " + old_classroom["classroom_status_id"].name + " to " + new_classroom["classroom_status_id"].name + "\n";

    }

    return updates;
}




//update Classroom
function updateClassroom(){
    let errors = checkErrors();

    if (errors === ""){

        let updates = checkUpdates();

        if (updates !== ""){
            let userResponse = window.confirm("Are you sure to make following updates? " + updates);

            if (userResponse){
                let serverResponse = getHttpRequestService("/classroom","PUT",new_classroom);

                if (serverResponse === "0") {
                    refreshClassroomTable();
                    refreshClassroomForm();
                    alert("Classroom record has successfully been updated!");
                }else {
                    alert("Error! You can't update the classroom record!");
                }
            }

        }else {
            alert("You don't have made any change to the record!");
        }
    }else {
        alert("Please correct following errors! " + errors);
    }
}



//refresh classroom table
function refreshClassroomTable(){

    classrooms = getServiceMapping("/classroom/list");

    classroomProperties = ["academic_year_id.name","classroom_name","medium_id.name","teacher_id.employee_id.name_with_initials","classroom_status_id.name"];

    classroomDataTypes = ["object","text","object","object","object"];

    fillDataTable(classroomTable,classrooms,classroomProperties,classroomDataTypes,deleteClassroomRecord,editClassroomRecord,viewClassroomRecord,true,loggedUserPrivileges);

    $("#classroomTable").DataTable();

}



//Delete Classroom Record
function deleteClassroomRecord(object,rowID){

    let classroomRecord = object;

    let userResponse = window.confirm("Are you sure to delete this classroom record?");
    if (userResponse){
        let serverResponse = getHttpRequestService("/classroom","DELETE",classroomRecord);
        if (serverResponse === "0"){
            alert("Classroom record successfully deleted!");
            refreshClassroomForm();
            refreshClassroomTable();
        }else {
            alert("You can't delete the classroom record now" + serverResponse);
        }
    }
}



//Edit classroom record
function editClassroomRecord(object,rowID){

    disableButton(false,true);

   new_classroom = getServiceMapping("/classroom/getByID?id=" + object.id);
    old_classroom = getServiceMapping("/classroom/getByID?id=" + object.id);

    fillingSelectElements(selectAca,'Select Academic Year',academic_years,'name',new_classroom["academic_year_id"].name);
    selectAca.classList.add("is-valid");

    fillingSelectElements(selectGrade,'Select Grade',grades,'name',new_classroom["grade_id"].name);
    selectGrade.classList.add("is-valid");

    fillingSelectElements(selectClassName,'Select Class Name',classNames,'name',new_classroom["class_name_id"].name);
    selectClassName.classList.add("is-valid");

    fillingSelectElements(selectMedium,'Select Medium',mediums,'name',new_classroom["medium_id"].name);
    selectMedium.classList.add("is-valid");

    fillingSelectElements(selectTeacher,'Select Teacher',teachers,'employee_id.name_with_initials',new_classroom["teacher_id"].employee_id.name_with_initials);
    selectTeacher.classList.add("is-valid");

    fillingSelectElements(selectClassroomStatus,'Select Classroom Status ',classroomStatusList,'name',new_classroom["classroom_status_id"].name);
    selectClassroomStatus.classList.add("is-valid");

    textClassroomName.value = new_classroom["classroom_name"];
    textClassroomName.classList.add("is-valid");


}



//View classroom record
function viewClassroomRecord(object,rowID){

    let classroom = object;


    tdSelectAca.innerText = classroom["academic_year_id"].name;
    tdGrade.innerText = classroom["grade_id"].name;
    tdClassname.innerText = classroom["class_name_id"].name;
    tdClassroomName.innerText = classroom["classroom_name"];
    tdMedium.innerText = classroom["medium_id"].name;
    tdTeacher.innerText = classroom["teacher_id"].employee_id.name_with_initials;
    tdClassroomStatus.innerText = classroom["classroom_status_id"].name;

    $("#modalViewClassroom").modal("show");
}



//print classroom details
function printClassroomDetails() {
    let newWindow = window.open();

    //using bootstrap link (CSS)
    newWindow.document.write(
        "<!DOCTYPE html>" +
        "<link href='Resources/Bootstrap%205/bootstrap-5.0.2-dist/css/bootstrap.min.css' rel='stylesheet'>" +
        "<script src='Resources/JQuery/JQuery.js'></script>" +
        "<h2> Classroom Management </h2>" +
        modalViewClassroom.outerHTML
    )

    //function to print the newly opened window
    setTimeout(function () {
        newWindow.print();
    }, 3000);
}