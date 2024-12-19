import React, { Component } from "react";
import PropTypes from "prop-types";
import NodeEditor from "./NodeEditor";
import InputGroup from "../inputs/InputGroup";
import StringInput from "../inputs/StringInput";
import { PlayCircle } from "styled-icons/fa-solid/PlayCircle";
import SelectInput from "../inputs/SelectInput";


const animationTypes = [
  {
    label: "Play",
    value: "play"
  },
  {
    label: "Play Loop",
    value: "loop"
  }
];
export default class AnimationControlNodeEditor extends Component {
  static propTypes = {
    editor: PropTypes.object,
    node: PropTypes.object
  };

  static iconComponent = PlayCircle;

  static description = `Animation control for a 3d model.`;

  onChangeAnimationName = animation_name => {
    this.props.editor.setPropertySelected("animation_name", animation_name);
  };

  onChangeAnimationTarget = animation_target => {
    this.props.editor.setPropertySelected("animation_target", animation_target);
  };

  onChangeAnimationType = animation_type => {
    this.props.editor.setPropertySelected("animation_type", animation_type);
  };

  onChangeProperty = (property, value) => {
    this.props.editor.setPropertySelected(property, value);
  };

  render() {
    const node = this.props.node;

    return (
      <NodeEditor description={AnimationControlNodeEditor.description} {...this.props}>
        <InputGroup name="Animation name">
          <StringInput value={node.animation_name} onChange={this.onChangeAnimationName} />
        </InputGroup>
        <InputGroup name="Animation Target">
          <StringInput value={node.animation_target} onChange={this.onChangeAnimationTarget} />
        </InputGroup>
        <InputGroup name="Animation Type">
          <SelectInput
            options={animationTypes}
            value={node.animation_type}
            onChange={value => {
              this.onChangeProperty("animation_type", value);
            }}
          />
        </InputGroup>
      </NodeEditor>
    );
  }
}
