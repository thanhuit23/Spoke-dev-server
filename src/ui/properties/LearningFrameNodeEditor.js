import React, { Component } from "react";
import PropTypes from "prop-types";
import NodeEditor from "./NodeEditor";
import InputGroup from "../inputs/InputGroup";
import StringInput from "../inputs/StringInput";
import { Desktop } from "styled-icons/fa-solid/Desktop";

export default class LearningFrameNodeEditor extends Component {
    static propTypes = {
      editor: PropTypes.object,
      node: PropTypes.object
    };

    // Element에 노출되는 아이콘
    static iconComponent = Desktop;

    // Element 패널과 속성 패널에 노출되는 설명문
    static description = "A learning frame to learning media.";

    // 변경
    onChangeSource = source => {
        this.props.editor.setPropertySelected("source", source);
    };

    // 렌더 - 속성 패널에서 속성을 설정할 에디터 추가
    render() {
        const node = this.props.node;

        return (
            <NodeEditor description={LearningFrameNodeEditor.description} {...this.props}>
                <InputGroup name="source">
                    <StringInput value={node.source} onChange={this.onChangeSource} />
                </InputGroup>
            </NodeEditor>
        );
    }
}

