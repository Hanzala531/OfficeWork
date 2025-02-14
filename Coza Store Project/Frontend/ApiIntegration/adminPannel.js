document.addEventListener("DOMContentLoaded", () => {
  fetchProductData(
    "http://localhost:3000/api/v1/products",
    "productTable",
    "products"
  );
  fetchOrdersData("http://localhost:3000/api/v1/orders", "orderTable");
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
      row.insertCell().textContent = "$"+item.price; // Product price
      row.insertCell().textContent = item.category.name; // Category name
      row.insertCell().textContent = item.stock; // Stock
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

//function to display orders data 
async function fetchOrdersData(url, tableId) {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No access token found. Please login.");

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
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
      row.insertCell().textContent = item._id; // Order ID
      row.insertCell().textContent = "$"+item.totalAmount; // Total amount
      row.insertCell().textContent = item.status; // Order status
      
      let actionCell = row.insertCell();
      actionCell.innerHTML = `
        <button class="update-status">Update Status</button> 
        <button class="delete">Delete</button>
      `;

      // Attach event listener to delete button
      actionCell.querySelector(".delete").addEventListener("click", async () => {
        try {
          const confirmDelete = confirm("Are you sure you want to delete this order?");
          if (!confirmDelete) return;

          const deleteResponse = await fetch(`${url}/${item._id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!deleteResponse.ok) throw new Error(`Delete failed: ${deleteResponse.status}`);

          // Remove row from table
          table.deleteRow(row.rowIndex);

          console.log(`Order ${item._id} deleted successfully`);
        } catch (error) {
          console.error("Error deleting order:", error.message);
        }
      });

      // Add event listener for Update Status button
      actionCell.querySelector(".update-status").addEventListener("click", async () => {
        const statusDropdown = document.createElement("select");
        const statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
        statuses.forEach((status) => {
          const option = document.createElement("option");
          option.value = status;
          option.textContent = status;
          if (status === item.status) option.selected = true;
          statusDropdown.appendChild(option);
        });

        const saveButton = document.createElement("button");
        saveButton.textContent = "Save";

        actionCell.innerHTML = "";
        actionCell.appendChild(statusDropdown);
        actionCell.appendChild(saveButton);

        saveButton.addEventListener("click", async () => {
          try {
            const selectedStatus = statusDropdown.value;
            const updateResponse = await fetch(`${url}/${item._id}/status`, {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ status: selectedStatus }),
            });

            if (!updateResponse.ok) throw new Error(`Update failed: ${updateResponse.status}`);

            // Update status cell text
            row.cells[3].textContent = selectedStatus;

            // Restore original buttons after update
            actionCell.innerHTML = `
              <button class="update-status">Update Status</button> 
              <button class="delete">Delete</button>
            `;

            // Reattach event listeners after restoring buttons
            actionCell.querySelector(".delete").addEventListener("click", () => row.remove());
            actionCell.querySelector(".update-status").addEventListener("click", async () => {
              actionCell.innerHTML = "";
              actionCell.appendChild(statusDropdown);
              actionCell.appendChild(saveButton);
            });

          } catch (error) {
            console.error("Error updating status:", error.message);
          }
        });
      });
    });

  } catch (error) {
    console.error("Error fetching data:", error.message);
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
  document.querySelector("#theme-toggle").textContent = document.body.classList.contains("dark-mode") ? "Light Mode" : "Dark Mode";
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