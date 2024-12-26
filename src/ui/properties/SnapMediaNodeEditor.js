// Thanh add
import React from "react";
import PropTypes from "prop-types";
import NodeEditor from "./NodeEditor";
import { ObjectGroup } from "styled-icons/fa-solid/ObjectGroup";
import InputGroup from "../inputs/InputGroup";
import SelectInput from "../inputs/SelectInput";
import useSetPropertySelected from "./useSetPropertySelected";
import { MediaType } from "../../editor/nodes/SnapFrameNode";
import { SnapAction } from "../../editor/nodes/SnapFrameNode";

const mediaTypeOptions = [
    { label: "All Media", value: MediaType.ALL },
    { label: "Only 2D Media", value: MediaType.ALL_2D },
    { label: "Only 3D Models", value: MediaType.MODEL },
    { label: "Only Images", value: MediaType.IMAGE },
    { label: "Only Videos", value: MediaType.VIDEO },
    { label: "Only PDFs", value: MediaType.PDF }
];

const snapActionOptions = [
    { label: "Nothing", value: SnapAction.NOTHING },
    { label: "Animation", value: SnapAction.ANIMATION },
    { label: "Media", value: SnapAction.MEDIA },
    { label: "Light", value: SnapAction.LIGHT },
    { label: "Show", value: SnapAction.SHOW },
    { label: "Hide", value: SnapAction.HIDE },
    { label: "Teleport", value: SnapAction.TELEPORT }
];

export default function SnapMediaNodeEditor(props) {
    const { node, editor } = props;
    const onChangeMediaType = useSetPropertySelected(editor, "mediaType");
    const onChangeSnapAction = useSetPropertySelected(editor, "snapAction");
    return (
        <NodeEditor description={SnapMediaNodeEditor.description} {...props}>
            <InputGroup name="Media Types" info="Limit what type of media this frame will capture">
                <SelectInput options={mediaTypeOptions} value={node.mediaType} onChange={onChangeMediaType} />
            </InputGroup>

            <InputGroup name="Snap Action" info="What action should be taken when the snap condition is met">
                <SelectInput options={snapActionOptions} value={node.snapAction} onChange={onChangeSnapAction} />
            </InputGroup>
        </NodeEditor>
    );
}

SnapMediaNodeEditor.iconComponent = ObjectGroup;
SnapMediaNodeEditor.description = "A snap frame to capture media objects.\n";

SnapMediaNodeEditor.propTypes = {
    editor: PropTypes.object,
    node: PropTypes.object
};
