import { StackNavigator } from "react-navigation";
import WelcomePage from "../page/WelcomePage";
import HomePage from "../page/HomePage";
import CustomKeyPage from "../page/my/CustomKeyPage";
import SortKeyPage from "../page/my/SortKeyPage";
import RepositoryDetail from "../page/RepositoryDetail";
import PopularPage from "../page/PopularPage";
import AboutPage from "../page/about/About";
import WebViewPage from "../page/WebViewPage";
import AboutMePage from "../page/about/AboutMePage";

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
    },
    RepositoryDetail: {
      screen: RepositoryDetail
    },
    AboutPage: {
      screen: AboutPage
    },
    WebViewPage: {
      screen: WebViewPage
    },
    AboutMePage: {
      screen: AboutMePage
    }
  },
  {
    navigationOptions: {
      header: null
    }
  }
));
