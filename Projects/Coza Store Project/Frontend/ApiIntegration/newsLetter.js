// Integrating the subscriber to the newsletter
// http://localhost:3000/api/v1/newsletter
// Method: POST

const form = document.querySelector('#newsletter-form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.querySelector('#email').value;

  if (!email) {
    alert('Please enter an email address.');
    return;
  }

  try {
    const response = await addEmail(email);

    if (response.success) {
      // Check for a success flag in the response
      alert('Thank you for subscribing to our newsletter!');
      document.querySelector('#email').value = ''; // Clear the input field
    } else {
      // Handle specific error messages from the backend
      const errorMessage = response.message || 'Failed to subscribe.';
      alert(`Failed to subscribe: ${errorMessage} Please try again.`);
    }
  } catch (error) {
    console.error('Error subscribing:', error);
    alert(
      'Failed to subscribe to newsletter. Please check the console for details.'
    );
  }
});

const addEmail = async (email) => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/newsletter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 400, 500)
      const message = await response.json();
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${message.message}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding subscriber:', error);
    throw error;
  }
};
