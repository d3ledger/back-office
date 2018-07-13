// package: iroha.consensus.yac.proto
// file: yac.proto

var yac_pb = require("./yac_pb");
var google_protobuf_empty_pb = require("google-protobuf/google/protobuf/empty_pb");
var grpc = require("grpc-web-client").grpc;

var Yac = (function () {
  function Yac() {}
  Yac.serviceName = "iroha.consensus.yac.proto.Yac";
  return Yac;
}());

Yac.SendVote = {
  methodName: "SendVote",
  service: Yac,
  requestStream: false,
  responseStream: false,
  requestType: yac_pb.Vote,
  responseType: google_protobuf_empty_pb.Empty
};

Yac.SendCommit = {
  methodName: "SendCommit",
  service: Yac,
  requestStream: false,
  responseStream: false,
  requestType: yac_pb.Commit,
  responseType: google_protobuf_empty_pb.Empty
};

Yac.SendReject = {
  methodName: "SendReject",
  service: Yac,
  requestStream: false,
  responseStream: false,
  requestType: yac_pb.Reject,
  responseType: google_protobuf_empty_pb.Empty
};

exports.Yac = Yac;

function YacClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

YacClient.prototype.sendVote = function sendVote(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  grpc.unary(Yac.SendVote, {
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

YacClient.prototype.sendCommit = function sendCommit(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  grpc.unary(Yac.SendCommit, {
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

YacClient.prototype.sendReject = function sendReject(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  grpc.unary(Yac.SendReject, {
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

exports.YacClient = YacClient;

