import React from 'react';
import {ScreenContainer} from '../../Component';
import {Dimensions, Text, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const {width} = Dimensions.get('window');

const AnimatedText = ({
  text,
  sharedValue,
  index,
  layoutWidth,
}: {
  text: string | string[];
  sharedValue: any;
  index: number;
  layoutWidth: number;
}) => {
  const textWidth = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const animatedStyleValue = ((sharedValue.value + index) % 2) - 1;
    const _width =
      textWidth.value > layoutWidth ? textWidth.value : layoutWidth;
    const translate = animatedStyleValue * _width;
    return {
      transform: [
        {
          translateX: translate,
        },
      ],
    };
  }, [sharedValue]);

  return (
    <Animated.Text
      onLayout={e => {
        textWidth.value = e.nativeEvent.layout.width;
      }}
      style={[{position: 'absolute'}, animatedStyle]}>
      {text}
    </Animated.Text>
  );
};

const Test = ({
  children,
  style,
  layoutWidth,
}: {
  children: string;
  layoutWidth: number;
  style?: any;
}) => {
  const progress = useSharedValue(0);

  const increase = () => {
    progress.value = withTiming(progress.value + 1, {duration: 1000});
    requestAnimationFrame(() => {
      increase();
    });
  };

  React.useEffect(() => {
    requestAnimationFrame(() => {
      increase();
    });
  }, []);

  return (
    <View style={style}>
      <Animated.View
        style={[
          {
            flexDirection: 'row',
          },
        ]}>
        <AnimatedText
          layoutWidth={layoutWidth}
          text={children}
          sharedValue={progress}
          index={0}
        />
        <AnimatedText
          layoutWidth={layoutWidth}
          text={children}
          sharedValue={progress}
          index={1}
        />
        {/*<AnimatedText text={children} sharedValue={progress} index={2} />*/}
      </Animated.View>
    </View>
  );
};

const a = 'f';
const MarqueeText = () => {
  return (
    <ScreenContainer>
      <Text>je</Text>
      <Test
        layoutWidth={300}
        style={{
          width: 300,
          height: 100,
          backgroundColor: 'teal',
          overflow: 'hidden',
        }}>
        Xin chaof cac b toi day
      </Test>
    </ScreenContainer>
  );
};

export default MarqueeText;
