window.addEventListener("load", function () {

  loggedUserPrivileges = getServiceMapping("/logUserModulePrivilege/byModule/" + "Student");

  // method calling of refreshForm() function to get refreshed the form everytime page is reloaded.
  refreshStudentForm();

  refreshStudentTable();
});



// function for disable UPDATE button at new record insertion & disable SUBMIT button when existing record is updated.
function disableButton(addSubmit,editUpdate){
  if (addSubmit && loggedUserPrivileges.insert){
    $("#studentSubmit").css('pointer-events','all')
    $("#studentSubmit").css('cursor','pointer')
    $("#studentSubmit").removeAttr('disabled')
  }else{
    $("#studentSubmit").css('pointer-events','all')
    $("#studentSubmit").css('cursor','not-allowed')
    $("#studentSubmit").attr('disabled','disabled')
  }

  if (editUpdate && loggedUserPrivileges.update){
    $("#studentUpdate").css('pointer-events','all')
    $("#studentUpdate").css('cursor','pointer')
    $("#studentUpdate").removeAttr('disabled')
  }else{
    $("#studentUpdate").css('pointer-events','all')
    $("#studentUpdate").css('cursor','not-allowed')
    $("#studentUpdate").attr('disabled','disabled')
  }
}




//to refresh the form
function refreshStudentForm() {
  new_student = {};
  old_student = null;


  //to fetch race data as a list
  races = getServiceMapping("/student/raceList");
  fillingSelectElements(selectRace,"Select Student's Race",races,"name");

  //to fetch religion data as a list
  religions = getServiceMapping("/student/religionList")
  fillingSelectElements(selectReligion,"Select Student's Religion",religions,"name");

  //to fetch guardian data as a list
  student_guardians = getServiceMapping("/guardian/list");
  fillDataList(guardianDataList,selectInputGuardian,"",student_guardians,'full_name','');
  selectInputGuardian.value = "";
  // fillingSelectElements(selectGuardian,"Select Student's Guardian",student_guardians,"full_name")


  // switch on student status & assign the property's value as tru when the form is refreshing
  switchStudentStatus.checked = true;
  new_student["student_status"] = true;


  // remove validations & values when the form is refreshed
  textFullName.value = ""
  textFullName.classList.remove("is-valid");

  textInitials.value = ""
  textInitials.classList.remove("is-valid");

  textCallingName.value = ""
  textCallingName.classList.remove("is-valid");

  textNIC.value = ""
  textNIC.classList.remove("is-valid");

  dateDOB.value = ""
  dateDOB.classList.remove("is-valid");

  selectInputGuardian.value = ""
  selectInputGuardian.classList.remove("is-valid");

  selectRace.value = ""
  selectRace.classList.remove("is-valid");

  selectReligion.value = ""
  selectReligion.classList.remove("is-valid");

  fileStudentPhoto.value = ""
  fileStudentPhoto.classList.remove("is-valid");

  text_permanent_address.value = ""
  text_permanent_address.classList.remove("is-valid");

  text_current_address.value = "";
  text_current_address.classList.remove("is-valid");

  textDescription.value = ""
  textDescription.classList.remove("is-valid");

  disableButton(true,false);
}



//function to refresh the student table
function refreshStudentTable(){

  let students = getServiceMapping("/student/findall");

  let studentDataList = ["registration_no","full_name","gender","guardian_id.name_with_initials","guardian_id.mobile","student_status"];

  let studentDataTypeList = ["text","text","text","object","object",getStudentStatus];

  fillDataTable(tableStudent,students,studentDataList,studentDataTypeList,deleteStudentRecord,editStudentRecord,viewStudentRecord,true,loggedUserPrivileges);

  //    connect JQuery datatable plug-in
  $("#tableStudent").DataTable();
}



// getting student status
function getStudentStatus(object){

  let student_status = "In-Active";

  if (object["student_status"]){
    student_status = "Active";
  }

  return student_status;
}



//to delete student record from the table
function deleteStudentRecord(object, rowID){
    let student = object;

    let userResponse = window.confirm("Are you sure that you want to delete the record?");

    if (userResponse){

      let serverResponse = getHttpRequestService("/student","DELETE",student);

      if (serverResponse === "0"){
        alert("Student record successfully deleted!");
        refreshStudentTable();
      }else {
        alert("Error! you can't delete the record!" + serverResponse );
      }
    }
}



