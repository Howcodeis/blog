/*
 * @Author: Matbin
 * @Date: 2023-11-21 18:23:42
 * @Description: 警告消息设置
 */

import { ElNotification, ElMessage } from "element-plus"

/**
* 
* @returns element-ui-Message
*/
export function serverErrorBack () {
  return ElMessage({
    type: 'error',
    message: "服务器断开或出现问题",
    duration: 2000,
    showClose: false
  })
}

/**
 * @param {string} type 
 * @param {string} message 
 * @returns element-ui-Message
 */
export function normalBack (type, message) {
  return ElMessage({
    type: type,
    message: message,
    duration: 2000,
    showClose: false
  })
}

/**
 * 
 * @param {string} title 
 * @param {string} message 
 * @param {string} type 
 * @param {number} offset 
 */
export function notificationBack (title, message, type, offset) {
  return ElNotification({
    title: title,
    message: message,
    type: type,
    offset: offset,
    duration: 1500,
    showClose: false
  })
}