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
  Platform
} from "react-native";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import ViewUtils from "../../util/ViewUtils";
import {MORE_MENU} from '../../common/MoreMenu';
import GlobalStyles from "../../../res/styles/GlobalStyles";

export default class AboutPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onClick(tab) {
    let TargetComponent,
      isRemoveKey,
      flag = { ...this.props, menuType: tab };
    switch (tab) {
      case MORE_MENU.About_Author:

        break;
      case MORE_MENU.Website:

        break;
      case MORE_MENU.Feedback:

        break;

    }
    if (TargetComponent != null) {
      this.props.navigation.navigate(TargetComponent, {
        flag: flag,
        isRemoveKey: isRemoveKey
      });
    }
  }

  getParallaxRenderConfig(params) {
    let config = {};
    config.renderBackground = () => (
      <View key="background">
        <Image
          source={{
            uri: params.backgroundImg,
            width: window.width,
            height: PARALLAX_HEADER_HEIGHT
          }}
        />
        <View
          style={{
            position: "absolute",
            top: 0,
            width: window.width,
            backgroundColor: "rgba(0,0,0,.4)",
            height: PARALLAX_HEADER_HEIGHT
          }}
        />
      </View>
    );
    config.renderForeground = () => (
      <View key="parallax-header" style={styles.parallaxHeader}>
        <Image
          style={styles.avatar}
          source={{
            uri: params.avatar,
            width: AVATAR_SIZE,
            height: AVATAR_SIZE
          }}
        />
        <Text style={styles.sectionSpeakerText}>{params.name}</Text>
        <Text style={styles.sectionTitleText}>{params.description}</Text>
      </View>
    );
    config.renderStickyHeader = () => (
      <View key="sticky-header" style={styles.stickySection}>
        <Text style={styles.stickySectionText}>{params.name}</Text>
      </View>
    );
    config.renderFixedHeader = () => (
      <View key="fixed-header" style={styles.fixedSection}>
        {ViewUtils.getLeftButton(() => this.props.navigation.pop())}
      </View>
    );
    return config;
  }

  renderView(contentView,params) {
    let renderConfig = this.getParallaxRenderConfig(params);
    return (
      <ParallaxScrollView
        headerBackgroundColor="#333"
        backgroundColor="#2196F3"
        stickyHeaderHeight={STICKY_HEADER_HEIGHT}
        parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
        backgroundSpeed={10}
        {...renderConfig}
      >
      {contentView}
      </ParallaxScrollView>
    );
  }
  render() {
    let content=<View style={{flexDirection:'column'}}>
   {ViewUtils.getSettingItem(()=>this.onClick(MORE_MENU.About_Author),require('../../../res/images/ic_computer.png'),MORE_MENU.Website,{tintColor:'#2196F3'})}
   <View style={GlobalStyles.line} />
   {ViewUtils.getSettingItem(()=>this.onClick(MORE_MENU.Website),require('../my/img/ic_insert_emoticon.png'),MORE_MENU.Website,{tintColor:'#2196F3'})}
   <View style={GlobalStyles.line} />
   {ViewUtils.getSettingItem(()=>this.onClick(MORE_MENU.Feedback),require('../../../res/images/ic_feedback.png'),MORE_MENU.Feedback,{tintColor:'#2196F3'})}
   <View style={GlobalStyles.line} />
    </View>
    return this.renderView(content,{
      name: "GitHub Popular",
      description:
        "这是一个滴滴答答滴滴答答滴滴答答的描述这是一个滴滴答答滴滴答答滴滴答答的描述",
      avatar: "https://avatar.csdn.net/6/7/C/1_qq_38366777.jpg?1536042584",
      backgroundImg:
        "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1333646673,365823664&fm=26&gp=0.jpg"
    });
  }
}

const window = Dimensions.get("window");

const AVATAR_SIZE = 120;
const ROW_HEIGHT = 60;
const PARALLAX_HEADER_HEIGHT = 350;
const STICKY_HEADER_HEIGHT = 70;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black"
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    width: window.width,
    height: PARALLAX_HEADER_HEIGHT
  },
  stickySection: {
    height: STICKY_HEADER_HEIGHT,
    justifyContent: "center",
    alignItems: 'center',
    paddingTop: Platform.OS === "ios" ? 20 : 0
  },
  stickySectionText: {
    color: "white",
    fontSize: 20,
    margin: 10
  },
  fixedSection: {
    position: "absolute",
    bottom: 0,
    right:10,
    left: 0,
    top:0,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
    paddingTop: Platform.OS === "ios" ? 20 : 0
  },
  fixedSectionText: {
    color: "#999",
    fontSize: 20
  },
  parallaxHeader: {
    alignItems: "center",
    flex: 1,
    flexDirection: "column",
    paddingTop: 100
  },
  avatar: {
    marginBottom: 10,
    borderRadius: AVATAR_SIZE / 2
  },
  sectionSpeakerText: {
    color: "white",
    fontSize: 24,
    paddingVertical: 5
  },
  sectionTitleText: {
    color: "white",
    fontSize: 18,
    paddingVertical: 5
  },
  row: {
    overflow: "hidden",
    paddingHorizontal: 10,
    height: ROW_HEIGHT,
    backgroundColor: "white",
    borderColor: "#ccc",
    borderBottomWidth: 1,
    justifyContent: "center"
  },
  rowText: {
    fontSize: 20
  }
});
