var readline = require('readline');
var readlineSync= require('readline-sync')
var PROTO_PATH = __dirname + '/protos/ITchat.proto';
var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');

var packageDefinition = protoLoader.loadSync (PROTO_PATH);
var ITchat_proto = grpc.loadPackageDefinition(packageDefinition).ITchat;

var client = new ITchat_proto.ChatService('localhost:40000', grpc.credentials.createInsecure());

var name = readlineSync.question ("Welcome to the IT chat support for Big Company Ltd. \n Type your name and press enter.")
var call = client.sendMessage();

call.on('data', function(resp) {
  console.log(resp.name + ": " + resp.message)
});
call.on('end', function() {

});
call.on("error", function(e) {
  console.log("Cannot connect to IT chat server")
})

call.write({
  message: name + " joined the IT support chatroom. \n Please type your IT issue or response and press enter",
  name: name
});

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


rl.on("line", function (message) {
  if (message.toLowerCase() === "quit") {
    call.write({
      message: name + " left the IT support chatroom",
      name: name
    });
    call.end();
    rl.close();
  } else {
      call.write({
        message: message,
        name: name
      });
  }
});
