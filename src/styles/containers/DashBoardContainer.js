import {StatusBar, StyleSheet, View} from 'react-native';
import AppColors from '../../assets/colors/Appcolors';
import LinearGradient from 'react-native-linear-gradient';

const DashBoardContainer = ({children}) => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'transparent'} translucent  barStyle={'dark-content'} />
      <LinearGradient
        style={styles.gradient}
        colors={[
          'rgba(239, 240, 255, 0.2)',
         'rgba(241, 243, 255, 0.5)',
          'white',
          'white',
        ]}
        start={{x: 0.4, y: 0}}
        end={{x: 0.4, y: 0.8}}
      />{children}
    </View>
  );
};

export default DashBoardContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.white,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});
