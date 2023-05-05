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
import { differenceBy } from 'lodash';



const HomeScreen = () => {
  const { theme } = useTheme();
  const { colors, BorderRadius, borderWidth, borderColor } = theme;
  const [songs, setSongs] = useState([]);
  const navigation = useNavigation();
  const [ratedSongIds, setRatedSongIds] = useState([]);
  const [hasRatedSongs, setHasRatedSongs] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  const navigateToProfile = () => {
    navigation.navigate('Profile');
  };

  const fetchRandomSongs = async () => {
  try {
    const songQuery = query(collection(db, 'songs'));
    const songSnapshot = await getDocs(songQuery);
    const allSongsData = songSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    // Filter out songs with missing data
    const filteredSongsData = allSongsData.filter((song) => song.songTitle && song.albumName && song.genre);

    // Check if filteredSongsData is not empty
    if (!filteredSongsData || filteredSongsData.length === 0) {
      console.error('No songs found in the database.');
      return;
    }

    // Check if allSongsData is not empty
    if (!allSongsData || allSongsData.length === 0) {
      console.error('No songs found in the database.');
      return;
    }

    // Fetch user rated songs
    const userSongsQuery = query(collection(db, 'userSongs'), where('userId', '==', auth.currentUser.uid));
    const userSongsSnapshot = await getDocs(userSongsQuery);
    const ratedSongIds = userSongsSnapshot.docs.map((doc) => doc.data().songId);

    // Filter out rated songs
    const unratedSongsData = allSongsData.filter((song) => !ratedSongIds.includes(song.id));

    // Get 5 random songs
    const randomSongs = [];
    for (let i = 0; i < 5 && unratedSongsData.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * unratedSongsData.length);
      randomSongs.push(unratedSongsData[randomIndex]);
      unratedSongsData.splice(randomIndex, 1);
    }

    // Update the state with the random songs
    setSongs((prevState) => [...prevState, ...randomSongs]);
  } catch (error) {
    console.error('Error fetching random songs:', error);
  }
};




  const fetchRecommendations = async () => {
  try {
    // Fetch all userSongs data
    const allUserSongsSnapshot = await getDocs(collection(db, 'userSongs'));
    const allUserSongsData = allUserSongsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    // Group songs by userId
    const groupedUserSongs = allUserSongsData.reduce((grouped, song) => {
      if (!grouped[song.userId]) {
        grouped[song.userId] = [];
      }
      grouped[song.userId].push(song);
      return grouped;
    }, {});

    // Filter out the current user's data
    const currentUserSongsData = groupedUserSongs[auth.currentUser.uid];
    const otherUserSongsData = Object.values(groupedUserSongs).filter(
      (userSongs) => userSongs[0].userId !== auth.currentUser.uid
    );

    if (!currentUserSongsData) {
      console.error("Current user's song data not found.");
      return;
    }

    console.log('auth.currentUser.uid:', auth.currentUser.uid);
    console.log('currentUserSongsData:', currentUserSongsData);

    // Function to calculate the similarity score between two users
    const calculateSimilarity = (user1Songs, user2Songs) => {
      const commonSongs = user1Songs.filter((song) => user2Songs.some((s) => s.songId === song.songId));
      const similarSongs = commonSongs.filter((song) => song.rating >= 4 && user2Songs.some((s) => s.songId === song.songId && s.rating >= 4));
      return (similarSongs.length / commonSongs.length) * 100;
    };

    // Calculate similarity scores and find recommendations
    const recommendedSongs = [];
    const similarityThreshold = 80;

    otherUserSongsData.forEach((otherUser) => {
      const similarityScore = calculateSimilarity(currentUserSongsData, otherUser);

      if (similarityScore >= similarityThreshold) {
        const uniqueHighlyRatedSongs = otherUser.filter((song) => song.rating >= 4 && !currentUserSongsData.some((s) => s.songId === song.songId));
        recommendedSongs.push(...uniqueHighlyRatedSongs);
      }
    });

    // Update the state with the recommended songs
    // setSongs((prevState) => [...prevState, ...recommendedSongs]);
    if (recommendedSongs.length === 0) {
  fetchRandomSongs(); // fetch 5 random songs
  setHasRatedSongs(false);
} else {
  setSongs(recommendedSongs);
  setHasRatedSongs(true);
}


  } catch (error) {
    console.error('Error fetching recommendations:', error);
  }
};


  useEffect(() => {
  if (isAuthenticated && auth.currentUser) {

    fetchRecommendations();

    const userSongsRef = collection(db, 'userSongs');
    const userSongsQuery = query(userSongsRef, where('userId', '==', auth.currentUser.uid));

    const unsubscribe = onSnapshot(userSongsQuery, (snapshot) => {
      console.log('Library changed. Fetching songs again...');
      fetchRecommendations();
    });

    // Clean up the listener when the component is unmounted
    return () => {
      unsubscribe();
    };
  } else {
    setSongs([]);
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
  const renderNoRecommendations = () => (
  <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
    {!hasRatedSongs && (
      <Text style={[styles.noRecommendationsText, { color: colors.text }]}>
        No recommendations available.
      </Text>
    )}
    <Text style={[styles.getStartedText, { color: colors.primary, textAlign: 'center', marginBottom: 20 }]}>
      Start rating songs!
    </Text>
  </View>
);



  const renderItem = ({ item }) => {
  const handleRating = (rating) => {
    if (auth.currentUser) {
      rateSong(auth.currentUser.uid, item.id, rating);
      removeRatedSong(item.id);
    } else {
      console.error("No user is logged in.");
    }
  };

  const removeRatedSong = (songId) => {
    setSongs(songs.filter(song => song.id !== songId));
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
          startingValue={0}
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
          Welcome,
        </Text>
        <Text style={[styles.getStartedText, { color: colors.primary }]}>
          Let's start rating!
        </Text>
      </View>
      <FlatList
          data={songs}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          ListEmptyComponent={renderNoRecommendations}
        />
      </View>
    );
  } else {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[styles.getStartedText, { color: colors.primary, textAlign: 'center', marginBottom: 20 }]}>
          Log in to continue
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
  noRecommendationsText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
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

export default HomeScreen;
