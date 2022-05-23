import React, { ReactElement } from "react";
import {
  LayoutChangeEvent,
  PanResponderGestureState,
  View,
  ViewStyle,
} from "react-native";
import Container, {
  ContainerProps,
  ContainerState,
  LayoutProps,
} from "./Container";
import Draggable from "./Draggable";

interface DragItemState extends ContainerState {
  layout: LayoutProps | null;
}
interface DragItemProps extends ContainerProps {
  addedHeight: number;
  onDrag: (
    gestureState: PanResponderGestureState,
    layout: LayoutProps | null,
    cb: Function,
    zoneId: any
  ) => any;
  onGrant: (value: boolean) => any;
  onDragEnd: (gesture: PanResponderGestureState) => boolean;
  draggedElementStyle?: ViewStyle;
  style?: ViewStyle;
  itemsInZoneStyle?: ViewStyle;
  item: any;
  renderItem: (item: any, index: number) => ReactElement;
  tabIndex: number;
}
class DragItem extends Container<DragItemProps, DragItemState> {
  state: DragItemState = {
    layout: null,
    mounted: false,
  };
  ref = React.createRef<View>();
  render() {
    const {
      onDrag,
      onDragEnd,
      item,
      renderItem,
      onGrant,
      tabIndex,
      addedHeight,
      itemsInZoneStyle,
      draggedElementStyle,
    } = this.props;
    let _child = null;
    if(item.multi) {
      _child = renderItem(item, tabIndex);
    } else {
      _child = renderItem(item, -1);
    }
    // const child = renderItem(item, tabIndex);
    const newChild = React.cloneElement(_child, {
      style: {},
      ref: this.ref,
      onLayout: (e: LayoutChangeEvent) => this.onSetLayout(e),
    });
    return (
      <Draggable
        layout={this.state.layout}
        onDrag={onDrag}
        onGrant={onGrant}
        draggedElementStyle={draggedElementStyle}
        addedHeight={addedHeight}
        style={{
          ..._child.props.style,
          ...itemsInZoneStyle,
        }}
        onDragEnd={() => onDragEnd(item)}
      >
        {newChild}
      </Draggable>
    );
  }
}

export default DragItem;
