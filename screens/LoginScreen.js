import {useContext, useState} from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import CustomInput from '../components/CustomInput';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {AppContext} from '../store/app-context';
import axios from 'axios';
import {BASE_API_URL} from '../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [encrypted, setEncrypted] = useState(true);
  const {setIsAuthenticating} = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  function validateInputs() {
    if (!username.trim()) {
      Alert.alert('Validation Error', 'Username cannot be empty');
      return false;
    }
    if (!password.trim()) {
      Alert.alert('Validation Error', 'Password cannot be empty');
      return false;
    }
    return true;
  }

  async function handleLogin() {
    const validation = validateInputs();
    if (!validation) return;

    try {
      setLoading(true);
      const resposne = await axios.post(BASE_API_URL + '/login', {
        username: username,
        password: password,
      });
      const token = resposne.data.token;
      console.log(token);
      await AsyncStorage.setItem('token', token);
      setIsAuthenticating(true);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'An error occurred.';
      Alert.alert('Login Error', errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.image}>
        <Image
          source={require('../assets/Resumate.png')}
          style={{
            width: 100,
            height: 100,
          }}
        />
      </View>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to get started</Text>
      <View style={styles.inputContainer}>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
          autoCapitalize={false}
          style={styles.input}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          autoCapitalize={false}
          secureTextEntry={encrypted}
          style={styles.input}
        />
        <TouchableOpacity
          onPress={() => {
            setEncrypted(encrypted => !encrypted);
          }}>
          <Ionicons name={encrypted ? 'eye' : 'eye-off'} size={20} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleLogin} disabled={loading}>
        <LinearGradient
          style={styles.loginButton}
          colors={['#42a4f5', '#427bf5', '#4254f5']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Login</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>New User? </Text>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => {
            navigation.navigate('RegisterScreen');
          }}>
          <Text style={styles.registerButtonText}>Register!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 10,
  },
  input: {
    fontSize: 16,
    flex: 1,
    textAlignVertical: 'top',
    textAlign: 'left',
  },
  loginButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: 50,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    marginBottom: 20,
    minHeight: 50,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  registerButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButtonText: {
    textAlign: 'center',
    color: '#007aff',
  },
  image: {
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 5,
    fontSize: 30,
    color: '#40403f',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#5c5c5c',
  },
});
