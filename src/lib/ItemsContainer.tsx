import React, { ReactElement } from "react";
import { PanResponderGestureState, TouchableOpacityProps, View, ViewStyle } from "react-native";
import Container, { ContainerProps, ContainerState, Display, LayoutProps } from "./Container";
import DragItem from "./DragItem";
import _ from "lodash";

interface ItemsContainerState extends ContainerState {
  layout: LayoutProps | null;
}
interface ItemsContainerProps extends ContainerProps {
  addedHeight: number;
  onDrag: (gestureState: PanResponderGestureState, layout: LayoutProps | null, cb: Function, zoneId: any) => any;
  onGrant: (value: boolean) => any;
  onDragEnd: (gesture: PanResponderGestureState) => boolean;
  draggedElementStyle?: ViewStyle;
  layout?: LayoutProps | null;
  style?: ViewStyle;
  dragging: boolean;
  itemsContainerHeightFixed?: boolean;
  itemKeyExtractor: (item: any) => number | string;
  itemsInZoneStyle?: ViewStyle;
  itemsContainerStyle?: ViewStyle;
  dragStyle?: ViewStyle;
  onLayout?: (layout: LayoutProps | null) => any;
  items: any[];
  renderItem: (item: any, index: number) => ReactElement;
  renderDragItem?: () => ReactElement;
  itemsDisplay?: Display;
  numCollumns?: number;
  zoneId?: number;
  propsInItems?: TouchableOpacityProps;
  func: (i?: any, cb?: (i?: any) => void) => void;
}
class ItemsContainer extends Container<ItemsContainerProps, ItemsContainerState> {
  ref = React.createRef<View>();
  onLayoutCallback = () => {
    if (this.props.onLayout) {
      this.props.onLayout(this.state.layout);
    }
  };
  render() {
    const {
      itemsContainerStyle,
      layout,
      dragging,
      itemKeyExtractor,
      onGrant,
      addedHeight,
      renderItem,
      onDragEnd,
      changed,
      onDrag,
      itemsContainerHeightFixed,
      draggedElementStyle,
      itemsInZoneStyle,
      items,
      itemsDisplay,
      numCollumns,
      zoneId,
      propsInItems,
      renderDragItem,
      dragStyle,
    } = this.props;
    const newItemsInZoneStyle: ViewStyle = {};
    const newItemsInZoneStyle2: ViewStyle = {};
    const newStyle: ViewStyle = {};
    const newStyle2: ViewStyle = {};
    if (dragging) {
      newStyle.zIndex = 10000;
    }
    if (itemsContainerHeightFixed) {
      newStyle.width = layout?.width;
      newStyle.height = layout?.height;
      newStyle2.width = layout?.width;
      newStyle2.height = layout?.height;
    }
    if (itemsDisplay === "row") {
      newStyle.flexDirection = "row";
      newStyle.alignItems = "center";
      newStyle.justifyContent = "space-between";
      newStyle.flexWrap = "wrap";
      newItemsInZoneStyle.width = `${100 / (numCollumns || 1) - (numCollumns && numCollumns > 0 ? 1 : 0)}%`;
    }
    const _itemsWithMulti = _.cloneDeep(items).filter((i) => i.multi == true);
    const _itemsFull = _.cloneDeep(items).filter((i) => i.multi == false);
    return (
      <React.Fragment>
        <View
          onLayout={(e) => {
            this.onSetLayout(e);
          }}
          style={[itemsContainerStyle, newStyle2]}>
          {_itemsFull.map((item, index) => {
            const key = itemKeyExtractor(item);
            return (
              <DragItem
                key={key}
                onDrag={onDrag}
                onGrant={onGrant}
                changed={changed}
                draggedElementStyle={draggedElementStyle}
                addedHeight={addedHeight}
                itemsInZoneStyle={{
                  ...itemsInZoneStyle,
                  ...newItemsInZoneStyle2,
                }}
                onDragEnd={onDragEnd}
                item={item}
                renderItem={renderItem}
                renderDragItem={renderDragItem}
                dragStyle={dragStyle}
                tabIndex={index}
                propsInItems={propsInItems}
                func={this.props.func}
              />
            );
          })}
        </View>
        <View
          onLayout={(e) => {
            this.onSetLayout(e);
          }}
          style={[itemsContainerStyle, newStyle]}>
          {_itemsWithMulti.map((item, index) => {
            const key = itemKeyExtractor(item);
            return (
              <DragItem
                key={key}
                onDrag={onDrag}
                onGrant={onGrant}
                changed={changed}
                draggedElementStyle={draggedElementStyle}
                addedHeight={addedHeight}
                itemsInZoneStyle={{
                  ...itemsInZoneStyle,
                  ...newItemsInZoneStyle,
                }}
                onDragEnd={onDragEnd}
                item={item}
                renderItem={renderItem}
                renderDragItem={renderDragItem}
                dragStyle={dragStyle}
                tabIndex={index}
                propsInItems={propsInItems}
                func={this.props.func}
              />
            );
          })}
        </View>
      </React.Fragment>
    );
  }
}

export default ItemsContainer;
