import React from 'react';
import {ScreenContainer} from '../../Component';
import {ScrollView, Text, View} from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
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

const ScrollWheelScreen = () => {
  const scrollY = useSharedValue(0);
  const ctx = useSharedValue(0);

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
        },
      );
    });

  return (
    <ScreenContainer
      style={{
        alignItems: undefined,
      }}>
      <GestureHandlerRootView style={{flex: 1}}>
        <GestureDetector gesture={pan}>
          <Animated.View
            style={{
              flex: 1,
              alignItems: 'center',
              marginLeft: 10,
              marginRight: 10,
              marginTop: 100,
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
                top: (screen.height - 300) / 2,
                width: 100,
                height: 45,
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

    const translateY = transformSin(sin) * (screen.height - 300);

    return {
      position: 'absolute',
      transform: [
        {
          translateY: translateY,
        },

        // {
        //   scale:
        //     isTop(scrollY.value + index * offset) *
        //     interpolate(transformSin(sin), [0, 0.5, 1], [0, 2, 0]),
        // },
      ],
      // opacity:
      //   isTop(scrollY.value + index * offset) *
      //   interpolate(transformSin(sin), [0, 0.5, 1], [0, 1, 0]),
      // zIndex: isTop(scrollY.value + index * offset),
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
