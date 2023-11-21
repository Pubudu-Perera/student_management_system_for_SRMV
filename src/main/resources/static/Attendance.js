window.addEventListener("load",function (){

    loggedUserPrivileges = getServiceMapping("/logUserModulePrivilege/byModule/" + "Attendance");

    refreshAttendanceForm();

    refreshAttendanceTable();

})

function disableButton(addSubmit,editUpdate){
    if (addSubmit && loggedUserPrivileges.insert){
        $("#buttonAttendanceSubmit").css('pointer-events','all')
        $("#buttonAttendanceSubmit").css('cursor','pointer')
        $("#buttonAttendanceSubmit").removeAttr('disabled')
    }else{
        $("#buttonAttendanceSubmit").css('pointer-events','all')
        $("#buttonAttendanceSubmit").css('cursor','not-allowed')
        $("#buttonAttendanceSubmit").attr('disabled','disabled')
    }

    if (editUpdate && loggedUserPrivileges.update){
        $("#buttonAttendanceUpdate").css('pointer-events','all')
        $("#buttonAttendanceUpdate").css('cursor','pointer')
        $("#buttonAttendanceUpdate").removeAttr('disabled')
    }else{
        $("#buttonAttendanceUpdate").css('pointer-events','all')
        $("#buttonAttendanceUpdate").css('cursor','not-allowed')
        $("#buttonAttendanceUpdate").attr('disabled','disabled')
    }
}



function refreshAttendanceForm(){

    new_attendance = {}
    old_attendance = null;

    new_attendance.attendanceHasStudentsList = [];

    let currentAcaYear = getCurrentDate("year","").toString();

    academic_years = getServiceMapping("/academic_year/list");
    fillingSelectElements(selectAcaYear,"Select Academic year",academic_years,'name',currentAcaYear);
    selectAcaYear.classList.add("is-valid");

    classrooms = getServiceMapping("/classroom/active_list");
    fillingSelectElements(selectClassroom,"Select Classroom",classrooms,'classroom_name');

    textTotalStudents.innerHTML = "";
    textTotalStudents.classList.remove("is-valid");

    textPresentStudents.innerHTML = "";
    textPresentStudents.classList.remove("is-valid");

    textAbsentStudents.innerHTML = "";
    textAbsentStudents.classList.remove("is-valid");

    dateAttendance.value = getCurrentDate("date","");
    new_attendance["date"] = dateAttendance.value;
    dateAttendance.classList.add("is-valid");

    disableButton(true,false)
}



//getting student list according to the classroom
function getStudentsByClassroom(){

    buttonAttendanceSubmit.disabled = true;

    studentsByClassroom = getServiceMapping("/student/byClassroom/" + JSON.parse(selectClassroom.value).id);

    let attendanceMarkingTableBody = attendanceMarkingTable.children[1];
    attendanceMarkingTableBody.innerHTML = "";

    if(studentsByClassroom.length !== 0){

        textTotalStudents.value = studentsByClassroom.length;
        new_attendance["total_students"] = textTotalStudents.value;
        textTotalStudents.classList.add("is-valid");

        // this variable is used at getHeadCount method. that's why it is global
        absentCount = studentsByClassroom.length;

        for (let index in studentsByClassroom){

            let studentAttendance = {}
            studentAttendance.student_id = studentsByClassroom[index];
            studentAttendance.attendancePresent = false;

            // adding student list to the association table attendanceHasStudents
            new_attendance.attendanceHasStudentsList.push(studentAttendance);

            let tr = document.createElement("tr");
            tr.id = studentsByClassroom[index].id;

            let index_td = document.createElement("td");
            index_td.innerText = parseInt(index) + 1;
            tr.appendChild(index_td);

            let regNo_td = document.createElement("td");
            regNo_td.innerText = studentsByClassroom[index].registration_no;
            tr.appendChild(regNo_td);


            let callingName_td = document.createElement("td");
            callingName_td.innerText = studentsByClassroom[index].name_with_initials;
            tr.appendChild(callingName_td);


            let attendance_id = document.createElement("td");

            let attendanceCheckbox = document.createElement("input");
            attendanceCheckbox.type = "checkbox";
            attendanceCheckbox.classList.add("form-check-input");

            let attendanceLabel = document.createElement("label");
            attendanceLabel.innerText = "Absent";
            attendanceLabel.classList.add("ms-2");
            attendanceLabel.classList.add("form-check-label");
            attendanceLabel.classList.add("fw-bold");

            attendanceCheckbox.onchange = function (){

                let attendanceIndex = new_attendance.attendanceHasStudentsList.map(e => e.student_id.id).indexOf(parseInt(this.parentNode.parentNode.id));

                if (this.checked){
                    attendanceLabel.innerText = "Present";
                    // following attendancePresent attribute is the exact property of association table
                    new_attendance.attendanceHasStudentsList[attendanceIndex].attendancePresent = true;
                    absentCount = parseInt(absentCount) - 1;
                }else {
                    new_attendance.attendanceHasStudentsList[attendanceIndex].attendancePresent = false;
                    absentCount = parseInt(absentCount) + 1;
                }
            }
            attendance_id.appendChild(attendanceCheckbox);
            attendance_id.appendChild(attendanceLabel);

            tr.appendChild(attendance_id);


            attendanceMarkingTableBody.appendChild(tr);
        }
    }
}

function calculatePercentage(){

    if (new_attendance["total_students"] != null && new_attendance["present"] != null){

        textPercentagetudents.value = (new_attendance["present"] / new_attendance["total_students"]) * 100;

        console.log(textPercentagetudents);
    }
}


//refresh attendance table
function refreshAttendanceTable(){

    attendances = getServiceMapping("/attendance/list");

    attendanceProperties = ["classroom_id.academic_year_id.name","classroom_id.classroom_name","date","total_students","present","absent"];

    attendanceDataTypes = ["object","object","text","text","text","text"];

    fillDataTable(tableAttendance,attendances,attendanceProperties,attendanceDataTypes,deleteAttendanceRecord,editAttendanceRecord,viewAttendanceRecord,true,loggedUserPrivileges)

    $("#tableAttendance").DataTable();
}



function deleteAttendanceRecord(){

}



function editAttendanceRecord(){

}



function viewAttendanceRecord(){

}



function checkErrors(){
    let errors = "";

    if (new_attendance["classroom_id"] == null){
        errors += "\n Please select classroom \n";
    }

    if (new_attendance["date"] == null){
        errors += "Please select school date\n";
    }

    return errors;
}



function submitAttendance(){
    let errors = checkErrors();

    if (errors === ""){
        let userResponse = window.confirm("Are you sure to add this attendance record? ");
        if (userResponse){
            let serverResponse = getHttpRequestService("/attendance","POST",new_attendance);
            if (serverResponse === "0"){
                alert("Attendance record added successfully!");
                refreshAttendanceForm();
                refreshAttendanceTable();
            }else {
                alert("Error! You can't add the attendance record! Try again! " + serverResponse);
            }
        }
    }else {
        alert("Please correct following errors! \n" + errors);
    }
}




function getHeadCount(){

    let headCount = textHeadCount.value;

    if (parseInt(absentCount) === parseInt(new_attendance["total_students"]) - parseInt(headCount)){
        buttonAttendanceSubmit.disabled = false;

        textPresentStudents.value = parseInt(headCount);
        new_attendance["present"] = textPresentStudents.value;
        textPresentStudents.classList.add("is-valid");

        textAbsentStudents.value = parseInt(absentCount);
        new_attendance["absent"] = textAbsentStudents.value;
        textAbsentStudents.classList.add("is-valid");
    }

}