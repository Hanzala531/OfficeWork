document.addEventListener("DOMContentLoaded", () => {
  fetchProductData(
    "http://localhost:3000/api/v1/products",
    "productTable",
    "products"
  );
  fetchNewsLetterData("http://localhost:3000/api/v1/newsletter", "newsLetterTable");
  userData("http://localhost:3000/api/v1/users", "userTable", "users");
});

// function to fetch and display data of products
async function fetchProductData(url, tableId) {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No access token found. Please login.");

    const response = await fetch(url, {
      headers: { 
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    if (!data.success || !Array.isArray(data.data)) {
      throw new Error("Invalid data format received");
    }

    const table = document.getElementById(tableId);
    table.innerHTML = table.rows[0].outerHTML; // Preserve table header

    data.data.forEach((item) => {
      let row = table.insertRow();
      row.insertCell().textContent = item.name; // Product name
      row.insertCell().textContent = item.price; // Product price
      row.insertCell().textContent = item.category.name; // Category name
      let actionCell = row.insertCell();
      actionCell.innerHTML = `<button>Edit</button> <button class="delete">Delete</button>`;

      // Add event listener for delete button
      actionCell.querySelector(".delete").addEventListener("click", async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/v1/products/${item._id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

          const result = await response.json();
          if (!result.success) throw new Error(result.message);

          console.log("Product deleted successfully");
          row.remove();
        } catch (error) {
          console.error("Error deleting product:", error.message);
          console.log(`Error deleting product: ${error.message}`);
        }
      });
    });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    console.log(`Error fetching data: ${error.message}`);
  }
}

// Function to fetch and display data of NewsLetter
async function fetchNewsLetterData(url, tableId) {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No access token found. Please login.");

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    if (!data.success || !Array.isArray(data.data)) {
      throw new Error("Invalid data format received");
    }

    const table = document.getElementById(tableId);
    table.innerHTML = table.rows[0].outerHTML; // Preserve table header

    data.data.forEach((item) => {
      let row = table.insertRow();
      row.insertCell().textContent = item.subscriberNo; // Email
      row.insertCell().textContent = item.email; // Email
      let actionCell = row.insertCell();
      actionCell.innerHTML = `<button>Delete</button>`;

      // Add event listener for delete button
      actionCell.querySelector("button").addEventListener("click", async () => {
        try {
          console.log("Deleting item with ID:", item._id); // Debugging statement
          const response = await fetch(`http://localhost:3000/api/v1/newsletter/${item._id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

          const result = await response.json();
          if (!result.success) throw new Error(result.message);

          console.log("Email deleted successfully");
          row.remove();
        } catch (error) {
          console.error("Error deleting email:", error.message);
          console.log(`Error deleting email: ${error.message}`);
        }
      });
    });

  } catch (error) {
    console.error("Error fetching data:", error.message);
    console.log(`Error fetching data: ${error.message}`);
  }
}

// Function to fetch and display data of users
async function userData(url, tableId, key) {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No access token found. Please login.");

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    if (!data.success || !Array.isArray(data[key])) {
      throw new Error("Invalid data format received");
    }

    const table = document.getElementById(tableId);
    table.innerHTML = table.rows[0].outerHTML; // Preserve table header

    data[key].forEach((item) => {
      let row = table.insertRow();
      row.insertCell().textContent = item.username;
      row.insertCell().textContent = item.email;
      row.insertCell().textContent = item.role;
      let actionCell = row.insertCell();
      actionCell.innerHTML = `<button class="update-status">Update Status</button> <button class="delete">Delete</button>`;

      // Add event listener for edit button
      // Api call for editing user
      actionCell.querySelector(".update-status").addEventListener("click", () => {
        // Create a dropdown for status selection
        const statusDropdown = document.createElement("select");
        const statuses = ["user", "admin", "moderator", "editor"]; // Statuses from user model
        statuses.forEach(status => {
          const option = document.createElement("option");
          option.value = status;
          option.textContent = status;
          statusDropdown.appendChild(option);
        });

        // Create a save button
        const saveButton = document.createElement("button");
        saveButton.textContent = "Save";

        // Replace the Update Status button with the dropdown and save button
        actionCell.innerHTML = "";
        actionCell.appendChild(statusDropdown);
        actionCell.appendChild(saveButton);

        // Add event listener for save button
        saveButton.addEventListener("click", async () => {
          try {
            const selectedRole = statusDropdown.value;
            console.log("Updating role for user with ID:", item._id);
            const response = await fetch(`http://localhost:3000/api/v1/users/${item._id}/role`, {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ role: selectedRole })
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const result = await response.json();
            if (!result.success) throw new Error(result.message);

            console.log("User role updated successfully");
            // Update the row to reflect the new role
            const roleCell = row.cells[2]; // Assuming role is in the third column
            roleCell.textContent = selectedRole;
            
            // Restore the original buttons
            actionCell.innerHTML = `<button class="update-status">Update Status</button> <button class="delete">Delete</button>`;
          } catch (error) {
            console.error("Error updating user role:", error.message);
            alert("Failed to update user role: " + error.message);
          }
        });
      });

      // Add event listener for delete button
      actionCell.querySelector(".delete").addEventListener("click", async () => {
        try {
          console.log("Deleting user with ID:", item._id); // Debugging statement
          const response = await fetch(`http://localhost:3000/api/v1/users/${item._id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

          const result = await response.json();
          if (!result.success) throw new Error(result.message);

          console.log("User deleted successfully");
          row.remove();
        } catch (error) {
          console.error("Error deleting user:", error.message);
          console.log(`Error deleting user: ${error.message}`);
        }
      });
    });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    console.log(`Error fetching data: ${error.message}`);
  }
}

// Theme toggle
document.getElementById("theme-toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Logout functionality
document.getElementById("logout").addEventListener("click", async () => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No access token found. Please login.");

    const response = await fetch(
      "http://localhost:3000/api/v1/users/logout",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }

    console.log("Logout successful");
    localStorage.removeItem("accessToken");
    window.location.href = "login.html";
  } catch (error) {
    console.error("Logout error:", error);
    console.log("Logout failed: " + error.message);
  }
});