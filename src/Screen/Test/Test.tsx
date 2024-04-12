import React, {RefObject} from 'react';
import {ScreenContainer} from '../../Component';
import {Dimensions, Image, Text, TouchableOpacity, View} from 'react-native';
import FeatureHighLight from '../../Component/FeatureHighLight';

const screen = Dimensions.get('window');

const tiles = [
  'This is a test tile 1',
  'This is a test tile 2',
  'This is a test tile 3',
  'This is a test tile 4',
  'This is a test tile 5',
  'This is a test tile 6',
];

const descriptions = [
  "This is a test description 1. It's a very long description",
  "This is a test description 2. It's a very long description",
  "This is a test description 3. It's a very long description",
  "This is a test description 4. It's a very long description",
  "This is a test description 5. It's a very long description",
  "This is a test description 6. It's a very long description",
];

const Test = () => {
  const refTarget = React.useRef<any>([]);
  const featureHighLightRef = React.useRef<any>(null);

  const show1 = () => {
    featureHighLightRef.current?.show(refTarget.current?.[1]);
  };

  const show0 = () => {
    featureHighLightRef.current?.show(refTarget.current?.[0]);
  };

  const show2 = () => {
    featureHighLightRef.current?.show(refTarget.current?.[2]);
  };

  const setTarget = (ref: any) => {
    refTarget.current?.push(ref);
  };

  return (
    <ScreenContainer
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text onPress={show0} ref={setTarget}>
        Test
      </Text>
      <View
        style={{
          marginTop: 10,
          width: 100,
          height: 50,
        }}>
        <TouchableOpacity>
          <Text
            ref={setTarget}
            onPress={show1}
            style={{
              backgroundColor: 'red',
            }}>
            Show
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <View
          style={{
            flexDirection: 'row',
            width: screen.width,
          }}>
          <View style={{flex: 1}} />
          <Image
            ref={setTarget}
            source={{uri: 'https://picsum.photos/200/200'}}
            style={{width: 200, height: 200, marginRight: 0}}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Image
            ref={setTarget}
            source={{uri: 'https://picsum.photos/200/200'}}
            style={{width: 200, height: 200, marginLeft: -30}}
          />
        </View>
      </View>

      <Text onPress={show2}>img</Text>
      <FeatureHighLight
        descriptions={descriptions}
        titles={tiles}
        targets={refTarget.current}
        ref={featureHighLightRef}
        // indexes={[0, 3, 2, 1]}
      />
    </ScreenContainer>
  );
};

export default Test;
