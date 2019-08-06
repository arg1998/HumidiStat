import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

const Warning = () => {
  return (
    <View style={styles.container}>
      <Icon color={'#EFF000'} name={'warning'} size={32} />
      <View style={styles.firstLine}>
        <View style={styles.yellowCircle} />
        <View style={styles.horizontalLine} />
        <Text style={styles.text}> Extreme humidity levels.</Text>
      </View>
      <Text style={styles.text}> Use precaution for set points </Text>
      <Text style={styles.text}> outside of 20%-55% </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginTop: 30
  },
  firstLine: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  yellowCircle: {
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: '#EFF000'
  },
  text: {
    color: '#fff',
    fontFamily: 'Avenir Roman',
    fontSize: 10
  },
  horizontalLine: {
    width: 10,
    marginLeft: 5,
    height: 2,
    backgroundColor: '#fff',
    borderRadius: 1
  }
});

export default Warning;
