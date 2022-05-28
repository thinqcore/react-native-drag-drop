import React, { Component, ReactNode } from "react";
import {
  Animated,
  GestureResponderEvent,
  PanResponder,
  PanResponderGestureState,
  PanResponderInstance,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";
import { LayoutProps } from "./Container";

export interface DraggableState {
  pan: Animated.ValueXY;
  dragging: boolean;
  pressed: boolean;
}

export interface DraggableProps {
  addedHeight: number;
  layout: LayoutProps | null;
  children: ReactNode;
  onDrag: (
    gestureState: PanResponderGestureState,
    layout: LayoutProps | null,
    cb: () => any,
    zoneId?: any
  ) => any;
  onGrant: (value: boolean) => any;
  onDragEnd: (gesture: PanResponderGestureState) => boolean;
  draggedElementStyle?: ViewStyle;
  style: ViewStyle;
  propsInItems?: TouchableOpacityProps;
  item: any;
  func: (i?: any, cb?: (i?: any) => void) => void;
}
class Draggable extends Component<DraggableProps, DraggableState> {
  state = {
    pan: new Animated.ValueXY(),
    dragging: false,
    pressed: false,
  };
  panResponder?: PanResponderInstance;
  onResponderMove = (
    e: GestureResponderEvent,
    gesture: PanResponderGestureState
  ) => {
    this.state.pan.setValue({
      x: gesture.dx,
      y: gesture.dy + this.props.addedHeight,
    });
    this.props.onDrag(gesture, this.props.layout, () => {
      this.state.pan.setValue({
        x: gesture.dx,
        y: gesture.dy + this.props.addedHeight,
      });
    });
  };
  onDragEnd = (e: GestureResponderEvent, gesture: PanResponderGestureState) => {
    this.setState((old: DraggableState): DraggableState => {
      if (old.dragging) {
        this.props.onGrant(true);
        if (!this.props.onDragEnd(gesture)) {
          this.state.pan.setValue({ x: 0, y: 0 });
        }
        return { ...old, dragging: false, pressed: false };
      } else {
        this.props.onGrant(false);
      }
      return old;
    });
  };
  onEnd = (e: GestureResponderEvent, gesture: PanResponderGestureState) => {
    this.onDragEnd(e, gesture);
  };
  UNSAFE_componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => this.state.pressed,
      onPanResponderGrant: () => {
        this.props.onGrant(true);
        this.setState({ dragging: true });
        this.state.pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: this.onResponderMove,
      onPanResponderTerminate: this.onEnd,
      onPanResponderEnd: this.onEnd,
      onPanResponderRelease: this.onDragEnd,
      onMoveShouldSetPanResponderCapture: () => this.state.pressed,
      onPanResponderReject: this.onEnd,
      onMoveShouldSetPanResponder: () => this.state.pressed,
      onPanResponderTerminationRequest: () => this.state.pressed,
      onShouldBlockNativeResponder: () => this.state.pressed,
      onStartShouldSetPanResponderCapture: () => this.state.pressed,
    });
  }
  render() {
    const panStyle: ViewStyle = {
      //@ts-ignore
      transform: this.state.pan.getTranslateTransform(),
    };

    let { draggedElementStyle, style, func, item } = this.props;
    if (this.state.pressed) {
      style = { ...style, ...draggedElementStyle };
    }
    if (this.state.dragging) {
      panStyle.zIndex = 1000;
      panStyle.elevation = 1000;
      style = { ...style, ...(draggedElementStyle || { opacity: 0.6 }) };
    }
    return (
      <Animated.View
        {...this.panResponder?.panHandlers}
        style={[panStyle, style]}
      >
        <TouchableOpacity
          delayLongPress={200}
          onLongPress={() => this.setState({ pressed: true }, () => {})}
          onPress={() => {
            func &&
              typeof func === "function" &&
              func(item, this.props.propsInItems?.onPress);
          }}
          {...this.props.propsInItems}
        >
          {this.props.children}
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

export default Draggable;
