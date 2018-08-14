/**
 * Created by penn on 2016/12/14.
 */

import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  WebView,
  TouchableOpacity,
  TextInput,
  DeviceEventEmitter
} from "react-native";
import NavigationBar from "./js/common/NavigationBar";
const URL = "http://www.github.com/";
export default class WebViewTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: URL,
      title: "",
      canGoBack: false
    };
  }
  onBack() {
    if (this.state.canGoBack) {
      this.webview.goBack();
      console.warn('----->')
    }else{
      DeviceEventEmitter.emit('showToast','到顶了')
    }
  }
  go() {
    this.setState({
      url: this.text
    });
    console.warn("---->", this.state.url);
  }
  onNavigationStateChange(e) {
    this.setState({
      canGoBack: e.canGoBack,
      title: e.title
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          title="WebView使用"
          style={{ backgroundColor: "#6495ED" }}
        />
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => {
              this.onBack();
            }}
          >
            <Text style={{ fontSize: 20 }}>返回</Text>
          </TouchableOpacity>
          <TextInput
            style={{ height: 40, flex: 1, borderWidth: 1, margin: 2 }}
            defaultValue={URL}
            onChangeText={text => (this.text = text)}
          />
          <TouchableOpacity
            onPress={() => {
              this.go();
            }}
          >
            <Text style={{ fontSize: 20 }}>前往</Text>
          </TouchableOpacity>
        </View>
        <WebView
          ref={webview => this.webview = webview}
          source={{ uri: this.state.url }}
          onNavigationStateChange={e => {
            this.onNavigationStateChange(e);
          }}
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
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10
  }
});
