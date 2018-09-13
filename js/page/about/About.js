import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  TouchableHighlight,
  Image,
  Dimensions,
  ListView,
  Platform,
  Linking
} from "react-native";
import ViewUtils from "../../util/ViewUtils";
import { MORE_MENU } from "../../common/MoreMenu";
import GlobalStyles from "../../../res/styles/GlobalStyles";
import AboutCommon, { FLAG_ABOUT } from "./AboutCommon";
import config from "../../../res/data/config.json";
import WebViewPage from "../WebViewPage";
export default class AboutPage extends Component {
  constructor(props) {
    super(props);
    this.aboutCommon = new AboutCommon(
      props,
      dic => this.updateState(dic),
      FLAG_ABOUT.flag_about,
      config
    );
    this.state = {
      projectModels: []
    };
  }

  componentDidMount() {
    this.aboutCommon.componentDidMount();
  }

  updateState(dic) {
    this.setState(dic);
  }
  onClick(tab) {
    let TargetComponent,
      params = { menuType: tab };
    switch (tab) {
      case MORE_MENU.About_Author:
        TargetComponent = "AboutMePage";
        break;
      case MORE_MENU.Website:
        TargetComponent = "WebViewPage";
        params.url = "https://hughcoder.github.io/";
        params.title = "个人博客";
        break;
      case MORE_MENU.Feedback:
        let url = "mailto://849978368@qq.com";
        Linking.canOpenURL(url)
          .then(supported => {
            if (!supported) {
              console.log("Can't handle url: " + url);
            } else {
              return Linking.openURL(url);
            }
          })
          .catch(err => console.error("An error occurred", err));
        break;
    }
    if (TargetComponent != null) {
      this.props.navigation.navigate(TargetComponent, {
        params: params
      });
    }
  }

  // renderView(contentView, params) {
  //   let renderConfig = this.getParallaxRenderConfig(params);
  //   return (
  //     <ParallaxScrollView
  //       headerBackgroundColor="#333"
  //       backgroundColor="#2196F3"
  //       stickyHeaderHeight={STICKY_HEADER_HEIGHT}
  //       parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
  //       backgroundSpeed={10}
  //       {...renderConfig}
  //     >
  //       {contentView}
  //     </ParallaxScrollView>
  //   );
  // }
  render() {
    // console.warn('--->',this.state.projectModels)
    let content = (
      <View style={{ flexDirection: "column" }}>
        {this.aboutCommon.renderRepository(this.state.projectModels)}
        {ViewUtils.getSettingItem(
          () => this.onClick(MORE_MENU.About_Author),
          require("../../../res/images/ic_computer.png"),
          MORE_MENU.About_Author,
          { tintColor: "#2196F3" }
        )}
        <View style={GlobalStyles.line} />
        {ViewUtils.getSettingItem(
          () => this.onClick(MORE_MENU.Website),
          require("../my/img/ic_insert_emoticon.png"),
          MORE_MENU.Website,
          { tintColor: "#2196F3" }
        )}
        <View style={GlobalStyles.line} />
        {ViewUtils.getSettingItem(
          () => this.onClick(MORE_MENU.Feedback),
          require("../../../res/images/ic_feedback.png"),
          MORE_MENU.Feedback,
          { tintColor: "#2196F3" }
        )}
        <View style={GlobalStyles.line} />
      </View>
    );
    return this.aboutCommon.render(content, {
      name: "HughRnApp",
      description:
        "这是一个滴滴答答滴滴答答滴滴答答的描述这是一个滴滴答答滴滴答答滴滴答答的描述",
      avatar: "https://avatar.csdn.net/6/7/C/1_qq_38366777.jpg?1536042584",
      backgroundImg:
        "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1333646673,365823664&fm=26&gp=0.jpg"
    });
  }
}

const AVATAR_SIZE = 120;
const ROW_HEIGHT = 60;
const PARALLAX_HEADER_HEIGHT = 350;
const STICKY_HEADER_HEIGHT = 70;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black"
  }
});
