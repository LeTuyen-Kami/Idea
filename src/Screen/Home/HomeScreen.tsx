import React from 'react';
import {Dimensions, Text, TouchableOpacity, View} from 'react-native';
import {ScreenContainer} from '../../Component';

const screen = Dimensions.get('window');

interface IButtonNavigation {
  title: string;
  onPress: () => void;
}

const ButtonNavigation = ({title, onPress}: IButtonNavigation) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 10,
          borderWidth: 1,
          borderRadius: 5,
          borderColor: 'red',
          justifyContent: 'space-between',
          width: screen.width - 20,
          marginTop: 10,
        }}>
        <Text>{title}</Text>
        <Text style={{fontWeight: 'bold'}}>{'->'}</Text>
      </View>
    </TouchableOpacity>
  );
};

const HomeScreen: React.FC<any> = ({navigation}) => {
  const navigateToChangeColor = () => {
    navigation.navigate('ChangeColor');
  };

  const navigateToShaderSkia = () => {
    navigation.navigate('ShaderSkia');
  };

  const navigateToTest = () => {
    navigation.navigate('Test');
  };

  const navigateToDemoSkia = () => {
    navigation.navigate('DemoSkia');
  };

  const navigateToCardAnimated = () => {
    navigation.navigate('CardAnimated');
  };

  const navigateToScrollWheel = () => {
    navigation.navigate('ScrollWheel');
  };

  const navigateToChangeNumber = () => {
    navigation.navigate('ChangeNumber');
  };

  const onPressMarqueeText = () => {
    navigation.navigate('MarqueeText');
  };

  const navigateCardTurnAround = () => {
    navigation.navigate('CardTurnAround');
  };

  return (
    <ScreenContainer>
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: 'red',
        }}>
        HomeScreen
      </Text>
      <ButtonNavigation onPress={navigateToChangeColor} title={'ChangeColor'} />
      <ButtonNavigation onPress={navigateToShaderSkia} title={'ShaderSkia'} />
      <ButtonNavigation onPress={navigateToTest} title={'Test'} />
      <ButtonNavigation onPress={navigateToDemoSkia} title={'DemoSkia'} />
      <ButtonNavigation
        onPress={navigateToCardAnimated}
        title={'Card Animated'}
      />
      <ButtonNavigation
        onPress={navigateToScrollWheel}
        title={'Scroll Wheel'}
      />
      <ButtonNavigation
        onPress={navigateToChangeNumber}
        title={'Change Number'}
      />
      <ButtonNavigation onPress={onPressMarqueeText} title={'Marquee Text'} />
      <ButtonNavigation
        onPress={navigateCardTurnAround}
        title={'Card turn around'}
      />
    </ScreenContainer>
  );
};

export default HomeScreen;
