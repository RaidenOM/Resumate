import LinearGradient from 'react-native-linear-gradient';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useContext, useRef, useState} from 'react';
import CustomButton from '../components/CustomButton';
import {useNavigation} from '@react-navigation/native';
import {AppContext} from '../store/app-context';
import {TEXT_PRIMARY_DARK, TEXT_PRIMARY} from '../colors';

export default function HomeScreen() {
  const flatListRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation();
  const {logout, user, theme, toggleTheme} = useContext(AppContext);

  const isDarkTheme = theme === 'dark';
  console.log(theme);

  const appFeatures = [
    {
      image: require('../assets/carousel/feature1.png'),
      feature: 'Resumate allows you to easily create Resumes without hassle!',
    },
    {
      image: require('../assets/carousel/feature2.png'),
      feature: 'Just fill the fields you want to include',
    },
    {
      image: require('../assets/carousel/feature3.png'),
      feature: 'Your created Resumes are stored in cloud for easy access',
    },
  ];

  const scrollToIndex = index => {
    if (index >= 0) {
      flatListRef.current.scrollToIndex({
        index: index % appFeatures.length,
        animated: true,
      });
      setCurrentIndex(index);
    }
  };

  const screenWidth = Dimensions.get('window').width;

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: isDarkTheme ? 'black' : 'white'},
      ]}>
      <LinearGradient
        style={styles.header}
        colors={['#007aff', '#bc02fa']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Welcome,</Text>
          <Text style={styles.headerSubtitle}>{user.username}</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={{marginHorizontal: 20}}
            onPress={toggleTheme}>
            <Ionicons
              name={isDarkTheme ? 'sunny' : 'moon'}
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={logout}>
            <Ionicons name="exit-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <Text
        style={[
          styles.title,
          {color: isDarkTheme ? TEXT_PRIMARY_DARK : TEXT_PRIMARY},
        ]}>
        Build Your Resume!
      </Text>
      <View style={styles.carouselContainer}>
        <FlatList
          ref={flatListRef}
          data={appFeatures}
          renderItem={({item}) => (
            <View style={styles.feature}>
              <Image source={item.image} style={styles.featureImage} />
              <Text
                style={[
                  styles.featureText,
                  {color: isDarkTheme ? '#fff' : '#000'},
                ]}>
                {item.feature}
              </Text>
            </View>
          )}
          keyExtractor={item => item.feature}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={event => {
            const newIndex = Math.round(
              event.nativeEvent.contentOffset.x / screenWidth,
            );
            setCurrentIndex(newIndex);
          }}></FlatList>
        {/* Floating Left Button */}
        {currentIndex > 0 && (
          <TouchableOpacity
            style={styles.leftButton}
            onPress={() => scrollToIndex(currentIndex - 1)}>
            <Ionicons name="chevron-back" size={20} color="#fff" />
          </TouchableOpacity>
        )}

        {/* Floating Right Button */}
        {currentIndex < appFeatures.length - 1 && (
          <TouchableOpacity
            style={styles.rightButton}
            onPress={() => scrollToIndex(currentIndex + 1)}>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
      <CustomButton
        style={styles.button}
        title="Create Resume"
        icon="add"
        onPress={() => {
          navigation.navigate('CreateResumeScreen');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 200,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 1,
  },
  headerSubtitle: {
    color: '#fff',
  },
  title: {
    marginTop: 20,
    fontSize: 20,
    textAlign: 'center',
  },
  feature: {
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  featureImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  featureText: {
    fontSize: 18,
    textAlign: 'center',
  },
  carouselContainer: {
    position: 'relative',
    alignItems: 'center',
    flex: 1,
    marginBottom: 10,
  },
  leftButton: {
    position: 'absolute',
    left: 10,
    bottom: '50%',
    backgroundColor: '#007aff',
    padding: 10,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  rightButton: {
    position: 'absolute',
    right: 10,
    bottom: '50%',
    backgroundColor: '#007aff',
    padding: 10,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  button: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
});
