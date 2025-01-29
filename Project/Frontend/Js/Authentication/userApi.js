// loginApi.js

async function loginUser(username, password, redirectUrl) {
    try {
        const response = await fetch('http://localhost:8000/api/v1/users/login', {
            method: 'POST', // Assuming it's a POST request
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error(`Login API Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched User Data:", data.data);
        
        // Redirect to the specified URL if login is successful
        window.location.href = redirectUrl;

        return data.data; // Return the user data
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error; // Rethrow the error for handling in the calling code
    }
}

export { loginUser };
