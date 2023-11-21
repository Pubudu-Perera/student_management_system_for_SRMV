window.addEventListener("load",function (){

    loggedUserPrivileges = getServiceMapping("/logUserModulePrivilege/byModule/" + "ExamResults");

    refreshResultsForm();

    refreshResultsTable();
})



// Button disable
function disableButton(addSubmit,editUpdate){
    if (addSubmit && loggedUserPrivileges.insert){
        $("#examResultsSubmit").css('pointer-events','all')
        $("#examResultsSubmit").css('cursor','pointer')
        $("#examResultsSubmit").removeAttr('disabled')
    }else{
        $("#examResultsSubmit").css('pointer-events','all')
        $("#examResultsSubmit").css('cursor','not-allowed')
        $("#examResultsSubmit").attr('disabled','disabled')
    }

    if (editUpdate && loggedUserPrivileges.update){
        $("#examResultsUpdate").css('pointer-events','all')
        $("#examResultsUpdate").css('cursor','pointer')
        $("#examResultsUpdate").removeAttr('disabled')
    }else{
        $("#examResultsUpdate").css('pointer-events','all')
        $("#examResultsUpdate").css('cursor','not-allowed')
        $("#examResultsUpdate").attr('disabled','disabled')
    }
}



function refreshResultsForm(){

    disableButton(true,false);

    new_result = {}
    old_result = null;


    new_result.examResultHasStudentsList = [];


    exams = getServiceMapping("/exam/list");
    fillingSelectElements(selectExam,"Select exam",exams,'name');


}


function getClassroomsByExamGrade(){

    classrooms = getServiceMapping("/classroom/classrooms_by_grade/" + JSON.parse(selectExam.value).grade_id.id);
    fillingSelectElements(selectClassroom,"Select classroom",classrooms,'classroom_name');
}



function getSubjectsByClassroom(){

    subjects = getServiceMapping("/subject/getByGradeID/" + JSON.parse(selectClassroom.value).grade_id.id);
    fillingSelectElements(selectSubject,"Select Subject",subjects,'name');

}



//getting student list according to the classroom
function getStudentsByClassroom(){

    studentsByClassroom = getServiceMapping("/student/byClassroom/" + JSON.parse(selectClassroom.value).id);

    let resultsTableBody = innerStudentResults.children[1];
    resultsTableBody.innerHTML = "";

    if(studentsByClassroom.length !== 0){

        textTotalStudents.value = studentsByClassroom.length;
        new_result["total_students"] = textTotalStudents.value;
        textTotalStudents.classList.add("is-valid");

        let total_marks = 0;

        for (let index in studentsByClassroom){

            let studentResult = {}
            studentResult.student_id = studentsByClassroom[index];

            // adding student list to the association table examResultHasStudents
            new_result.examResultHasStudentsList.push(studentResult);

            let tr = document.createElement("tr");
            tr.id = studentsByClassroom[index].id;

            let index_td = document.createElement("td");
            index_td.innerText = parseInt(index) + 1;
            tr.appendChild(index_td);

            let regNo_td = document.createElement("td");
            regNo_td.innerText = studentsByClassroom[index].registration_no;
            tr.appendChild(regNo_td);


            let name_td = document.createElement("td");
            name_td.innerText = studentsByClassroom[index].name_with_initials;
            tr.appendChild(name_td);


            let attendance_td = document.createElement("td");
            let attedance = document.createElement("input");
            attedance.type = "checkbox";
            attedance.classList.add("form-check-input");
            attedance.classList.add("present_absent");

            attendance_td.appendChild(attedance);
            tr.appendChild(attendance_td);



            let result_td = document.createElement("td");

            let marksInput = document.createElement("input");
            marksInput.type = "text";
            marksInput.readOnly = true;
            marksInput.classList.add("form-control");
            marksInput.placeholder = "Enter marks"

            result_td.appendChild(marksInput);

            tr.appendChild(result_td);


            attedance.onchange = function(){

                if (attedance.checked){
                    marksInput.readOnly = false;
                }

            }

            let grade_td = document.createElement("td");

            let gradeLabel = document.createElement("span");
            gradeLabel.id = "gradeLabel";

            marksInput.onblur = function (){

                let resultIndex = new_result.examResultHasStudentsList.map(e => e.student_id.id).indexOf(parseInt(this.parentNode.parentNode.id));

                new_result.examResultHasStudentsList[resultIndex].marks = parseInt(marksInput.value);
                total_marks += parseInt(marksInput.value);

                if (parseInt(marksInput.value) > 75){
                    gradeLabel.innerText = "A";
                    new_result.examResultHasStudentsList[resultIndex].grade = gradeLabel.innerText;
                }

                if (parseInt(marksInput.value) <= 75 && parseInt(marksInput.value) >= 65){
                    gradeLabel.innerText = "B";
                    new_result.examResultHasStudentsList[resultIndex].grade = gradeLabel.innerText;
                }

                if (parseInt(marksInput.value) <= 65 && parseInt(marksInput.value) >= 55){
                    gradeLabel.innerText = "C";
                    new_result.examResultHasStudentsList[resultIndex].grade = gradeLabel.innerText;
                }

                if (parseInt(marksInput.value) <= 55 && parseInt(marksInput.value) >= 35){
                    gradeLabel.innerText = "S";
                    new_result.examResultHasStudentsList[resultIndex].grade = gradeLabel.innerText;
                }

                if (parseInt(marksInput.value) < 35){
                    gradeLabel.innerText = "F";
                    new_result.examResultHasStudentsList[resultIndex].grade = gradeLabel.innerText;
                }

                textTotalMarks.value = total_marks;
                new_result["total_mark"] = textTotalMarks.value;

                textAverage.value = total_marks/studentsByClassroom.length;
                new_result["average_mark"] = textAverage.value;
            }


            grade_td.appendChild(gradeLabel);

            tr.appendChild(grade_td);
            innerStudentResults.appendChild(tr);
        }
    }
}



