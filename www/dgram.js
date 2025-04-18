var exec = cordova.require('cordova/exec');

// Events: 'message', 'error'
function Socket(type, port) {
    this._multicastSocket = type === 'multicast-udp4';
    this._broadcastSocket = type === 'broadcast-udp4';
    this._socketId = ++Socket.socketCount;
    this._eventHandlers = { };
    Socket.sockets[this._socketId] = this;
    exec(null, null, 'Dgram', 'create', [ this._socketId, this._multicastSocket, this._broadcastSocket, port ]);
}

Socket.socketCount = 0;
Socket.sockets = { };

Socket.prototype.on = function (event, callback) {
    this._eventHandlers[event] = callback;
};

Socket.prototype.bind = function (callback) {
    callback = callback || function () { };
    exec(callback.bind(null, null), callback.bind(null), 'Dgram', 'bind', [ this._socketId ]);
};

Socket.prototype.close = function () {
    exec(null, null, 'Dgram', 'close', [ this._socketId ]);
    delete Socket.sockets[this._socketId];
    this._socketId = 0;
};

// sends utf-8 or base64 based on encoding
Socket.prototype.send = function (buffer, destAddress, destPort, callback, encoding) {
    callback = callback || function () { };
    encoding = encoding || 'utf-8';
    exec(callback.bind(null, null), // success
         callback.bind(null), // failure
         'Dgram',
         'send',
         [ this._socketId, buffer, destAddress, destPort, encoding ]);
};

Socket.prototype.sendHex = function (hexString, destAddress, destPort, callback) {
    callback = callback || function () { };
    exec(callback.bind(null, null), // success
        callback.bind(null), // failure
        'Dgram',
        'sendHex',
        [this._socketId, hexString, destAddress, destPort]);
};

Socket.prototype.address = function () {
};

Socket.prototype.joinGroup = function (address, callback) {
    callback = callback || function () { };
    if (!this._multicastSocket) throw new Error('Invalid operation');
    exec(callback.bind(null, null), callback.bind(null), 'Dgram', 'joinGroup', [ this._socketId, address ]);
};

Socket.prototype.leaveGroup = function (address, callback) {
    callback = callback || function () { };
    if (!this._multicastSocket) throw new Error('Invalid operation');
    exec(callback.bind(null, null), callback.bind(null), 'Dgram', 'leaveGroup', [ this._socketId, address ]);
};

function createSocket(type, port) {
    if (type !== 'udp4' && type !== 'multicast-udp4' && type !== 'broadcast-udp4') {
        throw new Error('Illegal Argument, only udp4, multicast-udp4 and broadcast-udp4 supported');
    }
    iport = parseInt(port, 10);
    if (isNaN(iport) || iport === 0){
        throw new Error('Illegal Port number');
    }
    return new Socket(type, iport);
}

function onMessage(id, msg, remoteAddress, remotePort) {
    var socket = Socket.sockets[id];
    if (socket && 'message' in socket._eventHandlers) {
        socket._eventHandlers['message'].call(null, msg, { address: remoteAddress, port: remotePort });
        console.log('TRACE message '+raw)
    }
}

function onHexMessage(id, raw, remoteAddress, remotePort) {
    var socket = Socket.sockets[id];
    if (socket && 'hexMessage' in socket._eventHandlers) {
        socket._eventHandlers['hexMessage'].call(null, raw, { address: remoteAddress, port: remotePort });
        console.log('TRACE hexMessage '+raw)
    }
}

module.exports = {
    createSocket: createSocket,
    _onMessage: onMessage,
    _onHexMessage: onHexMessage
};
