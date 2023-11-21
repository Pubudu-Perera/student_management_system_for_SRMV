window.addEventListener("load",function (){

    loggedUserPrivileges = getServiceMapping("/logUserModulePrivilege/byModule/" + "StudentRegistration");

    refreshFormStuReg();

    refreshTableStuReg();

    // ListTransferSubForm();
})



// disable buttons
function disableButton(addSubmit,editUpdate){
    if (addSubmit && loggedUserPrivileges.insert){
        $("#studentRegistrationSubmit").css('pointer-events','all')
        $("#studentRegistrationSubmit").css('cursor','pointer')
        $("#studentRegistrationSubmit").removeAttr('disabled')
    }else{
        $("#studentRegistrationSubmit").css('pointer-events','all')
        $("#studentRegistrationSubmit").css('cursor','not-allowed')
        $("#studentRegistrationSubmit").attr('disabled','disabled')
    }

    if (editUpdate && loggedUserPrivileges.update){
        $("#studentRegistrationUpdate").css('pointer-events','all')
        $("#studentRegistrationUpdate").css('cursor','pointer')
        $("#studentRegistrationUpdate").removeAttr('disabled')
    }else{
        $("#studentRegistrationUpdate").css('pointer-events','all')
        $("#studentRegistrationUpdate").css('cursor','not-allowed')
        $("#studentRegistrationUpdate").attr('disabled','disabled')
    }
}



function refreshFormStuReg(){

    new_student_registration = {}
    old_student_registration = null;

    new_student_registration.subjects = [];

    academic_years = getServiceMapping("/academic_year/list");
    fillingSelectElements(selectAcaYear,'Select Academic year',academic_years,'name');

    grades = getServiceMapping("/grade/list");
    fillingSelectElements(selectGrade,'Select Grade',grades,'name');

    students = getServiceMapping("/student/studentListForReg");
    fillDataList(studentDataList,selectInputStudent,"",students,'full_name','');

    selectInputStudent.value = "";


    studentRegStatuses = getServiceMapping("/student_registration/student_registration_status/list");
    fillingSelectElements(selectRegStatus,'Select Registration Status',studentRegStatuses,'name');


    selectAcaYear.value = "";
    selectAcaYear.classList.remove("is-valid");

    selectGrade.value = "";
    selectGrade.classList.remove("is-valid");

    selectClassroom.value = "";
    selectClassroom.classList.remove("is-valid");


    selectInputStudent.classList.remove("is-valid");

    disableButton(true,false);
}



function getClassroomsByGrade(){

    classroomsByGrade = getServiceMapping("/classroom/classrooms_by_grade/" + JSON.parse(selectGrade.value).id);
    fillingSelectElements(selectClassroom,'Select Classroom',classroomsByGrade,'classroom_name');
}



// fetch the subjects according to the grade a student going to be assigned
function StudentStudyingSubjects(){

    //     inner form area (Many to many without attribute)
//     subjects according to the grade a student going to be assigned
    studyingSubjects = getServiceMapping("/subject/getByGradeID/" + JSON.parse(selectGrade.value).id);

//     refresh the selected subjects when the form is refreshed
    divSubjects.innerHTML = "";

    new_student_registration.subjects = [];

    for (let index in studyingSubjects){

        let divSubject = document.createElement("div");
        divSubject.classList.add("form-check");

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = index;
        checkbox.classList.add("form-check-input");
        checkbox.onchange = function (){
            if (this.checked){
                console.log(this.value);
                console.log("checked");
                new_student_registration.subjects.push(studyingSubjects[this.value]);
                console.log(new_student_registration.subjects);
            }else {
                console.log(this.value);
                console.log("unchecked");
                new_student_registration.subjects.splice(this.value,1);
            }
        }

        if (new_student_registration.subjects.length !== 0){
            let exitIndex = new_student_registration.subjects
                .map((e)=> e.subjects).indexOf(studyingSubjects[index]["name"]);
            console.log(exitIndex);
        }

        let checkboxLabel = document.createElement("label");
        checkboxLabel.innerText = studyingSubjects[index]["name"] + " ";
        checkboxLabel.classList.add("form-check-label");
        checkboxLabel.classList.add("fw-bold");

        divSubject.appendChild(checkbox);
        divSubject.appendChild(checkboxLabel);
        divSubjects.appendChild(divSubject);
    }

}



function getAcademicYearFee(){

    acdemic_year_fees = getServiceMapping("/academic_year_fee/acfBySS/" + JSON.parse(selectAcaYear.value).id);

    console.log(acdemic_year_fees.fee);
    textTotal.value = acdemic_year_fees.fee;

    new_student_registration["total_fees"] = parseFloat(textTotal.value).toFixed(2);

    console.log(typeof new_student_registration["total_fees"]);
    textTotal.classList.add("is-valid");


}



function refreshTableStuReg(){

    student_registrations = getServiceMapping("/student_registration/list");

    stu_reg_properties = ["academic_year_id.name","student_id.name_with_initials","classroom_id.classroom_name","subjects","student_registration_status_id.name"];

    stu_reg_dataTypes = ["object","object","object",getSubjectsByStudent,"object"];

    fillDataTable(studentRegistrationTable,student_registrations,stu_reg_properties,stu_reg_dataTypes,deleteStudentRegistration,editStudentRegistration,viewStudentRegistration,true,loggedUserPrivileges);

    $("#studentRegistrationTable").DataTable();
}



// Get student's studying subjects to show in the table
function getSubjectsByStudent(object){

    let studyingSubjects = getServiceMapping("/subject/getByStudentRegistrationID/" + object.id);

    let subjects = "";

    for (let index in studyingSubjects){
        subjects += studyingSubjects[index].name + " ,";
    }

    return subjects;
}



