import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import db, { auth } from '../firebase';
import theme from '../theme';
import { customAlphabet } from 'nanoid/non-secure';




const DevScreen = () => {
  const [songTitle, setSongTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [genre, setGenre] = useState('');
  const [albumName, setAlbumName] = useState('');
  const [albumCoverUrl, setAlbumCoverUrl] = useState('');

  const randomId = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10);


  const addSong = () => {
    const songData = {
      songTitle,
      duration,
      genre,
      albumName,
      albumCoverUrl,
      createdBy: auth.currentUser.uid,
    };

    addDoc(collection(db, 'songs'), songData)
      .then((docRef) => {
        console.log('Song added:', docRef);
        setSongTitle('');
        setDuration('');
        setGenre('');
        setAlbumName('');
        setAlbumCoverUrl('');
      })
      .catch((error) => {
        console.error('Error adding song:', error);
      });
  };

  const populateSongs = async () => {
  const songWords = ['Love', 'Life', 'Dream', 'Heart', 'Night', 'Day', 'Light', 'Dark', 'Time', 'Star'];
  const albumWords = ['Journey', 'Destiny', 'Eclipse', 'Memories', 'Rhythm', 'Symphony', 'Harmony', 'Paradise', 'Voyage', 'Odyssey'];
  const howMany = 10;
  const getRandomWord = (words) => words[Math.floor(Math.random() * words.length)];

  for (let i = 0; i < howMany; i++) {
    const randomSongTitle = `${getRandomWord(songWords)} ${getRandomWord(songWords)} ${randomId()}`;
    const randomAlbumName = `${getRandomWord(albumWords)} ${getRandomWord(albumWords)} ${Math.floor(i / 10) + 1}`;
    const songData = {
      songTitle: randomSongTitle,
      duration: '3:30',
      genre: 'Pop',
      albumName: randomAlbumName,
      albumCoverUrl: 'https://example.com/album-cover.jpg',
      createdBy: auth.currentUser.uid,
    };

    try {
      const docRef = await addDoc(collection(db, 'songs'), songData);
      console.log('Song added:', docRef);
    } catch (error) {
      console.error('Error adding song:', error);
    }
  }
};




  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Song</Text>
      <TextInput
        style={styles.input}
        placeholder="Song Title"
        value={songTitle}
        onChangeText={setSongTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Duration"
        value={duration}
        onChangeText={setDuration}
      />
      <TextInput
        style={styles.input}
        placeholder="Genre"
        value={genre}
        onChangeText={setGenre}
      />
      <TextInput
        style={styles.input}
        placeholder="Album Name"
        value={albumName}
        onChangeText={setAlbumName}
      />
      <TextInput
        style={styles.input}
        placeholder="Album Cover URL"
        value={albumCoverUrl}
        onChangeText={setAlbumCoverUrl}
      />
      <TouchableOpacity style={styles.button} onPress={addSong}>
        <Text style={styles.buttonText}>Add Song</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={populateSongs}>
        <Text style={styles.buttonText}>Populate</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  header: {
    ...theme.typography.h2,
    color: theme.colors.primary,
    marginBottom: 20,
  },
  input: {
    ...theme.borders.soft,
    backgroundColor: theme.colors.white,
    width: '100%',
    height: 40,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    ...theme.borders.soft,
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
  },
  buttonText: {
    ...theme.typography.body,
    color: theme.colors.white,
    fontSize: 16,
  },
});

export default DevScreen;
