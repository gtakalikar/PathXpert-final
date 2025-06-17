import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import { Rating } from 'react-native-ratings';  // Run: npm install react-native-ratings

export default function FeedbackScreen({ navigation }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    console.log('Rating:', rating);
    console.log('Comment:', comment);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feedback</Text>

      <Image
        source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Traffic_density_map.png' }}
        style={styles.map}
      />
      
      <Text style={styles.subtitle}>Rate your suggestion</Text>
      
      <Rating
        type="star"
        ratingCount={5}
        imageSize={30}
        startingValue={rating}
        onFinishRating={setRating}
        style={styles.rating}
      />

      <TextInput
        style={styles.input}
        placeholder="Add a comment..."
        value={comment}
        onChangeText={setComment}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Improve Suggestion</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,               // 👈 Increased font size
    fontWeight: '700',
    color: '#003366',
    textAlign: 'center',
    marginTop: 40,              // 👈 Moved heading further down
    marginBottom: 16,
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 12,
  },
  rating: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  input: {
    height: 100,
    borderColor: '#d3d3d3',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#ff7f7f',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
