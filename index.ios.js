/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    Navigator,
    Image,
    View
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import Boy from './Boy'
import ListViewTest from './ListViewTest'
import setup from './js/page/setup'
import FetchTest from './FetchTest'
import HomePage from './js/page/HomePage'
export default class imooc_gp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'home',
        }
    }

    render() {
        return (
            <View style={styles.container}>
               
                <FetchTest/>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        height: 22,
        width: 22,
    }
});

AppRegistry.registerComponent('imooc_gp', () => setup);
