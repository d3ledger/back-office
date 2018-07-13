// package: iroha.network.proto
// file: loader.proto

var loader_pb = require("./loader_pb");
var block_pb = require("./block_pb");
var grpc = require("grpc-web-client").grpc;

var Loader = (function () {
  function Loader() {}
  Loader.serviceName = "iroha.network.proto.Loader";
  return Loader;
}());

Loader.retrieveBlocks = {
  methodName: "retrieveBlocks",
  service: Loader,
  requestStream: false,
  responseStream: true,
  requestType: loader_pb.BlocksRequest,
  responseType: block_pb.Block
};

Loader.retrieveBlock = {
  methodName: "retrieveBlock",
  service: Loader,
  requestStream: false,
  responseStream: false,
  requestType: loader_pb.BlockRequest,
  responseType: block_pb.Block
};

exports.Loader = Loader;

function LoaderClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

LoaderClient.prototype.retrieveBlocks = function retrieveBlocks(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(Loader.retrieveBlocks, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.end.forEach(function (handler) {
        handler();
      });
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

LoaderClient.prototype.retrieveBlock = function retrieveBlock(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  grpc.unary(Loader.retrieveBlock, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          callback(Object.assign(new Error(response.statusMessage), { code: response.status, metadata: response.trailers }), null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
};

exports.LoaderClient = LoaderClient;

