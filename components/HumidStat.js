import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  Text,
  BackHandler
} from 'react-native';
import Animated from 'react-native-reanimated';
import {
  PanGestureHandler,
  State,
  TouchableNativeFeedback
} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/EvilIcons';
import InfoIcon from 'react-native-vector-icons/AntDesign';
import { scaleLinear } from 'd3-scale';
import CurvedLine from './CurvedLine';
import RulerMarks from './RulerMarks';
import HumidityTexts from './HumidityTexts';
import Warning from './Warning';
import InfoTile from './InfoTile';
import InfoDialog from './InfoDialog';

const {
  event,
  Value,
  add,
  cond,
  eq,
  set,
  greaterOrEq,
  lessOrEq,
  call,
  interpolate,
  Extrapolate,
  concat
} = Animated;

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');
const CIRCLE_RADIUS = 25;
const CIRCLE_VERTICAL_MARGIN = 50;
const UPPER_BOUND = CIRCLE_VERTICAL_MARGIN;
const LOWER_BOUND = HEIGHT - CIRCLE_VERTICAL_MARGIN - 4 * CIRCLE_RADIUS;

class HumidStat extends Component {
  constructor(props) {
    super(props);
    this.state = { isDialogOpen: false };

    this.humidityTextRef = React.createRef();
    this.panSate = new Value(State.UNDETERMINED);
    this.panTransY = new Value(0);
    this.panTrueY = new Value(0);
    this._oldCircleY = new Value(LOWER_BOUND);
    this.circleTrueY = new Value(0);
    this._newYPos = add(this.panTransY, this._oldCircleY);
    /*  rotation of the circle when user moves it
        currently, vector icons have a lot impact on performance. 
        so i decided to drop the rotation animation
    */

    const rotation = interpolate(this.circleTrueY, {
      inputRange: [UPPER_BOUND, LOWER_BOUND],
      outputRange: [3 * 360, 0],
      extrapolate: Extrapolate.CLAMP
    });
    this.rotation = concat(rotation, 'deg');

    this.values = [
      { v: 100, d: true },
      { v: 75, d: true },
      { v: 50, d: true },
      { v: 45, d: false },
      { v: 40, d: false },
      { v: 35, d: false },
      { v: 30, d: false },
      { v: 25, d: true },
      { v: 10, d: true },
      { v: 0, d: true }
    ];

    // animating the true position (Y translation ) of the circle
    this.circleTrueY = cond(
      eq(this.panSate, State.ACTIVE),
      cond(
        lessOrEq(this._newYPos, UPPER_BOUND),
        [
          set(this.circleTrueY, UPPER_BOUND),
          call([this.circleTrueY], this.onCircleMove), // callback to react with movement changes
          this.circleTrueY
        ],
        cond(
          greaterOrEq(this._newYPos, LOWER_BOUND),
          [
            set(this.circleTrueY, LOWER_BOUND),
            call([this.circleTrueY], this.onCircleMove), // callback to react with movement changes
            this.circleTrueY
          ],
          [
            set(this.circleTrueY, this._newYPos),
            call([this.circleTrueY], this.onCircleMove), // callback to react with movement changes
            this.circleTrueY
          ]
        )
      ),
      cond(
        lessOrEq(this._newYPos, UPPER_BOUND),
        set(this._oldCircleY, UPPER_BOUND),
        cond(
          greaterOrEq(this._newYPos, LOWER_BOUND),
          set(this._oldCircleY, LOWER_BOUND),
          set(this._oldCircleY, this._newYPos)
        )
      )
    );

    // distance between each set-point
    const d = (LOWER_BOUND - UPPER_BOUND) / (this.values.length - 1);
    const inputRange = [];
    for (let i = 0; i < this.values.length; i++) {
      inputRange.push(UPPER_BOUND + i * d);
    }
    //using d3 scale to scale the Y position to percentage
    this.humidityPercentageScale = scaleLinear()
      .domain(inputRange)
      .range(this.values.map(x => x.v));

    // catching the touch event from the Gesture Handler
    this._gesture_event_handler = event(
      [
        {
          nativeEvent: {
            state: this.panSate,
            translationY: this.panTransY,
            absoluteY: this.panTrueY
          }
        }
      ],
      { useNativeDriver: true }
    );
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (this.state.isDialogOpen) {
        this._closeInfoDialog();
        return true;
      }
      return false;
    });
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  // using setNativeProps to race with the animation
  onCircleMove = ([yPos]) => {
    this.humidityTextRef.current.setNativeProps({
      text: `${Math.round(this.humidityPercentageScale(yPos))}%`
    });
  };

  _closeInfoDialog = () => {
    this.setState({ isDialogOpen: false });
  };
  _openInfoDialog = () => {
    this.setState({ isDialogOpen: true });
  };

  render() {
    const { circleTrueY } = this;

    return (
      <View style={styles.container}>
        <View style={styles.leftSide}>
          <HumidityTexts
            lowerBound={LOWER_BOUND}
            upperBound={UPPER_BOUND}
            circleRadius={CIRCLE_RADIUS}
            circleY={circleTrueY}
            values={this.values}
          />
          <RulerMarks
            lowerBound={LOWER_BOUND}
            upperBound={UPPER_BOUND}
            circleRadius={CIRCLE_RADIUS}
            circleY={circleTrueY}
          />
        </View>

        <CurvedLine
          lineColor={'#1d7ade'}
          width={CIRCLE_RADIUS * 2}
          height={HEIGHT * 2}
          debug={false}
          debugCircle={false}
          circleRadius={CIRCLE_RADIUS}
          strokeWidth={5}
          paddingRight={3}
          translateY={circleTrueY}
        />
        <View style={{ width: 0 }}>
          <PanGestureHandler
            onHandlerStateChange={this._gesture_event_handler}
            onGestureEvent={this._gesture_event_handler}
          >
            <Animated.View
              style={[
                styles.circle,
                {
                  transform: [
                    { translateY: circleTrueY },
                    { translateX: -1.1 * CIRCLE_RADIUS },
                    { rotateZ: this.rotation }
                  ]
                }
              ]}
            >
              {/* dropping this animation due to performance reasons )-; */}
              <Icon
                name={'spinner-2'}
                color={'#333'}
                size={CIRCLE_RADIUS * 2}
              />
            </Animated.View>
          </PanGestureHandler>
        </View>

        <View style={styles.rightSide}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              paddingRight: 20
            }}
          >
            <View style={{ flexGrow: 1 }} />
            <TouchableNativeFeedback
              style={{ padding: 10 }}
              onPress={this._openInfoDialog}
            >
              <InfoIcon name={'infocirlceo'} size={28} color={'#555'} />
            </TouchableNativeFeedback>
          </View>
          <InfoTile title="RETURN TEMPERATURE" text="20°C" />
          <View>
            <Text style={styles.humidityPercentageTitle}>
              HUMIDITY PERCENTAGE
            </Text>
            <TextInput
              ref={this.humidityTextRef}
              editable={false}
              value={'0%'}
              style={styles.humidityPercentageText}
            />
          </View>
          <View>
            <InfoTile title="ABSOLUTE HUMIDITY" text="4gr/ft3" />
            <Warning />
          </View>
        </View>
        <InfoDialog
          visible={this.state.isDialogOpen}
          onClose={this._closeInfoDialog}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    overflow: 'hidden',
    flexDirection: 'row',
    flexGrow: 1
  },
  circle: {
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    backgroundColor: '#ffffff',
    borderRadius: CIRCLE_RADIUS,
    elevation: 20,
    zIndex: 200,
    justifyContent: 'center',
    alignItems: 'center'
  },
  leftSide: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    minWidth: 90
  },
  rightSide: {
    flexGrow: 2,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 40,
    paddingTop: 10,
    marginLeft: 20
  },
  humidityPercentageTitle: {
    color: '#127ac9',
    fontSize: 12,
    fontFamily: 'Avenir Roman'
  },
  humidityPercentageText: {
    color: '#c5edeb',
    fontSize: 55,
    padding: 0
  }
});

export default HumidStat;
