// VALIDATOR functions

// common validator function for text input fields
// new_object & old_object for if the user has updated the data. both objects are declared both objects in refreshForm() function.
function textValidator(field_ID, pattern, new_object, property, old_object) {
  let new_text_object = window[new_object];
  let old_text_object = window[old_object];

  //when the field is required
  if (field_ID.value !== "") {
    // convert the pattern into RegEx object
    const testPattern = new RegExp(pattern);

    //check the input field value is match to the specified RegEx pattern
    if (testPattern.test(field_ID.value)) {
      new_text_object[property] = field_ID.value;
      field_ID.classList.remove("is-invalid");

      if (
        old_text_object != null &&
        old_text_object[property] !== new_text_object[property]
      ) {
        field_ID.classList.add("is-valid");
        field_ID.style.borderColor = "orange";
      } else {
        field_ID.classList.add("is-valid");
      }
    } else {
      field_ID.classList.add("is-invalid");

      //for every key up this function is called. To avoid creating multiple span elements we have to make sure there is no span elements with "invalid" ID, has been created before.
      //  That's why for this IF statement
      if (document.getElementById("invalid") === null) {
        const invalid_feedback = document.createElement("span");
        invalid_feedback.setAttribute("id", "invalid");
        invalid_feedback.textContent = "Please Provide Valid Data!";
        invalid_feedback.classList.add("invalid-feedback");

        field_ID.after(invalid_feedback);
      }
    }
  }

  //when the field is optional
  else {
    if (field_ID.required) {
      new_text_object[property] = null;
      field_ID.classList.add("is-invalid");
    } else {
      new_text_object[property] = field_ID.value;
    }
  }
}




// validate function for date fields
function dateValidator(field_ID, new_object, property, old_object) {
  const new_date_object = window[new_object];
  const old_date_object = window[old_object];

  // if the field is not empty
  if (field_ID.value !== "") {
      new_date_object[property] = field_ID.value;
    if (
      old_date_object != null &&
      old_date_object[property] !== new_date_object[property]
    ) {
      field_ID.style.borderColor = "orange";
      field_ID.classList.add("is-valid");
    } else {
      field_ID.classList.add("is-valid");
    }
  }
  else{
    new_date_object[property] = null;
    if(field_ID.required){
        field_ID.classList.add("is-invalid");
    }else{
        field_ID.style.borderColor = 'rgb(118,118,118)';
    }
  }
}




// common Validator for input file  field(only to add image files)
function fileValidation(field_ID,new_object,property,old_object) {
    const new_file_object = window[new_object];
    const old_file_object = window[old_object];


  
    // Allowing file type
    let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;

    let invalid_feedback;

    if (!allowedExtensions.exec(field_ID.value)) {
        field_ID.classList.add("is-invalid");

        if (document.getElementById("invalid") == null) {
            invalid_feedback = document.createElement("span");
            invalid_feedback.setAttribute("id", "invalid");
            invalid_feedback.classList.add("invalid-feedback");
            invalid_feedback.textContent = "Please Provide Valid image format! Ex-: .jpg, .jpeg, .png";
            field_ID.after(invalid_feedback);
        }

    } else {
        if (document.getElementById("invalid") != null) {
            document.querySelector("#invalid").remove();
            field_ID.classList.remove("is-invalid");
        }

        let fileReaderPhoto = new FileReader();

        fileReaderPhoto.onload = function () {

            new_file_object[property] = btoa(fileReaderPhoto.result);
            return;

        }

        fileReaderPhoto.readAsDataURL(field_ID.files[0]);
        console.log(field_ID.files[0]);
    }
  }




// select field validator
function selectValidator(field_ID,new_object,property,old_object){
    new_select_object = window[new_object];
    old_select_object = window[old_object];

    // field is required
    if(field_ID.value !== ""){
        new_select_object[property] = JSON.parse(field_ID.value);

        if(old_select_object != null && old_select_object[property]["id"] !== new_select_object[property]["id"]){

            field_ID.classList.add("is-valid");
            field_ID.style.borderColor = "orange";
            
        }else{
            // if (field_ID.class === "is-invalid"){
            //     field_ID.classList.remove("is-invalid");
            // }
            field_ID.classList.add("is-valid");
        }
    }else{
        new_select_object[property] = null;
        if (field_ID.required) {
            field_ID.classList.add("is-invalid");
        }else {
            field_ID.style.borderColor = "rgb(118,118,118)";
        }
    }
}



