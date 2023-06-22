import React, { ReactElement } from "react";
import { LayoutChangeEvent, PanResponderGestureState, TouchableOpacityProps, View, ViewStyle } from "react-native";
import _ from "lodash";
import Container, { ContainerProps, ContainerState, LayoutProps } from "./Container";
import Draggable from "./Draggable";

interface DragItemState extends ContainerState {
  layout: LayoutProps | null;
}
interface DragItemProps extends ContainerProps {
  addedHeight: number;
  onDrag: (gestureState: PanResponderGestureState, layout: LayoutProps | null, cb: Function, zoneId: any) => any;
  onGrant: (value: boolean) => any;
  onDragEnd: (gesture: PanResponderGestureState) => boolean;
  draggedElementStyle?: ViewStyle;
  style?: ViewStyle;
  dragStyle?: ViewStyle;
  itemsInZoneStyle?: ViewStyle;
  item: any;
  renderItem: (item: any, index: number) => ReactElement;
  renderDragItem?: () => ReactElement;
  tabIndex: number;
  propsInItems?: TouchableOpacityProps;
  func: (i?: any, cb?: (i?: any) => void) => void;
}
class DragItem extends Container<DragItemProps, DragItemState> {
  state: DragItemState = {
    layout: null,
    mounted: false,
  };
  ref = React.createRef<View>();
  render() {
    const { onDrag, onDragEnd, item, renderItem, dragStyle, renderDragItem, onGrant, tabIndex, addedHeight, itemsInZoneStyle, draggedElementStyle, propsInItems } = this.props;
    let _child = null;
    let _dragAreaChild = null;
    if (renderDragItem) {
      _dragAreaChild = renderDragItem();
    }
    if (item.multi) {
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
    let dragAreaChild = null;
    if (_dragAreaChild) {
      dragAreaChild = React.cloneElement(_dragAreaChild, {
        style: {},
        ref: this.ref,
        onLayout: (e: LayoutChangeEvent) => this.onSetLayout(e),
      });
    }
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
        dragAreaChild={dragAreaChild}
        dragArea={dragAreaChild != null}
        propsInItems={propsInItems}
        dragStyle={dragStyle}
        item={item}
        func={this.props.func}>
        {newChild}
      </Draggable>
    );
  }
}

export default DragItem;
