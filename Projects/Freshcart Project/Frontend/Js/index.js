  async function fetchUserInfo() {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                console.log("User is not logged in");
                return;
            }

            const response = await fetch('http://localhost:3000/api/v1/users/user', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
                },
            });

            if (response.ok) {
                const userInfo = await response.json();
                console.log("Logged in as:", userInfo.name); // Access the username
                return userInfo; // Return user info for further use
            } else {
                console.error("Failed to fetch user info:", response.statusText);
            }
        }

        document.addEventListener('DOMContentLoaded', async function() {
            const logged = document.querySelector('.login');

            // Function to check if the user is logged in
            function isLoggedIn() {
                const token = localStorage.getItem('accessToken');
                return token !== null;
            }

            // Check on page load
            if (isLoggedIn()) {
                const userInfo = await fetchUserInfo(); // Fetch user info
                logged.addEventListener('click', function() {
                    alert('You are already logged in as ' + userInfo.name);
                    window.location.href = "../Html/profile.html"; // Redirect to profile page
                });

                // Update the UI to show the profile link
                logged.innerHTML = `
                    <img src="./svgs/user.svg" alt="User Icon" class="icon me-1" />
                    <span class="navRightTxt logintxt">Profile</span>`;
            } else {
                console.log("User is not logged in");
                // Update the UI to show the login link
                logged.innerHTML = `
                    <img src="./svgs/user.svg" alt="User Icon" class="icon me-1" />
                    <span class="navRightTxt logintxt">Login</span>`;
            }
        });