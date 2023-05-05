import { Constants } from 'expo-constants';
import { config } from 'dotenv';

config();

const ENV = {
  dev: {
    FIREBASE_API_KEY: process.env.REACT_NATIVE_FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.REACT_NATIVE_FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.REACT_NATIVE_FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.REACT_NATIVE_FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.REACT_NATIVE_FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.REACT_NATIVE_FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID: process.env.REACT_NATIVE_FIREBASE_MEASUREMENT_ID,
  },
  prod: {
    // same as dev for now
  },
};

const getEnvVars = (env = Constants.manifest.releaseChannel) => {
  // what is __DEV__ ?
  // true when react-native is running locally in dev mode
  // false when built with 'expo build'
  if (__DEV__) {
    return ENV.dev;
  } else if (env === 'staging') {
    return ENV.staging;
  } else if (env === 'prod') {
    return ENV.prod;
  }
};

export default getEnvVars;
