// 由于目前的webpack打包使用的是单页面打包
// 所以发送给服务端的session是同一个，因此公用封装的websocket
// global_callback是传入的方法，这个方法从组件中调用，然后接受数据
var websock = null;
var global_callback = null;

function initWebSocket() {
  var wsuri = "ws://112.74.59.53/websocket";
  // var wsuri = "ws://192.168.0.110:18082/websocket";
  websock = new WebSocket(wsuri);
  websock.onmessage = function (e) {
    websocketonmessage(e);
  };
  websock.onclose = function (e) {
    websocketclose(e);
  };
  websock.onopen = function () {
    websocketOpen();
  };
  websock.onerror = function () {
    console.log("WebSocket连接发生错误");
  }
}

function sendSock(agentData, callback) {
  global_callback = callback;
  if (websock.readyState === websock.OPEN) {
    websocketsend(agentData)
  } else if (websock.readyState === websock.CONNECTING) {
    setTimeout(function () {
      sendSock(agentData, callback);
    }, 1000);
  } else {
    setTimeout(function () {
      sendSock(agentData, callback);
    }, 1000);
  }
}
function websockClose() {
    websock.close()
}

function websocketonmessage(e) {
  global_callback(JSON.parse(e.data));
}

function websocketsend(agentData) {
  websock.send(agentData);
}

function websocketclose(e) {
  console.log("连接已关闭，错误码----" + e.code + "");
}

function websocketOpen(e) {
  console.log("连接成功");
}

initWebSocket();

export {
  sendSock,
    websockClose,
    initWebSocket
}
