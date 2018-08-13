/**
 * Created by penn on 2016/12/14.
 */

import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
} from 'react-native'
import Girl from './Girl'
import NavigationBar from './js/common/NavigationBar'
export default class Boy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            what: ''
        }
    }

    render() {
        let what = this.state.what === '' ? '' : '我收到了女孩回赠的:' + this.state.what;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title='Boy'
                    style={{backgroundColor: '#6495ED'}}
                />
                <Text style={styles.tips}>Hello I am boy.</Text>
                <Text style={styles.tips}
                      onPress={()=> {
                          this.props.navigator.push({
                              component: Girl,
                              name: 'Girl',
                              params: {
                                  what: '一枝玫瑰',
                                  onCallback: (what)=> {
                                      this.setState({
                                          what: what,
                                      })
                                  }
                              }
                          })
                      }}>
                    送花给女孩.</Text>
                <Text style={styles.tips}>{what}</Text>
            </View>)
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    tips: {
        fontSize: 29
    }
})
