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
  TouchableOpacity
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
const URL = "https://api.github.com/search/repositories?q=";
const QUERY_STR = "&sort=stars";

export default class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
    this.dataRepository = new DataRepository(FLAG_STORAGE.flag_popular);
    this.favoriteKeys = [];
    this.state = {
      rightButtonText: "搜索",
      isLoading: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => {
          r1 !== r2;
        }
      })
    };
  }
  componentDidMount() {}

  loadData() {
    this.updateState({
      isLoading: true
    });

    this.dataRepository
      .fetchNetRepository(this.genFetchUrl(this.inputKey))
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
          rightButtonText: "搜索"
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
    let listView = (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={e => this.renderRow(e)}
      />
    );
    if (Platform.OS === "ios") {
      statusBar = (
        <View style={[styles.statusBar, { backgroundColor: "#2196F3" }]} />
      );
    }
    return (
      <View style={GlobalStyles.root_container}>
        {statusBar}
        {this.renderNavBar()}
        {listView}
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
  }
});
