/**
 * Created by penn on 2016/12/14.
 */

import React, { Component } from "react";
import { View, StyleSheet, Text, WebView } from "react-native";
import NavigationBar from "./js/common/NavigationBar";
const URL = 'https://www.baidu.com/';
export default class WebViewTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: URL
    };
  }

  render() {
    let what =
      this.state.what === "" ? "" : "我收到了女孩回赠的:" + this.state.what;
    return (
      <View style={styles.container}>
        <NavigationBar
          title="WebView使用"
          style={{ backgroundColor: "#6495ED" }}
        />
        <WebView source={{ uri: this.state.url }} 
        
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tips: {
    fontSize: 29
  }
});
