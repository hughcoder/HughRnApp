export default class Utils {
  /**
   * 检查该item 有没有被收藏过
   * @param {*} item 
   * @param {*} items 
   */
  static checkFavorite(item, items) {
    for (let i = 0, j = items.length; i < j; i++) {
      if (item.id.toString() === items[i]) {
        return true;
      }
    }
    return false
  }
}
