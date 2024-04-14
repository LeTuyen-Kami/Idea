import React from 'react';
import {ScreenContainer} from '../../Component';
import {ScrollView, Text, View} from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {screen} from '../../Util';

const Data = [...Array(24).keys()];

const HEIGHT = 400;
const ITEM_HEIGHT = 45;

export const transformSin = (value: number) => {
  // sin from -1 to 1 -> 0 to 1
  'worklet';
  return (value + 1) / 2;
};

export const translateDeg2Rad = (deg: number) => {
  'worklet';
  return (deg * Math.PI) / 180;
};

export const compact = (value: number) => {
  //15 -> 15
  //375 -> 15
  //360 -> 0
  //0 -> 0
  //270 -> 270
  //-10 -> 350
  //-365 -> 355
  'worklet';
  return ((value % 360) + 360) % 360;
};

const isTop = (value: number) => {
  'worklet';
  if (compact(value) > 270 || compact(value) < 90) {
    return 1;
  } else {
    return 0;
  }
};

const compactIndex = (index: number, length: number) => {
  'worklet';
  // console.log('sign', Math.sign(index));
  return 12 * (Math.sign(index) + 1) - (index % length);
};

const ScrollWheelScreen = () => {
  const scrollY = useSharedValue(0);
  const ctx = useSharedValue(0);

  const onItemChange = (index: number) => {
    console.log('onItemChange', index);
  };

  const pan = Gesture.Pan()
    .onStart(() => {
      ctx.value = scrollY.value;
    })
    .onChange(event => {
      scrollY.value = event.translationY + ctx.value;
    })
    .onEnd(event => {
      scrollY.value = withDecay(
        {
          velocity: event.velocityY / 2,
        },
        () => {
          const offset = 360 / Data.length;
          const nearestIndex = Math.round(scrollY.value / offset);
          scrollY.value = withTiming(nearestIndex * offset, {
            duration: 100,
          });
          runOnJS(onItemChange)(compactIndex(nearestIndex, Data.length));
        },
      );
    });

  return (
    <ScreenContainer
      style={{
        alignItems: undefined,
      }}>
      <View
        style={{
          // backgroundColor: 'blue',
          // height: 300,
          flex: 1,
        }}>
        <GestureHandlerRootView style={{flex: 1}}>
          <GestureDetector gesture={pan}>
            <Animated.View
              style={{
                // flex: 1,
                alignItems: 'center',
                marginLeft: 10,
                marginRight: 10,
                marginTop: 100,
                backgroundColor: 'pink',
                height: HEIGHT - 4 * ITEM_HEIGHT + 45,
              }}>
              {Data.map((item, index) => {
                return (
                  <Item
                    key={index}
                    item={`${index + 1}`}
                    scrollY={scrollY}
                    index={index}
                    length={Data.length}
                  />
                );
              })}
              <View
                style={{
                  position: 'absolute',
                  top: HEIGHT / 2 - ITEM_HEIGHT * 2,
                  width: 100,
                  height: ITEM_HEIGHT,
                  // backgroundColor: 'cyan',
                  borderTopColor: 'red',
                  borderTopWidth: 1,
                  borderBottomColor: 'red',
                  borderBottomWidth: 1,
                }}
              />
            </Animated.View>
          </GestureDetector>
        </GestureHandlerRootView>
      </View>
    </ScreenContainer>
  );
};

const Item = ({
  item,
  scrollY,
  index,
  length,
}: {
  item: string;
  scrollY: SharedValue<number>;
  index: number;
  length: number;
}) => {
  // useAnimatedReaction(
  //   () => {
  //     return scrollY.value;
  //   },
  //   value => {
  //     console.log(value);
  //   },
  // );
  const offset = 360 / length;

  const animatedStyle = useAnimatedStyle(() => {
    const translateDeg = translateDeg2Rad(scrollY.value + index * offset);

    const sin = Math.sin(translateDeg);

    const translateY = transformSin(sin) * HEIGHT;

    return {
      position: 'absolute',
      transform: [
        {
          translateY: translateY - 2 * ITEM_HEIGHT,
        },

        {
          scale:
            isTop(scrollY.value + index * offset) *
            interpolate(transformSin(sin), [0, 0.5, 1], [0.5, 2, 0.5]),
        },
        {
          rotateX: `${interpolate(
            transformSin(sin),
            [0.2, 0.8],
            [-135, 135],
          )}deg`,
        },
      ],
      opacity:
        isTop(scrollY.value + index * offset) *
        interpolate(transformSin(sin), [0.3, 0.5, 0.7], [0, 1, 0]),
      zIndex: isTop(scrollY.value + index * offset),
    };
  }, [scrollY]);

  const textColor = useAnimatedStyle(() => {
    const translateDeg = translateDeg2Rad(scrollY.value + index * offset);

    const sin = Math.sin(translateDeg);

    return {
      color: interpolateColor(
        transformSin(sin),
        [0, 0.45, 0.5, 0.55, 1],
        ['black', 'black', 'red', 'black', 'black'],
      ),
    };
  }, [scrollY]);

  return (
    <Animated.View style={animatedStyle}>
      <Animated.Text
        style={[
          {
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
            paddingVertical: 10,
          },
          textColor,
        ]}>
        {item}
      </Animated.Text>
    </Animated.View>
  );
};

export default ScrollWheelScreen;
