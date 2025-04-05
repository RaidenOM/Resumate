import {useIsFocused} from '@react-navigation/native';
import axios from 'axios';
import {useContext, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {AppContext} from '../store/app-context';
import {BASE_API_URL} from '../utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from '../components/CustomButton';
import {COLOR_PRIMARY, TEXT_SECONDARY} from '../colors';

export default function MyResumesScreen() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const {token} = useContext(AppContext);
  const isFocused = useIsFocused();
  const [index, setIndex] = useState(0);
  const scrollViewRef = useRef();
  console.log(token);

  const scrollToIndex = index => {
    if (index >= 0 && index < resumes.length && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: index * screenWidth,
        animated: true,
      });
      setIndex(index);
    }
  };

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await axios.get(BASE_API_URL + '/resume', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setResumes(response.data);
      } catch (error) {
        const message = error?.response?.data?.message;
        Alert.alert('Error', message || 'Error fetching Resumes');
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (isFocused) fetchResumes();
  }, [isFocused]);

  if (loading || (resumes && resumes.length === 0)) {
    return (
      <View style={styles.loadingContainer}>
        {loading ? (
          <ActivityIndicator color={COLOR_PRIMARY} size="large" />
        ) : (
          <Text style={styles.subtitle}>No Resume Found</Text>
        )}
      </View>
    );
  }

  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        ref={scrollViewRef}
        onMomentumScrollEnd={event => {
          const newIndex = Math.round(
            event.nativeEvent.contentOffset.x / screenWidth,
          );
          setIndex(newIndex);
        }}
        showsHorizontalScrollIndicator={false}>
        {resumes &&
          resumes.length > 0 &&
          resumes.map((resume, index) => (
            <View style={styles.resumeCarouselContainer} key={index}>
              <View style={styles.resumeCarouselContent}>
                <TouchableOpacity
                  style={styles.previewImageContainer}
                  onPress={() => {
                    Linking.openURL(resume.url);
                  }}
                  onLongPress={() => {
                    Alert.alert(
                      'Confirm Delete',
                      'Are you sure you want to delete this resume?',
                      [
                        {text: 'Cancel', style: 'cancel'},
                        {
                          text: 'Confirm',
                          style: 'destructive',
                          onPress: async () => {
                            setResumes(prevResumes =>
                              prevResumes.filter(r => r._id !== resume._id),
                            );
                            await axios.delete(
                              BASE_API_URL + `/resume/${resume._id}`,
                              {
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                },
                              },
                            );
                          },
                        },
                      ],
                    );
                  }}>
                  <Image
                    source={{uri: resume.previewUrl}}
                    style={{width: '100%', height: '100%'}}
                    resizeMode="stretch"
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
      </ScrollView>
      <Text style={styles.subtitle}>Tap to open, hold to delete</Text>
      {index !== 0 && (
        <TouchableOpacity
          style={styles.leftButton}
          onPress={() => {
            scrollToIndex(index - 1);
          }}>
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>
      )}
      {index < resumes.length - 1 && (
        <TouchableOpacity
          style={styles.rightButton}
          onPress={() => {
            scrollToIndex(index + 1);
          }}>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resumeCarouselContainer: {
    width: Dimensions.get('window').width,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  resumeCarouselContent: {
    flex: 1,
  },
  leftButton: {
    position: 'absolute',
    left: 10,
    bottom: '50%',
    backgroundColor: COLOR_PRIMARY,
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
    backgroundColor: COLOR_PRIMARY,
    padding: 10,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  previewImageContainer: {
    width: '100%',
    flex: 1,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: TEXT_SECONDARY,
  },
});
