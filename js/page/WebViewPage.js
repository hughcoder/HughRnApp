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
import NavigationBar from "../common/NavigationBar";
import GlobalStyles from "../../res/styles/GlobalStyles";
import ViewUtils from "../util/ViewUtils";
const URL = "http://www.github.com/";
export default class WebViewPage extends Component {
  constructor(props) {
    super(props);
    const params = this.props.navigation.state.params.params;
    this.state = {
      url: params.url,
      title: params.title,
      canGoBack: false
    };
  }
  onBack() {
    if (this.state.canGoBack) {
      this.webview.goBack();
    } else {
      this.props.navigation.pop();
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
      url: e.url
    });
  }

  render() {
    return (
      <View style={GlobalStyles.root_container}>
        <NavigationBar
          title={this.state.title}
          style={{ backgroundColor: "#6495ED" }}
          leftButton={ViewUtils.getLeftButton(() => {
            this.onBack();
          })}
        />
        <WebView
          ref={webview => (this.webview = webview)}
          source={{ uri: this.state.url }}
          onNavigationStateChange={e => {
            this.onNavigationStateChange(e);
          }}
        />
      </View>
    );
  }
}
