import React, { ReactElement } from "react";
import { PanResponderGestureState, TouchableOpacityProps, View, ViewStyle } from "react-native";
import Container, { ContainerProps, ContainerState, Display, LayoutProps } from "./Container";
import DragZOne from "./DragZone";

interface ZonesContainerState extends ContainerState {
  layout: LayoutProps;
}
interface ZonesContainerProps extends ContainerProps {
  addedHeight: number;
  onDrag: (gestureState: PanResponderGestureState, layout: LayoutProps | null, cb: Function, zoneId: any) => any;
  onGrant: (value: boolean) => any;
  onDragEnd: (gesture: PanResponderGestureState) => boolean;
  draggedElementStyle?: ViewStyle;
  itemKeyExtractor: (item: any) => number | string;
  zoneKeyExtractor: (item: any) => number | string;
  itemsDisplay?: Display;
  numCollumns?: number;
  itemsInZoneStyle?: ViewStyle;
  dragStyle?: ViewStyle;
  zonesContainerStyle?: ViewStyle;
  onZoneLayoutChange: (zoneId: any, layout: LayoutProps) => any;
  zones: any[];
  renderItem: (item: any, index: number) => ReactElement;
  renderDragItem?: () => ReactElement;
  renderZone: (zone: any, children?: ReactElement, hover?: boolean) => ReactElement;
  listZonesIdApplyMulti?: number[];
  propsInItems?: TouchableOpacityProps;
  func: (i?: any, cb?: (i?: any) => void) => void;
}
class ZonesContainer extends Container<ZonesContainerProps, ZonesContainerState> {
  ref = React.createRef<View>();
  render() {
    const {
      itemKeyExtractor,
      renderItem,
      zonesContainerStyle,
      onZoneLayoutChange,
      onDragEnd,
      zoneKeyExtractor,
      itemsInZoneStyle,
      onGrant,
      changed,
      onDrag,
      zones,
      renderZone,
      draggedElementStyle,
      addedHeight,
      itemsDisplay,
      numCollumns,
      listZonesIdApplyMulti,
      propsInItems,
      renderDragItem,
      dragStyle,
    } = this.props;
    return (
      <View style={zonesContainerStyle}>
        {zones.map((zone) => {
          const key = zoneKeyExtractor(zone);
          return (
            <DragZOne
              onZoneLayoutChange={onZoneLayoutChange}
              zoneId={key}
              key={key}
              renderItem={renderItem}
              renderDragItem={renderDragItem}
              dragStyle={dragStyle}
              addedHeight={addedHeight}
              itemsDisplay={itemsDisplay}
              numCollumns={numCollumns}
              changed={changed}
              onGrant={onGrant}
              onDragEnd={onDragEnd}
              draggedElementStyle={draggedElementStyle}
              zone={zone}
              itemsInZoneStyle={itemsInZoneStyle}
              itemKeyExtractor={itemKeyExtractor}
              onDrag={onDrag}
              renderZone={renderZone}
              listZonesIdApplyMulti={listZonesIdApplyMulti}
              propsInItems={propsInItems}
              func={this.props.func}
            />
          );
        })}
      </View>
    );
  }
}

export default ZonesContainer;
