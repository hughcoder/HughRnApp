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
const URL = "https://api.github.com/search/repositories?q=";
const QUERY_STR = "&sort=stars";
export default class PopularPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: ""
    };
    this.dataRepository = new DataRepository();
  }

  loadData() {
    let url = URL + this.key + QUERY_STR;
    this.dataRepository
      .fetchNetRepository(url)
      .then(result => {
        this.setState({
          result: JSON.stringify(result)
        });
      })
      .catch(error => {
        console.warn("err", error);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar title="最热" style={{ backgroundColor: "#2196F3" }} statusBar={{ backgroundColor: "#2196F3" }} />
        <ScrollableTabView
          tabBarUnderlineStyle={{ backgroundColor: "#e7e7e7", height: 2 }}
          tabBarActiveTextColor="white"
          tabBarInactiveTextColor="mintcream"
          tabBarBackgroundColor="#2196F3"
          renderTabBar={() => <ScrollableTabBar />}
        >
          <PopularTab tabLabel="java">JAVA</PopularTab>
          <PopularTab tabLabel="ios">IOS</PopularTab>
          <PopularTab tabLabel="Android">android</PopularTab>
          <PopularTab tabLabel="javaScript">js</PopularTab>
        </ScrollableTabView>
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
