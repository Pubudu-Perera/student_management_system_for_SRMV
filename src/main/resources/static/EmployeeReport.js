window.addEventListener("load",function (){

    loggedUserPrivileges = getServiceMapping("/logUserModulePrivilege/byModule/" + "EmployeeReport");

    refreshEmployeeReportTable();
})


function refreshEmployeeReportTable(){

    let employees = getServiceMapping("/employee/findall");

    let employeeProperties = ["employee_no","name_with_initials","calling_name","designation_id.name","nic","mobile","employee_status"];

    let employeeDataTypes = ["text","text","text","object","text","text",getEmployeeStatus];

    fillDataTable(tableEmployee,employees,employeeProperties,employeeDataTypes,deleteEmployee,editEmployee,viewEmployee,false,loggedUserPrivileges);
}


function getEmployeeStatus(object){

    let employee_status_label = "Active";

    if (object["employee_status"]){
        employee_status_label = "In-active";
    }

    return employee_status_label;
}


function deleteEmployee(){

}


function editEmployee(){

}


function viewEmployee(){

}


function printEmployeeTable(){

}