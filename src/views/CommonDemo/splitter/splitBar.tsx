import {
  defineComponent,
  reactive,
  ref,
  computed,
  watch,
  withDirectives,
  inject,
} from "vue";
import { setStyle } from "../../../utils/setStyle";
import resize, { type ResizeDirectiveProp } from "@/directives/resize";
import type {
  splitStore,
  splitPane,
  DragState,
  splitState,
} from "./splitStore";

export default defineComponent({
  props: {
    showCollapseButton: {
      type: Boolean,
      default: true,
    },
    orientation: {
      type: String,
      default: "vertical",
    },
    splitBarSize: {
      type: String,
      default: "2px",
    },
    /**
     * 当前 pane 的索引
     */
    index: {
      type: Number,
    },
  },
  setup(props) {
    const state = reactive({
      wrapperClass: `split-bar split-bar--${props.orientation} resizable`,
    });
    const domRef = ref<null | HTMLElement>();
    const store = inject<splitStore>("splitStore");
    watch(
      [() => props.splitBarSize, domRef],
      ([curSplitBarSize, ele]) => {
        if (!(ele instanceof HTMLElement)) {
          return;
        }
        setStyle(ele, { flexBasis: curSplitBarSize });
      },
      { immediate: true }
    );
    const queryPanes = (index: number, nearIndex: number) => {
      if (!store) {
        return {};
      }
      const pane = store.getPane(index);
      const nearPane = store.getPane(nearIndex);
      return {
        pane,
        nearPane,
      };
    };
    // 根据当前状态生成收起按钮样式
    const generateCollapseClass = (
      pane: splitPane | undefined,
      nearPane: splitPane | undefined,
      showIcon: boolean
    ) => {
      // 是否允许收起
      const isCollapsible = pane?.component?.props?.collapsible && showIcon;
      // 当前收起状态
      const isCollapsed = pane?.component?.props?.collapsed;
      // 一个 pane 收起的时候，隐藏相邻 pane 的收起按钮
      const isNearPaneCollapsed = nearPane?.collapsed;
      return {
        split__collapse: isCollapsible,
        collapsed: isCollapsed,
        hidden: isNearPaneCollapsed,
      };
    };
    // 计算前面板收起操作样式
    const prevClass = computed(() => {
      if (!props || props.index === undefined) {
        return {};
      }
      const { pane, nearPane } = queryPanes(props.index, props.index + 1);
      // 第一个面板或者其它面板折叠方向不是向后的， 显示操作按钮
      const showIcon =
        pane?.component?.props?.collapseDirection !== "after" ||
        props.index === 0;
      console.log(
        generateCollapseClass(pane, nearPane, showIcon),
        "generateCollapseClass(pane, nearPane, showIcon)"
      );
      return generateCollapseClass(pane, nearPane, showIcon);
    });

    // 计算相邻面板收起操作样式
    const nextClass = computed(() => {
      if (!store || !props || props.index === undefined) {
        return {};
      }
      const { pane, nearPane } = queryPanes(props.index + 1, props.index);
      // 最后一个面板或者其它面板折叠方向不是向前的显示操作按钮
      const showIcon =
        pane?.component?.props?.collapseDirection !== "before" ||
        props.index + 1 === store.state.paneCount - 1;
      return generateCollapseClass(pane, nearPane, showIcon);
    });
    // 指令输入值
    const coordinate = {
      pageX: 0,
      pageY: 0,
      originalX: 0,
      originalY: 0,
    };
    let initState: DragState;
    const resizeProp: ResizeDirectiveProp = {
      enableResize: true,
      onPressEvent: function ({ originalEvent }): void {
        originalEvent.stopPropagation(); // 按下的时候，阻止事件冒泡
        if (!store || !props || props.index === undefined) {
          return;
        }
        if (!store.isResizable(props.index)) {
          return;
        }
        initState = store.dragState(props.index);
        coordinate.originalX = originalEvent.pageX;
        coordinate.originalY = originalEvent.pageY;
      },
      onDragEvent: function ({ originalEvent }): void {
        originalEvent.stopPropagation(); // 移动的时候，阻止事件冒泡
        if (!store || !props || props.index === undefined) {
          return;
        }
        if (!store.isResizable(props.index)) {
          return;
        }
        coordinate.pageX = originalEvent.pageX;
        coordinate.pageY = originalEvent.pageY;
        let distance;
        if (props.orientation === "vertical") {
          distance = coordinate.pageY - coordinate.originalY;
        } else {
          distance = coordinate.pageX - coordinate.originalX;
        }
        store.setSize(initState, distance);
      },
      onReleaseEvent: function ({ originalEvent }): void {
        originalEvent.stopPropagation(); // 释放的时候，阻止事件冒泡
        if (!store || !props || props.index === undefined) {
          return;
        }
        if (!store.isResizable(props.index)) {
          return;
        }
        coordinate.pageX = originalEvent.pageX;
        coordinate.pageY = originalEvent.pageY;
        let distance;
        if (props.orientation === "vertical") {
          distance = coordinate.pageY - coordinate.originalY;
        } else {
          distance = coordinate.pageX - coordinate.originalX;
        }
        store.setSize(initState, distance);
      },
    };
    return () => {
      return withDirectives(
        <div class={state.wrapperClass} ref={domRef}>
          {props.showCollapseButton && (
            <el-toolTip content={"prev"}>
              <div class={["prev", prevClass.value]}>{prevClass.value}</div>
            </el-toolTip>
          )}
          {props.showCollapseButton && (
            <el-toolTip content={"next"}>
              <div class={["next", nextClass.value]}>{nextClass.value}</div>
            </el-toolTip>
          )}
        </div>,
        [[resize, resizeProp]]
      );
    };
  },
});