//to edit student record from the table
function editStudentRecord(object,rowID){

  disableButton(false,true);

  new_student = getServiceMapping("/student/getByID?id=" + object.id);
  old_student = getServiceMapping("/student/getByID?id=" + object.id);

  fillingSelectElements(selectGuardian,"Select Student's Guardian",student_guardians,"name_with_initials",new_student.guardian_id.name_with_initials);
  selectGuardian.classList.add("is-valid");

  textFullName.value = new_student["full_name"];
  textFullName.classList.add("is-valid") ;

  textInitials.value = new_student["name_with_initials"];
  textInitials.classList.add("is-valid");

  textCallingName.value = new_student["calling_name"];
  textCallingName.classList.add("is-valid") ;

  if(new_student["nic"] !== undefined){
   textNIC.value = new_student["nic"] ;
   textNIC.classList.add("is-valid");
  }

  dateDOB.value = new_student["date_of_birth"];
  dateDOB.classList.add("is-valid");


  if (new_student["gender"] === "Male"){
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

  fillingSelectElements(selectRace,"Select Student's Race",races,"name",new_student.race_id.name);
  selectRace.classList.add("is-valid");

  fillingSelectElements(selectReligion,"Select Student's Religion",religions,"name",new_student.religion_id.name);
  selectReligion.classList.add("is-valid");

  text_permanent_address.value = new_student["permanent_address"];
  text_permanent_address.classList.add("is-valid");

  if(new_student["current_address"] !== undefined){
    text_current_address.value = new_student["current_address"];
    text_current_address.classList.add("is-valid");
  }else {
    text_current_address.style.borderColor = "rgb(115,20,18)";
  }

  if(new_student["description"] !== undefined){
    textDescription.value = new_student["description"];
    textDescription.classList.add("is-valid");
  }else {
    textDescription.style.borderColor = "rgb(115,20,18)";
  }

  if(new_student["student_status"] === true){
    switchStudentStatus.checked = true;
    labelStudentStatus.value = "The student account is Active"
  }else{
    switchStudentStatus.checked = false;
    labelStudentStatus.value = "The student account is In-active"
  }
}



//to view student record from the table
function viewStudentRecord(object,rowID){
    let student = object;

  tdId.innerHTML = student.id;
  tdFullName.innerHTML = student.full_name;
  tdNameWithInitials.innerHTML = student.name_with_initials;
  tdCallingName.innerHTML = student.calling_name;

  if (student.nic !== undefined){
    tdNIC.innerHTML = student.nic;
  }else{
    tdNIC.innerHTML = "-";
  }

  tdDOB.innerHTML = student.date_of_birth;
  tdGender.innerHTML = student.gender;
  tdGuardian.innerHTML = student.guardian_id.name_with_initials;
  tdRace.innerHTML = student.race_id.name;
  tdReligion.innerHTML = student.religion_id.name;
  tdPermanentAddress.innerHTML = student.permanent_address;

  if (student.current_address !== undefined){
    tdCurrentAddress.innerHTML = student.current_address;
  }else{
    tdCurrentAddress.innerHTML = "-";
  }

  if (student.description !== undefined){
    tdDescription.innerHTML = student.description;
  }else{
    tdDescription.innerHTML = "-";
  }

  if (student.student_status === true){
    tdStatus.innerHTML = "Active";
  }else{
    tdStatus.innerHTML = "In-active";
  }

  $("#modalViewStudent").modal("show");
}



//check all the required fields are filled
function checkErrors(){

  let errors = "";

  if (new_student.full_name == null){
    errors += "Please Enter Student's full name! + \n";
  }

  if (new_student.name_with_initials == null) {
    errors += "Please Enter Student's Name with Initials! \n";

  }

  if (new_student.calling_name == null) {
    errors += "Please Enter Student's Calling Name! \n";

  }

  if (new_student["date_of_birth"] == null){
    errors += "Please Select Student's Date of Birth! \n";

  }

  if (new_student.gender == null){
    errors += "Please select Student's Gender! \n";

  }

  if (new_student.race_id == null){
    errors += "Please select Student's race!! \n";

  }

  if (new_student.religion_id == null){
    errors += "Please select Student's Religion!! \n";

  }

  if (new_student.permanent_address == null){
    errors += "Please enter Student's Permanent Address!! \n";

  }

  if (new_student.guardian_id === ""){
    errors += "Please select Student's Guardian! \n";

  }

  return errors;
}



//function to submit the form
function submitStudent(){

  console.log(selectRace.value);

  console.log(new_student);

  let errors = checkErrors();

  if (errors === ""){
    let userResponse = window.confirm("Are you sure to add this Student?");

          if (userResponse){
            let serverResponse = getHttpRequestService("/student","POST",new_student);
            if (serverResponse === "0"){
                window.alert("Student Record Has Been Added Successfully!");
                refreshStudentForm();
                refreshStudentTable();
            }else {
              alert("Student record can not be added! \n" + errors);
            }
          }
  }else{
    alert("Student record can not be added! Please correct following errors! \n" + errors);
  }

}



// check updated values
function checkUpdates(){

  let updates = "";


  if (new_student.full_name !== old_student.full_name){
    updates += "Student's full name has been changed from " + old_student.full_name + " to " + new_student.full_name + "\n";
  }
  if (new_student.name_with_initials !== old_student.name_with_initials){
    updates += "Student's name with initials has been changed from " + old_student.name_with_initials + " to " + new_student.name_with_initials + "\n";
  }
  if (new_student.calling_name !== old_student.calling_name) {
    updates += "Student's calling name has been changed from " + old_student.calling_name + " to " + new_student.calling_name + "\n";
  }
  if (new_student.nic !== old_student.nic){
    updates += "Student's NIC number has been changed from " + old_student.nic + " to " + new_student.nic + "\n";
  }
  if (new_student.date_of_birth !== old_student.date_of_birth){
    updates += "Student's Date of Birth has been changed from " + old_student.date_of_birth + " to " + new_student.date_of_birth + "\n";
  }
  if (new_student.gender !== old_student.gender){
    updates += "Student's gender has been changed from " + old_student.gender + " to " + new_student.gender + "\n";
  }
  if (new_student.race_id.name !== old_student.race_id.name){
    updates += "Student's Race has been changed from " + old_student.race_id.name + " to " + new_student.race_id.name + "\n";
  }
  if (new_student.religion_id.name !== old_student.religion_id.name){
    updates += "Student's Religion has been changed from " + old_student.religion_id.name + " to " + new_student.religion_id.name + "\n";
  }
  if (new_student["permanent_address"] !== old_student["permanent_address"]){
    updates += "Student's Permanent Address has been changed from " + old_student["permanent_address"] + " to " + new_student["permanent_address"] + "\n";
  }
  if (new_student["current_address"] !== old_student["current_address"]){
    updates += "Student's Current Address has been changed from " + old_student["current_address"] + " to " + new_student["current_address"] + "\n";
  }
  if (new_student["description"] !== old_student["description"]){
    updates += "Student description  has been changed from " + old_student["description"] + " to " + new_student["description"] + "\n";
  }

  return updates;
}



// update student
function updateStudent(){

  let errors = checkErrors();
  if (errors === ""){
    let updatedData = checkUpdates();

    if (updatedData !== ""){
      let userResponse = window.confirm("Are you sure that you want to make following changes? "+ updatedData);

      if (userResponse){
        let serverResponse = getHttpRequestService("/student","PUT",new_student);
        if (serverResponse === "0"){
          alert("Student record updated successfully!");
          refreshStudentTable();
          refreshStudentForm();
        }else {
          alert("Error! Student record can not be updated!");
        }
      }else {
        alert("Student record was not updated!");
      }
    }
  }else {
    alert("Please correct following errors! " + errors);
  }
}



//get gender & dob through Student's nic
function genderThroughNIC() {
  var nicNo = textNIC.value;
  let pattern = "^([0-9]{9}[x|X|v|V]|[0-9]{12})$";

  let testPattern = new RegExp(pattern);

  //execute only if the nic value is validated
  if (testPattern.test(nicNo)) {
    // check whether the id number is 10 digit one. if it is coverting it to 12 number one.
    if (nicNo.length === 10) {
      // getting year digitis
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
      new_student["gender"] = "Male";
      label_male.style.color = "green";
      label_female.style.color = "rgb(115,20,18)";
    } else {
      genderFemale.checked = true;
      new_student["gender"] = "Female";
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
    if(monthDayDigits > 500){
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
      birthDate = startDate.setDate(monthDayDigits-1);
    }
 
    dob = new Date(birthDate);
    let month = dob.getMonth() + 1;
    let date = dob.getDate();

    if(yearDigits.length === 2){
          yearDigits = "19" + yearDigits;
    }

    if(month < 10){
      month = "0" + month;
    }

    if(date < 10){
      date = "0" + date;
    }

    finalBirthDate = yearDigits + "-" + month + "-" + date;
    dateDOB.value = finalBirthDate;
    dateDOB.classList.add("is-valid");
    new_student["date_of_birth"] = finalBirthDate;
  }
  else{
    dateDOB.classList.remove("is-valid");
    dateDOB.value = "";

  }
}
