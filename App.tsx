/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Connection, Queue, Exchange } from 'react-native-rabbitmq';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\nCmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\nShake or press menu button for dev menu',
});

type Props = {};

export default class App extends Component<Props> {

  constructor(props) {
    super(props)
  }

  componentWillMount() {

    const config = {
      host: '10.0.2.2',
      port: 5672,
      username: 'guest',
      password: 'guest',
      virtualhost: '/'
    };

    let connection = new Connection(config)
    connection.connect()

    let connected = false;
    let queue;
    let exchange;

    connection.on('connected', (event) => {

      console.log("CONNECTION SUCCESSFUL!");

      queue = new Queue(connection, {
        name: 'queue_name',
        passive: false,
        durable: true,
        exclusive: false,
        consumer_arguments: { 'x-priority': 1 }
      });

      exchange = new Exchange(connection, {
        name: 'exchange_name',
        type: 'direct',
        durable: true,
        autoDelete: false,
        internal: false
      });

      queue.bind(exchange, 'queue_name');

    });

    connection.on('error', event => {

      connected = false;
      console.log("FAILED TO CONNECT!");
      console.log(connection);
      console.log(event);
    });

  }

  render() {

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit App.js
        </Text>
        <Text style={styles.instructions}>
          {instructions}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});