// data list validator
function dataListValidator(fieldID,pattern,new_object,property,old_object,dataListName,displayProperty,showFieldID,showFieldProperty){

    let new_dataList_object = window[new_object];

    let old_dataList_object = window[old_object];

    let dataList = window[dataListName];

    if (fieldID.value !== ""){
        const selected_pattern = new RegExp(pattern);

        if (selected_pattern.test(fieldID.value)){
            // new_dataList_object[property] = fieldID.value;

            for (let index in dataList) {
                if (getDataFromObject(dataList[index], displayProperty) === fieldID.value) {
                    new_dataList_object[property] = dataList[index];
                    showFieldID.innerHTML = getDataFromObject(dataList[index], showFieldProperty)
                }
            }

            if (old_dataList_object != null && new_dataList_object[property][displayProperty] !== old_dataList_object[property][displayProperty]){
                fieldID.style.border = "2px solid orange";
            }else {
                fieldID.classList.add("is-valid");
            }
        }else {
            new_dataList_object[property] = null;
            fieldID.classList.add("is-invalid");
        }
    }else {
        new_dataList_object[property] = null;
        if (fieldID.required){
            fieldID.classList.add("is-invalid");
        }else{
            fieldID.style.border = "2px solid rgb(118,118,118)";
        }
    }
}



// radio field validator
function radioValidator(field_ID,new_object,property,old_object,label_ID_1,label_ID_2){
    new_radio_object = window[new_object];
    old_radio_object = window[old_object];

    if(field_ID.checked){
        new_radio_object[property] = field_ID.value;
        console.log(field_ID.value);
        console.log(new_radio_object[property]);

        if(old_radio_object != null && old_radio_object[property] !== new_radio_object[property]){
            field_ID.nextElementSibling.style.color = "orange";
        }else{
            field_ID.nextElementSibling.style.color = "green";
        }

    }else{
        new_radio_object[property] = null;
        label_ID_1.style.color = "red";
        label_ID_2.style.color = "red";
    }
}


//Common validator function for all checkbox fields & switch elements
const checkboxValidator = (field_ID,new_object,property,old_object,setTrueValue,setFalseValue,label_status_ID,trueLabelDisplayText,falseLabelDisplayText) => {
    let ob = window[new_object];
    let old_ob = window[old_object];

    if(field_ID.checked){
        ob[property] = setTrueValue;
        label_status_ID.innerText = trueLabelDisplayText;
    }else{
        ob[property] = setFalseValue;
        label_status_ID.innerText = falseLabelDisplayText;
    }
}



//common select field filling function for all select fields
const fillingSelectElements = (field_id, message, dataList, displayProperty, selectedValue = null, display = true) => {

    //clear existing value
    field_id.innerHTML = "";


    //creating "Select one" part
    let option_placeholder = document.createElement('option');
    option_placeholder.selected = true;
    option_placeholder.disabled = true;
    option_placeholder.innerText = message;

    field_id.appendChild(option_placeholder);

    //creating designations
    for (let index in dataList) {
        let createOptions = document.createElement('option');

        //JSON.stringify() is used to catch the particular value as a JSON object.
        createOptions.value = JSON.stringify(dataList[index]);

        //createOptions.innerText = dataList[index][displayProperty];
        createOptions.innerText = getDataFromObject(dataList[index], displayProperty);

        if (getDataFromObject(dataList[index], displayProperty) === selectedValue) {
            createOptions.selected = true;
            field_id.classList.add("is-valid");
        }

        field_id.appendChild(createOptions);


    }

    if (display === true) {
        field_id.disabled = false;
    } else {
        field_id.disabled = true;
    }
}



//common select field filling function for all select fields(2 values for one field)
const fillingSelectElements2 = (field_id, message, dataList, displayProperty1, displayProperty2,selected_value ,display = true) => {

    field_id.innerHTML = "";
    field_id.value = "";

    //creating "Select one" part
    let option_placeholder = document.createElement('option');
    option_placeholder.selected = true;
    option_placeholder.disabled = true;
    option_placeholder.innerText = message;

    field_id.appendChild(option_placeholder);

    for(let index in dataList){
        let option_values = document.createElement("option");

        option_values.value = JSON.stringify(dataList[index]);
        option_values.innerText = dataList[index][displayProperty1] + " --- " + dataList[index][displayProperty2];
        if (selected_value === dataList[index][displayProperty1]){
            option_values.selected = "selected";
        }
        field_id.appendChild(option_values);
    }

    if (display){
        field_id.disabled = false;
    }else {
        field_id.disabled = true;
    }
}



// search & select Datalist auto fill
function fillDataList(dataListFieldID,inputFieldID,displayMessage,dataList,displayProperty,selectedValue){

    dataListFieldID.innerHTML = "";
    let optionPlaceholder = document.createElement("option");
    optionPlaceholder.value = "";
    optionPlaceholder.innerText = displayMessage;
    optionPlaceholder.selected = true;
    optionPlaceholder.disabled = true;
    dataListFieldID.appendChild(optionPlaceholder);

    for (let index in dataList){
        let optionValues = document.createElement("option");
        optionValues.value = getDataFromObject(dataList[index],displayProperty);
        if (getDataFromObject(dataList[index],displayProperty) === selectedValue){
            optionValues.selected = true;
            inputFieldID.value = getDataFromObject(dataList[index],displayProperty);
            inputFieldID.classList.add("is-valid");
        }

        dataListFieldID.appendChild(optionValues);
    }

}



