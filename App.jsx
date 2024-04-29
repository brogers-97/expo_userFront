import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Notifications } from 'expo-notifications'
//import { StatusBar, TextInput, TouchableOpacity } from 'react-native';

export default function App() {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleRegister = () => {
    console.log('pressed')
    axios.post('http://192.168.1.130:5001/register', {
        username,
        password
    })
    .then(response => {
      console.log('user registered:', response.data)
    })
    .catch(err => {
      if (axios.isAxiosError(err)) {
        console.error("Axios request failed", err.response?.data, err.toJSON());
      } else {
        console.error(err);
      }
    })
  }


  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.usernameBox}
        placeholder='Username'
        onChangeText={text => setUsername(text)}
        value={username}
      />
      <TextInput 
        style={styles.passwordBox}
        placeholder='Password'
        onChangeText={text => setPassword(text)}
        value={password}
        secureTextEntry={true}
      />
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleRegister}
      >
        <Text 
          style={styles.submitText}
        >login</Text>
      </TouchableOpacity>
      <StatusBar style='auto' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  usernameBox: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  passwordBox: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  loginButton: {
    width: '55%',
    backgroundColor: 'lightblue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center'
  },
  submitText: {
    textAlign: 'center',
  }
});
