/**
 * Popover 还没弄之后再看看吧
 */

import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  Navigator,
  Image,
  View,
  TextInput,
  ListView,
  RefreshControl,
  DeviceEventEmitter,
  TouchableOpacity
} from "react-native";

import DataRepository, { FLAG_STORAGE } from "../expand/dao/DataRepository";
import TabNavigator from "react-native-tab-navigator";
import NavigationBar from "../common/NavigationBar";
import RepositoryCell from "../common/RepositoryCell";
import TrendingCeil from "../common/TrendingCeil";
import ScrollableTabView, {
  ScrollableTabBar
} from "react-native-scrollable-tab-view";
import LanguageDao, { FLAG_LANGUAGE } from "../expand/dao/LanguageDao";
import TimeSpan from "../model/TimeSpan";
import Popover from "../common/Popover";
const URL = "https://github.com/trending/";
var timeSpanTextArray = [
  new TimeSpan("今 天", "since=daily"),
  new TimeSpan("本 周", "since=weekly"),
  new TimeSpan("本 月", "since=monthly")
];

export default class TrendingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: "",
      languages: [],
      isVisible: false,
      buttonRect: {}
    };
    this.dataRepository = new DataRepository(FLAG_STORAGE.flag_trending);
    this.LanguageDao = new LanguageDao(FLAG_LANGUAGE.flag_language);
  }
  componentDidMount() {
    this.loadLanguage();
  }

  loadLanguage() {
    this.LanguageDao.fetch()
      .then(languages => {
        if (languages) {
          this.setState({
            languages: languages
          });
        }
      })
      .catch(error => {});
  }

  showPopover() {
    this.refs.button.measure((ox, oy, width, height, px, py) => {
      this.setState({
        isVisible: true,
        buttonRect: { x: px, y: py, width: width, height: height }
      });
    });
  }

  renderTitleView() {
    return (
      <View>
        <TouchableOpacity ref="button" onPress={() => this.showPopover()}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontSize: 18,
                color: "white",
                fontWeight: "400"
              }}
            >
              趋势
            </Text>
            <Image
              style={{ width: 12, height: 12, marginLeft: 5 }}
              source={require("../../res/images/ic_spinner_triangle.png")}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    let content =
      this.state.languages.length > 0 ? (
        <ScrollableTabView
          tabBarUnderlineStyle={{ backgroundColor: "#e7e7e7", height: 2 }}
          tabBarInactiveTextColor="mintcream"
          tabBarActiveTextColor="white"
          ref="scrollableTabView"
          tabBarBackgroundColor="#2196F3"
          initialPage={0}
          renderTabBar={() => (
            <ScrollableTabBar
              style={{ height: 40, borderWidth: 0, elevation: 2 }}
              tabStyle={{ height: 39 }}
            />
          )}
        >
          {this.state.languages.map((reuslt, i, arr) => {
            let language = arr[i];
            return language.checked ? (
              <TrendingTab key={i} tabLabel={language.name} {...this.props} />
            ) : null;
          })}
        </ScrollableTabView>
      ) : null;
    let timeSpanView = (
      <Popover
        isVisible={this.state.isVisible}
        fromRect={this.state.buttonRect}
        onClose={this.closePopover}
      >
        <Text>I'm the content of this popover!</Text>
      </Popover>
    );
    return (
      <View style={styles.container}>
        <NavigationBar
          title="趋势"
          style={{ backgroundColor: "#2196F3" }}
          statusBar={{ backgroundColor: "#2196F3" }}
          titleView={this.renderTitleView()}
        />
        {content}
        {timeSpanView}
      </View>
    );
  }
}

class TrendingTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: "",
      isLoading: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => {
          r1 !== r2;
        }
      })
    };
    this.dataRepository = new DataRepository(FLAG_STORAGE.flag_trending);
  }
  componentDidMount() {
    this.loadData();
  }

  genFetchUrl(timeSpan, category) {
    return URL + category + timeSpan.searchText;
  }

  loadData() {
    this.setState({
      isLoading: true
    });
    let url = URL + this.props.tabLabel + "?since=daily";
    console.warn("url", url);
    this.dataRepository
      .fetchRepository(url)
      .then(result => {
        let item = result && result.items ? result.items : result ? result : []; //!!!!!!
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(result.items),
          isLoading: false
        });
        if (
          result &&
          result.updata_data &&
          !this.dataRepository.checkData(result.updata_data)
        ) {
          DeviceEventEmitter.emit("showToast", "数据过时");
          return this.dataRepository.fetchNetRepository(url);
        } else {
          DeviceEventEmitter.emit("showToast", "显示缓存数据");
        }
      })
      .then(items => {
        if (!items || items.length === 0) return;
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(items)
        });
        DeviceEventEmitter.emit("showToast", "显示网络数据");
      })
      .catch(error => {
        console.warn("err", error);
      });
  }
  onSelect(item) {
    this.props.navigation.navigate("RepositoryDetail", {
      item: item
    });
  }
  renderRow(data) {
    console.log("----->", data);
    return (
      <TrendingCeil
        data={data}
        key={data.id}
        onSelect={() => this.onSelect(data)}
      />
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={data => this.renderRow(data)}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isLoading}
              onRefresh={() => this.loadData()}
              colors={["#2196F3"]}
              tintColor={"#2196F3"}
              title={"Loading"}
              titleColor={"#2196F3"}
            />
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  image: {
    height: 22,
    width: 22
  },
  tips: {
    fontSize: 29
  }
});
