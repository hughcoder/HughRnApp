export default class ActionUtils {
  /**
   * 跳转到相应详情页
   * @param {*} projectModel 
   * @param {*} params 
   */
 static onSelect(projectModel,params) {
    this.props.navigation.navigate("RepositoryDetail", {
      projectModel: projectModel,
      params,
    });
  }
}
