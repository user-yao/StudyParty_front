"use strict";
const common_vendor = require("../common/vendor.js");
const store_modules_user = require("./modules/user.js");
const store_modules_group = require("./modules/group.js");
const store_modules_article = require("./modules/article.js");
const store = common_vendor.createStore({
  modules: {
    user: store_modules_user.user,
    group: store_modules_group.group,
    article: store_modules_article.article
  }
});
exports.store = store;
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/index.js.map
