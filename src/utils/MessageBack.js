/*
 * @Author: Matbin
 * @Date: 2023-11-21 18:23:42
 * @Description: 警告消息设置
 */

import { ElNotification, ElMessage } from "element-plus"

/**
 * 显示一个具有特定类型和消息的提示框。
 * @param {string} type - 消息框的类型，如 'success', 'info', 'warning', 'error'。
 * @param {string} message - 要显示的消息。
 * @param {number} [duration=2000] - 消息框显示的持续时间，单位为毫秒。
 * @param {boolean} [showClose=false] - 是否显示关闭按钮。
 */
export function normalBack (type, message, duration = 2000, showClose = false) {
  // 参数校验，确保type和message是预期的类型，这里只做了简单的类型检查
  if (typeof type !== 'string' || typeof message !== 'string') {
    console.error('normalBack: 参数类型错误,type和message应该都是字符串.');
    return;
  }

  // 构造传给ElMessage的配置对象
  const config = {
    type: type,
    message: message,
    duration: duration,
    showClose: showClose
  };

  try {
    // 调用ElMessage，确保其存在且为函数类型
    if (typeof ElMessage === 'function') {
      return ElMessage(config);
    } else {
      console.error('ElMessage 未定义或不是函数类型。');
    }
  } catch (error) {
    console.error('显示消息框时发生错误：', error);
  }
}

/**
 * 
 * @param {string} title 
 * @param {string} message 
 * @param {string} type 
 * @param {number} offset 
 * returns element-ui-Notification
 */
export function notificationBack (title, message, type, offset = 60, duration = 1500, showClose = false) {
  // 参数校验，确保type和message是预期的类型，这里只做了简单的类型检查
  if (typeof type !== 'string' || typeof message !== 'string' || typeof title !== 'string') {
    console.error('normalBack: 参数类型错误,type和message以及title应该都是字符串.');
    return;
  }
  if (typeof offset !== 'number') {
    console.error('notificationBack: 参数类型错误,offset应为数字');
    return;
  }
  // 构造传给ElMessage的配置对象
  const config = {
    title: title,
    message: message,
    type: type,
    offset: offset,
    duration: duration,
    showClose: showClose
  };
  try {
    // 调用ElMessage，确保其存在且为函数类型
    if (typeof ElNotification === 'function') {
      return ElNotification(config);
    } else {
      console.error('ElNotification 未定义或不是函数类型.');
    }
  } catch (error) {
    console.error('显示消息框时发生错误：', error);
  }
}