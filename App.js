import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {
  ActivityIndicator,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import HomeScreen from './screens/HomeScreen';
import MyResumesScreen from './screens/MyResumesScreen';
import CreateResumeScreen from './screens/CreateResumeScreen';
import PreviewResumeScreen from './screens/PreviewResumeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import {NavigationContainer} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import AppProvider, {AppContext} from './store/app-context';
import {useContext} from 'react';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size, focused}) => {
          console.log(color);
          if (route.name === 'HomeScreen') {
            return (
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                color={color}
                size={size}
              />
            );
          } else if (route.name === 'MyResumesScreen') {
            return (
              <Ionicons
                name={focused ? 'document' : 'document-outline'}
                color={color}
                size={size}
              />
            );
          }
        },
      })}>
      <Tab.Screen
        component={HomeScreen}
        name="HomeScreen"
        options={{tabBarLabel: 'Home', headerShown: false}}
      />
      <Tab.Screen
        component={MyResumesScreen}
        name="MyResumesScreen"
        options={{
          tabBarLabel: 'My Resumes',
          headerBackgroundContainerStyle: {backgroundColor: '#fff'},
          headerBackground: () => (
            <LinearGradient
              colors={['#007aff', '#bc02fa']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={{
                flex: 1,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.3,
                shadowRadius: 3,
                elevation: 5,
              }}
            />
          ),
          headerTitle: 'My Resumes',
          headerTintColor: '#fff',
        }}
      />
    </Tab.Navigator>
  );
}

function MainAppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <Stack.Screen
        component={Tabs}
        name="Tabs"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        component={CreateResumeScreen}
        name="CreateResumeScreen"
        options={{
          headerBackgroundContainerStyle: {backgroundColor: '#fff'},
          headerBackground: () => (
            <LinearGradient
              colors={['#007aff', '#bc02fa']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={{
                flex: 1,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.3,
                shadowRadius: 3,
                elevation: 5,
              }}
            />
          ),
          headerTitle: 'Create Resume',
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        component={PreviewResumeScreen}
        name="PreviewResumeScreen"
      />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <Stack.Screen component={LoginScreen} name="LoginScreen" />
      <Stack.Screen component={RegisterScreen} name="RegisterScreen" />
    </Stack.Navigator>
  );
}

function Navigation() {
  const {user, loading} = useContext(AppContext);

  if (loading) {
    return (
      <>
        <View style={[styles.loadingContainer, {backgroundColor: 'white'}]}>
          <View
            style={{
              borderRadius: 20,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.3,
              shadowRadius: 3,
              elevation: 5,
              marginBottom: 20,
            }}>
            <Image
              source={require('./assets/Resumate.png')}
              resizeMode="center"
              style={{height: 200, width: 200}}
            />
          </View>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={{marginTop: 20, color: '#7f8c8d'}}>
            Designed by Om Kumar
          </Text>
        </View>
      </>
    );
  }

  return user ? <MainAppStack /> : <AuthStack />;
}

export default function App() {
  return (
    <>
      <AppProvider>
        <NavigationContainer>
          <Navigation />
        </NavigationContainer>
      </AppProvider>
      <StatusBar backgroundColor={'black'} barStyle={'light-content'} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
