// package: iroha.network.transport
// file: mst.proto

var mst_pb = require("./mst_pb");
var google_protobuf_empty_pb = require("google-protobuf/google/protobuf/empty_pb");
var grpc = require("grpc-web-client").grpc;

var MstTransportGrpc = (function () {
  function MstTransportGrpc() {}
  MstTransportGrpc.serviceName = "iroha.network.transport.MstTransportGrpc";
  return MstTransportGrpc;
}());

MstTransportGrpc.SendState = {
  methodName: "SendState",
  service: MstTransportGrpc,
  requestStream: false,
  responseStream: false,
  requestType: mst_pb.MstState,
  responseType: google_protobuf_empty_pb.Empty
};

exports.MstTransportGrpc = MstTransportGrpc;

function MstTransportGrpcClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

MstTransportGrpcClient.prototype.sendState = function sendState(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  grpc.unary(MstTransportGrpc.SendState, {
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

exports.MstTransportGrpcClient = MstTransportGrpcClient;

