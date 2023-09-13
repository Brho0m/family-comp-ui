const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const app = express();





let currentDeadline = new Date('2023-08-20T23:59:00Z'); // This is just the initial value.
const admins = {
    mo_hr: bcrypt.hashSync('1023aa', 10) // Hashed password
};
app.use(session({
    secret: 'aRandomSecretKey',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3600000  // sets the session to expire after 1 hour of inactivity
    }
}));

app.use(cors({origin: '*'}));
app.use(express.urlencoded({ extended: true })); // Replacing body-parser's urlencoded with built-in
app.use(express.json()); // This line lets you accept JSON payloads
app.use(express.static(__dirname + '/public'));


// MongoDB setup
const mongoDBUrl = 'mongodb+srv://abdullaziz9a:Chess1122@cluster0.ifnuc5e.mongodb.net/';
mongoose.connect(mongoDBUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 3000,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
});
app.get('/formData/:id', (req, res) => {
    const id = req.params.id;

    if (!id || !ObjectId.isValid(id)) {
        return res.status(400).send('Invalid ID provided.');
    }
    

    FormData.findById(id, (err, formData) => {
        if (err) {
            return res.status(500).send(err.message);
        }

        if (!formData) {
            return res.status(404).send('FormData not found.');
        }

        res.json(formData);
    });
});
module.exports = app;

const formDataSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    nationality: { type: String, required: true },
    university: { type: String, required: true },
    Year: {type: String, required: false},
    teamSize: { type: Number, required: true },
    name2: {
        type: String,
        required: function() {
            return this.teamSize > 1;
        }
    },
    phone2: {
        type: String,
        required: function() {
            return this.teamSize > 1;
        }
    },
    nationality2: {
        type: String,
        required: function() {
            return this.teamSize > 1;
        }
    },
    university2: {
        type: String,
        required: function() {
            return this.teamSize > 1;
        }
    },
    Year2: {
        type: String,
        required: function() {
            return this.teamSize > 1;
        }
    },
   

    doctorName: { type: String, required: true },
    ResearchSpecialty: { type: String, required: true },
    title: { type: String, required: true },
    abstract: { type: String, required: true },
    editable: { type: Boolean, default: true },
});

formDataSchema.pre('save', function(next) {
    if (this.teamSize === 1) {
        this.name2 = null;
        this.phone2 = null;
        this.nationality2 = null;
        this.university2 = null;
        this.Year2 = null;
    }
    next();
});



//ADMINS SETTING

app.get('/admin', (req, res) => {
    if (req.session) {
        req.session.destroy(function(err) {
            if (err) {
                console.log("Error:", err);
            }
            res.sendFile(__dirname + '/public/admin_login.html');
        });
    } else {
        res.sendFile(__dirname + '/public/admin_login.html');
    }
});

app.post('/admin_login', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = admins[username];
    
    if (!hashedPassword || !bcrypt.compareSync(password, hashedPassword)) {
        return res.status(401).json({
            success: false,
            error: "Wrong username/password"
        });
    }

    req.session.isAdmin = true;  // Setting the session
    return res.json({
        success: true,
        redirect: '/admin_dashboard'
    });
});


app.get('/admin_dashboard', (req, res) => {
    if (!req.session.isAdmin) {
        return res.redirect('/admin');
    }
    res.sendFile(__dirname + '/public/admin_dashboard.html');
});

app.post('/set-deadline', (req, res) => {
    const { deadline } = req.body;

    if(!deadline) {
        return res.status(400).json({ message: 'Please provide a valid deadline.' });
    }

    const newDeadline = new Date(deadline);
    if (isNaN(newDeadline)) {
        return res.status(400).json({ message: 'Invalid date format provided.' });
    }

    currentDeadline = newDeadline;
    res.json({ message: 'Deadline successfully set.' });
});

app.get('/get-deadline', (req, res) => {
    res.json({ deadline: currentDeadline });
});


app.post('/admin/clear-database', async (req, res) => {
    if (!req.session.isAdmin) {
        return res.status(403).send('You do not have the necessary permissions.');
    }
    
    try {
        await FormDataModel.deleteMany({}); // This clears all documents from the collection
        res.json({ message: 'Database successfully cleared.' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error clearing the database.');
    }
});
app.get('/get-responses', (req, res) => {
    // Fetch data from MongoDB
    FormDataModel.find({})
        .then(responses => {
            res.json({ responses });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'An error occurred while fetching responses' });
        });
});

//PDF


