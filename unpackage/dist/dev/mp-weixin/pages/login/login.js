"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      form: {
        phone: "",
        password: ""
      }
    };
  },
  methods: {
    handleLogin() {
      common_vendor.index.__f__("log", "at pages/login/login.vue:52", "登录信息：", this.form);
    }
  }
};
if (!Array) {
  const _easycom_u_text2 = common_vendor.resolveComponent("u-text");
  const _easycom_u_input2 = common_vendor.resolveComponent("u-input");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_link2 = common_vendor.resolveComponent("u-link");
  const _easycom_u_view2 = common_vendor.resolveComponent("u-view");
  (_easycom_u_text2 + _easycom_u_input2 + _easycom_u_button2 + _easycom_u_link2 + _easycom_u_view2)();
}
const _easycom_u_text = () => "../../uni_modules/uview-plus/components/u-text/u-text.js";
const _easycom_u_input = () => "../../uni_modules/uview-plus/components/u-input/u-input.js";
const _easycom_u_button = () => "../../uni_modules/uview-plus/components/u-button/u-button.js";
const _easycom_u_link = () => "../../uni_modules/uview-plus/components/u-link/u-link.js";
const _easycom_u_view = () => "../../uni_modules/uview-plus/components/u-view/u-view.js";
if (!Math) {
  (_easycom_u_text + _easycom_u_input + _easycom_u_button + _easycom_u_link + _easycom_u_view)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $data.form.phone = $event),
    b: common_vendor.p({
      placeholder: "请输入手机号",
      type: "number",
      border: "bottom",
      modelValue: $data.form.phone
    }),
    c: common_vendor.o(($event) => $data.form.password = $event),
    d: common_vendor.p({
      placeholder: "请输入密码",
      type: "password",
      border: "bottom",
      modelValue: $data.form.password
    }),
    e: common_vendor.o($options.handleLogin),
    f: common_vendor.p({
      type: "primary"
    }),
    g: common_vendor.p({
      url: "/pages/register/register",
      type: "default",
      ["hover-class"]: "none"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e4e4508d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
