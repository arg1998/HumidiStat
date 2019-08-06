import React from 'react';
import { Dimensions, View, ScrollView, Text } from 'react-native';
import MaskedView from '@react-native-community/masked-view';
import CurvedLine from '../components/CurvedLine';
const { height: HEIGHT } = Dimensions.get('window');

export default class MaskTest extends React.Component {
  render() {
    return (
      <MaskedView
        style={{
          flex: 1,
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center'
        }}
        maskElement={
          <View
            style={{
              backgroundColor: 'transparent'
            }}
          >
            <ScrollView style={{ height: '100%' }}>
              <View style={{ height: 500 }} />
              <Text>This is A Mask</Text>
              <View style={{ height: 500 }} />
            </ScrollView>
          </View>
        }
      >
       
        <View style={{ flexGrow: 1, backgroundColor: '#00F' }} />
        <View style={{ flexGrow: 1, backgroundColor: '#0F0' }} />
        <View style={{ flexGrow: 1, backgroundColor: '#F00' }} />
      </MaskedView>
    );
  }
}
