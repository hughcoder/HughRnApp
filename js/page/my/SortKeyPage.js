/**
 * Created by penn on 2016/12/14.
 */

import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Alert
} from "react-native";
import NavigationBar from "../../common/NavigationBar";
import HomePage from "../HomePage";
import LanguageDao, { FLAG_LANGUAGE } from "../../expand/dao/LanguageDao";
import ArrayUtils from "../../util/ArrayUtils";
import SortableListView from "react-native-sortable-listview";
import ViewUtils from "../../util/ViewUtils";
export default class SortKeyPage extends Component {
  constructor(props) {
    super(props);
    this.dataArray = []; //从数据库当中读取的所有标签的数组 a,b,c,d,e,f
    this.originalCheckedArray = []; //已经订阅的标签筛选出来(筛选后的数组) a,c,e
    this.sortResultArray = []; //排序之后新生成的所有标签的数组
    this.state = {
      checkedArray: []  //对筛选后的数据进行排序 c,e,a
    };
    //记录下上一个标签排序的顺序
  }
  componentDidMount() {
    this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
    this.loadData();
  }
  loadData() {
    this.languageDao
      .fetch()
      .then(result => {
        //筛选出用户已经订阅的标签
        this.getCheckedItems(result);
      })
      .catch(err => {
        console.warn(err);
      });
  }
  getCheckedItems(result) {
    this.dataArray = result;
    let checkedArray = [];
    for (let i = 0, len = result.length; i < len; i++) {
      let data = result[i];
      if (data.checked) {
        checkedArray.push(data);
      }
    }
    this.setState({
      checkedArray: checkedArray
    });
    this.originalCheckedArray = ArrayUtils.clone(checkedArray);
  }
  onBack() {
    if (
      ArrayUtils.isEqual(this.originalCheckedArray, this.state.checkedArray)
    ) {
      this.props.navigation.pop();
      return;
    }
    Alert.alert(
      "提示",
      "要保存修改吗？",
      [
        { text: "不保存", onPress: () => this.props.navigation.pop() },
        {
          text: "保存",
          onPress: () => {
            this.onSave(true);
          }
        }
      ],
      { cancelable: false }
    );
  }
  onSave(isChecked) {
    if (
      !isChecked &&
      ArrayUtils.isEqual(this.originalCheckedArray, this.state.checkedArray)
    ) {
      this.props.navigation.pop();
      return;
    }
    this.getSortResult();
    this.languageDao.save(this.sortResultArray);
    this.props.navigation.pop();
  }
  getSortResult() {
    this.sortResultArray = ArrayUtils.clone(this.dataArray);
    for (let i = 0, l = this.originalCheckedArray.length; i < l; i++) {
      let item = this.originalCheckedArray[i];
      let index = this.dataArray.indexOf(item);
      this.sortResultArray.splice(index, 1, this.state.checkedArray[i]);//获取排序前数字的索引位置，用新的去替换这个位置
    }
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
          title="自定义标签"
          style={{ backgroundColor: "#6495ED" }}
          leftButton={ViewUtils.getLeftButton(() => {
            this.onBack();
          })}
          rightButton={rightButton}
        />
        <SortableListView
          style={{ flex: 1 }}
          data={this.state.checkedArray}
          order={Object.keys(this.state.checkedArray)}
          onRowMoved={e => {
            this.state.checkedArray.splice(
              e.to,
              0,
              this.state.checkedArray.splice(e.from, 1)[0]);
            this.forceUpdate();
          }}
          renderRow={row => <SortCell data={row} />}
        />
      </View>
    );
  }
}
class SortCell extends Component {
  render() {
    return (
      <TouchableHighlight
        underlayColor={"#eee"}
        style={styles.item}
        {...this.props.sortHandlers}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={require("../my/img/ic_sort.png")}
            style={{
              tintColor: "#2196F3",
              width: 16,
              height: 18,
              marginRight: 10
            }}
          />
          <Text>{this.props.data.name}</Text>
        </View>
      </TouchableHighlight>
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
  item: {
    padding: 15,
    backgroundColor: "#F8F8F8",
    borderBottomWidth: 1,
    borderColor: "#eee"
  },
  title: {
    color: "white",
    fontSize: 18
  }
});
