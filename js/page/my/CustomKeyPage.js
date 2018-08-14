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
  Image
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
    this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
    this.changeValues = []
    this.state = {
      dataArray: []
    };
  }
  componentDidMount() {
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
    this.languageDao.save(this.state.dataArray);
    this.props.navigation.pop();
  }
  renderView() {}
  onBack() {
    this.props.navigation.pop();
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
    data.checked = !data.checked;
    ArrayUtils.updateArray(this.changeValues, data);
  }
  renderCheckBox(data) {
    let leftText = data.name;
    return (
      <CheckBox
        onClick={() => this.onClick(data)}
        style={{ flex: 1, padding: 10 }}
        leftText={leftText}
        isChecked={data.checked}
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
    let rightButton = (
      <TouchableOpacity onPress={() => this.onSave()}>
        <View style={{ margin: 10 }}>
          <Text style={styles.title}>保存</Text>
        </View>
      </TouchableOpacity>
    );
    return (
      <View style={styles.container}>
        <NavigationBar
          title="欢迎"
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
