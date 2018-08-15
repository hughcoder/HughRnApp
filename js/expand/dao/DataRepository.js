import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
export var FLAG_STORAGE = {
  flag_popular: "popular",
  flage_trending: "trending"
};
import GitHubTrending from "../../util/trending/GitHubTrending";
export default class DataRepository {
  constructor(flag) {
    this.flag = flag;
    if (flag === FLAG_STORAGE.flage_trending) {
      this.trending = new GitHubTrending();
    }
  }
  fetchRepository(url) {
    return new Promise((resolve, reject) => {
      //获取本地的数据
      this.fetchLocalRepository(url)
        .then(result => {
          if (result) {
            resolve(result);
          } else {
            this.fetchNetRepository(url)
              .then(result => {
                resolve(result);
              })
              .catch(e => {
                resolve(e);
              });
          }
        })
        .catch(e => {
          resolve(e);
        });
    });
  }
  /**
   * 获取本地数据
   * @param  url
   */
  fetchLocalRepository(url) {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(url, (error, result) => {
        if (!error) {
          try {
            resolve(JSON.parse(result));
          } catch (e) {
            reject(error);
          }
        }
      });
    });
  }

  fetchNetRepository(url) {
    return new Promise((resolve, reject) => {
      if (this.flag === FLAG_STORAGE.flage_trending) {
        this.trending.fetchTrending(url).then(result => {
          if (!result) {
            reject(new Error("responseData is null"));
            return;
          }
          this.saveRepository(url, result);
          resolve(result);
        });
      }
      fetch(url)
        .then(response => response.json())
        .then(result => {
          if (!result) {
            reject(new Error("response is null"));
            return;
          }
          resolve(result.items);
          this.saveRepository(url, result.items);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  saveRepository(url, items, callBack) {
    if (!url || !items) return;
    let wrapData = { items: items, updata_data: new Date().getTime() };
    AsyncStorage.setItem(url, JSON.stringify(wrapData), callBack);
  }
  /**
   * 判断数据是否过时
   * @param {*} longTime 数据的时间戳
   */
  checkData(longTime) {
    // return false; 测试用的
    let currentDate = new Date();
    let targetDate = new Date();
    targetDate.setTime(longTime);
    if (currentDate.getMonth() !== targetDate.getMonth()) return false;
    if (currentDate.getDate() !== targetDate.getDate()) return false;
    if (currentDate.getHours() - targetDate.getHours() > 4) return false;
    // if (currentDate.getMinutes() - targetDate.getMinutes() > 1)return false;
    return true;
  }
}
