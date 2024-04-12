import {memo, useCallback, useEffect, useState} from 'react';
import {Canvas, Circle, Group} from '@shopify/react-native-skia';
import {
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {Button, Text, View} from 'react-native';

function CompChild(props: {title: string; test: () => void}) {
  console.log('render CompChild');
  return <Text>hello {props.title}</Text>;
}

const MemoCompChild = memo(CompChild);

export const DemoSkia = () => {
  const size = 256;
  const r = useSharedValue(0);
  const c = useDerivedValue(() => size - r.value);
  useEffect(() => {
    r.value = withRepeat(withTiming(size * 0.33, {duration: 1000}), -1);
  }, [r, size]);
  // return (
  //   <Canvas style={{flex: 1}}>
  //     <Group blendMode="multiply">
  //       <Circle cx={r} cy={r} r={r} color="cyan" />
  //       <Circle cx={c} cy={r} r={r} color="magenta" />
  //       <Circle cx={size / 2} cy={c} r={r} color="yellow" />
  //     </Group>
  //   </Canvas>
  // );
  const [count, setCount] = useState(0);

  const test = useCallback(() => {
    return 1;
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>count: {count}</Text>
      <MemoCompChild test={test} title={'hello'} />
      <Button title={'click'} onPress={() => setCount(count + 1)} />
    </View>
  );
};

export default DemoSkia;
