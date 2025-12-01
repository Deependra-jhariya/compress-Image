import {
  NavigationProp,
  StackActions,
  useNavigation,
} from '@react-navigation/native';
import { RootStackParams } from '../../../app/naviagtion/types';

export const useAppNavigation = () => {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  const navigateTo = (screen: keyof RootStackParams, params?: any) => {
    navigation.navigate(screen, params);
  };

  const replaceTo = (screen: keyof RootStackParams, params?: any) => {
    navigation.dispatch(StackActions.replace(screen, params));
  };

  const resetTo = (screen: keyof RootStackParams, params?: any) => {
    navigation.reset({
      index: 0,
      routes: [{ name: screen, params }],
    });
  };

  const goback =() =>{
    if(navigation.canGoBack()){
        navigation.goBack()
    }
  }

  return {
    navigateTo,
    replaceTo,
    resetTo,
    goback
  };
};
