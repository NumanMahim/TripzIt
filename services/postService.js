import { storage, db } from '../config/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";

// Upload image to Firebase storage
export const uploadImageToFirebase = async (imageUri) => {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const storageRef = ref(storage, `images/${Date.now()}`);
    const snapshot = await uploadBytes(storageRef, blob);
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error("Error uploading image: ", error);
    throw error;
  }
};

// Save post with image URL and caption to Firestore
export const savePost = async (username, imageUrl, caption) => {
  try {
    const postsRef = collection(db, "posts");
    await addDoc(postsRef, {
      username: username,
      imageUrl: imageUrl,
      caption: caption,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Error saving post: ", error);
    throw error;
  }
};

// Fetch posts from Firestore
export const fetchPosts = async () => {
  try {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching posts: ", error);
    throw error;
  }
};
