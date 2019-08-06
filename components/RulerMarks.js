import React, { Component } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';
const { interpolate, Extrapolate, add } = Animated;
const { height: HEIGHT } = Dimensions.get('window');
const MARK_HEIGHT = 1;

export class RulerMarks extends Component {
  constructor(props) {
    super(props);
    const { lowerBound, upperBound, circleRadius, circleY } = props;
    const d = (lowerBound - upperBound) / 54;
    this.marks = [];
    const z1 = 2.25 * circleRadius;
    const z2 = 1.8 * circleRadius;
    const v1 = 1.6 * circleRadius;
    const v2 = 1.2 * circleRadius;
    const cY = add(circleY, circleRadius);

    for (let i = 0; i < 55; i++) {
      const y = upperBound + circleRadius + i * d;
      const transX = interpolate(cY, {
        inputRange: [y - z1, y - z2, y, y + z2, y + z1],
        outputRange: [v1, v2, 0, v2, v1],
        extrapolate: Extrapolate.CLAMP
      });
      const opacityAnim = interpolate(transX, {
        inputRange: [0, v1],
        outputRange: [1, 0.3],
        extrapolate: Extrapolate.CLAMP
      });
      this.marks.push(
        <Animated.View
          key={i}
          style={[
            i % 6 == 0 ? styles.longMark : styles.shortMark,
            {
              opacity: opacityAnim,
              transform: [{ translateY: y }, { translateX: transX }]
            }
          ]}
        />
      );
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // state changes doesn't affect this component, so we never allow for re-rendering 
    return false;
  }

  render() {
    return <View style={styles.container}>{this.marks}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  longMark: {
    height: MARK_HEIGHT + 1,
    width: 25,
    position: 'absolute',
    backgroundColor: '#fff'
  },
  shortMark: {
    height: MARK_HEIGHT,
    width: 15,
    position: 'absolute',
    backgroundColor: '#aaa'
  }
});

export default RulerMarks;
