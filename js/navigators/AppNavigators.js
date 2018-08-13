import { StackNavigator } from "react-navigation";
import WelcomePage from "../page/WelcomePage";
import HomePage from "../page/HomePage";
import CustomKeyPage from '../page/my/CustomKeyPage'

export default (AppNavigator = StackNavigator(
  {
    WelcomePage: {
      screen: WelcomePage
    },
    HomePage: {
      screen: HomePage
    },
    CustomKeyPage:{
      screen:CustomKeyPage
    }
  },
  {
    navigationOptions: {
      header: null
    }
  }
));
