import React from "react";
import PropTypes from "prop-types";
import NodeEditor from "./NodeEditor";
import InputGroup from "../inputs/InputGroup";
import StringInput from "../inputs/StringInput";
import SelectInput from "../inputs/SelectInput";
import ImageInput from "../inputs/ImageInput";
import { Square } from "styled-icons/fa-solid/Square";
import useSetPropertySelected from "./useSetPropertySelected";
import AttributionNodeEditor from "./AttributionNodeEditor";

// Constants for dropdown options
const triggerTypes = [
    { label: "Scenario", value: "scenario" },
    { label: "Link", value: "link" },
    { label: "Iframe", value: "iframe" },
    { label: "Animation", value: "animation" }
];

const actions = [
    { label: "Hide", value: 1 },
    { label: "Animation", value: 2 },
    { label: "Audio", value: 3 }
];

const animationTypes = [
    { label: "Loop", value: "loop" },
    { label: "Play", value: "play" },
    { label: "Stop", value: "stop" }
];

/**
 * ImageButtonNodeEditor
 * A React component for editing properties of an Image Button node.
 * Supports dynamic input rendering based on user interactions.
 */
export default function ImageButtonNodeEditor(props) {
    const { editor, node } = props;

    // Hook-based setters for node properties
    const onChangeSrc = useSetPropertySelected(editor, "src");
    const onChangeHref = useSetPropertySelected(editor, "href");
    const onChangeTriggerTarget = useSetPropertySelected(editor, "triggerTarget");
    const onChangeTriggerName = useSetPropertySelected(editor, "triggerName");
    const onChangeTriggerValue = useSetPropertySelected(editor, "triggerValue");
    const onChangeTriggerType = useSetPropertySelected(editor, "triggerType");
    const onChangeActionsAfterClick = useSetPropertySelected(editor, "actionsAfterClick");
    const onChangeActionsData = useSetPropertySelected(editor, "actionsData");

    /**
     * Updates `actionsData` for a specific key and value.
     * @param {string} key - The key to update in actionsData.
     * @param {any} value - The new value for the key.
     */
    const setActionsData = (key, value) => {
        node.actionsData[key] = value;
        onChangeActionsData(node.actionsData);
    };

    // Rendering dynamic input fields based on triggerType or actions
    return (
        <NodeEditor description={ImageButtonNodeEditor.description} {...props}>
            {/* Image URL input */}
            <InputGroup name="Image Url" info="Specify the URL for the image to display.">
                <ImageInput value={node.src} onChange={onChangeSrc} />
            </InputGroup>

            {/* Trigger type selection */}
            <InputGroup name="Trigger Type" info="Select the action triggered by interacting with the image.">
                <SelectInput
                    options={triggerTypes}
                    value={node.triggerType}
                    onChange={onChangeTriggerType}
                />
            </InputGroup>

            {/* Conditional inputs based on trigger type */}
            {node.triggerType === "link" && (
                <InputGroup name="Link Href" info="Allows the image to function as a link for the given URL.">
                    <StringInput value={node.href} onChange={onChangeHref} />
                </InputGroup>
            )}

            {node.triggerType === "iframe" && (
                <InputGroup name="Iframe Href" info="Allows the image to display an iframe for the given URL.">
                    <StringInput value={node.href} onChange={onChangeHref} />
                </InputGroup>
            )}

            {node.triggerType === "scenario" && (
                <>
                    <InputGroup name="Scenario Target" info="Specify the target scenario to trigger.">
                        <StringInput value={node.triggerTarget} onChange={onChangeTriggerTarget} />
                    </InputGroup>
                    <InputGroup name="Scenario Value" info="Define the value associated with the scenario.">
                        <StringInput value={node.triggerValue} onChange={onChangeTriggerValue} />
                    </InputGroup>
                </>
            )}

            {node.triggerType === "animation" && (
                <>
                    <InputGroup name="Animation Target" info="Specify the target object for the animation.">
                        <StringInput value={node.triggerTarget} onChange={onChangeTriggerTarget} />
                    </InputGroup>                    
                    <InputGroup name="Animation Value" info="Select the action to perform for the animation (e.g., Loop, Play, Stop).">
                        <SelectInput
                            options={animationTypes}
                            value={node.triggerValue}
                            onChange={onChangeTriggerValue}
                        />
                    </InputGroup>
                    <InputGroup name="Animation Name" info="Enter the name of the animation to trigger.">
                        <StringInput value={node.triggerName} onChange={onChangeTriggerName} />
                    </InputGroup>
                </>
            )}

            {/* Actions after click selection */}
            <InputGroup name="Action After Click" info="Select the actions triggered after clicking the button.">
                <SelectInput
                    options={actions}
                    value={node.actionsAfterClick}
                    onChange={onChangeActionsAfterClick}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    isMulti
                />
            </InputGroup>

            {/* Additional inputs based on selected actions */}
            {node.actionsAfterClick?.some(action => action.value === 3) && (
                <InputGroup name="Audio Url" info="Provide the URL of the audio to play after clicking.">
                    <StringInput
                        value={node.actionsData.audio}
                        onChange={(e) => setActionsData("audio", e)}
                    />
                </InputGroup>
            )}

            {node.actionsAfterClick?.some(action => action.value === 2) && (
                <>
                    <InputGroup name="Animation Target" info="Specify the target object for the animation.">
                        <StringInput
                            value={node.actionsData.animationTarget}
                            onChange={(e) => setActionsData("animationTarget", e)}
                        />
                    </InputGroup>
                    <InputGroup name="Animation Name" info="Enter the name of the animation to trigger.">
                        <StringInput
                            value={node.actionsData.animationName}
                            onChange={(e) => setActionsData("animationName", e)}
                        />
                    </InputGroup>
                    <InputGroup name="Animation Value" info="Select the action to perform for the animation (e.g., Loop, Play, Stop).">
                        <SelectInput
                            options={animationTypes}
                            value={node.actionsData.animationValue}
                            onChange={(e) => setActionsData("animationValue", e)}
                        />
                    </InputGroup>
                </>
            )}

            {/* Attribution editor */}
            <AttributionNodeEditor name="Attribution" {...props} />
        </NodeEditor>
    );
}

// Prop types for validation
ImageButtonNodeEditor.propTypes = {
    editor: PropTypes.object.isRequired,
    node: PropTypes.object.isRequired,
    multiEdit: PropTypes.bool
};

// Static properties for metadata
ImageButtonNodeEditor.iconComponent = Square;
ImageButtonNodeEditor.description = "Dynamically load an image to overlay the entire webpage onto your hub's scene.";