window.addEventListener('load',function (){

    let logged_user = getServiceMapping("/logged_user/");

    loggedUserUsername.innerText = logged_user.username;
    loggedUserRole.innerText = logged_user.role;

    console.log(logged_user);
})


function logOutConfirmation(){

    let logout_user_confirmation = window.confirm("Are you sure to log out?");

    if (logout_user_confirmation){
        window.location.replace('/log_out');
    }
}