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
  Linking,
  Clipboard
} from "react-native";
import ViewUtils from "../../util/ViewUtils";
import { MORE_MENU } from "../../common/MoreMenu";
import GlobalStyles from "../../../res/styles/GlobalStyles";
import AboutCommon, { FLAG_ABOUT } from "./AboutCommon";
import config from "../../../res/data/config.json";
import WebViewPage from "../WebViewPage";
import Toast, { DURATION } from "react-native-easy-toast";
const FLAG = {
  REPOSITORY: "开源项目",
  BLOG: {
    name: "技术博客",
    items: {
      PERSONAL_BLOG: {
        title: "个人博客",
        account: "https://hughcoder.github.io/"
      },
      CSDN: {
        title: "CSDN",
        account: "https://blog.csdn.net/qq_38366777"
      },
      JIANSHU: {
        title: "简书",
        account: "https://blog.csdn.net/qq_38366777"
      },
      GITHUB: {
        title: "GitHub",
        account: "https://github.com/hughcoder"
      }
    }
  },
  CONTACT: {
    name: "联系方式",
    items: {
      QQ: {
        title: "QQ",
        account: "849978368"
      },
      Email: {
        title: "Email",
        account: "849978368@qq.com"
      }
    }
  },
  QQ: {
    name: "技术交流群",
    items: {
      MD: {
        title: "aa",
        account: "123"
      },
      RN: {
        title: "React Native",
        account: "12321"
      }
    }
  }
};
export default class AboutMePage extends Component {
  constructor(props) {
    super(props);
    this.aboutCommon = new AboutCommon(
      props,
      dic => this.updateState(dic),
      FLAG_ABOUT.flag_about,
      config
    );
    this.state = {
      projectModels: [],
      author: config.author,
      showRepository: false,
      showBlog: false,
      showQQ: false,
      showContact: false
    };
  }

  componentDidMount() {
    this.aboutCommon.componentDidMount();
  }

  updateState(dic) {
    this.setState(dic);
  }

  /**
   * 获取item右侧图标
   * @param {*} isShow
   */
  getClickIcon(isShow) {
    return isShow
      ? require("../../../res/images/ic_tiaozhuan_up.png")
      : require("../../../res/images/ic_tiaozhuan_down.png");
  }

  onClick(tab) {
    let TargetComponent,
      params = { menuType: tab };
    switch (tab) {
      case FLAG.BLOG.items.CSDN:
      case FLAG.BLOG.items.GITHUB:
      case FLAG.BLOG.items.JIANSHU:
      case FLAG.BLOG.items.PERSONAL_BLOG:
        TargetComponent = "WebViewPage";
        let newUrl = tab.account;
        params.url = newUrl;
        params.title = "个人博客";
        break;
        break;
      case FLAG.REPOSITORY:
        this.updateState({ showRepository: !this.state.showRepository });
        break;
      case FLAG.BLOG:
        this.updateState({ showBlog: !this.state.showBlog });
        break;
      case FLAG.QQ:
        this.updateState({ showQQ: !this.state.showQQ });
        break;
      case FLAG.CONTACT:
        this.updateState({ showContact: !this.state.showContact });
        break;
      case FLAG.CONTACT.items.QQ:
        Clipboard.setString(tab.account);
        this.toast.show("QQ:" + tab.account + "已复制到剪贴板");
      case FLAG.CONTACT.items.Email:
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

  /**
   * 显示列表数据
   * @param {*} dic
   * @param {*} isShowAccount
   */
  renderItems(dic, isShowAccount) {
    if (!dic) return;
    let views = [];
    for (let i in dic) {
      let title = dic[i].title + ":" + dic[i].account;
      views.push(
        <View key={i}>
          {ViewUtils.getSettingItem(() => this.onClick(dic[i]), "", title, {
            tintColor: "#2196F3"
          })}
          <View style={GlobalStyles.line} />
        </View>
      );
    }

    return views;
  }

  render() {
    let content = (
      <View style={{ flexDirection: "column" }}>
        {ViewUtils.getSettingItem(
          () => this.onClick(FLAG.BLOG),
          require("../../../res/images/ic_computer.png"),
          FLAG.BLOG.name,
          { tintColor: "#2196F3" },
          this.getClickIcon(this.state.showBlog)
        )}
        <View style={GlobalStyles.line} />
        {this.state.showBlog
          ? this.renderItems(FLAG.BLOG.items, this.state.showBlog)
          : null}

        {ViewUtils.getSettingItem(
          () => this.onClick(FLAG.REPOSITORY),
          require("../../../res/images/ic_code.png"),
          FLAG.REPOSITORY,
          { tintColor: "#2196F3" },
          this.getClickIcon(this.state.showRepository)
        )}
        <View style={GlobalStyles.line} />
        {this.state.showRepository
          ? this.aboutCommon.renderRepository(this.state.projectModels)
          : null}

        {ViewUtils.getSettingItem(
          () => this.onClick(FLAG.QQ),
          require("../../../res/images/ic_computer.png"),
          FLAG.QQ.name,
          { tintColor: "#2196F3" },
          this.getClickIcon(this.state.showQQ)
        )}
        <View style={GlobalStyles.line} />
        {this.state.showQQ ? this.renderItems(FLAG.QQ.items) : null}

        {ViewUtils.getSettingItem(
          () => this.onClick(FLAG.CONTACT),
          require("../../../res/images/ic_computer.png"),
          FLAG.CONTACT.name,
          { tintColor: "#2196F3" },
          this.getClickIcon(this.state.showContact)
        )}
        <View style={GlobalStyles.line} />
        {this.state.showContact ? this.renderItems(FLAG.CONTACT.items) : null}
      </View>
    );
    return (
      <View style={styles.container}>
        {this.aboutCommon.render(content, this.state.author)}
        <Toast ref={e => (this.toast = e)} />
      </View>
    );
  }
}

const AVATAR_SIZE = 120;
const ROW_HEIGHT = 60;
const PARALLAX_HEADER_HEIGHT = 350;
const STICKY_HEADER_HEIGHT = 70;

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
