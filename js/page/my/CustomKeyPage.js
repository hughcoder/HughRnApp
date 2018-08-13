/**
 * Created by penn on 2016/12/14.
 */

import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView
} from "react-native";
import NavigationBar from "../../common/NavigationBar";
import HomePage from "../HomePage";
import ViewUtils from "../../util/ViewUtils";
import NavigatorUtil from "../../util/NavigatorUtil";
import LanguageDao from "../../expand/dao/LanguageDao";
import { FLAG_LANGUAGE } from "../../expand/dao/LanguageDao";
import  CheckBox from 'react-native-check-box'
export default class CustomKeyPage extends Component {
  constructor(props) {
    super(props);
    this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
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
  onSave() {}
  renderView() {}
  onBack() {
    this.props.navigation.pop();
  }
  renderView() {
    if (!this.state.dataArray || this.state.dataArray.length === 0) {
      return null;
    } else {
      let len = this.state.dataArray.length;
      console.warn(len);
      let views = [];
      for (let i = 0, l = len - 2; i < l; i += 2) {
        console.warn("-->", i);
        views.push(
          <View key={i}>
            <View style={styles.item}>
              <Text>{this.state.dataArray[i].name}</Text>
              <Text>{this.state.dataArray[i + 1].name}</Text>
            </View>
            <View style={styles.line} />
          </View>
        );
      }
      views.push(
        <View key={len - 1}>
          <View style={styles.item}>
            {len % 2 === 0 ? (
              <Text>{this.state.dataArray[len - 2].name}</Text>
            ) : null}
            <Text>{this.state.dataArray[len - 1].name}</Text>
          </View>
          <View style={styles.line} />
        </View>
      );
      return views;
    }
  }
  renderCheckBox(data){
    // let leftText=data.name;
    // return(
    //   <CheckBox onClick={()=>this.onClick(data)}
    //    leftText={leftText}
    //    checkedImage={<Image source={}/>}
    //   />
    // )
  }

  render() {
    let rightButton = (
      <TouchableOpacity onPress={() => this.onSave}>
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
    height: 1,
    backgroundColor: "black"
  },
  item: {
    flexDirection: "row",
    alignItems: "center"
  }
});