//filling data into the main table (Important)
function fillDataTable(tableID, dataList, propertyList, dataTypeList, deleteData, editData, viewData, buttonVisibility = true,loggedUserPrivileges) {

    let tbody = tableID.children[1];
    tbody.innerHTML = "";

    for (let record in dataList) {


        //creating new <tr> element
        let trow = document.createElement("tr");

        //creating <td> element for Index field
        let index = document.createElement("td");
        index.innerText = parseInt(record) + 1;

        trow.appendChild(index);



        for (let pro in propertyList) {

            let property = document.createElement("td");

            let data = dataList[record][propertyList[pro]];

            if (dataTypeList[pro] === "text") {
                if (data == null) {
                    property.innerText = "-";
                } else {
                    property.innerText = data;
                }
            }
            // else if (dataTypeList[pro] === "YearOfBirth") {
            //     if (data == null) {
            //         property.innerText = "-";
            //     } else {
            //         property.innerText = new Date(data).getFullYear();
            //     }
            // }
            else if (dataTypeList[pro] === "image") {

                let img = document.createElement("img");
                img.style.height = "50px";
                img.style.width = "50px";

                if (data == null) {
                    img.src = "Resources/Images/Icon.png";
                } else {
                    //img.src = "";
                }
                property.appendChild(img);

            } else if (dataTypeList[pro] === "object") {
                property.innerHTML = getDataFromObject(dataList[record], propertyList[pro]);

            } else {
                property.innerHTML = dataTypeList[pro](dataList[record]);
            }

            trow.appendChild(property);
        }


        //creating buttons for modify field
        const Modify = document.createElement("td");

        const clearButton = document.createElement("button");
        clearButton.classList.add("btn");
        clearButton.classList.add("btn-danger");
        clearButton.classList.add("ms-1");
        clearButton.classList.add("me-1");
        clearButton.classList.add("btn-sm");
        clearButton.innerHTML = "<i class='fa-solid fa-trash-can'></i>";
        clearButton.onclick = function() {
            let idx = this.parentNode.parentNode.firstChild.innerHTML;
            deleteData(dataList[parseInt(idx) - 1], parseInt(idx) - 1);
        }
        if(!loggedUserPrivileges.delete){
            clearButton.disabled = true;
            clearButton.style.pointerEvents = "all"
            clearButton.style.cursor = "not-allowed";
        }else{
            clearButton.disabled = false;
            clearButton.style.pointerEvents = "all"
            clearButton.style.cursor = "pointer";
        }

        const editButton = document.createElement("button");
        editButton.classList.add('btn');
        editButton.classList.add('btn-warning');
        editButton.classList.add('ms-1');
        editButton.classList.add('me-1');
        editButton.classList.add("btn-sm");
        editButton.innerHTML = "<i class='fa-solid fa-pen'></i>";
        editButton.onclick = function() {

            let idx = this.parentNode.parentNode.firstChild.innerHTML;
            editData(dataList[parseInt(idx) - 1], parseInt(idx) - 1);
        }
        if(!loggedUserPrivileges.update){
            editButton.disabled = true;
            editButton.style.pointerEvents = "all"
            editButton.style.cursor = "not-allowed";
        }else{
            editButton.disabled = false;
            editButton.style.pointerEvents = "all"
            editButton.style.cursor = "pointer";
        }

        const viewButton = document.createElement("button");
        viewButton.classList.add("btn");
        viewButton.classList.add("btn-info");
        viewButton.classList.add("ms-1");
        viewButton.classList.add("me-1");
        viewButton.classList.add("btn-sm");
        viewButton.innerHTML = "<i class='fa-solid fa-eye'></i>";
        viewButton.onclick = function() {
            let idx = this.parentNode.parentNode.firstChild.innerHTML;
            viewData(dataList[parseInt(idx) - 1], parseInt(idx) - 1);
        }


        Modify.appendChild(clearButton);
        Modify.appendChild(editButton);
        Modify.appendChild(viewButton);

        if (buttonVisibility) {
            trow.appendChild(Modify);
        }


        tbody.appendChild(trow);
    }
}



