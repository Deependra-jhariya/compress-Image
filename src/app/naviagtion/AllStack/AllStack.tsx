import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  SplashScreen,
  HomeScreen,
  CompressScreen,
  ResizeScreen,
  CropScreen,
  ConvertScreen,
  RotateScreen,
  FlipScreen,
  BlurScreen,
  RemoveBackgroundScreen
} from '../../../presentation/screens';

const Stack = createNativeStackNavigator();

const AllStack = () => {
  return (
    <Stack.Navigator initialRouteName='SplashScreen' screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="CompressScreen" component={CompressScreen} />
      <Stack.Screen name="ResizeScreen" component={ResizeScreen} />
      <Stack.Screen name="CropScreen" component={CropScreen} />
      <Stack.Screen name="ConvertScreen" component={ConvertScreen} />
      <Stack.Screen name="RotateScreen" component={RotateScreen} />
      <Stack.Screen name="FlipScreen" component={FlipScreen} />
      <Stack.Screen name="BlurScreen" component={BlurScreen} />
      <Stack.Screen name="RemoveBackgroundScreen" component={RemoveBackgroundScreen} />
    </Stack.Navigator>
  );
};

export default AllStack;

const styles = StyleSheet.create({});
