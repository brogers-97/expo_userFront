import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage'

const Stack = createStackNavigator()

function HomeScreen ({ navigation }) {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginPress, setLoginPress] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')


  const handleLoginPress = (isLogin) => {
    setLoginPress(isLogin)
  }


  //CLEAN SCREEN WHEN ENTERING
  useFocusEffect(
    React.useCallback(() => {
      setErrorMessage('')
      setUsername('')
      setPassword('')
    }, [])
  )



  //REGISTER
  const handleRegister = async () => {
    if( username === '') {
      setErrorMessage('Please enter Username')
      return
    }
    if( password === '') {
      setErrorMessage('Please enter Password')
      return
    }
    axios.post('http://192.168.1.130:5001/register', {
        username,
        password
    })
    //IF SUCCESSFUL RESPONSE FROM SERVER...
    .then(response => {
      //SET TOKEN FROM SERVER IN ASYNCSTORAGE
        AsyncStorage.setItem('token', response.data.token)
          .then(() => {
            //THEN NAVIGATE TO NEW SCREEN WITH TOKEN IN ASYNCSTORAGE
            navigation.navigate('Success', { token: response.data.token } )
          })
          .catch(error => console.log('Error storing token:', error))
    })
    .catch(err => {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setErrorMessage('User already exists')
        } else {
          console.error("Axios request failed", err.response?.data, err.toJSON());
        }
      } else {
        console.error(err);
      }
    })
  }


  //LOGIN
  const handleLogin = async () => {
    try {
      const response = await axios.get('http://192.168.1.130:5001/login', {
        params: {
          username,
          password
        }
      });
  
      AsyncStorage.setItem('token', response.data.token)
        .then(() => {
          navigation.navigate('Success', { token: response.data.token });
        })
        .catch(error => console.log('Error storing token:', error));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setErrorMessage('Incorrect username or password');
        } else {
          console.error("Axios request failed", err.response?.data, err.toJSON());
        }
      } else {
        console.error(err);
      }
    }
  }
  
  
  



  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to Brain Dump</Text>
  
      <View style={styles.loginContainer}>
        <View style={styles.loginOptionsContainer}>
          <TouchableOpacity onPress={() => handleLoginPress(false)} style={[styles.optionButton, !loginPress && styles.selectedOption]}>
            <Text style={styles.optionText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleLoginPress(true)} style={[styles.optionButton, loginPress && styles.selectedOption]}>
            <Text style={styles.optionText}>Register</Text>
          </TouchableOpacity>
        </View>
  
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
        </View>
  
        <TouchableOpacity onPress={loginPress ? handleRegister : handleLogin} style={styles.loginButton}>
          <Text style={styles.loginButtonLabel}>{loginPress ? 'Register' : 'Login'}</Text>
        </TouchableOpacity>
  
        {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
      </View>
    </View>
  );
}




//SEPERATE SCREEN
function SuccessScreen({ navigation, route }) {
  const [tokenValid, setTokenValid] = useState(false)




  //VERIFY THAT TOKEN EXISTS BEFORE RENDERING PAGE
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token')
        if (token) {
          setTokenValid(true)
        } else {
          navigation.navigate('Home')
        }
      } catch (error) {
        console.error('error verifying token:', error)
      }
    }

    verifyToken()

  }, [])





  const handleLogout = async () => {
    await AsyncStorage.removeItem('token')
    navigation.navigate('Home')
  }

  if (!tokenValid) {
    return null
  }

  const { token } = route.params

  return (
    <View>
      <Text>Registration Successful!</Text>
      <Text>{token}</Text>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogout}
      >
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}





//SCREEN NAVIGATION
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Success" component={SuccessScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}










//STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loginContainer: {
    alignItems: 'center',
  },
  loginOptionsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  optionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: '#eee',
  },
  selectedOption: {
    backgroundColor: 'lightblue',
  },
  optionText: {
    fontSize: 16,
  },
  inputContainer: {
    width: '80%',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    minWidth: 200,
  },
  loginButton: {
    backgroundColor: 'lightblue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  loginButtonLabel: {
    color: '#fff',
    fontSize: 16,
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
  },
});

