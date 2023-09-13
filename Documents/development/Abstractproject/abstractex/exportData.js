const fs = require('fs');
const mongoose = require('mongoose');

// Replace 'mongodb://localhost:27017/abstractex' with your MongoDB connection URL
const mongoDBUrl = 'mongodb://localhost:27017/abstractex';

mongoose.connect(mongoDBUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');

  // Replace 'FormData' with the name of your collection
  const FormDataModel = mongoose.model('FormData');

  FormDataModel.find({}, (err, data) => {
    if (err) {
      console.error('Error retrieving data:', err);
      mongoose.connection.close();
      return;
    }

    const outputFile = 'output.txt';
    const fileContent = data.map(doc => JSON.stringify(doc, null, 2)).join('\n\n');

    fs.writeFile(outputFile, fileContent, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
      } else {
        console.log(`Data exported to ${outputFile}`);
      }

      mongoose.connection.close();
    });
  });
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
});
