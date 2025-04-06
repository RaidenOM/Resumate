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
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {AppContext} from '../store/app-context';
import axios from 'axios';
import {BASE_API_URL} from '../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [encrypted, setEncrypted] = useState(true);
  const [encryptedConfim, setEncryptedConfirm] = useState(true);
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
    if (username.length <= 3) {
      Alert.alert(
        'Validation Error',
        'Username must be greater than 3 characters',
      );
      return false;
    }
    if (username.includes(' ')) {
      Alert.alert('Validation Error', 'Username cannot have spaces');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Validation Error', "Passwords don't match");
      return false;
    }
    return true;
  }
  async function handleRegister() {
    const validation = validateInputs();
    if (!validation) return;

    try {
      setLoading(true);
      await axios.post(BASE_API_URL + '/register', {username, password});
      Alert.alert('Success', 'Account has been successfully created');
      navigation.goBack();
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || 'An error occurred.';
      Alert.alert('Register Error', errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>
      <Text style={styles.subtitle}>Sign up to get started</Text>
      <View style={styles.inputContainer}>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Userame"
          autoCapitalize="none"
          style={styles.input}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          autoCapitalize="none"
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
      <View style={styles.inputContainer}>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm Password"
          autoCapitalize="none"
          secureTextEntry={encryptedConfim}
          style={styles.input}
        />
        <TouchableOpacity
          onPress={() => {
            encryptedConfim(encrypted => !encrypted);
          }}>
          <Ionicons name={encryptedConfim ? 'eye' : 'eye-off'} size={20} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleRegister} disabled={loading}>
        <LinearGradient
          style={styles.loginButton}
          colors={['#42a4f5', '#427bf5', '#4254f5']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Register</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>Already have an Account? </Text>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => {
            navigation.goBack();
          }}>
          <Text style={styles.registerButtonText}>Login!</Text>
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
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.25,
    shadowRadius: 10,
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
