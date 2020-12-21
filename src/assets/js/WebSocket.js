import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import Constant from '@/assets/js/Constant.js'

let timer = null;
let stompClient = null;
let subscribeUrl = null;
let success = null;
let error = null;
let retry = null;
let isBreak = null;
let url = null;

/**
 * websocket工具类
 */
export default {
  /**
   * websocket初始化,启动定时器进行心跳检测,断开重连
   *
   * @param {String} subscribeUrl 订阅地址
   * @param {Object} success      成功调用方法
   * @param {Object} error        失败调用方法
   */
  init(subscribeUrl, success, error) {
    this.url = Constant.API_ENV + "/ws" + "?token=" + window.localStorage.getItem("token");

    this.retry = 0;
    this.isBreak = false;

    //初始化数据
    this.subscribeUrl = subscribeUrl;
    this.success = success;
    this.error = error;

    //先关闭websocket连接和定时器
    this.disconnect();

    //进行websocket连接
    this.connection(this.url);
    this.timer = setInterval(() => {

      //断开才进行重试
      if (this.isBreak) {
        //重试次数+1
        this.retry++;
        console.error("[WebSocket] 连接断开,重新连接....当前重试次数:" + this.retry);

        //开始连接
        this.connection(this.url);

        //重试次数超限,就停止重试
        if (this.retry >= 10) {
          console.error("[WebSocket] 重试次数超限,断开连接！");
          //关闭定时器
          clearInterval(this.timer);
        }
      }
    }, 10000);
  },
  /**
   * 进行websocket连接,订阅服务
   */
  connection(url) {
    let socket = new SockJS(url);
    this.stompClient = Stomp.over(socket);
    this.stompClient.heartbeat.outgoing = 10000; //前端对后端进行心跳检测的时长 ms
    this.stompClient.heartbeat.incoming = 0; //后端对前端就行心跳检测的时长 ms

    //去掉debug打印
    this.stompClient.debug = null;

    //开始连接
    this.stompClient.connect({}, () => {
      console.info("[WebSocket] 连接成功！");

      //连接成功初始化数据
      this.retry = 0;
      this.isBreak = false;

      //进行订阅服务
      this.stompClient.subscribe(this.subscribeUrl, message => {
        this.success(message);
      });

    }, err => {
      //断开连接
      this.isBreak = true;
      this.error("[WebSocket] " + err);
    })
  },
  /**
   * 发送消息
   * @param {Object} sendUrl
   * @param {Object} message
   */
  sendMessage(sendUrl, message) {
    this.stompClient.send(sendUrl, {}, JSON.stringify(message));
  },
  /**
   * 关闭连接/关闭定时器
   */
  disconnect() {
    let count = 0;

    if (this.stompClient) {
      this.stompClient.disconnect();
      count++;
    }
    if (this.timer) {
      clearInterval(this.timer);
      count++;
    }

    if (count > 0) {
      console.info("[WebSocket] 关闭成功！");
    }

  }
}
