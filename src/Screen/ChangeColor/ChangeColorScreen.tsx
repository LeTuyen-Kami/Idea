import React, {useRef} from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {
  Canvas,
  Circle,
  Image as SkiaImage,
  ImageShader,
  makeImageFromView,
  mix,
  SkImage,
} from '@shopify/react-native-skia';

const screen = Dimensions.get('window');
const {width, height: h} = screen;
const barHeight =
  Platform.select({
    android: 24,
    ios: 0,
  }) || 0;
const height = h - barHeight;
console.log('StatusBar.currentHeight', height, StatusBar.currentHeight);
const wait = (timeout: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};

enum Theme {
  Light = 0,
  Dark = 1,
}

const randomImageUrl = 'https://picsum.photos/200/300';

const maxFromPointToConner = (x: number, y: number, w: number, h: number) => {
  return Math.max(
    Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)),
    Math.sqrt(Math.pow(w - x, 2) + Math.pow(y, 2)),
    Math.sqrt(Math.pow(x, 2) + Math.pow(h - y, 2)),
    Math.sqrt(Math.pow(w - x, 2) + Math.pow(h - y, 2)),
  );
};

const ChangeColorScreen = () => {
  const colorState = useSharedValue(Theme.Light);
  const ref = useRef(null);
  const transition = useSharedValue(0);
  const circle = useSharedValue({
    x: 0,
    y: 0,
    r: 0,
  });
  const [overlay1, setOverlay1] = React.useState<SkImage | null>(null);
  const [overlay2, setOverlay2] = React.useState<SkImage | null>(null);
  const [showModal, setShowModal] = React.useState(false);

  const backgroundStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        colorState.value,
        [Theme.Light, Theme.Dark],
        ['white', 'black'],
      ),
    };
  });

  const textStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        colorState.value,
        [Theme.Light, Theme.Dark],
        ['black', 'white'],
      ),
    };
  });

  const onPressChangeColor = async (e: {
    nativeEvent: {pageX: number; pageY: number};
  }) => {
    if (overlay1) {
      return;
    }

    circle.value = {
      x: e.nativeEvent.pageX,
      y: e.nativeEvent.pageY,
      r: maxFromPointToConner(
        e.nativeEvent.pageX,
        e.nativeEvent.pageY,
        width,
        height,
      ),
    };
    const ov1 = await makeImageFromView(ref);
    setOverlay1(ov1);
    await wait(10);
    colorState.value =
      colorState.value === Theme.Light ? Theme.Dark : Theme.Light;
    StatusBar.setBarStyle(
      colorState.value === Theme.Dark ? 'dark-content' : 'light-content',
    );

    await wait(100);
    const ov2 = await makeImageFromView(ref);
    setOverlay2(ov2);
    transition.value = 0;
    transition.value = withTiming(1, {
      duration: 1000,
      easing: Easing.bezier(0.64, 0.04, 0.31, 0.98),
    });
    await wait(1000);
    setOverlay1(null);
    setOverlay2(null);
    //release
    ov1?.dispose();
    ov2?.dispose();
  };

  const r = useDerivedValue(() => {
    const rs = mix(transition.value, 0, circle.value.r);
    return rs;
  });

  const onPressImage = () => {
    console.log('onPressImage');
  };
  const onPressShowModal = () => {
    setShowModal(!showModal);
  };

  // React.useEffect(() => {
  //   StatusBar.setHidden(true);
  // }, []);

  return (
    <View style={{flex: 1}}>
      <Animated.View
        ref={ref}
        style={[
          {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          },
          backgroundStyle,
        ]}>
        <Pressable onPress={onPressChangeColor}>
          <Animated.Text style={textStyle}>Change Color</Animated.Text>
        </Pressable>

        <View
          style={{
            width: 200,
            height: 200,
            backgroundColor: 'red',
            overflow: 'hidden',
          }}>
          <Animated.FlatList
            data={[...Array(10).keys()]}
            renderItem={({item, index}) => {
              return (
                <View key={index}>
                  <Image
                    source={{uri: randomImageUrl}}
                    style={{width: 200, height: 200}}
                  />
                </View>
              );
            }}
            horizontal
            pagingEnabled={true}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <TouchableOpacity onPress={onPressShowModal}>
          <Animated.Text style={textStyle}>ShowModal</Animated.Text>
        </TouchableOpacity>
        <Animated.Text style={textStyle}>
          lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis
        </Animated.Text>
        <Modal visible={showModal} transparent>
          <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <Pressable style={{flex: 1}} onPress={onPressShowModal}></Pressable>
            <View
              style={{
                width: '100%',
                height: 300,
                backgroundColor: 'pink',
              }}>
              <Pressable style={{flex: 1}}>
                <ScrollView
                  pagingEnabled
                  horizontal
                  style={{
                    width: '100%',
                    height: 300,
                    flexShrink: 1,
                  }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, index) => {
                    return (
                      <View onStartShouldSetResponder={() => true} key={index}>
                        <Image
                          source={{uri: randomImageUrl}}
                          style={{
                            width: 400,
                            height: 200,
                          }}
                        />
                      </View>
                    );
                  })}
                </ScrollView>
              </Pressable>
            </View>
          </View>
        </Modal>
      </Animated.View>
      {!!overlay1 && (
        <Canvas style={StyleSheet.absoluteFill} pointerEvents={'none'}>
          <SkiaImage
            image={overlay1}
            x={0}
            y={0}
            width={width}
            height={height}
          />
          {overlay2 && (
            <Circle r={r} c={circle} color={'red'}>
              <ImageShader
                image={overlay2}
                x={0}
                y={0}
                width={width}
                height={height}
                fit={'cover'}
              />
            </Circle>
          )}
        </Canvas>
      )}
    </View>
  );
};

export default ChangeColorScreen;
