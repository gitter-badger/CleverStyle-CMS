// Generated by CoffeeScript 1.9.3

/**
 * @package   WebSockets
 * @category  modules
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2015, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
 */

(function() {
  var allow_reconnect, handlers, messages_pool, socket, socket_active, w;

  socket = null;

  handlers = {};

  messages_pool = [];

  allow_reconnect = true;

  socket_active = function() {
    var ref;
    return socket && ((ref = socket.readyState) !== WebSocket.CLOSING && ref !== WebSocket.CLOSED);
  };

  (function() {
    var connect, delay, keep_connection, onmessage, onopen;
    delay = 0;
    onopen = function() {
      delay = 1000;
      cs.WebSockets.send('Client/authentication', {
        session: cs.getcookie('session'),
        user_agent: navigator.userAgent,
        language: cs.Language.clanguage.toString()
      });
      while (messages_pool.length) {
        cs.WebSockets.send(messages_pool.shift());
      }
    };
    onmessage = function(message) {
      var action, action_handlers, details, ref, ref1, ref2, type;
      ref = JSON.parse(message.data), action = ref[0], details = ref[1];
      ref1 = action.split(':'), action = ref1[0], type = ref1[1];
      switch (action) {
        case 'Server/close':
          allow_reconnect = false;
      }
      action_handlers = handlers[action];
      if (!action_handlers || !action_handlers.length) {
        return;
      }
      if ((ref2 = typeof details) === 'boolean' || ref2 === 'number' || ref2 === 'string') {
        details = [details];
      }
      action_handlers.forEach(function(h) {
        if (type === 'error') {
          return h[1] && h[1].apply(h[1], details);
        } else {
          return h[0] && h[0].apply(h[0], details);
        }
      });
    };
    connect = function() {
      socket = new WebSocket((location.protocol === 'https:' ? 'wss' : 'ws') + ("://" + location.host + "/WebSockets"));
      socket.onopen = onopen;
      socket.onmessage = onmessage;
    };
    keep_connection = function() {
      return setTimeout((function() {
        if (!allow_reconnect) {
          return;
        }
        if (!socket_active()) {
          delay = (delay || 1000) * 2;
          connect();
        }
        return keep_connection();
      }), delay);
    };
    return keep_connection();
  })();

  w = {
    'on': function(action, callback, error) {
      if (!action || (!callback && !error)) {
        return w;
      }
      if (!handlers[action]) {
        handlers[action] = [];
      }
      handlers[action].push([callback, error]);
      return w;
    },
    'off': function(action, callback, error) {
      if (!handlers[action]) {
        return w;
      }
      handlers[action] = handlers[action].filter(function(h) {
        if (h[0] === callback) {
          delete h[0];
        }
        if (h[1] === error) {
          delete h[1];
        }
        return h[0] || h[1];
      });
      return w;
    },
    once: function(action, callback, error) {
      var callback_, error_;
      if (!action || (!callback && !error)) {
        return w;
      }
      callback_ = function() {
        w.off(action, callback_, error_);
        return callback.apply(callback, arguments);
      };
      error_ = function() {
        w.off(action, callback_, error_);
        return error.apply(error, arguments);
      };
      return w.on(action, callback_, error_);
    },
    send: function(action, details) {
      var message;
      if (!action) {
        return w;
      }
      message = JSON.stringify([action, details]);
      if (!socket_active()) {
        messages_pool.push(message);
      } else {
        socket.send(message);
      }
      return w;
    }
  };

  cs.WebSockets = w;

}).call(this);
