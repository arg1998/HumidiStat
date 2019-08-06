import React from 'react';
import { Path, Svg, Circle } from 'react-native-svg';
import { path } from 'd3-path';
import Animated from 'react-native-reanimated';
const { sub } = Animated;

class CurvedLine extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    // state changes doesn't affect this component, so we never allow for re-rendering
    return false;
  }
  render() {
    const {
      width: SVG_W,
      height: SVG_H,
      debug,
      circleRadius: CR,
      strokeWidth: ST,
      paddingRight: PR,
      lineColor,
      circleColor,
      debugCircle,
      translateY
    } = this.props;

    const D = 2.5 * CR; // Distance from the center of the circle to the vertical line
    const VLH = SVG_H / 2; // vertical line height
    const X = SVG_W - PR; // baseline X

    //#region Cubic Bezier Curves Control Points
    const c1 = { x: X, y: VLH - (3 * D) / 4 };
    const c2 = { x: X - 0.35 * CR, y: VLH - 0.6 * D };

    const c3 = { x: X - 1.1 * CR, y: VLH - 0.4 * D };
    const c4 = { x: X - 1.5 * CR, y: VLH - D / 4 };

    const c5 = { x: X - 1.5 * CR, y: VLH + D / 4 };
    const c6 = { x: X - 1.1 * CR, y: VLH + 0.4 * D };

    const c7 = { x: X - 0.35 * CR, y: VLH + 0.6 * D };
    const c8 = { x: X, y: VLH + (3 * D) / 4 };
    //#endregion

    const curve = path();
    curve.moveTo(X, 0);
    curve.lineTo(X, VLH - D);
    curve.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, X - 0.75 * CR, VLH - D / 2);
    curve.bezierCurveTo(c3.x, c3.y, c4.x, c4.y, X - 1.5 * CR, VLH);
    curve.bezierCurveTo(c5.x, c5.y, c6.x, c6.y, X - 0.75 * CR, VLH + D / 2);
    curve.bezierCurveTo(c7.x, c7.y, c8.x, c8.y, X, VLH + D);
    curve.lineTo(X, SVG_H);

    //#region  Debug Section
    let debugGuideLines = null;
    if (debug) {
      const guide_line_1 = path();
      guide_line_1.moveTo(X, 0);
      guide_line_1.lineTo(X, SVG_H);

      const guide_line_2 = path();
      guide_line_2.moveTo(X - 0.75 * CR, 0);
      guide_line_2.lineTo(X - 0.75 * CR, SVG_H);

      const guide_line_3 = path();
      guide_line_3.moveTo(X - 1.5 * CR, 0);
      guide_line_3.lineTo(X - 1.5 * CR, SVG_H);

      const guide_line_4 = path();
      guide_line_4.moveTo(0, SVG_H / 2);
      guide_line_4.lineTo(X, SVG_H / 2);

      const guide_line_5 = path();
      guide_line_5.moveTo(0, VLH - D);
      guide_line_5.lineTo(X, VLH - D);

      const guide_line_6 = path();
      guide_line_6.moveTo(0, VLH + D);
      guide_line_6.lineTo(X, VLH + D);

      debugGuideLines = (
        <React.Fragment>
          <Path
            d={guide_line_1.toString()}
            strokeDasharray={3}
            strokeWidth={1}
            stroke={'#999'}
          />
          <Path
            d={guide_line_2.toString()}
            strokeDasharray={3}
            strokeWidth={1}
            stroke={'#999'}
          />
          <Path
            d={guide_line_3.toString()}
            strokeDasharray={3}
            strokeWidth={1}
            stroke={'#999'}
          />
          <Path
            d={guide_line_4.toString()}
            strokeDasharray={3}
            strokeWidth={1}
            stroke={'#999'}
          />
          <Path
            d={guide_line_5.toString()}
            strokeDasharray={3}
            strokeWidth={1}
            stroke={'#999'}
          />
          <Path
            d={guide_line_6.toString()}
            strokeDasharray={3}
            strokeWidth={1}
            stroke={'#999'}
          />
          <Circle cx={c1.x} cy={c1.y} r={3} fill={'red'} />
          <Circle cx={c2.x} cy={c2.y} r={3} fill={'red'} />

          <Circle cx={c3.x} cy={c3.y} r={3} fill={'yellow'} />
          <Circle cx={c4.x} cy={c4.y} r={3} fill={'yellow'} />

          <Circle cx={c5.x} cy={c5.y} r={3} fill={'lightgreen'} />
          <Circle cx={c6.x} cy={c6.y} r={3} fill={'lightgreen'} />

          <Circle cx={c7.x} cy={c7.y} r={3} fill={'lightblue'} />
          <Circle cx={c8.x} cy={c8.y} r={3} fill={'lightblue'} />
        </React.Fragment>
      );
    }
    //#endregion

    const transY = sub(translateY, VLH - CR);
    return (
      <Animated.View
        style={{
          backgroundColor: 'transparent',
          transform: [{ translateY: transY }]
        }}
      >
        <Svg
          style={{
            borderColor: 'yellow',
            borderWidth: debug ? 1 : 0
          }}
          width={SVG_W}
          height={SVG_H}
        >
          {debugCircle && (
            <Circle
              cx={X}
              cy={SVG_H / 2}
              r={CR ? CR : 25}
              fill={circleColor ? circleColor : '#fff'}
            />
          )}
          <Path
            d={curve.toString()}
            strokeWidth={ST}
            fill={'transparent'}
            stroke={lineColor ? lineColor : '#fff'}
          />
          {debugGuideLines}
        </Svg>
      </Animated.View>
    );
  }
}

export default CurvedLine;
