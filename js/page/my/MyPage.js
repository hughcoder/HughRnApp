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
  TouchableHighlight,
  Image,
  Dimensions
} from "react-native";
import NavigationBar from "../../common/NavigationBar";
import HomePage from "../HomePage";
import { FLAG_LANGUAGE } from "../../expand/dao/LanguageDao";
import { MORE_MENU } from "../../common/MoreMenu";
import GlobalStyles from "../../../res/styles/GlobalStyles";
import ViewUtils from "../../util/ViewUtils";
import CustomKeyPage from "./CustomKeyPage";
import SortKeyPage from "./SortKeyPage";
const width = Dimensions.get("window").width;
export default class MyPage extends Component {
  constructor(props) {
    super(props);
  }

  onClick(tab) {
    let TargetComponent,
      flag = { ...this.props, menuType: tab };
    switch (tab) {
      case MORE_MENU.Custom_Language:
        TargetComponent = "CustomKeyPage";
        flag = FLAG_LANGUAGE.flag_language;
        break;
      case MORE_MENU.Custom_Key:
        TargetComponent = "CustomKeyPage";
        flag = FLAG_LANGUAGE.flag_key;
        break;
      case MORE_MENU.Remove_Key:
        TargetComponent = "CustomKeyPage";
        flag = FLAG_LANGUAGE.flag_key;
        break;
      case MORE_MENU.Sort_Language:
        TargetComponent = "SortKeyPage";
        flag = FLAG_LANGUAGE.flag_language;
        break;
      case MORE_MENU.Sort_Key:
        TargetComponent = "SortKeyPage";
        flag = FLAG_LANGUAGE.flag_key;
        break;
      case MORE_MENU.Custom_Theme:
        break;
      case MORE_MENU.About_Author:
        TargetComponent = "AboutMePage";
        break;
      case MORE_MENU.About:
        TargetComponent = "AboutPage";
        break;
    }
    if (TargetComponent != null) {
      this.props.navigation.navigate(TargetComponent, {
        flag: flag
      });
    }
  }

  getItem(tag, icon, text) {
    return ViewUtils.getSettingItem(
      () => this.onClick(tag),
      icon,
      text,
      { tintColor: "#2196F3" },
      null
    );
  }

  render() {
    let navigationBar = (
      <NavigationBar title="我的" style={{ backgroundColor: "#6495ED" }} />
    );

    return (
      <View style={GlobalStyles.root_container}>
        {navigationBar}
        <ScrollView style={{ flexDirection: "column" }}>
          <TouchableHighlight
            onPress={() => {
              this.onClick(MORE_MENU.About);
            }}
          >
            <View style={[styles.item, { height: 90 }]}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <Image
                  source={require("../../../res/images/ic_trending.png")}
                  style={[
                    { width: 40, height: 40, marginRight: 10 },
                    { tintColor: "#6495ED" }
                  ]}
                />
                <Text>GitHub popular</Text>
              </View>
              <Image
                source={require("../../../res/images/ic_tiaozhuan.png")}
                style={[
                  { marginRight: 10, width: 22, height: 22 },
                  { tintColor: "#6495ED" }
                ]}
              />
            </View>
          </TouchableHighlight>
          <View style={GlobalStyles.line} />
          {/*趋势管理*/}
          <Text style={styles.groupTitle}>趋势管理</Text>
          {/*自定义语言*/}
          <View style={GlobalStyles.line} />
          {this.getItem(
            MORE_MENU.Custom_Language,
            require("./img/ic_custom_language.png"),
            "自定义语言"
          )}
          {/*语言排序*/}
          <View style={GlobalStyles.line} />
          {this.getItem(
            MORE_MENU.Sort_Language,
            require("./img/ic_swap_vert.png"),
            "语言排序"
          )}
          {/*最热管理*/}
          <Text style={styles.groupTitle}>最热管理</Text>
          {/*自定义标签*/}
          <View style={GlobalStyles.line} />
          {this.getItem(
            MORE_MENU.Custom_Key,
            require("./img/ic_custom_language.png"),
            "自定义标签"
          )}
          {/*标签排序*/}
          <View style={GlobalStyles.line} />
          {this.getItem(
            MORE_MENU.Sort_Key,
            require("./img/ic_swap_vert.png"),
            "标签排序"
          )}
          {/*标签移除*/}
          <View style={GlobalStyles.line} />
          {this.getItem(
            MORE_MENU.Remove_Key,
            require("./img/ic_remove.png"),
            "标签移除"
          )}

          {/*设置*/}
          <Text style={styles.groupTitle}>设置</Text>
          {/*自定义主题*/}
          <View style={GlobalStyles.line} />
          {this.getItem(
            MORE_MENU.Custom_Theme,
            require("./img/ic_view_quilt.png"),
            "自定义主题"
          )}
          {/*关于作者*/}
          <View style={GlobalStyles.line} />
          {this.getItem(
            MORE_MENU.About_Author,
            require("./img/ic_insert_emoticon.png"),
            "关于作者"
          )}
        </ScrollView>
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
  item: {
    backgroundColor: "white",
    padding: 10,
    height: 60,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    width: width
  },
  groupTitle: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 5,
    fontSize: 12,
    color: "gray"
  }
});
