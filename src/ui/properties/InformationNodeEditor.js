import React, { Component } from "react";
import PropTypes from "prop-types";
import configs from "../../configs";
import NodeEditor from "./NodeEditor";
import InputGroup from "../inputs/InputGroup";
import StringInput from "../inputs/StringInput";
import { Link } from "styled-icons/fa-solid/Link";
import { Info } from "styled-icons/fa-solid/Info";

export default class InformationNodeEditor extends Component {
    static propTypes = {
        editor: PropTypes.object,
        node: PropTypes.object
    };

    static iconComponent = Info;

    static description = 'Information panel for a 3d model.';

    onChangeInformationUrl = information_url => {
        this.props.editor.setPropertySelected("information_url", information_url);
    };
    onChangeInformationTitle = information_title => {
        this.props.editor.setPropertySelected("information_title", information_title);
    };
    onChangeInformationText = information_text => {
        this.props.editor.setPropertySelected("information_text", information_text);
    };
    onChangeInformationImage = information_image => {
        this.props.editor.setPropertySelected("information_image", information_image);
    };

    render() {
        const node = this.props.node;

        return (
            <NodeEditor description={InformationNodeEditor.description} {...this.props}>
                <InputGroup name="Information URL">
                    <StringInput value={node.information_url} onChange={this.onChangeInformationUrl} />
                </InputGroup>
                <InputGroup name="Information Title">
                    <StringInput value={node.information_title} onChange={this.onChangeInformationTitle} />
                </InputGroup>
                <InputGroup name="Information Text">
                    <StringInput value={node.information_text} onChange={this.onChangeInformationText} />
                </InputGroup>
                <InputGroup name="Information Image Url">
                    <StringInput value={node.information_image} onChange={this.onChangeInformationImage} />
                </InputGroup>
            </NodeEditor>
        );
    }
}
