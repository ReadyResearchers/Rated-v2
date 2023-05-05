import  db  from './firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export const rateSong = async (userId, songId, rating) => {
  const songRef = doc(db, 'songs', songId);
  const userSongRef = doc(db, 'userSongs', `${userId}_${songId}`);

  try {
    await updateDoc(songRef, {
      ratings: { [userId]: rating },
    });

    const userSongSnapshot = await getDoc(userSongRef);

    if (userSongSnapshot.exists()) {
      await updateDoc(userSongRef, {
        rating,
      });
    } else {
      await setDoc(userSongRef, {
        userId,
        songId,
        rating,
      });
    }

    console.log('Song rating updated successfully');
  } catch (error) {
    console.error('Error rating the song:', error);
  }
};
