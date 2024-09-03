# Hospital Management System

This Hospital Management System is a web-based application developed using Node.js, Express, and EJS for server-side rendering. It utilizes OAuth for secure authentication, Google Sheets as a database, and Google Drive for storing medical records. The system allows users to book appointments, view medical records, and manage patient information efficiently.

## Features

- **User Authentication**: Secure user authentication using OAuth.
- **Appointment Booking**: Patients can book appointments online with doctors.
- **Patient Management**: Manage patient information, including personal details, medical history, and appointment records.
- **Medical Records**: Store and retrieve medical records securely on Google Drive.
- **View Medical Records**: Patients can view their medical records and doctors can update them.
- **Google Sheets Integration**: Utilizes Google Sheets as a database to store patient and appointment data.
- **Google Drive Integration**: Medical records and other related documents are securely stored on Google Drive.

## Technology Stack

- **Node.js**: JavaScript runtime used to build the backend.
- **Express**: Web application framework for Node.js.
- **EJS**: Templating engine for generating HTML with embedded JavaScript.
- **OAuth**: Used for secure user authentication.
- **Google Sheets API**: Used as the database for storing patient and appointment data.
- **Google Drive API**: Used for storing and managing medical records.

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/OldStager01/Sattv-HMS.git
   cd Sattv-HMS
   
2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the contents from `.env.sample` file.


4. **Start the server:**

   ```bash
   npm start
   ```
   
## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
