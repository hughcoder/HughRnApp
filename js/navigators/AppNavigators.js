import { StackNavigator } from "react-navigation";
import WelcomePage from "../page/WelcomePage";
import HomePage from "../page/HomePage";
import CustomKeyPage from "../page/my/CustomKeyPage";
import SortKeyPage from "../page/my/SortKeyPage";

export default (AppNavigator = StackNavigator(
  {
    WelcomePage: {
      screen: WelcomePage
    },
    HomePage: {
      screen: HomePage
    },
    CustomKeyPage: {
      screen: CustomKeyPage
    },
    SortKeyPage: {
      screen: SortKeyPage
    }
  },
  {
    navigationOptions: {
      header: null
    }
  }
));
