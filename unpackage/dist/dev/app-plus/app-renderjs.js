var __renderjsModules={};

__renderjsModules["06bd5139"] = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // <stdin>
  var stdin_exports = {};
  __export(stdin_exports, {
    default: () => stdin_default
  });

  // ../../../../uniapp2023/studyParty/uni_modules/gao-ChatSSEClient/components/gao-ChatSSEClient/constant.js
  var RETRY_BACKOFF_MULTIPLIER = 1.5;
  var DEFAULT_RETRY_INTERVAL = 1e3;

  // ../../../../uniapp2023/studyParty/uni_modules/gao-ChatSSEClient/components/gao-ChatSSEClient/fetch-event-source/parse.js
  function getBytes(stream, onChunk) {
    return __async(this, null, function* () {
      const reader = stream.getReader();
      let result;
      while (!(result = yield reader.read()).done) {
        onChunk(result.value);
      }
    });
  }
  function getLines(onLine) {
    let buffer;
    let position;
    let fieldLength;
    let discardTrailingNewline = false;
    return function onChunk(arr) {
      if (buffer === void 0) {
        buffer = arr;
        position = 0;
        fieldLength = -1;
      } else {
        buffer = concat(buffer, arr);
      }
      const bufLength = buffer.length;
      let lineStart = 0;
      while (position < bufLength) {
        if (discardTrailingNewline) {
          if (buffer[position] === 10) {
            lineStart = ++position;
          }
          discardTrailingNewline = false;
        }
        let lineEnd = -1;
        for (; position < bufLength && lineEnd === -1; ++position) {
          switch (buffer[position]) {
            case 58:
              if (fieldLength === -1) {
                fieldLength = position - lineStart;
              }
              break;
            case 13:
              discardTrailingNewline = true;
            case 10:
              lineEnd = position;
              break;
          }
        }
        if (lineEnd === -1) {
          break;
        }
        onLine(buffer.subarray(lineStart, lineEnd), fieldLength);
        lineStart = position;
        fieldLength = -1;
      }
      if (lineStart === bufLength) {
        buffer = void 0;
      } else if (lineStart !== 0) {
        buffer = buffer.subarray(lineStart);
        position -= lineStart;
      }
    };
  }
  function getMessages(onId, onRetry, onMessage) {
    let message = newMessage();
    let decoder;
    decoder = {
      decode(arraybuffer) {
        return decodeURIComponent(escape(String.fromCharCode(...arraybuffer)));
      }
    };
    decoder = new TextDecoder();
    return function onLine(line, fieldLength) {
      if (line.length === 0) {
        onMessage === null || onMessage === void 0 ? void 0 : onMessage(message);
        message = newMessage();
      } else if (fieldLength > 0) {
        const field = decoder.decode(line.subarray(0, fieldLength));
        const valueOffset = fieldLength + (line[fieldLength + 1] === 32 ? 2 : 1);
        const value = decoder.decode(line.subarray(valueOffset));
        switch (field) {
          case "data":
            message.data = message.data ? message.data + "\n" + value : value;
            break;
          case "event":
            message.event = value;
            break;
          case "id":
            onId(message.id = value);
            break;
          case "retry":
            const retry = parseInt(value, 10);
            if (!isNaN(retry)) {
              onRetry(message.retry = retry);
            }
            break;
          default:
            const msg = decoder.decode(line, { stream: true });
            message.data = msg;
            onMessage(message);
            break;
        }
      }
    };
  }
  function concat(a, b) {
    const res = new Uint8Array(a.length + b.length);
    res.set(a);
    res.set(b, a.length);
    return res;
  }
  function newMessage() {
    return {
      data: "",
      event: "",
      id: "",
      retry: void 0
    };
  }

  // ../../../../uniapp2023/studyParty/uni_modules/gao-ChatSSEClient/components/gao-ChatSSEClient/fetch-event-source/fetch.js
  var __rest = function(s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    return t;
  };
  var EventStreamContentType = "text/event-stream";
  var LastEventId = "last-event-id";
  var DEFAULT_TIMEOUT = 3e5;
  var HEARTBEAT_TIMEOUT = 12e4;
  var MAX_RETRY_COUNT = 5;
  function fetchEventSource(input, _a, extend) {
    var { signal: inputSignal, headers: inputHeaders, onopen: inputOnOpen, onmessage, onclose, onerror, openWhenHidden, fetch: inputFetch, timeout = DEFAULT_TIMEOUT, heartbeatTimeout = HEARTBEAT_TIMEOUT } = _a, rest = __rest(_a, ["signal", "headers", "onopen", "onmessage", "onclose", "onerror", "openWhenHidden", "fetch", "timeout", "heartbeatTimeout"]);
    const { maxRetryCount = MAX_RETRY_COUNT } = extend;
    return new Promise((resolve, reject) => {
      const headers = Object.assign({}, inputHeaders);
      if (!headers.accept) {
        headers.accept = EventStreamContentType;
      }
      let curRequestController;
      let retryCount = 0;
      let heartbeatTimer = null;
      let lastDataTime = Date.now();
      function onVisibilityChange() {
        curRequestController.abort();
        if (!document.hidden) {
          create();
        }
      }
      if (!openWhenHidden) {
        document.addEventListener("visibilitychange", onVisibilityChange);
      }
      let retryInterval = DEFAULT_RETRY_INTERVAL;
      let retryTimer = 0;
      function dispose() {
        document.removeEventListener("visibilitychange", onVisibilityChange);
        window.clearTimeout(retryTimer);
        clearHeartbeatTimer();
        curRequestController.abort();
      }
      function clearHeartbeatTimer() {
        if (heartbeatTimer) {
          window.clearTimeout(heartbeatTimer);
          heartbeatTimer = null;
        }
      }
      function resetHeartbeatTimer() {
        clearHeartbeatTimer();
        lastDataTime = Date.now();
        heartbeatTimer = window.setTimeout(() => {
          console.warn("\u{1F494} SSE\u5FC3\u8DF3\u8D85\u65F6\uFF0C\u4E3B\u52A8\u65AD\u5F00\u8FDE\u63A5\u91CD\u8FDE");
          curRequestController.abort();
          retryTimer = window.setTimeout(create, 2e3);
        }, heartbeatTimeout);
      }
      inputSignal === null || inputSignal === void 0 ? void 0 : inputSignal.addEventListener("abort", () => {
        dispose();
        resolve();
      });
      const fetch = inputFetch !== null && inputFetch !== void 0 ? inputFetch : window.fetch;
      const onopen = inputOnOpen !== null && inputOnOpen !== void 0 ? inputOnOpen : defaultOnOpen;
      function create() {
        return __async(this, null, function* () {
          var _a2;
          curRequestController = new AbortController();
          const timeoutId = window.setTimeout(() => {
            console.warn("\u23F0 SSE\u8BF7\u6C42\u8D85\u65F6\uFF0C\u4E3B\u52A8\u65AD\u5F00\u8FDE\u63A5");
            curRequestController.abort();
          }, timeout);
          try {
            console.log(`\u{1F504} \u5F00\u59CBSSE\u8FDE\u63A5\uFF0C\u91CD\u8BD5\u6B21\u6570: ${retryCount}/${maxRetryCount}`);
            const response = yield fetch(input, Object.assign(Object.assign({}, rest), {
              headers,
              signal: curRequestController.signal
            }));
            window.clearTimeout(timeoutId);
            yield onopen(response);
            retryCount = 0;
            resetHeartbeatTimer();
            yield getBytes(response.body, getLines(getMessages((id) => {
              resetHeartbeatTimer();
              if (id) {
                headers[LastEventId] = id;
              } else {
                delete headers[LastEventId];
              }
            }, (retry) => {
              retryInterval = retry;
            }, (message) => {
              resetHeartbeatTimer();
              if (onmessage) {
                onmessage(message);
              }
            })));
            onclose === null || onclose === void 0 ? void 0 : onclose();
            dispose();
            resolve();
          } catch (err) {
            window.clearTimeout(timeoutId);
            clearHeartbeatTimer();
            if (!curRequestController.signal.aborted) {
              console.error(`\u274C SSE\u8FDE\u63A5\u9519\u8BEF (\u7B2C${retryCount + 1}\u6B21):`, err);
              try {
                if (retryCount < maxRetryCount) {
                  retryCount++;
                  const backoffDelay = retryInterval * Math.pow(RETRY_BACKOFF_MULTIPLIER, retryCount - 1);
                  const interval = (_a2 = onerror === null || onerror === void 0 ? void 0 : onerror(err)) !== null && _a2 !== void 0 ? _a2 : backoffDelay;
                  console.log(`\u{1F504} \u5C06\u5728 ${interval}ms \u540E\u8FDB\u884C\u7B2C${retryCount}\u6B21\u91CD\u8BD5`);
                  window.clearTimeout(retryTimer);
                  retryTimer = window.setTimeout(create, interval);
                } else {
                  console.error("\u274C \u8FBE\u5230\u6700\u5927\u91CD\u8BD5\u6B21\u6570\uFF0C\u505C\u6B62\u91CD\u8BD5");
                  dispose();
                  reject(new Error(`SSE\u8FDE\u63A5\u5931\u8D25\uFF0C\u5DF2\u91CD\u8BD5${maxRetryCount}\u6B21: ${err.message}`));
                }
              } catch (innerErr) {
                console.error("\u274C \u9519\u8BEF\u5904\u7406\u8FC7\u7A0B\u4E2D\u53D1\u751F\u5F02\u5E38:", innerErr);
                dispose();
                reject(innerErr);
              }
            } else {
              console.log("\u{1F6D1} SSE\u8FDE\u63A5\u88AB\u4E3B\u52A8\u4E2D\u6B62");
            }
          }
        });
      }
      create();
    });
  }
  function defaultOnOpen(response) {
    const contentType = response.headers.get("content-type");
    if (!(contentType === null || contentType === void 0 ? void 0 : contentType.startsWith(EventStreamContentType))) {
      throw new Error(`Expected content-type to be ${EventStreamContentType}, Actual: ${contentType}`);
    }
  }

  // <stdin>
  var stdin_default = {
    data() {
      return {
        ctrl: null
      };
    },
    methods: {
      objToJson(obj) {
        const json = {};
        for (const key in obj) {
          const val = obj[key];
          if (typeof val === "string" || typeof val === "number" || typeof val === "boolean") {
            json[key] = val;
          } else {
            json[key] = val.toString();
          }
        }
        return json;
      },
      /**
       * 停止生成
       */
      stopChatCore() {
        var _a;
        (_a = this.ctrl) == null ? void 0 : _a.abort();
      },
      /**
       * 开始对话
       */
      startChatCore(data) {
        const { url, body, headers, method, timeout, heartbeatTimeout, maxRetryCount } = data;
        if (!url)
          return;
        console.log(data);
        try {
          this.ctrl = new AbortController();
          fetchEventSource(
            url,
            {
              readJson: true,
              method,
              openWhenHidden: true,
              signal: this.ctrl.signal,
              timeout: timeout || 3e5,
              heartbeatTimeout: heartbeatTimeout || 12e4,
              headers: __spreadValues({
                "Content-Type": "application/json"
              }, headers),
              body: body ? body : void 0,
              onopen: (response) => {
                this.$ownerInstance.callMethod("open", this.objToJson(response));
              },
              onmessage: (data2) => {
                this.$ownerInstance.callMethod("message", data2);
              },
              onerror: (err) => {
                console.error("\u274C SSE\u8FDE\u63A5\u9519\u8BEF:", err);
                this.$ownerInstance.callMethod("error", JSON.stringify(err));
                return 3e3;
              }
            },
            {
              maxRetryCount
            }
          ).then(() => {
            this.$ownerInstance.callMethod("finish");
          }).catch((err) => {
            console.error("\u{1F4A5} SSE\u8FDE\u63A5\u5F02\u5E38:", err);
            this.$ownerInstance.callMethod("error", err);
          });
        } catch (e) {
          console.error("\u{1F6A8} \u542F\u52A8SSE\u8FDE\u63A5\u65F6\u51FA\u73B0\u5F02\u5E38:", e);
        }
      }
    }
  };
  return __toCommonJS(stdin_exports);
})();
