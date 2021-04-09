import 'package:graphql/client.dart';
import 'dart:io' as io;
import 'package:websocket/websocket.dart' as _ws;

/// Custom version of [WebSocketLink] that connects with the given headers
class WSLink extends Link {
  /// Creates a new [WebSocketLink] instance with the specified config.
  WSLink(
    this.url, {
    this.config = const SocketClientConfig(),
    this.headers,
  });

  final String url;
  final SocketClientConfig config;

  final Map<String, dynamic> headers;

  // cannot be final because we're changing the instance upon a header change.
  SocketClient _socketClient;

  @override
  Stream<Response> request(Request request, [forward]) async* {
    if (_socketClient == null) {
      connectOrReconnect();
    }

    yield* _socketClient.subscribe(request, true);
  }

  /// Connects or reconnects to the server with the specified headers.
  void connectOrReconnect() {
    _socketClient?.dispose();
    _socketClient = SocketClient(
      url,
      config: config,
      connect: (url, {protocols}) => _WebSocket.connect(
        url,
        protocols: protocols,
        headers: headers,
      ),
    );
  }

  /// Disposes the underlying socket client explicitly. Only use this, if you want to disconnect from
  /// the current server in favour of another one. If that's the case, create a new [WebSocketLink] instance.
  Future<void> dispose() async {
    await _socketClient?.dispose();
    _socketClient = null;
  }
}

class _WebSocket implements _ws.WebSocket {
  io.WebSocket _socket;

  _WebSocket._(this._socket);

  static Future<_WebSocket> connect(
    String url, {
    Iterable<String> protocols,
    Map<String, dynamic> headers,
  }) async {
    return _WebSocket._(await io.WebSocket.connect(
      url,
      protocols: protocols,
      headers: headers,
    ));
  }

  @override
  void add(/*String|List<int>*/ data) => _socket.add(data);

  @override
  Future addStream(Stream stream) => _socket.addStream(stream);

  @override
  void addUtf8Text(List<int> bytes) => _socket.addUtf8Text(bytes);

  @override
  Future close([int code, String reason]) => _socket.close(code, reason);

  @override
  int get closeCode => _socket.closeCode;

  @override
  String get closeReason => _socket.closeReason;

  @override
  String get extensions => _socket.extensions;

  @override
  String get protocol => _socket.protocol;

  @override
  int get readyState => _socket.readyState;

  @override
  Future get done => _socket.done;

  Stream _stream;

  @override
  Stream<dynamic /*String|List<int>*/ > get stream =>
      _stream ??= _socket.asBroadcastStream();
}
