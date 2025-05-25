# ZIA School Management System

A modern school management system built with React and Firebase.

## 🔥 Firebase Setup

To connect this application to Firebase, follow these steps:

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `zia-school-management`
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Firestore Database

1. In the Firebase console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select a location closest to your users
5. Click "Done"

### 3. Get Firebase Configuration

1. In the Firebase console, click the gear icon ⚙️
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click "Web app" icon (`</>`)
5. Register your app with name: `zia-school-web`
6. Copy the Firebase configuration object

### 4. Update Firebase Configuration

Replace the configuration in `src/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id"
};
```

### 5. Set Firestore Rules (Optional for Development)

In Firestore console, go to "Rules" tab and use these rules for development:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **Important**: Change these rules for production to secure your data!

## 🚀 Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

4. Use the "Initialize Sample Data" button in the dev tools (bottom-right corner) to create test users

## 🔐 Test Credentials

After initializing sample data, you can use these credentials to test login:

### Admin Login:
- **Email**: `admin@ziaschool.com`
- **Password**: `admin123`

### Teacher Login:
- **Email**: `emily.teacher@ziaschool.com`
- **Password**: `teacher123`

## 📊 Database Collections

The app creates these Firestore collections:

### `admins`
- `name` (string): Admin's full name
- `email` (string): Admin's email address
- `password` (string): Admin's password (⚠️ should be hashed in production)
- `phone` (string, optional): Admin's phone number
- `role` (string): Always "admin"
- `isActive` (boolean): Account status
- `createdAt` (timestamp): Account creation date
- `updatedAt` (timestamp): Last update date

### `teachers`
- `name` (string): Teacher's full name
- `email` (string): Teacher's email address
- `password` (string): Teacher's password (⚠️ should be hashed in production)
- `phone` (string, optional): Teacher's phone number
- `subject` (string, optional): Subject taught
- `qualification` (string, optional): Teacher's qualification
- `role` (string): Always "teacher"
- `isActive` (boolean): Account status
- `createdAt` (timestamp): Account creation date
- `updatedAt` (timestamp): Last update date

## 🔧 Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App (⚠️ irreversible)

## 🏗️ Project Structure

```
src/
├── components/          # Reusable components
│   └── DevTools.js     # Development utilities
├── models/             # Data models and services
│   ├── Admin.js        # Admin model and service
│   └── Teacher.js      # Teacher model and service
├── utils/              # Utility functions
│   └── sampleData.js   # Sample data for testing
├── firebase.js         # Firebase configuration
└── App.js             # Main application component
```

## 🛡️ Security Notes

⚠️ **Important Security Considerations for Production:**

1. **Password Hashing**: Currently passwords are stored in plain text. Use bcrypt or similar for hashing.
2. **Firestore Rules**: Update Firestore security rules for production.
3. **Authentication**: Consider using Firebase Authentication instead of custom auth.
4. **Environment Variables**: Store Firebase config in environment variables.
5. **Input Validation**: Add server-side validation for all inputs.

## 📱 Features

- ✅ Responsive design with Material-UI
- ✅ Admin and Teacher login system
- ✅ Firebase Firestore integration
- ✅ Form validation
- ✅ Error handling
- ✅ Development tools for testing
- ✅ Clean, modern UI

## 🎯 Next Steps

- [ ] Add password hashing
- [ ] Implement proper authentication with Firebase Auth
- [ ] Create admin/teacher dashboards
- [ ] Add student management features
- [ ] Implement role-based access control
- [ ] Add more comprehensive error handling
- [ ] Create responsive navigation

## 📄 License

This project is licensed under the MIT License.