// Endpoint to download all responses
app.get('/download-all-responses-pdf', async (req, res) => {
    if (!req.session.isAdmin) {
        return res.status(403).send('You do not have the necessary permissions.');
    }

    try {
        const responses = await FormDataModel.find({});
        generatePDF(responses).then(pdfBuffer => {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=all-responses.pdf');
            res.send(pdfBuffer);
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error generating PDF.');
    }
});

// Endpoint to download selected responses


const PDFDocument = require('pdfkit'); 
// Function to generate the PDF
function generatePDF(responses) {
    return new Promise((resolve, reject) => {
        let doc = new PDFDocument();
        let pdfBuffers = [];

        doc.on('data', pdfBuffers.push.bind(pdfBuffers));
        doc.on('end', () => {
            resolve(Buffer.concat(pdfBuffers));
        });

        for (let response of responses) {
            doc.text(`Name: ${response.name}`);
            doc.text(`Email: ${response.email}`);
            doc.text(`Phone: ${response.phone}`);
            doc.text(`Nationality: ${response.nationality}`);
            doc.text(`University: ${response.university}`);
            doc.text(`Year: ${response.Year}`);
            
            if (response.teamSize === 2) {
                doc.text(`Name of the second person: ${response.name2}`);
                doc.text(`Phone of the second person: ${response.phone2}`);
                doc.text(`Nationality of the second person: ${response.nationality2}`);
                doc.text(`University of the second person: ${response.university2}`);
                doc.text(`Year of the second person: ${response.Year2}`);
            }
            
            doc.text(`Research Specialty: ${response.ResearchSpecialty}`);
            doc.text(`Doctor Name: ${response.doctorName}`);
            doc.text(`Title: ${response.title}`);
            doc.text(`Abstract: ${response.abstract}`);
            
            doc.addPage();  // Add a new page for the next response
        }

        doc.end();
    });
}

//mondo with database





// Logout
app.get('/admin/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});


const FormDataModel = mongoose.model('FormData', formDataSchema);


// Main form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// As soon as the script runs, fetch the deadline

// Submit the form// Submit the form
app.post('/submit', async (req, res) => {
    console.log("Received request:", req.body);  // <-- Add this line
    const { name, email, phone, nationality, university, Year, doctorName, ResearchSpecialty, title, abstract, teamSize, name2, phone2, nationality2, university2, Year2 } = req.body;

    if (!name || !email || !phone || !nationality || !university || !doctorName || !ResearchSpecialty ||  !title || !abstract) {
        return res.status(400).send('One or more fields are missing. Received: ' + JSON.stringify(req.body));
    }
    
    
    const isPastDeadline = new Date() > currentDeadline;

   
    
    
    // Validate the word count for the abstract
    const wordCount = abstract.trim().split(/\s+/).length;
    if (wordCount > 200) {
        return res.status(400).send('The abstract must be less than 200 words.');
    }

    

    if (isPastDeadline) {
        return res.status(403).send('Deadline has passed.');
    }

    const formData = new FormDataModel({
        name,
        email,
        phone,
        nationality,
        university,
        Year,
        teamSize, name2, phone2, nationality2, university2, Year2,
        doctorName,
        ResearchSpecialty,
        title,
        abstract,
        editable: !isPastDeadline,
    });

    try {
        const savedData = await formData.save();
        res.redirect(`/thank_you?id=${savedData._id}`);
    } catch (err) {
        console.error("Error processing request:", err.message);
        res.status(500).send('Internal server error.');
    }
});


// View and edit the submission
app.get('/thank_you', async (req, res) => {
    const id = req.query.id;
    try {
        const formData = await FormDataModel.findById(id);
        if (!formData) {
            return res.status(404).send('Form data not found.');
        }
        res.sendFile(__dirname + '/public/resandedit.html');
    } catch (err) {
        console.error("Error processing request:", err.message);
        res.status(500).send('Internal server error.');
    }
});

// Fetch specific submission data for populating frontend
app.get('/edit/:id', async (req, res) => {
    try {
        const formData = await FormDataModel.findById(req.params.id);
        if (!formData) {
            return res.status(404).send('Form data not found.');
        }
        res.json(formData);
    } catch (err) {
        console.error("Error processing request:", err.message);
        res.status(500).send('Internal server error.');
    }
});

// Update a submission
app.put('/submit_edit/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const formData = await FormDataModel.findById(id);
        if (!formData) {
            return res.status(404).send('Form data not found.');
        }
        if (!formData.editable) {
            return res.status(400).send('The response is no longer editable due to past deadline or other issues.');
        }
        const updatedData = await FormDataModel.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedData);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error: ' + err.message);
    }
});

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).send('Something went wrong!');
});


// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

