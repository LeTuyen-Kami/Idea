import React from 'react';

import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {ScreenContainer} from '../../Component';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {screen} from '../../Util';
import {translateDeg2Rad} from '../ScrollWheel/ScrollWheelScreen';

type TCard = {
  index: number;
  sharedValue: SharedValue<number>;
  onPress: () => void;
};

const RATIO = screen.width / screen.height;
const RADIUS_WIDTH = screen.width / 2 - 100;
const RADIUS_HEIGHT = (screen.height - 200) / 2 - 100;

const interpolateRadius = (rad: number) => {
  const _rad = (rad % 90) / 90;

  return Math.sin(translateDeg2Rad(rad));
};

console.log('RATIO', RATIO, interpolateRadius(0));

const Card: React.FC<TCard> = ({index, sharedValue, onPress}) => {
  const offset = (360 / 3) * index;

  console.log('index', screen.width - 200);

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = Math.round(
      Math.sin(translateDeg2Rad(sharedValue.value + offset + 90)) *
        ((screen.height - 200) / 2),
    );

    const translateX = Math.round(
      Math.cos(translateDeg2Rad(sharedValue.value + offset + 90)) *
        ((screen.width - 160) / 2),
    );
    return {
      transform: [
        {
          translateY: translateY,
        },
        {
          translateX: translateX,
        },
      ],
    };
  });

  return (
    <TouchableOpacity onPress={onPress}>
      <Animated.View
        style={[
          {
            width: 200,
            height: 200,
            backgroundColor: 'red',
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: RADIUS_HEIGHT,
            left: RADIUS_WIDTH,
          },
          animatedStyle,
        ]}>
        <Text>Card {index}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const CardTurnAround: React.FC<any> = props => {
  const animateValue = useSharedValue(0);
  const locking = useSharedValue(false);

  const onPress = () => {
    if (locking.value) {
      return;
    }
    locking.value = true;

    animateValue.value = withTiming(animateValue.value + 360 / 3, {}, () => {
      locking.value = false;
    });
  };

  return (
    <ScreenContainer
      style={{
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
      }}>
      <Text>haha</Text>
      {[1, 2, 3].map((item, index) => {
        return (
          <Card
            key={index}
            onPress={onPress}
            index={index}
            sharedValue={animateValue}
          />
        );
      })}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CardTurnAround;
