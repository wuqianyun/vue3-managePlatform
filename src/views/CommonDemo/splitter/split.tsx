import {
  defineComponent,
  reactive,
  ref,
  provide,
  onUnmounted,
  watch,
} from "vue";
import type { VNode } from "vue";
import splitBar from "./splitBar";
import { splitStore, type splitPane } from "./splitStore";
interface splitState {
  panes: VNode[];
}

export default defineComponent({
  name: "split",
  components: { splitBar },
  props: {
    orientation: {
      type: String,
      default: "vertical",
    },
    splitBarSize: {
      type: String,
      default: "2px",
    },
    showCollapseButton: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, ctx) {
    const store: splitStore = new splitStore();
    const state: splitState = reactive({
      panes: [], // 面板
    });
    state.panes = ctx.slots.splitPane?.() || [];
    store.setPanes({ panes: state.panes as unknown as splitPane[] });

    provide("orientation", props.orientation);
    provide("splitStore", store);

    const domRef = ref<HTMLElement>();
    return () => {
      const { splitBarSize, orientation, showCollapseButton } = props;
      const wrapperClass = ["split", `split--${orientation}`];
      return (
        <div class={wrapperClass} ref={domRef}>
          {state.panes}
          {state.panes
            .filter((_, index, arr) => index !== arr.length - 1)
            .map((_, index) => {
              return (
                <split-bar
                  index={index}
                  style={`order: ${index * 2 + 1}`}
                  splitBarSize={splitBarSize}
                  orientation={orientation}
                  showCollapseButton={showCollapseButton}
                ></split-bar>
              );
            })}
        </div>
      );
    };
  },
});
