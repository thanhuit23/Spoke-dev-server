import React, { Component } from "react";
import PropTypes from "prop-types";
import NodeEditor from "./NodeEditor";
import InputGroup from "../inputs/InputGroup";
import StringInput from "../inputs/StringInput";
import { Anchor } from "styled-icons/fa-solid/Anchor";

/*
export default function GatewayNodeEditor(props) {
    const { editor, node } = props;

    // 변경
    const onChangeLinkUrl = useSetPropertySelected(editor, "linkUrl")

    // 속성 패널에서 속성을 설정할 에디터 추가
    return (
        <NodeEditor {...props} description={GatewayNodeEditor.description}>
            <InputGroup name="linkUrl">
                <ImageInput value={node.linkUrl} onChange={onChangeLinkUrl} />
            </InputGroup>
        </NodeEditor>
    );
}

// Element에 노출되는 아이콘
GatewayNodeEditor.iconComponent = Anchor;

// Element 패널과 속성 패널에 노출되는 설명문
GatewayNodeEditor.description = "Link to a room or a website.";

GatewayNodeEditor.propTypes = {
  editor: PropTypes.object.isRequired,
  node: PropTypes.object.isRequired
};
*/

export default class GatewayNodeEditor extends Component {
    static propTypes = {
      editor: PropTypes.object,
      node: PropTypes.object
    };

    // Element에 노출되는 아이콘
    static iconComponent = Anchor;

    // Element 패널과 속성 패널에 노출되는 설명문
    static description = "A gateway to a room or a website.";

    // 변경
    onChangeLinkUrl = linkUrl => {
        this.props.editor.setPropertySelected("linkUrl", linkUrl);
    };

    // 렌더 - 속성 패널에서 속성을 설정할 에디터 추가
    render() {
        const node = this.props.node;

        return (
            <NodeEditor description={GatewayNodeEditor.description} {...this.props}>
                <InputGroup name="linkUrl">
                    <StringInput value={node.linkUrl} onChange={this.onChangeLinkUrl} />
                </InputGroup>
            </NodeEditor>
        );
    }
}

