/**
 * Created by penn on 2016/12/14.
 */

import React, { Component } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import NavigationBar from "../../common/NavigationBar";
import HomePage from "../HomePage";
import { FLAG_LANGUAGE } from "../../expand/dao/LanguageDao";
export default class MyPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          title="自定义标签"
          style={{ backgroundColor: "#6495ED" }}
        />
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("CustomKeyPage", {
              isRemoveKey: false,
              flag: FLAG_LANGUAGE.flag_key
            });
          }}
        >
          <Text style={styles.tips}>自定义标签</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("CustomKeyPage", {
              isRemoveKey: false,
              flag: FLAG_LANGUAGE.flag_language
            });
          }}
        >
          <Text style={styles.tips}>自定义语言</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("SortKeyPage", {
              flag: FLAG_LANGUAGE.flag_key
            });
          }}
        >
          <Text style={styles.tips}>标签排序页</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("SortKeyPage", {
              flag: FLAG_LANGUAGE.flag_language
            });
          }}
        >
          <Text style={styles.tips}>语言排序页</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("CustomKeyPage", {
              isRemoveKey: true
            });
          }}
        >
          <Text style={styles.tips}>标签移除接口</Text>
        </TouchableOpacity>
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
