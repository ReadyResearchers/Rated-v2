// HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Rating } from 'react-native-ratings';
import { getDocs, collection, query, orderBy, where, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useTheme } from 'react-native-elements';
import db from '../firebase';
import { useNavigation } from '@react-navigation/native';
import { rateSong } from '../helpers.js';

const LibraryScreen = () => {
  const { theme } = useTheme();
  const { colors, BorderRadius, borderWidth, borderColor } = theme;
  const [songs, setSongs] = useState([]);
  const navigation = useNavigation();

  const navigateToProfile = () => {
    navigation.navigate('Profile');
  };

  const [isAuthenticated, setIsAuthenticated] = useState(auth.currentUser !== null);


  useEffect(() => {
    if (isAuthenticated && auth.currentUser) {
      const fetchSongs = async () => {
        try {
          const userSongsQuery = query(collection(db, 'userSongs'), where('userId', '==', auth.currentUser.uid));
          const userSongsSnapshot = await getDocs(userSongsQuery);
          const userSongsData = userSongsSnapshot.docs.map((doc) => ({...doc.data(), id: doc.id}));

          const songPromises = userSongsData.map(async (userSong) => {
            const songRef = doc(db, 'songs', userSong.songId);
            const songDoc = await getDoc(songRef);
            return {...songDoc.data(), id: songDoc.id, userRating: userSong.rating};
          });

          const songsData = await Promise.all(songPromises);
          console.log("Fetched songs:", songsData);
          setSongs(songsData);
        } catch (error) {
          console.error('Error fetching songs:', error);
        }
      };


      const userSongsRef = collection(db, 'userSongs');
      const userSongsQuery = query(userSongsRef, where('userId', '==', auth.currentUser.uid));

      const unsubscribe = onSnapshot(userSongsQuery, (snapshot) => {
        console.log('Library changed. Fetching songs again...');
        fetchSongs();
      });

      // Clean up the listener when the component is unmounted
      return () => {
        unsubscribe();
      };
    } else {
      setSongs([])
    }
}, [isAuthenticated]); // end of use effect

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  });

  // Clean up the listener when the component is unmounted
  return () => {
    unsubscribe();
  };
}, []);



  const renderItem = ({ item }) => {
  const handleRating = (rating) => {
    if (auth.currentUser) {
      rateSong(auth.currentUser.uid, item.id, rating);
    } else {
      console.error("No user is logged in.");
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.songContainer,
        {
          backgroundColor: colors.background,
          borderRadius: BorderRadius.global,
          borderWidth: borderWidth.global,
          borderColor: borderColor.global,
        },
      ]}
      onPress={() => console.log('song clicked')}
    >
      <Text style={[styles.songTitle, { color: colors.primary }]}>{item.songTitle}</Text>
      <Text style={[styles.songDetails, { color: colors.text }]}>{item.albumName}</Text>
      <Text style={[styles.songDetails, { color: colors.text }]}>{item.genre}</Text>
      <View style={styles.ratingContainer}>
        <Rating
          type="star"
          imageSize={30}
          onFinishRating={handleRating}
          startingValue={item.userRating}
        />
      </View>
    </TouchableOpacity>
  );
};

  if (isAuthenticated) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.headerContainer}>
        <Text style={[styles.welcomeText, { color: colors.primary }]}>
          Your Library
        </Text>
        <Text style={[styles.getStartedText, { color: colors.primary }]}>
          View or modify your previous ratings
        </Text>
      </View>
      <FlatList
        data={songs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      </View>
    );
  } else {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[styles.getStartedText, { color: colors.primary, textAlign: 'center', marginBottom: 20 }]}>
          Log in to view your library
        </Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={navigateToProfile}>
          <Text style={[styles.buttonText, { color: colors.white }]}>Log in</Text>
        </TouchableOpacity>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
   headerContainer: {
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  welcomeText: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  getStartedText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  songContainer: {
    padding: 15,
    marginBottom: 10,
  },
  songTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  songDetails: {
    fontSize: 14,
    marginBottom: 5,
  },
  ratingContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
  },
});

export default LibraryScreen;
