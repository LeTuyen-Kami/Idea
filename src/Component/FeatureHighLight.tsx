import React, {
  forwardRef,
  RefObject,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {Dimensions, Modal, Text, View} from 'react-native';
import {
  Canvas,
  DiffRect,
  rect,
  rrect,
  useComputedValue,
  useValue,
  runTiming,
  useValueEffect,
  runSpring,
} from '@shopify/react-native-skia';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const screen = Dimensions.get('window');

interface IFeatureHighLightRef {
  show: (target: RefObject<any>['current']) => void;
  hide: () => void;
}

interface IFeatureHighLight {
  targets: RefObject<any>['current'][];
  titles: string[];
  descriptions: string[];
  indexes?: number[];
}

const FeatureHighLight = forwardRef<IFeatureHighLightRef, IFeatureHighLight>(
  ({targets, titles, descriptions, indexes = []}, ref) => {
    const [visible, setVisible] = useState(false);
    // const [position, setPosition] = useState({x: 0, y: 0, w: 0, h: 0});
    // const position = useSharedValue({x: 0, y: 0, w: 0, h: 0});
    const positionX = useValue(0);
    const positionY = useValue(0);
    const positionW = useValue(0);
    const positionH = useValue(0);
    const index = useRef(0);
    const locking = useRef(false);
    const cal = async (target: RefObject<any>['current'] | null, dur = 300) => {
      if (!target) {
        return;
      }

      return new Promise((resolve, reject) => {
        try {
          target?.measure?.(
            (
              x: any,
              y: any,
              width: any,
              height: any,
              pageX: number,
              pageY: number,
            ) => {
              console.log(
                'x, y, width, height, pageX, pageY',
                x,
                y,
                width,
                height,
                pageX,
                pageY,
              );
              // position.value = {x: pageX, y: pageY, w: width, h: height};
              runTiming(positionX, pageX, {
                duration: dur,
              });
              runTiming(positionY, pageY, {
                duration: dur,
              });
              runTiming(positionW, width, {
                duration: dur,
              });
              runTiming(positionH, height, {
                duration: dur,
              });
              resolve(null);
            },
          );
        } catch (error) {
          console.log('error', error);
          reject(error);
        }
      });
    };

    const show = async () => {
      const startIndex = indexes.length ? indexes[0] : 0;

      await cal(targets[startIndex], 0);
      index.current = 0;
      setVisible(true);
    };

    const hide = () => {
      setVisible(false);
    };

    const onPressLayout = () => {
      if (locking.current) {
        return;
      }

      if (index.current >= targets.length - 1) {
        hide();
        return;
      }
      index.current += 1;
      locking.current = true;
      const nextIndex = indexes.length ? indexes[index.current] : index.current;
      cal(targets[nextIndex]).then(() => {
        console.log('done', positionX.current, positionY.current);
        locking.current = false;
      });
    };

    const animatedRect = useComputedValue(() => {
      const x = Math.max(0, positionX.current - 10);
      const y = Math.max(0, positionY.current - 10);
      const scaleW = +!!x * 10 + 10 + +!x * positionX.current;
      const scaleH = +!!y * 10 + 10 + +!y * positionY.current;
      const w =
        x + positionW.current + scaleW > screen.width
          ? screen.width - x
          : positionW.current + scaleW;
      const h =
        y + positionH.current + scaleH > screen.height
          ? screen.height - y
          : positionH.current + scaleH;

      return rrect(rect(x, y, w, h), 0, 0);
    }, [positionW, positionH, positionX, positionY]);

    const height = useSharedValue(0);

    useValueEffect(positionY, () => {
      height.value = positionY.current + positionH.current + 20;
    });

    const animatedText = useAnimatedStyle(() => {
      return {
        position: 'absolute',
        top: height.value,
        left: 10,
        right: 10,
      };
    }, [height]);

    useImperativeHandle(
      ref,
      () => {
        return {
          show,
          hide,
        };
      },
      [],
    );

    return (
      <Modal visible={visible} transparent>
        <Canvas
          style={{
            width: screen.width,
            height: screen.height,
          }}
          onTouchEnd={onPressLayout}>
          <DiffRect
            inner={animatedRect}
            outer={rrect(rect(0, 0, screen.width, screen.height), 10, 10)}
            color={'rgba(0,0,0,0.5)'}
          />
        </Canvas>
        <Animated.View style={animatedText}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 20,
              color: 'pink',
            }}>
            {titles[0]}
          </Text>
          <Text
            style={{
              color: 'cyan',
            }}>
            {descriptions[0].repeat(4)}
          </Text>
        </Animated.View>
      </Modal>
    );
  },
);

export default FeatureHighLight;

// {/*<Pressable*/}
// {/*  onPress={hide}*/}
// {/*  style={{*/}
// {/*    position: 'absolute',*/}
// {/*    backgroundColor: 'rgba(0,0,0,0.5)',*/}
// {/*    top: 0,*/}
// {/*    left: 0,*/}
// {/*    right: 0,*/}
// {/*    bottom: Math.floor(screen.height - position.y) + 10,*/}
// {/*  }}*/}
// {/*/>*/}
// {/*<Pressable*/}
// {/*  onPress={hide}*/}
// {/*  style={{*/}
// {/*    position: 'absolute',*/}
// {/*    backgroundColor: 'rgba(0,0,0,0.5)',*/}
// {/*    top: Math.ceil(position.y + position.h) + 10,*/}
// {/*    left: 0,*/}
// {/*    right: 0,*/}
// {/*    bottom: 0,*/}
// {/*  }}*/}
// {/*/>*/}
// {/*<Pressable*/}
// {/*  onPress={hide}*/}
// {/*  style={{*/}
// {/*    position: 'absolute',*/}
// {/*    backgroundColor: 'rgba(0,0,0,0.5)',*/}
// {/*    top: Math.ceil(position.y) - 10,*/}
// {/*    left: 0,*/}
// {/*    right: Math.floor(screen.width - position.x + 10),*/}
// {/*    height: Math.floor(position.h + 20),*/}
// {/*  }}*/}
// {/*/>*/}
// {/*<Pressable*/}
// {/*  onPress={hide}*/}
// {/*  style={{*/}
// {/*    position: 'absolute',*/}
// {/*    backgroundColor: 'rgba(0,0,0,0.5)',*/}
// {/*    top: Math.ceil(position.y) - 10,*/}
// {/*    left: Math.floor(position.x + position.w) + 10,*/}
// {/*    right: 0,*/}
// {/*    height: Math.floor(position.h + 20),*/}
// {/*  }}*/}
// {/*/>*/}
