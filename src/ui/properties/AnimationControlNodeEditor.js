import React, { Component } from "react";
import PropTypes from "prop-types";
import configs from "../../configs";
import NodeEditor from "./NodeEditor";
import InputGroup from "../inputs/InputGroup";
import StringInput from "../inputs/StringInput";
import { Link } from "styled-icons/fa-solid/Link";

export default class AnimationControlNodeEditor extends Component {
  static propTypes = {
    editor: PropTypes.object,
    node: PropTypes.object
  };

  static iconComponent = Link;

  static description = `Animation control for a 3d model.`;

  onChangeAnimationName = animation_name => {
    this.props.editor.setPropertySelected("animation_name", animation_name);
  };

  render() {
    const node = this.props.node;

    return (
      <NodeEditor description={AnimationControlNodeEditor.description} {...this.props}>
        <InputGroup name="Animation name">
          <StringInput value={node.animation_name} onChange={this.onChangeAnimationName} />
        </InputGroup>
      </NodeEditor>
    );
  }
}
