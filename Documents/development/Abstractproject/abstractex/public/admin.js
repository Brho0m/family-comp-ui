


document.addEventListener('DOMContentLoaded', function() {


document.getElementById('setDeadline').addEventListener('click', function() {
    const deadlineValue = document.getElementById('deadline').value;

    if (!deadlineValue) {
        return alert('Please enter a valid deadline.');
    }

    fetch('/set-deadline', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ deadline: deadlineValue })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to set the deadline.');
    });
});
document.getElementById('clearDatabase').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the database? This action is irreversible and you can\'t fetch the data later.')) {
        fetch('/admin/clear-database', { method: 'POST' })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => {
                        throw new Error(err.message || 'Error clearing the database.');
                    });
                }
                return response.json();
            })
            .then(data => {
                alert(data.message);
                fetchResponses();  // Refresh the displayed responses after clearing the database.
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred: ' + error.message + '. Please try again.');
            });
    }
});





function fetchDeadline() {
    fetch("/get-deadline")
        .then(res => res.json())
        .then(data => {
            const deadlineInput = document.getElementById('deadline');
            deadlineInput.value = new Date(data.deadline).toISOString().split(".")[0];
        });
}


// ... (other code)

    // Fetch the responses and deadline as soon as the page loads
    fetchResponses();
    fetchDeadline();

document.getElementById('refreshResponses').addEventListener('click', fetchResponses);
function fetchResponses() {
    fetch('/get-responses')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayResponses(data.responses);
            let count = data.responses.length; // Get the count from the length of the responses array.
            document.getElementById('responseCount').innerHTML = `Total Responses: ${count}`;
        
       
    })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to fetch the responses.');
        });
}



function displayResponses(responses) {
    const responseDiv = document.getElementById('responses');
    responseDiv.innerHTML = ''; // Clear previous responses

    if (responses && responses.length) {
        responses.forEach(response => {
            console.log("Processing response:", response);
            let secondPersonDetails = "";

            if(response.teamSize === 2) {
                secondPersonDetails = `
                <strong>Name of the second person:</strong> ${response.name2}<br>
                <strong>Phone of the second person:</strong> ${response.phone2}<br>
                <strong>nationality of the second person:</strong> ${response.nationality2}<br>
                <strong>university of the second person:</strong> ${response.university2}<br>
                <strong>Year of the second person:</strong> ${response.Year2}<br>
                `;
            }

            const div = document.createElement('div');
            div.style.backgroundColor = 'gray'; // Set background color to gray
            div.style.padding = '10px';
            div.style.margin = '10px 0';
            div.style.fontSize= '20px '
            div.innerHTML = `

                <strong>Name:</strong> ${response.name}<br>
                <strong>Email:</strong> ${response.email}<br>
                <strong>Phone:</strong> ${response.phone}<br>
                <strong>nationality:</strong> ${response.nationality}<br>
                <strong>university:</strong> ${response.university}<br>
                <strong>Year:</strong> ${response.Year}<br>
                <strong>teamSize:</strong> ${response.teamSize}<br>
                ${secondPersonDetails}
                <strong>ResearchSpecialty:</strong> ${response.ResearchSpecialty}<br>
                <strong>doctorName:</strong> ${response.doctorName}<br>
                <strong>Title:</strong> ${response.title}<br>
                <strong>Abstract:</strong> ${response.abstract}<br>
                <hr>
                `;
            responseDiv.appendChild(div);
        });
    } else {
        responseDiv.innerHTML = '<p>No responses available.</p>'; // Display a message when no responses are available.
    }

}

console.log("Checking if element is present:", document.getElementById('responseCount'));


// ... (other code)
//{PDF}

console.log("Script loaded");

function downloadAllResponsesPDF() {
    console.log("Attempting to download all responses");
    window.location.href = '/download-all-responses-pdf';
}

document.getElementById('downloadAllResponsesBtn').addEventListener('click', downloadAllResponsesPDF);

// Attach the function to the button's click event


});