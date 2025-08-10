"use strict";
const uni_modules_uviewPlus_libs_mixin_mpMixin = require("../../libs/mixin/mpMixin.js");
const uni_modules_uviewPlus_libs_mixin_mixin = require("../../libs/mixin/mixin.js");
const uni_modules_uviewPlus_libs_function_index = require("../../libs/function/index.js");
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "up-view",
  mixins: [uni_modules_uviewPlus_libs_mixin_mpMixin.mpMixin, uni_modules_uviewPlus_libs_mixin_mixin.mixin],
  emits: ["click"],
  computed: {
    valueStyle() {
    }
  },
  props: {
    backgroundColor: "",
    color: "",
    flexDirection: "",
    justifyContent: "",
    alignItems: "",
    flex1: "",
    width: "",
    height: "",
    padding: "",
    margin: "",
    borderColor: ""
  },
  data() {
    return {};
  },
  methods: {
    addStyle: uni_modules_uviewPlus_libs_function_index.addStyle,
    clickHandler() {
      this.$emit("click");
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.n(_ctx.class),
    b: $props.backgroundColor,
    c: $props.color,
    d: $props.flexDirection,
    e: $props.justifyContent,
    f: $props.alignItems,
    g: $props.flex1,
    h: $props.width,
    i: $props.height,
    j: $props.padding,
    k: $props.margin,
    l: $props.borderColor
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-02d480a7"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/uview-plus/components/u-view/u-view.js.map
