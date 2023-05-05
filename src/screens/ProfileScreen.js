// src/screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import db, { auth } from '../firebase';
import theme from '../theme';


const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleSignUp = () => {
  console.log("Attempting to sign up");
  createUserWithEmailAndPassword(auth, email, password)
    .then(({ user }) => {
      console.log("User created:", user);

      // Create a new document in the 'userProfiles' collection with the user's uid as the document ID
      return setDoc(doc(db, "userProfiles", user.uid), {
        email: user.email,
        ratedSongs: [],
        recommendations: [],
      });
    })
    .then(() => {
      console.log("User profile document created");
    })
    .catch((error) => {
      console.log(error);

      // Check if the error is due to an existing email
      if (error.code === "auth/email-already-in-use") {
        alert("There is already an account for this email.");
      }
      // Check if the error is due to an invalid email
      else if (error.code === "auth/invalid-email") {
        alert("The email address is not valid.");
      }
      else {
        alert("Error signing up. Please try again.");
      }
    });
};

  const handleLogin = () => {
  console.log("Attempting to log in");
  signInWithEmailAndPassword(auth, email, password)
    .then((result) => {
      console.log("Login result:", result);
    })
    .catch((error) => {
      console.log(error);

      // Check if the error is due to a wrong password
      if (error.code === "auth/wrong-password") {
        alert("The password is incorrect. Please try again.");
      }
      // Check if the error is due to a user not found
      else if (error.code === "auth/user-not-found") {
        alert("There is no user with this email. Please check your email or create an account.");
      }
      // Check if the error is due to an invalid email
      else if (error.code === "auth/invalid-email") {
        alert("The email address is not valid.");
      }
      else {
        alert("Error logging in. Please try again.");
      }
    });
};



  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.log(error);
    }
  };

    if (user) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Welcome, {user.email}!</Text>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>
      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCompleteType="email"
      />
      <Text style={styles.label}>Password:</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoCompleteType="password"
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Create an account</Text>
      </TouchableOpacity>
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: theme.typography.h2.fontWeight,
    color: theme.colors.primary,
    marginBottom: theme.typography.h2.marginBottom,
  },
  label: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: theme.typography.body.fontWeight,
    color: theme.colors.primary,
    alignSelf: 'flex-start',
    marginBottom: theme.typography.body.marginBottom,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.borders.soft.borderRadius,
    paddingHorizontal: 10,
    marginBottom: theme.typography.body.marginBottom,
    backgroundColor: theme.colors.white,
    color: theme.colors.text,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borders.soft.borderRadius,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: theme.typography.body.marginBottom,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: theme.typography.body.fontSize,
  },
});


export default ProfileScreen;
