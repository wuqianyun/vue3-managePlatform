import {
  defineComponent,
  reactive,
  ref,
  provide,
  onUnmounted,
  onMounted,
  watch,
  inject,
} from "vue";
import type { splitStore } from "./splitStore";
import { addClass, hasClass, removeClass } from "../../../utils/class";
import { setStyle } from "../../../utils/setStyle";

export default defineComponent({
  name: "splitPane",
  props: {
    collapsed: {
      type: Boolean,
      default: true,
    },
    /**
     * 可选，指定 pane 是否可折叠收起
     */
    collapsible: {
      type: Boolean,
      default: true,
    },
    /**
     * 可选，是否在 pane 进行折叠后收缩 pane 宽度而非收起
     */
    shrink: {
      type: Boolean,
      default: false,
    },
    /**
     * 可选，折叠后收缩的 pane 宽度 （单位：px）
     */
    shrinkWidth: {
      type: Number,
      default: 36,
    },
    /**
     * 可选，指定 pane 宽度，设置像素值或者百分比
     * pane初始化大小
     */
    size: {
      type: String,
    },
  },
  setup(props, { slots, expose }) {
    const store = inject<splitStore>("splitStore");
    const domRef = ref<null | HTMLElement>();
    const orderRef = ref();
    watch([orderRef, domRef], ([order, ele]) => {
      if (!ele) {
        return;
      }
      setStyle(ele, { order });
    });
    let initialSize = ""; // 记录初始化挂载传入的大小
    onMounted(() => {
      if (props.size) {
        initialSize = props.size;
      }
      if (store) {
        store.setPanes({ panes: store.state.panes });
      }
    });
    watch(
      [() => props.collapsed, domRef],
      ([collapsed, ele]) => {
        if (!ele) {
          return;
        }
        const paneHiddenClass = "split-pane--hidden";
        if (!collapsed) {
          removeClass(ele, paneHiddenClass);
        } else {
          addClass(ele, paneHiddenClass);
        }

        if (collapsed && props.shrink) {
          removeClass(ele, paneHiddenClass);
          setStyle(ele, { flexBasis: `${props.shrinkWidth}px` });
        } else {
          console.log({ flexBasis: initialSize });
          setStyle(ele, { flexBasis: initialSize });
        }
      },
      { immediate: true }
    );
    // 暴露给外部使用
    expose({
      order: orderRef,
    });
    return () => (
      <div class="split-pane" ref={domRef}>
        {slots.default?.()}
      </div>
    );
  },
});
