/**
 * Created by penn on 2016/12/14.
 */

import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert
} from "react-native";
import NavigationBar from "../../common/NavigationBar";
import HomePage from "../HomePage";
import ViewUtils from "../../util/ViewUtils";
import NavigatorUtil from "../../util/NavigatorUtil";
import LanguageDao from "../../expand/dao/LanguageDao";
import { FLAG_LANGUAGE } from "../../expand/dao/LanguageDao";
import CheckBox from "react-native-check-box";
import ArrayUtils from "../../util/ArrayUtils";
export default class CustomKeyPage extends Component {
  constructor(props) {
    super(props);
    this.changeValues = [];
    this.isRemoveKey = this.props.navigation.state.params.isRemoveKey;
    this.state = {
      dataArray: [],
      flag: this.props.navigation.state.params.flag
    };
  }
  componentDidMount() {
    this.languageDao = new LanguageDao(this.state.flag);
    this.loadData();
  }

  loadData() {
    this.languageDao
      .fetch()
      .then(result => {
        this.setState({ dataArray: result });
      })
      .catch(error => {
        console.warn(error);
      });
  }
  onSave() {
    if (this.changeValues.length === 0) {
      this.props.navigation.pop();
      return;
    }
    if (this.isRemoveKey) {
      for (let i = 0, l = this.changeValues.length; i < l; i++) {
        ArrayUtils.remove(this.state.dataArray, this.changeValues[i]);
      }
    }
    this.languageDao.save(this.state.dataArray);
    this.props.navigation.pop();
  }
  renderView() {}
  onBack() {
    if (this.changeValues.length === 0) {
      this.props.navigation.pop();
      return;
    } else {
      Alert.alert(
        "提示",
        "要保存修改吗？",
        [
          { text: "不保存", onPress: () => this.props.navigation.pop() },
          {
            text: "保存",
            onPress: () => {
              this.onSave();
            }
          }
        ],
        { cancelable: false }
      );
    }
  }
  renderView() {
    if (!this.state.dataArray || this.state.dataArray.length === 0) {
      return null;
    } else {
      let len = this.state.dataArray.length;
      let views = [];
      for (let i = 0, l = len - 2; i < l; i += 2) {
        views.push(
          <View key={i}>
            <View style={styles.item}>
              {this.renderCheckBox(this.state.dataArray[i])}
              {this.renderCheckBox(this.state.dataArray[i + 1])}
            </View>
            <View style={styles.line} />
          </View>
        );
      }
      views.push(
        <View key={len - 1}>
          <View style={styles.item}>
            {len % 2 === 0
              ? this.renderCheckBox(this.state.dataArray[len - 2])
              : null}
            {this.renderCheckBox(this.state.dataArray[len - 1])}
          </View>
          <View style={styles.line} />
        </View>
      );
      return views;
    }
  }
  onClick(data) {
    if (!this.isRemoveKey) data.checked = !data.checked;
    ArrayUtils.updateArray(this.changeValues, data);
  }
  renderCheckBox(data) {
    let leftText = data.name;
    let isChecked = this.isRemoveKey ? false : data.checked;
    return (
      <CheckBox
        onClick={() => this.onClick(data)}
        style={{ flex: 1, padding: 10 }}
        leftText={leftText}
        isChecked={isChecked}
        checkedImage={
          <Image
            source={require("./img/ic_check_box.png")}
            style={{ tintColor: "#6495ED" }}
          />
        }
        unCheckedImage={
          <Image
            source={require("./img/ic_check_box_outline_blank.png")}
            style={{ tintColor: "#6495ED" }}
          />
        }
      />
    );
  }

  render() {
    let right = this.isRemoveKey ? "移除" : "保存";
    let rightButton = (
      <TouchableOpacity onPress={() => this.onSave()}>
        <View style={{ margin: 10 }}>
          <Text style={styles.title}>{right}</Text>
        </View>
      </TouchableOpacity>
    );
    let title = this.isRemoveKey ? "标签移除" : "自定义标签";
    title =
      this.props.navigation.state.params.flag === FLAG_LANGUAGE.flag_language
        ? "自定义语言"
        : title;
    return (
      <View style={styles.container}>
        <NavigationBar
          title={title}
          style={{ backgroundColor: "#6495ED" }}
          leftButton={ViewUtils.getLeftButton(() => {
            this.onBack();
          })}
          rightButton={rightButton}
        />
        <ScrollView>{this.renderView()}</ScrollView>
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
  title: {
    fontSize: 20,
    color: "white"
  },
  line: {
    height: 0.3,
    backgroundColor: "darkgray"
  },
  item: {
    flexDirection: "row",
    alignItems: "center"
  }
});
