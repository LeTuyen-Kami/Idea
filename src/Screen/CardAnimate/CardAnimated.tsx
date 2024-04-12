import React from 'react';
import {ScreenContainer} from '../../Component';
import {Text, TouchableOpacity, View} from 'react-native';
import Animated, {
  useSharedValue,
  SharedValue,
  useAnimatedStyle,
  withTiming,
  useAnimatedReaction,
  runOnJS,
  withDelay,
  withRepeat,
} from 'react-native-reanimated';

const randomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

const totalDuration = 3000;
const totalCard = 52;
const usedCard = totalCard / 4;
const delayTime = totalDuration / usedCard;

interface ICard {
  title: string;
  color: string;
  animatedValue: SharedValue<number>;
  deg: number;
  index: number;
}
const Card = ({title, color, animatedValue, deg, index}: ICard) => {
  const _value = useSharedValue(0);
  const _ll = useSharedValue(0);

  useAnimatedReaction(
    () => {
      return animatedValue.value;
    },
    value => {
      _value.value = withDelay(
        delayTime * (usedCard - index),
        withTiming(
          +value / (index + 1),
          {
            duration: delayTime,
          },
          () => {
            _ll.value = 1 / (index + 1);
            _value.value = withRepeat(
              withTiming(_ll.value, {duration: 0}, () => {
                _ll.value = _ll.value + 1 / (index + 1);
              }),
              index,
            );
          },
        ),
      );
    },
    [animatedValue],
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: 40 * _value.value,
        },
        {
          translateY: 60 * _value.value,
        },
        {
          rotate: `${_value.value * deg}deg`,
        },
        {
          translateX: -40 * _value.value,
        },
        {
          translateY: -60 * _value.value,
        },
      ],
    };
  }, [_value]);

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: 80,
          height: 120,
          backgroundColor: color,
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
        },
        animatedStyle,
      ]}>
      <Text>Card {title}</Text>
    </Animated.View>
  );
};

const a = [...Array(usedCard).keys()];
const CardAnimated = () => {
  const listCard = React.useRef<number[]>(a);
  const animatedValue = useSharedValue(0);
  const startAnimation = useSharedValue(false);

  const changeValue = () => {
    animatedValue.value = withTiming(animatedValue.value === 1 ? 0 : 1, {
      duration: totalDuration,
    });
    startAnimation.value = !startAnimation.value;
  };

  const animatedView = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: -40 * animatedValue.value,
        },
        {
          translateY: -60 * animatedValue.value,
        },
      ],
    };
  }, [animatedValue]);

  return (
    <ScreenContainer style={{justifyContent: 'center'}}>
      <Animated.View
        style={[
          {flex: 1, justifyContent: 'center', alignItems: 'center'},
          animatedView,
        ]}>
        {listCard.current.map((_, index) => {
          return (
            <Card
              key={index}
              title={`${index}`}
              color={randomColor()}
              animatedValue={startAnimation}
              deg={(360 / listCard.current.length) * index}
              index={index}
            />
          );
        })}
      </Animated.View>
      <TouchableOpacity
        onPress={changeValue}
        style={{
          backgroundColor: 'cyan',
          padding: 10,
          borderRadius: 5,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>Press Me</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
};

export default CardAnimated;