//filling data into the inner tables (Important)
function fillInnerDataTable(InnerTableID, dataList, propertyList, dataTypeList, deleteData) {

    let tbody = InnerTableID.children[1];
    tbody.innerHTML = "";

    for (let record in dataList) {


        //creating new <tr> element
        let trow = document.createElement("tr");

        //creating <td> element for Index field
        let index = document.createElement("td");
        index.innerText = parseInt(record) + 1;

        trow.appendChild(index);



        for (let pro in propertyList) {

            let property = document.createElement("td");

            let data = dataList[record][propertyList[pro]];

            if (dataTypeList[pro] === "text") {
                if (data == null) {
                    property.innerText = "-";
                } else {
                    property.innerText = data;
                }
            }

            else if (dataTypeList[pro] === "image") {

                let img = document.createElement("img");
                img.style.height = "50px";
                img.style.width = "50px";

                if (data == null) {
                    img.src = "Resources/Images/Icon.png";
                } else {
                    //img.src = "";
                }
                property.appendChild(img);

            } else if (dataTypeList[pro] === "object") {
                property.innerHTML = getDataFromObject(dataList[record], propertyList[pro]);

            } else {
                property.innerHTML = dataTypeList[pro](dataList[record]);
            }

            trow.appendChild(property);
        }


        //creating buttons for modify field
        const Modify = document.createElement("td");

        const clearButton = document.createElement("button");
        clearButton.classList.add("btn");
        clearButton.classList.add("ms-3");
        clearButton.classList.add("me-3");
        clearButton.classList.add("btn-sm");
        clearButton.innerHTML = "<i class='fa-solid fa-trash-can'></i>";
        clearButton.onclick = function() {
            let idx = this.parentNode.parentNode.firstChild.innerHTML;
            deleteData(dataList[parseInt(idx) - 1], parseInt(idx) - 1);
        }

        Modify.appendChild(clearButton);

        trow.appendChild(Modify);

        tbody.appendChild(trow);
    }
}



//The function is used to get the value of nested objects Ex-: Employee_Designation : {id: 1, designation_name : "Manager", branch : {branch_ID:123, branch_name:"Matara"}}
//if we want to access property called Branch_name, first of all we have to access "Branch". It is an object type property.
//Through the property "branch", we access "Branch_name".
//called at fillingSelectElements() & fillDataTable()
const getDataFromObject = (object_of_the_property, propertyPath) => {

    let get = (propertyModal, path) => {

        let paths = path.split(".");

        if (paths.length > 1 && typeof propertyModal[paths[0]] === 'object') {
            return get(propertyModal[paths[0]], paths.splice(1).join('.'));
        } else {
            return propertyModal[paths[0]];
        }
    }

    let data = get(object_of_the_property, propertyPath);
    return data;
}



//common GET Request mapping implementation to get data from database & fill them to the table of any module
function getServiceMapping(url){
    let responseData;
    $.ajax(url,{
        async:false,
        dataType:'json',
        success:function (data,status,ahr){
            $('#serviceStatus').append(url + "<br>");
            $('#serviceStatus').append(status + "<br>");
            $('#serviceStatus').append(JSON.stringify(data) + "<br>");
            responseData = data;
        },
        errors:function (ahr,status,errormsg){
            $('#serviceStatus').append(url + "<br>");
            $('#serviceStatus').append(status + "<br>");
            $('#serviceStatus').append(ahr.response.json.error + "<br>");
            responseData = [];
        }
    });

    return responseData;
}



//to perform common http methods like DELETE,PUT,POST
//this function often used in table's modify column to Delete, Update data
function getHttpRequestService(url,method,rdata){
    let responseData;
    $.ajax(url,{
        async:false,
        type:method,
        data:JSON.stringify(rdata),
        timeout: 500,
        contentType: 'application/json',
        success:function (data,status,ahr){
            $('#serviceStatus').append(url + "<br>");
            $('#serviceStatus').append(status + "<br>");
            $('#serviceStatus').append(data + "<br>");
            responseData = data;
        },
        errors:function (ahr,status,errormsg){
            $('#serviceStatus').append(url + "<br>");
            $('#serviceStatus').append(status + "<br>");
            $('#serviceStatus').append(ahr.response.json.error + "<br>");
            responseData = ahr.response.json.error;
        }
    });
    return responseData;
}




//function to get current date
function getCurrentDate(format,givenDate){

    //set auto  load value
    let today;

    if (givenDate !== "") {
        today = new Date(givenDate)
    } else {
        today = new Date()
    }
    let month = today.getMonth() + 1 // return 0-11;
    let date = today.getDate() // return 1-31;

    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    //AssDate.value ="2022-10-02";
    let currentDate = today.getFullYear() + "-" + month + "-" + date;
    let currentMonth = today.getFullYear() + "-" + month;
    let currentYear = today.getFullYear();

    if (format == "date") return currentDate;
    if (format == "month") return currentMonth;
    if (format == "year") return currentYear;
}