window.addEventListener("load", function (){

    loggedUserPrivileges = getServiceMapping("/logUserModulePrivilege/byModule/" + "Teacher");

    refreshTeacherForm();

    refreshTeacherTable();

})

//Refresh teacher form
function refreshTeacherForm(){

    new_teacher = {}
    old_teacher = null;

    new_teacher.subjects = [];

//     fetch employees which the designation is teacher from employee module
    teachers = getServiceMapping("/employee/teachersList");
    fillingSelectElements(selectEmployee,"Select the employee",teachers,'name_with_initials');


//     inner form area (Many to many without attribute)
//     Subjects for the teacher can teach
    teachingSubjects = getServiceMapping("subject/teaching_subjects");

//     refresh the selected subjects when the form is refreshed
    divSubjects.innerHTML = "";

    for (let index in teachingSubjects){

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
                new_teacher.subjects.push(teachingSubjects[this.value]);
                console.log(new_teacher.subjects);
            }else {
                console.log(this.value);
                console.log("unchecked");
                new_teacher.subjects.splice(this.value,1);
            }
        }

        if (new_teacher.subjects.length !== 0){
            let exitIndex = new_teacher.subjects
                .map((e)=> e.subjects).indexOf(teachingSubjects[index]["name"]);
            console.log(exitIndex);
        }

        let checkboxLabel = document.createElement("label");
        checkboxLabel.innerText = teachingSubjects[index]["subject_code"] + " - " + teachingSubjects[index]["name"] + " ";
        checkboxLabel.classList.add("form-check-label");
        checkboxLabel.classList.add("fw-bold");

        divSubject.appendChild(checkbox);
        divSubject.appendChild(checkboxLabel);
        divSubjects.appendChild(divSubject);
    }


    selectEmployee.classList.remove("is-valid");
    selectEmployee.value = "";

    textCallingName.classList.remove("is-valid")
    textCallingName.value = "";

    textNIC.classList.remove("is-valid")
    textNIC.value = "";

    textMobile.classList.remove("is-valid")
    textMobile.value = "";

    textPrevSchool.classList.remove("is-valid")
    textPrevSchool.value = "";

    textQualifications.classList.remove("is-valid")
    textQualifications.value = "";


}



// function for auto-fill teacher details when the teacher is selected
function teacherDetailsAutoFill(){

    textCallingName.value = new_teacher["employee_id"]["calling_name"];
    textNIC.value = new_teacher["employee_id"]["nic"];
    textMobile.value = new_teacher["employee_id"]["mobile"];
}



//Refresh Teacher Table
function refreshTeacherTable(){

    teachers = getServiceMapping("/teacher/list");

    teacherProperties = ["employee_id.name_with_initials","previous_school","qualifications","subjectsSet"];

    teacherDataTypes = ["object","text","text",getTeacherSubjects];

    fillDataTable(teacherTable,teachers,teacherProperties,teacherDataTypes,deleteTeacherRecord,editTeacherRecord,viewTeacherRecord,true,loggedUserPrivileges);

    $('#teacherTable').DataTable();
}



// get teacher subjects
function getTeacherSubjects(object){

    let teacherSubjects = getServiceMapping("/subject/getByTeacherID/" + object.id);

    let subjects = "";

    for (let index in teacherSubjects){
        subjects += teacherSubjects[index]["subject_code"] + " - " + teacherSubjects[index]["name"] + "<br/>";
    }

    return subjects;
}



function deleteTeacherRecord(){

}



function editTeacherRecord(){

}


function viewTeacherRecord(){

}


function updateTeacher(){

}



// check errors
function checkErrors(){
    let errors = "";

    if (new_teacher.employee_id == null){
        errors += "Teacher isn't Selected! \n";
    }

    if (new_teacher.qualifications == null){
        errors += "Qualifications aren't Entered! \n";
    }

    if (new_teacher.subjects == null){
        errors += "Teaching subjects aren't selected! \n";
    }

    return errors;
}



function submitTeacher(){

    let errors = checkErrors();

    if (errors === ""){
        let userResponse = window.confirm("Are you sure to add following teacher record? \n");

        if (userResponse){
            let postResponse = getHttpRequestService("/teacher","POST",new_teacher);

            if (postResponse === "0"){
                alert("Teacher record has been added successfully!");
                refreshTeacherForm();
                refreshTeacherTable();
            }else {
                alert(postResponse);
            }
        }
    }else {
        alert("Please correct following errors! \n" + errors);
    }
}