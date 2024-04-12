import React from 'react';
import {Button, Image, Text, View} from 'react-native';
import {ScreenContainer} from '../../Component';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';

const AnimatedText = ({
  value,
  sharedValue,
  index,
}: {
  value: number;
  index: number;
  sharedValue: SharedValue<number>;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const animatedStyleValue = ((sharedValue.value + index) % 3) - 1;
    const translate = animatedStyleValue * 50;
    return {
      transform: [
        {
          translateY: translate,
        },
      ],
      opacity: interpolate(
        animatedStyleValue,
        [-1, -0.5, 0, 0.5, 1],
        [0, 0, 1, 0, 0],
      ),
    };
  });

  return (
    <Animated.Text
      style={[
        {
          position: 'absolute',
          fontSize: 20,
          fontWeight: 'bold',
          color: 'blue',
        },
        animatedStyle,
      ]}>
      {value}
    </Animated.Text>
  );
};

const NumberComponent = ({number}: {number: number}) => {
  const animatedValue = useSharedValue(0);
  const [v, setV] = React.useState(0);

  const changeValue = () => {
    setV(number);
  };

  React.useEffect(() => {
    animatedValue.value = withTiming(number, {
      duration: 300,
    });
    setTimeout(() => {
      runOnJS(changeValue)();
    }, 150);
  }, [number]);

  return (
    <View
      style={{
        width: 50,
        height: 50,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {[1, 2, 3].map((item, index) => (
        <AnimatedText
          key={item}
          value={v}
          index={index}
          sharedValue={animatedValue}
        />
      ))}
    </View>
  );
};

const ChangeNumberScreen = () => {
  const [numberValue, setNumberValue] = React.useState(1);
  const [images, setImages] = React.useState([]);

  const increaseNumber = () => {
    setNumberValue(numberValue + 1);
  };

  const decreaseNumber = () => {
    setNumberValue(numberValue - 1);
  };

  const requireLargeFile = () => {
    const image = require('../../assets/images/large_image.jpg');
    const a = [];
    for (let i = 0; i < 10; i++) {
      a.push(image);
    }
  };

  React.useEffect(() => {
    return () => {
      console.log('unmount');
    };
  }, []);

  return (
    <ScreenContainer
      style={{
        justifyContent: 'center',
      }}>
      <Text>haha</Text>
      <NumberComponent number={numberValue} />
      <Button title={'+'} onPress={increaseNumber} />
      <Button title={'-'} onPress={decreaseNumber} />
      <Button title={'require large file'} onPress={requireLargeFile} />
      {/*<Image*/}
      {/*  source={image}*/}
      {/*  style={{*/}
      {/*    width: 100,*/}
      {/*    height: 100,*/}
      {/*  }}*/}
      {/*/>*/}
      {images.map((item, index) => {
        return (
          <Image
            key={index}
            source={item}
            style={{
              width: 100,
              height: 100,
            }}
          />
        );
      })}
    </ScreenContainer>
  );
};

export default ChangeNumberScreen;