function refreshResultsTable(){

    examResults = getServiceMapping("/exam_results/list");

    examResultsProperties = ["exam_id.name","subjects_id.name","classroom_id.classroom_name","examResultHasStudentsList"]

    examResultsDataTypes = ["object","object","object",getExamResults];

    fillDataTable(tableExamResults,examResults,examResultsProperties,examResultsDataTypes,deleteExamResultRecord,editExamResultRecord,viewExamResultRecord,true,loggedUserPrivileges);

    $('#tableExamResults').DataTable();
}



function getExamResults(object){
    let examResults = "";
    for (let index in object.examResultHasStudentsList){
        if (object.examResultHasStudentsList.length - 1 === index){
            examResults += object.examResultHasStudentsList[index].student_id.name_with_initials + " - " + object.examResultHasStudentsList[index].marks;
        }else {
            examResults += object.examResultHasStudentsList[index].student_id.name_with_initials + " - " + object.examResultHasStudentsList[index].marks + "<br/>";
        }
    }
    return examResults;

}



function  deleteExamResultRecord(object,rowID){

    let deletingExamResults = object;

    let userResponse = window.confirm("Are you to delete this exam results record?");

    if ((userResponse)){
        let serverResponse = getHttpRequestService("/exam_results", "DELETE", deletingExamResults);
        if (serverResponse === "0"){
            window.alert("Exam record Delete Successfully!")
        }else {
            alert("Error! You can't delete this exam results record \n" + serverResponse);
        }
    }
}



function editExamResultRecord(){

    disableButton(false,true);
}



function viewExamResultRecord(){

}




function checkErrors(){

    let errors = "";

    if (new_result["classroom_id"] == null){
        errors += "Please select the classroom! \n";
        selectClassroom.classList.add("is-invalid");
    }

    if (new_result["subjects_id"] == null){
        errors += "Please select the subject! \n";
        selectSubject.classList.add("is-invalid");
    }

    return errors;
}



function submitExamResults(){
    console.log(new_result);

    let errors = checkErrors();

    if (errors === ""){
        let userResponse = window.confirm("Are you sure to add this exam results record? ");
        if (userResponse){
            let serverResponse = getHttpRequestService("/exam_results","POST",new_result);
            if (serverResponse === "0"){
                alert("Attendance record added successfully!");
                refreshResultsForm();
                refreshResultsTable();
            }else {
                alert("Error! You can't add the result record! Try again! " + serverResponse);
            }
        }
    }else {
        alert("Please correct following errors! \n" + errors);
    }

}



function checkUpdates(){

}



function updateExamResults(){

}




