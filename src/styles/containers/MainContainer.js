import {StatusBar, StyleSheet, View} from 'react-native';
import AppColors from '../../assets/colors/Appcolors';
import LinearGradient from 'react-native-linear-gradient';

const MainContainer = ({children}) => {
  return (
    <View style={styles.container}>
      {/* <StatusBar backgroundColor={AppColors.grad1}   barStyle={'dark-content'} /> */}
            <StatusBar backgroundColor={'transparent'} translucent barStyle={'dark-content'} />
      <LinearGradient
        style={styles.gradient}
        colors={[
          AppColors.grad1,
          AppColors.grad2,
          'white',
          'white',
        ]}
        start={{x: 0.4, y: 0}}
        end={{x: 0.4, y: 0.8}}
      />
      {children}
    </View>
  );
};

export default MainContainer;

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
