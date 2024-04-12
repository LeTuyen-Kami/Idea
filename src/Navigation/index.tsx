import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  CardAnimated,
  ChangeColorScreen,
  ChangeNumberScreen,
  DemoSkia,
  HomeScreen,
  MarqueeText,
  ScrollWheelScreen,
  ShaderSkiaScreen,
  Test,
} from '../Screen';
import CardTurnAround from '../Screen/CardTurnAround';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          fullScreenGestureEnabled: true,
        }}>
        <Stack.Screen name={'Home'} component={HomeScreen} />
        <Stack.Screen name={'ChangeColor'} component={ChangeColorScreen} />
        <Stack.Screen name={'ShaderSkia'} component={ShaderSkiaScreen} />
        <Stack.Screen name={'Test'} component={Test} />
        <Stack.Screen name={'DemoSkia'} component={DemoSkia} />
        <Stack.Screen name={'CardAnimated'} component={CardAnimated} />
        <Stack.Screen name={'ScrollWheel'} component={ScrollWheelScreen} />
        <Stack.Screen name={'ChangeNumber'} component={ChangeNumberScreen} />
        <Stack.Screen name={'MarqueeText'} component={MarqueeText} />
        <Stack.Screen name={'CardTurnAround'} component={CardTurnAround} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
