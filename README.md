# DTL - Cargo Management System

A Telegram Web App for managing cargo requests, drivers, logisticians, and analytics in logistics companies.

## Features

- **Authentication:** Login and registration system with role-based access
- **Role Management:** Owner, Admin, Logistician, and Driver roles with different permissions
- **Cargo Management:** Create and track cargo requests with drivers and logisticians
- **Analytics:** Visualize financial and cargo performance analytics
- **Team Management:** Invite and approve team members

## Tech Stack

### Frontend
- React with TypeScript
- Material UI for components
- React Router for navigation
- Chart.js for analytics visualizations
- Axios for API requests
- Telegram Web App integration

### Backend
- Django
- Django REST Framework
- PostgreSQL database
- JWT authentication
- Role-based permissions

## Setup Instructions

### Prerequisites
- Node.js 14+ and npm
- Python 3.8+
- PostgreSQL database

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Create a PostgreSQL database named `cargo_db`.

5. Run migrations:
   ```
   python run_migrations.py
   ```

6. Start the server:
   ```
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## Usage

### Roles and Permissions
- **Owner:** Create organization, manage team members, view analytics, view all cargo requests
- **Logistician:** Create cargo requests, assign drivers, track progress
- **Driver:** View assigned cargo requests, update cargo status
- **Admin:** System administration

### Workflow
1. Owner registers and creates an organization
2. Owner invites team members (logisticians and drivers)
3. Logisticians create cargo requests and assign drivers
4. Drivers update cargo status as they progress
5. Owner and logisticians track performance through analytics

## Telegram Integration

To use this app as a Telegram Mini App:

1. Create a new bot with BotFather in Telegram
2. Set up the Web App URL to point to your deployed application
3. Configure the app to use Telegram WebApp.js features

## API Endpoints

- **/api/register/** - User registration
- **/api/token/** - JWT token acquisition
- **/api/token/refresh/** - Refresh JWT token
- **/api/users/** - User management
- **/api/organizations/** - Organization management
- **/api/cargo-requests/** - Cargo request management
- **/api/analytics/** - Analytics data

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any questions or issues, please open an issue on the GitHub repository. 