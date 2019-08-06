import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, TextInput } from 'react-native';
import Animated from 'react-native-reanimated';
const { interpolate, Extrapolate, add } = Animated;
const TEXT_HEIGHT = 30;

export class HumidityTexts extends Component {
  constructor(props) {
    super(props);
    const { lowerBound, upperBound, circleRadius, circleY, values } = props;
    const d = (lowerBound - upperBound) / (values.length - 1);
    const circleCenter = add(circleY, circleRadius);
    const scaleFactor = 1.2; // text scale when circle is close to it

    // a list to hold the animated components
    this.texts = [];

    for (let i = 0; i < values.length; i++) {
      // calculating the Y position of each text
      const y = upperBound + circleRadius + i * d - TEXT_HEIGHT / 2;
      // text scale animation based
      const scale = interpolate(circleCenter, {
        inputRange: [
          y + TEXT_HEIGHT / 2 - d,
          y + TEXT_HEIGHT / 2,
          y + TEXT_HEIGHT / 2 + d
        ],
        outputRange: [1, scaleFactor, 1],
        extrapolate: Extrapolate.CLAMP
      });
      const transX = interpolate(scale, {
        inputRange: [1, scaleFactor],
        outputRange: [0, 5],
        extrapolate: Extrapolate.CLAMP
      });
      this.texts.push(
        <Animated.View
          style={[
            styles.textContainer,
            {
              transform: [
                { translateY: y },
                { scale: scale },
                { translateX: transX }
              ]
            }
          ]}
        >
          <View
            style={values[i].d ? styles.yellowCircle : styles.emptyCircle}
          />
          <TextInput
            editable={false}
            value={`${values[i].v}%`}
            style={styles.text}
          />
        </Animated.View>
      );
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // state changes doesn't affect this component, so we never allow for re-rendering
    return false;
  }

  render() {
    return <View style={styles.container}>{this.texts}</View>;
  }
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingLeft: 5
  },
  textContainer: {
    width: '100%',
    position: 'absolute',
    paddingLeft: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    padding: 0,
    margin: 0,
    textAlign: 'left',
    fontSize: 14,
    width: '100%',
    minWidth: 60,
    color: '#fff',
    fontFamily: 'GothamMedium',
    height: TEXT_HEIGHT
  },
  yellowCircle: {
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: '#ee0',
    marginRight: 5
  },
  emptyCircle: {
    width: 5,
    marginRight: 5
  }
});
export default HumidityTexts;