// function to delete student registration record from the table
function deleteStudentRegistration(object,rowID){

    let deletingStuReg = object;

    let userResponse = window.confirm("Are you sure to delete this Student Registration record? ");

    if (userResponse){

        let serverResponse = getHttpRequestService("/student_registration","DELETE",deletingStuReg);
        if (serverResponse === "0"){
            alert("Student registration record successfully deleted!");
            refreshTableStuReg();
            refreshFormStuReg();
        }else {
            alert(serverResponse);
        }
    }
}



// function to edit student registration record from the table
function editStudentRegistration(object,rowID){

}



// function to view student registration record from the table
function viewStudentRegistration(object,rowID){

}



// Checks if there are any blank or invalidated fields
function checkErrors(){

    let errors = "";

    if(selectAcaYear.value === ""){
        errors += "Please select the academic year \n";
        selectAcaYear.classList.add("is-invalid");
    }

    if(selectGrade.value === ""){
        errors += "Please select the grade \n";
        selectGrade.classList.add("is-invalid");
    }

    if(selectClassroom.value === ""){
        errors += "Please select the classroom \n";
        selectClassroom.classList.add("is-invalid");
    }

    if(selectInputStudent.value === ""){
        errors += "Please select the student \n";
        selectInputStudent.classList.add("is-invalid");
    }

    if (new_student_registration["grade_id"].id < 10 && new_student_registration["grade_id"].id >= 6){
        if (new_student_registration.subjects.length !== 10){
            errors += "Please select 10 subjects \n";
        }
    }else if (new_student_registration["grade_id"].id >= 10 && new_student_registration["grade_id"].id <= 11){
        if (new_student_registration.subjects.length !== 9){
            errors += "Please select 9 subjects \n";
        }
    }

    if (selectRegStatus.value === ""){
        errors += "Please select the registration status \n";
        selectRegStatus.classList.add("is-invalid");
    }

    return errors;
}



// function to submit student registration record
function SubmitStuReg(){

    console.log(new_student_registration);
    console.log(selectRegStatus.value);

    console.log(new_student_registration.subjects.length);



    let errors = checkErrors();

    if (errors === ""){
        let userResponse = window.confirm("Are you sure to add this Student Registration record?");

        if (userResponse){
            let serverResponse = getHttpRequestService("/student_registration","POST",new_student_registration);
            if (serverResponse === "0"){
                window.alert("Student Registration Record Has Been Added Successfully!");
                refreshFormStuReg();
                refreshTableStuReg();
            }else {
                alert("Student Registration record can not be added! \n" + errors);
            }
        }
    }else{
        alert("Student registration record can not be added! Please correct following errors! \n" + errors);
    }
}



// function ListTransferSubForm(){
//
//     let academic_years_1 = getServiceMapping("/academic_year/list");
//     fillingSelectElements(selectAcaYearBulk1,"Year",academic_years_1,'name');
//
//     let academic_years_2 = getServiceMapping("academic_year/list");
//     fillingSelectElements(selectAcaYearBulk2,"Year",academic_years_2,'name');
//
//     let grades_1 = getServiceMapping("/grade/list");
//     fillingSelectElements(selectGradeBulk1,'Grade',grades_1,'name');
//
//     let grades_2 = getServiceMapping("/grade/list");
//     fillingSelectElements(selectGradeBulk2,'Grade',grades_2,'name');
// }
//
//
// function classroomsByGradeList1(){
//    let classroomsByGradeList1 = getServiceMapping("/classroom/classrooms_by_grade/" + JSON.parse(selectGradeBulk1.value).id);
//     fillingSelectElements(selectClassroomBulk1,'Classroom',classroomsByGradeList1,'classroom_name');
// }
//
//
//
// function classroomsByGradeList2(){
//     let classroomsByGradeList2 = getServiceMapping("/classroom/classrooms_by_grade/" + JSON.parse(selectGradeBulk2.value).id);
//     fillingSelectElements(selectClassroomBulk2,'Classroom',classroomsByGradeList2,'classroom_name');
// }



// function getExistingStudentsByClassroom(){
//
//     let existingStudentsByClassroom = getServiceMapping("/student/byClassroom/" + JSON.parse(selectClassroomBulk1.value).id);
//
//     existingClassStudentList.innerHTML = "";
//
//     let orderList = document.createElement("ol");
//     orderList.classList.add("list-group");
//     orderList.classList.add("list-group-numbered");
//     orderList.id = "existingStudentList";
//     existingClassStudentList.appendChild(orderList);
//
//     for (let index in existingStudentsByClassroom){
//
//         let studentListElement = document.createElement("li");
//         studentListElement.classList.add("list-group-item");
//
//         studentListElement.innerHTML = existingStudentsByClassroom[index].registration_no + " - " + existingStudentsByClassroom[index].name_with_initials;
//
//         orderList.appendChild(studentListElement);
//
//     }
//
//
//
//     $(document).ready(function() {
//
// // Add click event listener to all list items
//         $('ol li').click(function() {
// // Toggle the "selected" class
//             $(this).toggleClass('selected');
//         });
// // Add click event listener to the move left button
//         $('#addRightOne').click(function() {
// // Get all the selected items
//             let selectedItems = $('#existingStudentList .selected');
// // Remove the "selected" class from the selected items
//             selectedItems.removeClass('selected');
// // Append the selected items to the first list
//             $('').append(selectedItems);
//         });
// // Add click event listener to the move right button
//         $('#move_right').click(function() {
// // Get all the selected items
//             var selectedItems = $('.list1 .selected');
// // Remove the "selected" class from the selected items
//             selectedItems.removeClass('selected');
// // Prepend the selected items to the second list
//             $('.list2').prepend(selectedItems);
//         });
//     });
//
// }



