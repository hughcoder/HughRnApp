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
import ViewUtils from "../util/ViewUtils";
const URL = "http://www.github.com/";
const TRENDING_URL = "https://github.com/";
export default class RepositoryDetail extends Component {
  constructor(props) {
    super(props);
    let item = this.props.navigation.state.params.projectModel.item;
    this.url = this.props.navigation.state.params.projectModel.item.html_url
      ? item.html_url
      : TRENDING_URL+item.fullName;
    let title = this.props.navigation.state.params.projectModel.item.full_name
      ? item.full_name
      : item.fullName;
    this.state = {
      url: this.url,
      title: title,
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
      <View style={styles.container}>
        <NavigationBar
          title={this.state.title}
          style={{ backgroundColor: "#6495ED" }}
          leftButton={ViewUtils.getLeftButton(() => {
            this.onBack();
          })}
        />
        {/* <View style={styles.row}>
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
        </View> */}
        <WebView
          ref={webview => (this.webview = webview)}
          source={{ uri: this.state.url }}
          onNavigationStateChange={e => {
            this.onNavigationStateChange(e);
          }}
          startInLoadingState={true}
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
