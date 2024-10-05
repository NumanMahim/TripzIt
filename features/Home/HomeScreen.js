import React, { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import picture1 from '../../assets/picture1.jpg';  // Add this in the assets folder
import picture2 from '../../assets/picture2.jpg';  // Add this in the assets folder

export default function HomeScreen() {
  const [posts, setPosts] = useState([
    {
      id: '1',
      username: 'Numan',
      profileImage: 'https://example.com/profile1.jpg',
      postImage: picture1,
      liked: false,
      comments: [],
      showComments: false,
    },
    {
      id: '2',
      username: 'Mahim',
      profileImage: 'https://example.com/profile2.jpg',
      postImage: picture2,
      liked: false,
      comments: [],
      showComments: false,
    },
  ]);

  const [userPost, setUserPost] = useState(null);  // For user-uploaded posts

  // Function to pick an image from the gallery
  const pickImageFromGallery = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access gallery is required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      const newPost = {
        id: String(posts.length + 1),
        username: 'User',
        profileImage: 'https://example.com/userprofile.jpg',
        postImage: { uri: result.uri },
        liked: false,
        comments: [],
        showComments: false,
      };
      setPosts([newPost, ...posts]); // Add the new post to the top of the feed
    }
  };

  const toggleLike = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, liked: !post.liked } : post
      )
    );
  };

  const toggleComments = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, showComments: !post.showComments } : post
      )
    );
  };

  const addComment = (postId, comment) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, comment] }
          : post
      )
    );
  };

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      {/* User Info */}
      <View style={styles.userInfo}>
        <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
        <Text style={styles.username}>{item.username}</Text>
      </View>

      {/* Post Image */}
      <Image source={item.postImage} style={styles.postImage} />

      {/* Like and Comment options */}
      <View style={styles.interactionRow}>
        <TouchableOpacity onPress={() => toggleLike(item.id)}>
          <Icon name={item.liked ? 'heart' : 'heart-outline'} size={25} color={item.liked ? 'red' : 'black'} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => toggleComments(item.id)}>
          <Icon name="chatbubble-outline" size={25} color="black" />
        </TouchableOpacity>
      </View>

      {/* Show Comments Input and Section */}
      {item.showComments && (
        <View>
          {/* Comment Input */}
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              onSubmitEditing={(e) => addComment(item.id, e.nativeEvent.text)}
            />
          </View>

          {/* Show Comments */}
          {item.comments.length > 0 && (
            <View style={styles.commentSection}>
              {item.comments.map((comment, index) => (
                <Text key={index} style={styles.commentText}>
                  {comment}
                </Text>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* What's on your mind section */}
      <View style={styles.uploadSection}>
        <Image
          source={{ uri: 'https://example.com/userprofile.jpg' }}
          style={styles.userProfileImage}
        />
        <Text style={styles.uploadText}>What's on your mind?</Text>
        <TouchableOpacity onPress={pickImageFromGallery}>
          <Icon name="image-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>

      {/* Feed */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  postContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  postImage: {
    width: '100%',
    height: 400, // Adjust as per your design
    marginTop: 10,
  },
  interactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  commentInputContainer: {
    paddingHorizontal: 10,
    marginTop: 10,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingLeft: 10,
    paddingRight: 10,
    height: 40,
    fontSize: 14,
  },
  commentSection: {
    paddingHorizontal: 10,
    marginTop: 10,
  },
  commentText: {
    fontSize: 14,
    marginBottom: 5,
  },
  uploadSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  userProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  uploadText: {
    flex: 1,
    fontSize: 16,
    color: '#888',
  },
});
