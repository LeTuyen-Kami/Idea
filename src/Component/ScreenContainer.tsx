import React from 'react';
import {SafeAreaView, View, ViewStyle} from 'react-native';

interface IScreenContainer {
  style?: ViewStyle;
  children: any;
}

const ScreenContainer: React.FC<IScreenContainer> = ({children, style}) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, alignItems: 'center', ...style}}>{children}</View>
    </SafeAreaView>
  );
};

export default ScreenContainer;
