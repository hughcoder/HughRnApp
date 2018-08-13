/**
 * Created by penn on 2016/12/19.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Navigator,
    Image,
    View,
    ListView,
    RefreshControl,
    TouchableOpacity,
} from 'react-native';
import Toast, {DURATION} from 'react-native-easy-toast'
import HttpUtils from './HttpUtils'
import NavigationBar from './js/common/NavigationBar'
export default class FetchTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: ''
        }
    }

    load(url) {
        // fetch(url)
        //     .then(response=>response.json())
        //     .then(result=> {
        //         this.setState({
        //             result: JSON.stringify(result)
        //         })
        //     })
        //     .catch(error=> {
        //         this.setState({
        //             result: JSON.stringify(error)
        //         })
        //     })
        HttpUtils.get(url)
            .then(result=>{
                this.setState({
                    result: JSON.stringify(result)
                })
            })
            .catch(error=> {
                this.setState({
                    result: JSON.stringify(error)
                })
            })
    }

    post(url, data) {
        // fetch(url, {
        //     method: 'POST',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(data)
        // })
        //     .then(response=>response.json())
        //     .then(result=> {
        //         this.setState({
        //             result: JSON.stringify(result)
        //         })
        //     })
        //     .catch(error=> {
        //         this.setState({
        //             result: JSON.stringify(error)
        //         })
        //     })
        HttpUtils.post(url,data)
            .then(result=>{
                this.setState({
                    result: JSON.stringify(result)
                })
            })
            .catch(error=> {
                this.setState({
                    result: JSON.stringify(error)
                })
            })
    }

    render() {
        return (
            <View>
                <NavigationBar
                    title="Fetch的使用"/>
                <Text style={styles.text} onPress={()=>this.load('http://rap.taobao.org/mockjsdata/11793/test')}>
                    加载数据
                </Text>
                <Text style={styles.text} onPress={()=>this.post('http://rap.taobao.org/mockjsdata/11793/submit',{userName:'小明',password:'123456'})}>
                    提交数据
                </Text>
                <Text style={styles.text}>请求结果:{this.state.result}</Text>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    text: {
        fontSize: 20
    }
})