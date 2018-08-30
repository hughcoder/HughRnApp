import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  Navigator,
  Image,
  View,
  TextInput,
  ListView,
  TouchableOpacity
} from "react-native";
import HTMLView from 'react-native-htmlview'

export default class TrendingCeil extends Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onSelect} style={styles.container}>
        <View style={styles.cell_container}>
          <Text style={styles.title}>{this.props.data.fullName}</Text>
          <HTMLView value={this.props.data.description} onLinkPress={()=>{}} />
          <Text style={styles.description}>{this.props.data.meta}</Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <Text style={styles.author}>Build by:</Text>
              {this.props.data.contributors.map((result, i, arr) => {
                return (
                  <Image
                    style={{ height: 22, width: 22 }}
                    source={{ uri: arr[i] }}
                  />
                );
              })}
            </View>

            <Image
              style={{ width: 22, height: 22 }}
              source={require("../../res/images/ic_star.png")}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    fontSize: 16,
    marginBottom: 2,
    color: "#212121"
  },
  description: {
    fontSize: 14,
    marginBottom: 2,
    color: "#757575",
    borderRadius: 2
  },
  cell_container: {
    backgroundColor: "white",
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    marginVertical: 3,
    borderWidth: 0.5,
    borderRadius: 2,
    borderColor: "#dddddd",
    shadowColor: "gray",
    shadowOffset: { width: 0.5, height: 0.5 },
    shadowOpacity: 0.4,
    shadowRadius: 1,
    elevation: 2
  },
  author: {
    fontSize: 14,
    marginBottom: 2,
    color: "#757575"
  }
});
