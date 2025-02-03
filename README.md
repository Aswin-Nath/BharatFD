Backend Repo:https://github.com/Aswin-Nath/backend

Frontend Repo:https://github.com/Aswin-Nath/BharatFD

Hosted the FAQ app : https://bharat-fd-kappa.vercel.app/

Hosted the Backend Server : https://backend-6jqv.onrender.com/queries


## Unique Features

- Dynamic Language Translation Using Azure  
  Supports multiple languages dynamically for better accessibility.

- Easier and Simple Design for Admin  
  User-friendly interface for admins to manage FAQs and queries effortlessly.

- Pagination for Efficient Content Loading  
  Ensures fast loading and smooth navigation, even with large datasets.

- Search Option for Queries in FAQs  
  Allows users to quickly find relevant information within the FAQs.
  

**APIS**

**Query Management APIs**

| Method  | Endpoint         | Description                          | Request Body Example |
|---------|-----------------|--------------------------------------|----------------------|
| **POST** | `/add-query` | Submit a user query | `{ "question": "What is Node.js?" }` |
| **GET**  | `/queries` | Retrieve all submitted queries | _No body required_ |
| **POST** | `/respond-query` | Respond to a query | `{ "id": 1, "answer": "Node.js is a runtime environment." }` |

**FAQ Management APIs**

| Method  | Endpoint         | Description                          | Request Body Example |
|---------|-----------------|--------------------------------------|----------------------|
| **POST** | `/add-to-faq` | Add a query to FAQs | `{ "question": "What is Node.js?", "answer": "A JavaScript runtime." }` |
| **GET**  | `/faqs` | Retrieve all FAQs | _No body required_ |
| **DELETE** | `/delete-faq/:id` | Delete an FAQ by ID | _No body required_ |


# Process of Cloning the frontend


# Clone the frontend repository
git clone https://github.com/Aswin-Nath/BharatFD

cd BharatFD

# Install dependencies
npm install

# Start the frontend
npm start

# Frontend will be running in
http://localhost:3000/


process of cloning the Backend
# Clone the backend repository
git clone https://github.com/Aswin-Nath/backend

cd backend

# Install dependencies
npm install

# Start the backend
node server.js

# Backend will  be running on 
http://localhost:5000
