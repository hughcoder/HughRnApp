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
  DeviceEventEmitter
} from "react-native";

import DataRepository, { FLAG_STORAGE } from "../expand/dao/DataRepository";
import TabNavigator from "react-native-tab-navigator";
import NavigationBar from "../common/NavigationBar";
import RepositoryCell from "../common/RepositoryCell";
import TrendingCeil from "../common/TrendingCeil";
import FavoriteDao from "../expand/dao/FavoriteDao";
import ScrollableTabView, {
  ScrollableTabBar
} from "react-native-scrollable-tab-view";
import ProjectModel from "../model/ProjectModel";

import Utils from "../util/Utils";
const URL = "https://api.github.com/search/repositories?q=";
const QUERY_STR = "&sort=stars";
var favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
export default class FavoritePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: "",
      languages: [],
    };
    this.dataRepository = new DataRepository(FLAG_STORAGE.flag_popular);
  }
  componentDidMount() {}

  render() {
    let content =
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
          <FavoriteTab
            tabLabel="最热"
            flag={FLAG_STORAGE.flag_popular}
            {...this.props}
          />
          <FavoriteTab
            tabLabel="趋势"
            flag={FLAG_STORAGE.flag_trending}
            {...this.props}
          />
        </ScrollableTabView>
    
    return (
      <View style={styles.container}>
        <NavigationBar
          title="收藏"
          style={{ backgroundColor: "#2196F3" }}
          statusBar={{ backgroundColor: "#2196F3" }}
        />
        {content}
      </View>
    );
  }
}

class FavoriteTab extends Component {
  constructor(props) {
    super(props);
    this.favoriteDao = new FavoriteDao(this.props.flag);
    this.state = {
      favoriteKeys: [],
      result: "",
      isLoading: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => {
          r1 !== r2;
        }
      })
    };
    this.dataRepository = new DataRepository(FLAG_STORAGE.flag_popular);
  }
  componentDidMount() {
    this.loadData();
  }

  updateState(dic) {
    if (!this) return;
    this.setState(dic);
  }

  loadData() {
    this.setState({
      isLoading: true
    });

    this.favoriteDao
      .getAllItems()
      .then(items => {
        const resultData = [];
        for (let i = 0, len = items.length; i < len; i++) {
          resultData.push(new ProjectModel(items[i], true));
        }
        this.setState({
          isLoading: false,
          dataSource: this.getDataSource(resultData)
        });
      })
      .catch(e => {
        this.setState({
          isLoading: false
        });
        console.warn("--->er", e);
      });
  }

  getDataSource(items) {
    return this.state.dataSource.cloneWithRows(items);
  }

  onSelect(projectModel) {
    this.props.navigation.navigate("RepositoryDetail", {
      projectModel: projectModel
    });
  }
  /**
   * 收藏单击回调函数
   */
  onFavorite(item, isFavorite) {
    if (isFavorite) {
      favoriteDao.saveFavoriteItem(item.id.toString(), JSON.stringify(item));
    } else {
      favoriteDao.removeFavoriteItem(item.id.toString());
    }
  }

  renderRow(ProjectModel) {
    let CellComponent =
      this.props.flag === FLAG_STORAGE.flag_popular
        ? RepositoryCell
        : TrendingCeil;
    return (
      <CellComponent
        ProjectModel={ProjectModel}
        ket={
          this.props.flag === FLAG_STORAGE.flag_popular
            ? ProjectModel.item.id
            : ProjectModel.item.fullName
        }
        onSelect={() => this.onSelect(ProjectModel)}
        onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
      />
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={data => this.renderRow(data)}
          // renderEmptySections = {true}
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
