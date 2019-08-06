import React, { Component } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, Text, View } from 'react-native';
import HumidStat from './components/HumidStat';
import MaskTest from './playground/mask';

export class App extends Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <HumidStat />
        {/* <MaskTest /> */}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#150029'
  }
});

export default App;
