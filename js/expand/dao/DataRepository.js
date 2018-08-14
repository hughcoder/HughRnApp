import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  AsyncStorage
} from "react-native";

export default class DataRepository {
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
  checkData(longTime){
    // return false; 测试用的
    let cDate= new Date();
    let tDate= new Date();
    tDate.setTime(longTime);
    if(cDate.getMonth()!==tDate.getMonth())  return false;
    if(cDate.getDay()!==tDate.getDate())  return false;
    if(cDate.getHours()-tDate.getHours()>4) return false;
    return true
  }
}
