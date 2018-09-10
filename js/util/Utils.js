export default class Utils {
  /**
   * 检查该item 有没有被收藏过
   * @param {*} item
   * @param {*} items
   */
  static checkFavorite(item,items) {
    for (var i = 0, len = items.length; i < len; i++) {
        let id=item.id? item.id:item.fullName;
        if (id.toString() === items[i]) {
            return true;
        }
    }
    return false;
}

  /**
   * 检查项目更新时间
   * @param {*} longTime  项目更新时间
   * true代表不需要更新，false的话 需要更新
   */
  static checkDate(longTime) {
    // return false;
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
