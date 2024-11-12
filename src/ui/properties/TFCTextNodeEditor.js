import React, { Component } from "react";
import PropTypes from "prop-types";
import NodeEditor from "./NodeEditor";
import { AlignCenter } from "styled-icons/fa-solid/AlignCenter";
import InputGroup from "../inputs/InputGroup";
import StringInput from "../inputs/StringInput";
import NumericInputGroup from "../inputs/NumericInputGroup";
import ColorInput from "../inputs/ColorInput";
import BooleanInput from "../inputs/BooleanInput";
import SelectInput from "../inputs/SelectInput";

// 텍스트 정렬 (left, center, right)
const textAlignments = [
    {
        label: "left",
        value: "left"
    },
    {
        label: "center",
        value: "center"
    },
    {
        label: "right",
        value: "right"
    }
];

// 텍스트 줄 바꿈 (normal: 일반, breakall: 글자 단위, keepall: 공백 단위)
const wordBreak = [
    {
        label: "normal",
        value: "normal"
    },
    {
        label: "breakall",
        value: "breakall"
    },
    {
        label: "keepall",
        value: "keepall"
    }
];

export default class TFCTextNodeEditor extends Component {
    static propTypes = {
        editor: PropTypes.object,
        node: PropTypes.object
    };

    // Element에 노출되는 아이콘
    static iconComponent = AlignCenter;

    // Element 패널과 속성 패널에 노출되는 설명문
    static description = "Creates a 3D text element.";

    // 변경
    onChangeProperty = (property, value) => {
        this.props.editor.setPropertySelected(property, value);
    };

    // 렌더 - 속성 패널에서 속성을 설정할 에디터 추가
    render() {
        const { node } = this.props;

        return (
            <NodeEditor description={TFCTextNodeEditor.description} {...this.props}>
                <InputGroup name="Text" info="The text you want to display in your scene.">
                    <StringInput
                        value={node.text}
                        onChange={value => {this.onChangeProperty("text", value);}}
                    />
                </InputGroup>

                <InputGroup name="Font Name" info="Set the name of the font.">
                    <StringInput
                        value={node.fontName}
                        onChange={value => {this.onChangeProperty("fontName", value);}}
                    />
                </InputGroup>

                <InputGroup name="Font Url" info="Set the url of the font.">
                    <StringInput
                        value={node.fontUrl}
                        onChange={value => {this.onChangeProperty("fontUrl", value);}}
                    />
                </InputGroup>

                <NumericInputGroup name="Font Size" info="Set the size of the font."
                    min={16}
                    smallStep={0.1}
                    mediumStep={1}
                    largeStep={5}
                    value={node.fontSize}
                    onChange={value => {this.onChangeProperty("fontSize", value);}}
                />

                <InputGroup name="Color" info="Set the color of the text.">
                    <ColorInput
                        value={node.color}
                        onChange={value => {this.onChangeProperty("color", value);}}
                    />
                </InputGroup>

                <InputGroup name="Background Color" info="Set the color of the background.">
                    <ColorInput
                        value={node.backgroundColor}
                        onChange={value => {this.onChangeProperty("backgroundColor", value);}}
                    />
                </InputGroup>

                <InputGroup name="Transparency" info="Set transparency for text background.">
                    <BooleanInput
                        value={node.transparency}
                        onChange={value => {this.onChangeProperty("transparency", value);}}
                    />
                </InputGroup>

                <NumericInputGroup name="Line Height" info="Set the line height of each line of text."
                    min={16}
                    smallStep={0.1}
                    mediumStep={1}
                    largeStep={5}
                    value={node.lineHeight}
                    onChange={value => {this.onChangeProperty("lineHeight", value);}}
                />

                <NumericInputGroup name="Line Space" info="Set the line space of each line of text."
                    min={2}
                    smallStep={0.1}
                    mediumStep={1}
                    largeStep={5}
                    value={node.lineSpace}
                    onChange={value => {this.onChangeProperty("lineSpace", value);}}
                />

                <NumericInputGroup name="Width" info="Set the width of the text block."
                    min={0}
                    smallStep={0.05}
                    mediumStep={0.1}
                    largeStep={0.5}
                    value={node.width}
                    onChange={value => {this.onChangeProperty("width", value);}}
                />

                <NumericInputGroup name="Padding Left" info="Set the padding left of the text block."
                    min={0}
                    smallStep={0.05}
                    mediumStep={0.1}
                    largeStep={0.5}
                    value={node.paddingLeft}
                    onChange={value => {this.onChangeProperty("paddingLeft", value);}}
                />

                <NumericInputGroup name="Padding Top" info="Set the padding top of the text block."
                    min={0}
                    smallStep={0.1}
                    mediumStep={1}
                    largeStep={5}
                    value={node.paddingTop}
                    onChange={value => {this.onChangeProperty("paddingTop", value);}}
                />

                <NumericInputGroup name="Padding Right" info="Set the padding right of the text block."
                    min={0}
                    smallStep={0.05}
                    mediumStep={0.1}
                    largeStep={0.5}
                    value={node.paddingRight}
                    onChange={value => {this.onChangeProperty("paddingRight", value);}}
                />

                <NumericInputGroup name="Padding Bottom" info="Set the padding bottom of the text block."
                    min={0}
                    smallStep={0.1}
                    mediumStep={1}
                    largeStep={5}
                    value={node.paddingBottom}
                    onChange={value => {this.onChangeProperty("paddingBottom", value);}}
                />
                <InputGroup name="Text Align" info="Set the horizontal alignment of each line of text block.">
                    <SelectInput
                        label="Text Align"
                        options={textAlignments}
                        value={node.align}
                        onChange={value => {this.onChangeProperty("align", value);}}
                    />
                </InputGroup>

                <InputGroup name="Auto Overflow Wrap" info="Set auto overflow wraps for the text block.">
                    <BooleanInput
                        value={node.autoOverflowWrap}
                        onChange={value => {this.onChangeProperty("autoOverflowWrap", value);}}
                    />
                </InputGroup>

                <InputGroup name="Word Break" info="Set text wraps for the text block.">
                    <SelectInput
                        label="Word Break"
                        options={wordBreak}
                        value={node.wordBreak}
                        onChange={value => {this.onChangeProperty("wordBreak", value);}}
                    />
                </InputGroup>
            </NodeEditor>
        );
    }
}

