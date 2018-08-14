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
  RefreshControl
} from "react-native";

import DataRepository from "../expand/dao/DataRepository";
import TabNavigator from "react-native-tab-navigator";
import NavigationBar from "../common/NavigationBar";
import RepositoryCell from "../common/RepositoryCell";
import ScrollableTabView, {
  ScrollableTabBar
} from "react-native-scrollable-tab-view";
import LanguageDao, { FLAG_LANGUAGE } from "../expand/dao/LanguageDao";
const URL = "https://api.github.com/search/repositories?q=";
const QUERY_STR = "&sort=stars";
export default class PopularPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: "",
      languages: []
    };
    this.dataRepository = new DataRepository();
    this.LanguageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
  }
  componentDidMount() {
    this.loadData();
  }
  
  loadData(){
    this.LanguageDao.fetch().then(result=>{
      this.setState({
        languages:result
      })
    }).catch(error=>{
      console.warn('err',error)
    })
  }

  render() {
    console.warn("--->", this.state.languages);
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
          {this.state.languages.map((reuslt, i, arr)=> {
            let language = arr[i];
            return language.checked ? <PopularTab key={i} tabLabel={language.name} {...this.props}/> : null;
        })}
        </ScrollableTabView>
      ) : null;
    return (
      <View style={styles.container}>
        <NavigationBar
          title="最热"
          style={{ backgroundColor: "#2196F3" }}
          statusBar={{ backgroundColor: "#2196F3" }}
        />
        {content}
      </View>
    );
  }
}

class PopularTab extends Component {
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
    this.dataRepository = new DataRepository();
  }
  componentDidMount() {
    this.loadData();
  }
  loadData() {
    this.setState({
      isLoading: true
    });
    let url = URL + this.props.tabLabel + QUERY_STR;
    this.dataRepository
      .fetchNetRepository(url)
      .then(result => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(result.items),
          isLoading: false
        });
      })
      .catch(error => {
        console.warn("err", error);
      });
  }
  renderRow(data) {
    return <RepositoryCell data={data} />;
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
