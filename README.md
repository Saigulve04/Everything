# Everything.India Integrated Platform

A full-stack e-commerce platform with separate interfaces for buyers and sellers.

## Project Structure

```
Everything-integrated/
├── backend/                    # Main backend server
│   ├── controllers/           # All controllers
│   ├── middleware/            # Middleware functions
│   ├── models/               # Database models
│   ├── routes/               # API routes
│   ├── utils/                # Utility functions
│   ├── config/               # Configuration files
│   ├── uploads/              # File uploads directory
│   ├── index.js              # Main server file
│   └── package.json          # Backend dependencies
├── frontend/                  # React frontend
│   ├── public/               # Static files
│   ├── src/                  # Source code
│   └── package.json          # Frontend dependencies
├── database/                  # Database related files
│   ├── setup.sql             # Database setup
│   └── migrations/           # Database migrations
├── .env                      # Environment variables
├── package.json              # Root package.json
└── README.md                 # Project documentation
```

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/Saigulve04/Everything.git
cd Everything
```

2. Install dependencies:
```bash
npm install
cd frontend && npm install
```

3. Set up the database:
```bash
npm run setup-db
```

4. Start the development servers:
```bash
# Start backend
npm run dev

# In a new terminal, start frontend
npm run client

# Or start both together
npm run dev:all
```

## Features

- User Authentication (Buyer/Seller)
- Product Management
- Order Processing
- File Uploads
- Real-time Updates
- Responsive Design

## Technologies Used

- Frontend: React, Chakra UI, Redux
- Backend: Node.js, Express
- Database: MySQL
- Authentication: JWT
- File Upload: Multer

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.