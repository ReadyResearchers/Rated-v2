# Rated-v2
Rated: A React Native mobile application that fetches and recommends songs based on users' preferences and ratings.

This project uses the following technologies:

- React Native
- Firebase Firestore for the backend
- Firebase Authentication for user login and registration

## Dependencies

To run this project, you will need:

- Node.js and npm installed on your machine
- Expo CLI (`npm install -g expo-cli`)
- Xcode or Android Studio installed if you want to run the app on an emulator

## Setup and Installation

1. Clone this repository:

2. Navigate to the project directory:
3. Install the dependencies:
```
npm install
```
4. Start the development server:
```
npx expo start
```

## Firebase Configuration

This project uses Firebase for the backend. You will need to setup your own Firebase project and replace the configuration in the firebase.js file with your own.

```
const firebaseConfig = {
  apiKey: "<API_KEY>",
  authDomain: "<AUTH_DOMAIN>",
  projectId: "<PROJECT_ID>",
  storageBucket: "<STORAGE_BUCKET>",
  messagingSenderId: "<MESSAGING_SENDER_ID>",
  appId: "<APP_ID>",
  measurementId: "<MEASUREMENT_ID>"
};

```

Or, use the current firebase database included.