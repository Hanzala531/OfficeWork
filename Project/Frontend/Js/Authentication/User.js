import { loginUser } from "./userApi";
document.addEventListener('DOMContentLoaded', function() {
    const email = document.querySelector('.LoginEmail');
    const password = document.querySelector('.LoginPassword');
    loginUser(email, password, '../index.html');
})