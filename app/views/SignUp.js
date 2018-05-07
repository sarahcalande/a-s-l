import React, {Component} from "react";
import { View, ScrollView, StyleSheet, Text,
  TouchableHighlight, ImageBackground, KeyboardAvoidingView } from "react-native";
import { Button } from "react-native-elements";
import { onSignIn, setStorage } from "../auth";
import { url } from '../lib/url';

import t from 'tcomb-form-native';

const Form = t.form.Form;

const newUser = t.struct({
    username: t.String,
    password: t.String,
    email: t.String,
});

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value : {
      username : '',
      password : '',
      email : ''
      }
    };
  }

  componentWillUnmount() {
    this.setState = {
      value : {
        username : '',
        password : null,
        email : ''

      }
    };
  }

  _onChange = (value) => {
    this.setState({
      value
    })
  }

  _handleAdd = () => {
    const navigation = this.props.navigation;
    const value = this.refs.form.getValue();
    if(value === null){
      alert('Enter your info to register!')
    }else if((/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(value.email) === false){
      alert('Email must be valid email address')
    } else {
      const data = {
        username: value.username,
        email: value.email,
        password: value.password,
      }
      // Serialize and post the data
      const json = JSON.stringify(data);
      console.log(json);
        fetch(`${url}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
        })
        .then(response => {
          console.log(response, "RES HITT");
          response.json()
        .then(response => {
          setStorage(response)
          if(response.success === true){
            onSignIn()
            .then(() => navigation.navigate("SignedIn"));
        } else return alert('Wrong Username or Password');
        })
      })
      .done()
      }
    }

  render() {
    const navigation = this.props.navigation;
    return(
      <ScrollView style={styles.form}>
        <KeyboardAvoidingView behavior="padding">
          <Form
            ref='form' //assign a ref
            type={newUser}
            options={options}
            value={this.state.value}
            onChange={this._onChange}
          />

          <Button
            large
            buttonStyle={{ marginTop: 10 }}
            backgroundColor="transparent"
            textStyle={{ color: "#ffb6c1" }}
            fontWeight="bold"
            raised={true}
            title="SIGN UP"
            onPress={this._handleAdd}
          />
          <Button
            large
            buttonStyle={{ marginBottom: 10 }}
            backgroundColor="transparent"
            textStyle={{ color: "#ffb6c1" }}
            fontWeight="bold"
            raised={true}
            title="Sign In"
            onPress={() => navigation.navigate("SignIn")}
          />
         </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}



const options = {
  fields: {
    username: {
      autoCorrect: false
    },
    email: {
      autoCorrect: false,
      error: "Don't miss out on all this Shade! Enter an email to stay connected."
    },
    password: {
      password: true,
      autoCorrect: false,
      autoCapitalize: 'none',
      secureTextEntry: true,
      error: "Enter your super secret password and check if someone's throwing Shade!"
    },
  },
};

const styles = StyleSheet.create({
  form:{
    paddingTop: 20,
    margin: 20,
  },
  text: {
    color: 'lightgrey',
    width: null,
    height: null,
  }
});

export default Register;
