import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const InfoTile = props => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{props.title}</Text>
      <Text
        style={[
          styles.text,
          { fontSize: props.textSize ? props.textSize : 28 }
        ]}
      >
        {props.text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginBottom: 10,
    marginTop: 10
  },
  title: {
    color: "#127ac9",
    fontSize: 12,
    fontFamily: 'Avenir Roman'
  },
  text: {
    color: '#fff',
    fontFamily: 'GothamMedium',
    marginTop: 10
  }
});

export default InfoTile;
