function addRoutineToPlan(routineId, weekStartDate) {
    fetch('/addRoutine', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ routineId, weekStartDate }),
    })
    .then(response => {
      if (response.ok) {
        return response.text();
      }
      throw new Error('Network response was not ok.');
    })
    .then(text => {
      alert(text); // Display the success message from the server as an alert
    })
    .catch(error => console.error('Error adding routine:', error));
  }
  