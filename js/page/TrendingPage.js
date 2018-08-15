/**
 * Created by penn on 2016/12/14.
 */

import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  AsyncStorage,
  TextInput,
  Button,
  TouchableOpacity
} from "react-native";
import DataRepository,{FLAG_STORAGE} from './../expand/dao/DataRepository'
import NavigationBar from "../common/NavigationBar";
import Toast, { DURATION } from "react-native-easy-toast";
import GithubTrending from "../util/trending/GitHubTrending";
const URL = "https://github.com/trending/";
export default class TrendingPage extends Component {
  constructor(props) {
    super(props);
    this.trending = new GithubTrending();
    this.DataRepository=new DataRepository(FLAG_STORAGE.flage_trending);
    this.state = {
     result:''
    };
  }

  onLoad() {
    let url = URL + this.text;

    this.DataRepository.fetchRepository(url).then(result => {
     this.setState({
       result:JSON.stringify(result),
     })
    }).catch(error=>{
      this.setState({
        result:JSON.stringify(error)
      })
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          title="GithubTrending"
          style={{ backgroundColor: "#6495ED" }}
        />
        <TextInput
          style={{ borderWidth: 1, height: 40, margin: 6 }}
          onChangeText={text => (this.text = text)}
        />
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={() => this.onLoad()}>
            <Text style={styles.tips}>加载数据</Text>
          </TouchableOpacity>
        </View>
        <Text style={{height:600}}>{this.state.result}</Text>
        <Toast ref={toast => (this.toast = toast)} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tips: {
    fontSize: 29,
    margin: 5
  }
});
