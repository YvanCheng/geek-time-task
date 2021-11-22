import platformSDK, { GlobalState } from "platform-sdk";

export type GlobalAppState = GlobalState;

export function init() {
  platformSDK.init({
    debug: true
  });
}

/**
 * 设置项目变化时的监听
 */
export function setOnProjectChangeListener(listener: () => void) {
  /**/
}

/**
 * 设置项目变化时的监听
 */
export function setOnProductChangeListener(listener: () => void) {
  /**/
}

/**
 * 判断是否在当前是否运行在基座内部
 */
export function isInMicroAppContainer(): boolean {
  return platformSDK.isInMicroAppContainer();
}

/**
 * 获取全局 state
 */
export function getGlobalState(): GlobalAppState {
  return platformSDK.getState();
}
