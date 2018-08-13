/**
 * Created by penn on 2016/12/14.
 */

import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  AsyncStorage,
  TextInput,
  Button,
  TouchableOpacity
} from "react-native";
import Girl from "./Girl";
import NavigationBar from "./js/common/NavigationBar";
import Toast, { DURATION } from "react-native-easy-toast";
const KEY = "test";
export default class AsyncStorageText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      what: ""
    };
  }
  onSave() {
    AsyncStorage.setItem(KEY, this.text, error => {
      if (!error) {
        this.toast.show("保存成功", DURATION.LENGTH_LONG);
      } else {
        this.toast.show("保存失败", DURATION.LENGTH_LONG);
      }
    });
  }
  onRemove() {
    AsyncStorage.removeItem(KEY,(error)=>{
      if (!error) {
        this.toast.show("移除成功", DURATION.LENGTH_LONG);
      } else {
        this.toast.show("移除失败", DURATION.LENGTH_LONG);
      }
    })
  }
  onFetch() {
    AsyncStorage.getItem(KEY, (error, result) => {
      if (!error) {
        if (result !== ""&&result!==null) {
          this.toast.show("取出的内容为" + result);
        }else{
          this.toast.show('key不存在');
        }
      } else {
        this.toast.show("去除失败" + result);
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          title="AsyncStorageText"
          style={{ backgroundColor: "#6495ED" }}
        />
        <TextInput
          style={{ borderWidth: 1, height: 40, margin: 6 }}
          onChangeText={text => (this.text = text)}
        />
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={() => this.onSave()}>
            <Text style={styles.tips}>保存</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.onRemove()}>
            <Text style={styles.tips}>移除</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.onFetch()}>
            <Text style={styles.tips}>取出</Text>
          </TouchableOpacity>
        </View>
        <Toast ref={toast => (this.toast = toast)} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tips: {
    fontSize: 29,
    margin: 5
  }
});
