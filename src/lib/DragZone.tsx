import React, { ReactElement } from "react";
import { LayoutChangeEvent, PanResponderGestureState, TouchableOpacityProps, View, ViewStyle } from "react-native";
import Container, { ContainerProps, ContainerState, Display, LayoutProps } from "./Container";
import ItemsContainer from "./ItemsContainer";

interface DragZOneState extends ContainerState {
  layout: LayoutProps;
}
interface DragZOneProps extends ContainerProps {
  addedHeight: number;
  onDrag: (gestureState: PanResponderGestureState, layout: LayoutProps | null, cb: Function, zoneId: any) => any;
  onGrant: (value: boolean) => any;
  onDragEnd: (gesture: PanResponderGestureState) => boolean;
  draggedElementStyle?: ViewStyle;
  itemKeyExtractor: (item: any) => number | string;
  itemsInZoneStyle?: ViewStyle;
  dragStyle?: ViewStyle;
  zoneId: any;
  zone: any;
  onZoneLayoutChange: (zoneId: any, layout: LayoutProps) => any;
  renderItem: (item: any, index: number) => ReactElement;
  renderDragItem?: () => ReactElement;
  renderZone: (zone: any, children?: ReactElement, hover?: boolean) => ReactElement;
  itemsDisplay?: Display;
  numCollumns?: number;
  listZonesIdApplyMulti?: number[];
  propsInItems?: TouchableOpacityProps;
  func: (i?: any, cb?: (i?: any) => void) => void;
}
class DragZOne extends Container<DragZOneProps, DragZOneState> {
  ref = React.createRef<View>();
  onLayoutCallback = () => {
    this.props.onZoneLayoutChange(this.props.zoneId, this.state.layout);
  };
  renderItems = (items: any): any => {
    const { renderItem, itemKeyExtractor, addedHeight, onDrag, itemsInZoneStyle, draggedElementStyle, onGrant, onDragEnd, changed, zoneId, itemsDisplay, numCollumns, listZonesIdApplyMulti, renderDragItem, dragStyle } = this.props;
    let _itemsDisplay = itemsDisplay;
    if (listZonesIdApplyMulti && listZonesIdApplyMulti.length > 0 && !listZonesIdApplyMulti.includes(zoneId)) {
      _itemsDisplay = "collumn";
    }
    if (!items || items.length === 0) return null;
    return (
      <ItemsContainer
        itemsContainerStyle={{}}
        dragging={false}
        onGrant={onGrant}
        addedHeight={addedHeight}
        numCollumns={numCollumns}
        itemsDisplay={_itemsDisplay}
        changed={changed}
        draggedElementStyle={draggedElementStyle}
        itemsInZoneStyle={itemsInZoneStyle}
        itemKeyExtractor={itemKeyExtractor}
        renderItem={renderItem}
        renderDragItem={renderDragItem}
        dragStyle={dragStyle}
        onDragEnd={onDragEnd}
        onDrag={(e, l, cb) => onDrag(e, l, cb, zoneId)}
        items={items}
        zoneId={zoneId}
        propsInItems={this.props.propsInItems}
        func={this.props.func}
      />
    );
  };
  render() {
    const { renderZone, zone } = this.props;
    const hover = zone.layout?.hover;
    const child = renderZone(zone, this.renderItems(zone.items), hover);
    const newStyle: ViewStyle = {};
    if (zone.dragged) {
      newStyle.zIndex = 10000;
      newStyle.elevation = 10000;
    }
    return React.cloneElement(child, {
      style: { ...newStyle, ...child.props.style },
      ref: this.ref,
      onLayout: (e: LayoutChangeEvent) => this.onSetLayout(e),
    });
  }
}

export default DragZOne;
