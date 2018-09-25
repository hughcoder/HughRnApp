/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
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
  Platform,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import RepositoryCell from "../common/RepositoryCell";
import Toast, { DURATION } from "react-native-easy-toast";
import ViewUtils from "../util/ViewUtils";
import GlobalStyles from "../../res/styles/GlobalStyles";
import NavigationBar from "../common/NavigationBar";
import DataRepository, { FLAG_STORAGE } from "../expand/dao/DataRepository";
import ProjectModel from "../model/ProjectModel";
import LanguageDao, { FLAG_LANGUAGE } from "../expand/dao/LanguageDao";
import FavoriteDao from "../expand/dao/FavoriteDao";
import Utils from "../util/Utils";
import makeCancelable from "../util/Cancelable";
const URL = "https://api.github.com/search/repositories?q=";
const QUERY_STR = "&sort=stars";

export default class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
    this.dataRepository = new DataRepository(FLAG_STORAGE.flag_popular);
    this.favoriteKeys = [];
    this.keys = [];
    this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
    this.isKeyChange = false;
    this.state = {
      rightButtonText: "搜索",
      isLoading: false,
      showBottomButton: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => {
          r1 !== r2;
        }
      })
    };
  }
  componentDidMount() {
    this.initKeys();
  }
  componentWillUnmount() {
    if (this.isKeyChange) {
      DeviceEventEmitter.emit("ACTION_HOME", ACTION_HOME.A_RESTART);
    }
    this.cancelable && this.cancelable.cancel();
  }

  /**
   * 获取所以标签 同步方法去调用
   */
  async initKeys() {
    this.keys = await this.languageDao.fetch();
  }

  loadData() {
    this.updateState({
      isLoading: true,
      showBottomButton: false
    });
    this.cancelable = makeCancelable(
      this.dataRepository.fetchNetRepository(this.genFetchUrl(this.inputKey))
    );

    this.cancelable.promise
      .then(responseData => {
        if (!this || !responseData || responseData.length === 0) {
          this.toast.show(this.inputKey + "什么都没找到", DURATION.LENGTH_LONG);
          this.updateState({ isLoading: false, rightButtonText: "搜索" });
          return;
        }
        this.items = responseData;
        this.getFavoriteKeys();
      })
      .catch(e => {
        this.updateState({
          isLoading: false,
          rightButtonText: "搜索",
          showBottomButton: false
        });
      });
  }

  genFetchUrl(key) {
    return URL + key + QUERY_STR;
  }

  onBackPress() {
    this.refs.input.blur();
    this.props.navigation.pop();
  }

  updateState(dic) {
    this.setState(dic);
  }

  getFavoriteKeys() {
    this.updateState({ showBottomButton: true });
    this.favoriteDao
      .getFavoriteKeys()
      .then(keys => {
        this.favoriteKeys = keys || [];
        this.flushFavoriteState();
      })
      .catch(e => {
        this.flushFavoriteState();
      });
  }

  /**
   * 更新Project的 item每一项的收藏状态
   */
  flushFavoriteState() {
    let projectModels = [];
    let items = this.items;
    for (let i = 0, len = items.length; i < len; i++) {
      projectModels.push(
        new ProjectModel(
          items[i],
          Utils.checkFavorite(items[i], this.favoriteKeys)
        )
      );
    }
    this.updateState({
      isLoading: false,
      dataSource: this.getDataSource(projectModels),
      rightButtonText: "搜索"
    });
  }

  getDataSource(data) {
    return this.state.dataSource.cloneWithRows(data);
  }

  onRightButtonClick() {
    if (this.state.rightButtonText === "搜索") {
      this.updateState({ rightButtonText: "取消" });
      this.loadData();
    } else {
      this.updateState({ rightButtonText: "搜索", isLoading: false });
      this.cancelable.cancel();
    }
  }

  onSelect(projectModel) {
    this.props.navigation.navigate("RepositoryDetail", {
      projectModel: projectModel
    });
  }

  renderRow(ProjectModel) {
    return (
      <RepositoryCell
        ProjectModel={ProjectModel}
        ket={ProjectModel.item.id}
        onSelect={() => this.onSelect(ProjectModel)}
        onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
      />
    );
  }

  /**
   * 收藏单击回调函数
   */
  onFavorite(item, isFavorite) {
    if (isFavorite) {
      this.favoriteDao.saveFavoriteItem(
        item.id.toString(),
        JSON.stringify(item)
      );
    } else {
      this.favoriteDao.removeFavoriteItem(item.id.toString());
    }
  }

  /**
   * 添加标签
   */
  saveKey() {
    let key = this.inputKey;
    if (this.checkKeyIsExist(this.keys, key)) {
      this.toast.show(key + "已经存在", DURATION.LENGTH_LONG);
    } else {
      key = {
        path: key,
        name: key,
        checked: true
      };
      this.keys.unshift(key);
      this.languageDao.save(this.keys);
      this.toast.show(key.name + "保存成功", DURATION.LENGTH_LONG);
      this.isKeyChange = true;
    }
  }
  /**
   * 检查key是否存在于keys中
   * @param keys
   * @param key
   */
  checkKeyIsExist(keys, key) {
    for (let i = 0, l = keys.length; i < l; i++) {
      if (key.toLowerCase() === keys[i].name.toLowerCase()) return true;
    }
    return false;
  }

  renderNavBar() {
    let backButton = ViewUtils.getLeftButton(() => this.onBackPress());
    let inputView = (
      <TextInput
        style={styles.textinput}
        ref="input"
        onChangeText={text => (this.inputKey = text)}
      />
    );
    let rightButton = (
      <TouchableOpacity
        onPress={() => {
          this.refs.input.blur();
          this.onRightButtonClick();
        }}
      >
        <View style={{ marginRight: 10 }}>
          <Text style={styles.title}>{this.state.rightButtonText}</Text>
        </View>
      </TouchableOpacity>
    );
    return (
      <View
        style={{
          backgroundColor: "#2196F3",
          flexDirection: "row",
          alignItems: "center",
          height:
            Platform.OS === "ios"
              ? GlobalStyles.nav_bar_height_ios
              : GlobalStyles.nav_bar_height_android
        }}
      >
        {backButton}
        {inputView}
        {rightButton}
      </View>
    );
  }

  render() {
    let statusBar = null;
    let listView = !this.state.isLoading ? (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={e => this.renderRow(e)}
      />
    ) : null;
    if (Platform.OS === "ios") {
      statusBar = (
        <View style={[styles.statusBar, { backgroundColor: "#2196F3" }]} />
      );
    }
    let indivatorView = this.state.isLoading ? (
      <ActivityIndicator
        animating={this.state.isLoading}
        style={styles.centering}
        size="large"
      />
    ) : null;
    let resultView = (
      <View style={{ flex: 1 }}>
        {indivatorView}
        {listView}
      </View>
    );

    let bottomButton = this.state.showBottomButton ? (
      <TouchableOpacity
        style={[styles.bottomButton, { backgroundColor: "#2196F3" }]}
        onPress={() => {
          this.saveKey();
        }}
      >
        <View style={{ justifyContent: "center" }}>
          <Text style={styles.title}>添加标签</Text>
        </View>
      </TouchableOpacity>
    ) : null;
    return (
      <View style={GlobalStyles.root_container}>
        {statusBar}
        {this.renderNavBar()}
        {resultView}
        {bottomButton}
        <Toast ref={toast => (this.toast = toast)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  statusBar: {
    height: 20
  },
  textinput: {
    flex: 1,
    height: Platform.OS === "ios" ? 30 : 40,
    borderWidth: Platform.OS === "ios" ? 1 : 0,
    borderColor: "white",
    alignSelf: "center",
    paddingLeft: 5,
    marginRight: 10,
    marginLeft: 5,
    borderRadius: 3,
    opacity: 0.7,
    color: "white"
  },
  title: {
    fontSize: 18,
    color: "white",
    fontWeight: "500"
  },
  centering: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  bottomButton: {
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.9,
    height: 40,
    position: "absolute",
    left: 10,
    top: GlobalStyles.window_height - 45,
    right: 10,
    borderRadius: 3
  }
});
