import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import NodeEditor from "./NodeEditor";
import InputGroup from "../inputs/InputGroup";
import StringInput from "../inputs/StringInput";
import SelectInput from "../inputs/SelectInput";
import ImageInput from "../inputs/ImageInput";
import { Square } from "styled-icons/fa-solid/Square";
import useSetPropertySelected from "./useSetPropertySelected";
import AttributionNodeEditor from "./AttributionNodeEditor";
import NumericInputGroup from "../inputs/NumericInputGroup";

// Constants for dropdown options
const triggerTypes = [
    { label: "Scenario", value: "scenario" },
    { label: "NPC", value: "npc" },
    // { label: "Link", value: "link" },
    // { label: "Iframe", value: "iframe" },
    // { label: "Animation", value: "animation" }
];

const npcNames = [
    { label: "Voice", value: "voice" },
    { label: "Text", value: "text" }
];

const actions = [
    { label: "Hide", value: 1 },
    { label: "Animation", value: 2 },
    { label: "Audio", value: 3 },
    { label: "Transform", value: 4 },
    { label: "Visibility", value: 5 }
];

const animationTypes = [
    { label: "Loop", value: "loop" },
    { label: "Play", value: "play" },
    { label: "Stop", value: "stop" }
];

const transformTypes = [
    { label: "Rotate", value: "rotate" },
    // { label: "Scale", value: "scale" },
    { label: "Translate", value: "translate" }
];

const visibilityTypes = [
    { label: "Activate", value: "activate" },
    { label: "Deactivate", value: "deactivate" }
];

function* treeWalker(editor) {
    const stack = [];

    stack.push({
        depth: 0,
        object: editor.scene,
        childIndex: 0,
        lastChild: true,
        parentEnabled: true
    });

    while (stack.length !== 0) {
        const { depth, object, childIndex, lastChild, parentEnabled } = stack.pop();

        const NodeEditor = editor.getNodeEditor(object) || DefaultNodeEditor;
        const iconComponent = NodeEditor.iconComponent || DefaultNodeEditor.iconComponent;

        const isExpanded = true;
        const enabled = parentEnabled && object.enabled;

        yield {
            id: object.id,
            isLeaf: object.children.filter(c => c.isNode).length === 0,
            isExpanded,
            depth,
            object,
            iconComponent,
            selected: editor.selected.indexOf(object) !== -1,
            active: editor.selected.length > 0 && object === editor.selected[editor.selected.length - 1],
            enabled,
            childIndex,
            lastChild
        };

        if (object.children.length !== 0 && isExpanded) {
            for (let i = object.children.length - 1; i >= 0; i--) {
                const child = object.children[i];

                if (child.isNode) {
                    stack.push({
                        depth: depth + 1,
                        object: child,
                        childIndex: i,
                        lastChild: i === 0,
                        parentEnabled: enabled
                    });
                }
            }
        }
    }
}

/**
 * ImageButtonNodeEditor
 * A React component for editing properties of an Image Button node.
 * Supports dynamic input rendering based on user interactions.
 */
export default function ImageButtonNodeEditor(props) {
    const { editor, node } = props;
    const [nodes, setNodes] = useState([]);
    const [targetNames, setTargetNames] = useState([]);
    const [targetAnimationNames, setTargetAnimationNames] = useState([]);
    const [targetActionAnimationNames, setTargetActionAnimationNames] = useState([]);
    const updateNodeHierarchy = useCallback(() => {
        setNodes(Array.from(treeWalker(editor)));
    }, [editor]);
    // Hook-based setters for node properties
    const onChangeSrc = useSetPropertySelected(editor, "src");
    const onChangeHref = useSetPropertySelected(editor, "href");
    const onChangeTriggerTarget = useSetPropertySelected(editor, "triggerTarget");
    const onChangeTriggerName = useSetPropertySelected(editor, "triggerName");
    const onChangeTriggerValue = useSetPropertySelected(editor, "triggerValue");
    const onChangeTriggerType = useSetPropertySelected(editor, "triggerType");
    const onChangeActionsAfterClick = useSetPropertySelected(editor, "actionsAfterClick");
    const onChangeActionsData = useSetPropertySelected(editor, "actionsData");

    useEffect(() => {
        // console.log("targetNames", targetNames);
    }, [targetNames]);

    useEffect(() => {
        // console.log("targetAnimationNames", targetAnimationNames);
    }, [targetAnimationNames]);

    useEffect(() => {
        // console.log("targetActionAnimationNames", targetActionAnimationNames);
    }, [targetActionAnimationNames]);

    useEffect(() => {
        // console.log("actionsData", node.actionsData);        
    }, [node.actionsData]);

    /**
     * Updates `actionsData` for a specific key and value.
     * @param {string} key - The key to update in actionsData.
     * @param {any} value - The new value for the key.
     */
    const setActionsData = (key, value) => {
        node.actionsData[key] = value;
        onChangeActionsData(node.actionsData);
    };

    const setTargetAnimationName = (value) => {
        node.triggerName = value;
        onChangeTriggerName(node.triggerName);
    };

    useEffect(() => {
        updateNodeHierarchy();
    }, [updateNodeHierarchy]);

    const handleTriggerTargetChange = (target) => {
        // console.log("target", target);
        // Update the triggerTarget property in the editor
        onChangeTriggerTarget(target);
        const targetValue = nodes.find(node => node.object.name === target);
        if (!targetValue || !targetValue.object) {
            return;
        }
        const targetObject = targetValue.object;
        const clipOptions =
            targetObject.model && targetObject.model.animations
                ? targetObject.model.animations.map((clip, index) => ({ label: clip.name, value: clip.name }))
                : [];
        if (clipOptions.length == 0) {
            clipOptions.unshift({ label: "None", value: -1 });
        }
        setTargetAnimationNames(clipOptions);
    };

    const handleAnimationTargetChange = (target) => {
        // Update the triggerTarget property in the editor
        setActionsData("animationTarget", target)
        const targetValue = nodes.find(node => node.object.name === target);
        if (!targetValue || !targetValue.object) {
            return;
        }
        const targetObject = targetValue.object;
        const clipOptions =
            targetObject.model && targetObject.model.animations
                ? targetObject.model.animations.map((clip, index) => ({ label: clip.name, value: clip.name }))
                : [];
        if (clipOptions.length == 0) {
            clipOptions.unshift({ label: "None", value: -1 });
        }
        setTargetActionAnimationNames(clipOptions);
    };

    useEffect(() => {
        const targetNamesTemp = [];
        for (const node of nodes) {
            if (node.object.isNode) {
                targetNamesTemp.push({ label: node.object.name, value: node.object.name });
            }
        }
        setTargetNames(targetNamesTemp);
        if (node.actionsData.animationTarget) {
            handleAnimationTargetChange(node.actionsData.animationTarget);
        }
        if (node.triggerTarget) {
            handleTriggerTargetChange(node.triggerTarget);
        }
    }, [nodes]);

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
                        <SelectInput
                            options={targetNames}
                            value={node.triggerTarget}
                            onChange={handleTriggerTargetChange}
                        />
                    </InputGroup>
                    <InputGroup name="Scenario Step" info="Define the value associated with the scenario.">
                        <StringInput value={node.triggerName} onChange={onChangeTriggerName} />
                    </InputGroup>
                    <InputGroup name="Scenario Next Step" info="Define the next value associated with the scenario.">
                        <StringInput value={node.triggerValue} onChange={onChangeTriggerValue} />
                    </InputGroup>
                </>
            )}

            {node.triggerType === "animation" && (
                <>
                    <InputGroup name="Animation Target" info="Specify the target object for the animation.">
                        <SelectInput
                            options={targetNames}
                            value={node.triggerTarget}
                            onChange={handleTriggerTargetChange}
                        />
                    </InputGroup>
                    <InputGroup name="Animation Name" info="Enter the name of the animation to trigger.">
                        <SelectInput
                            options={targetAnimationNames}
                            value={node.triggerName}
                            onChange={(e) => setTargetAnimationName(e)} />
                    </InputGroup>
                    <InputGroup name="Animation Type" info="Select the action to perform for the animation (e.g., Loop, Play, Stop).">
                        <SelectInput
                            options={animationTypes}
                            value={node.triggerValue}
                            onChange={onChangeTriggerValue}
                        />
                    </InputGroup>
                </>
            )}

            {node.triggerType === "npc" && (
                <>
                    <InputGroup name="NPC Target" info="Specify the target NPC to trigger.">
                        <SelectInput
                            options={targetNames}
                            value={node.triggerTarget || ""}
                            onChange={handleTriggerTargetChange}
                        />
                    </InputGroup>
                    <InputGroup name="NPC Name" info="Select the name of NPC to trigger (e.g., Voice, Text).">
                        <SelectInput
                            options={npcNames}
                            value={node.triggerName || ""}
                            onChange={onChangeTriggerName}
                        />
                    </InputGroup>
                    <InputGroup name="NPC API" info="Enter the API URL for the NPC (https).">
                        <StringInput
                            value={node.triggerValue || "https://coastal-fails-warren-co.trycloudflare.com/process_audio"}
                            onChange={onChangeTriggerValue}
                        />
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
                    <InputGroup name="Play all animations" info="Play all animations in the scene.">

                    </InputGroup>
                    <InputGroup name="Animation Type" info="Select the action to perform for the animation (e.g., Loop, Play, Stop).">
                        <SelectInput
                            options={animationTypes}
                            value={node.actionsData.animationValue}
                            onChange={(e) => setActionsData("animationValue", e)}
                        />
                    </InputGroup>
                    {/* <InputGroup name="Animation Target" info="Select the action triggered by interacting with the image.">
                        <SelectInput
                            options={targetNames}
                            value={node.actionsData.animationTarget}
                            onChange={(e) => handleAnimationTargetChange(e)}
                        />
                    </InputGroup>
                    <InputGroup name="Animation Name" info="Enter the name of the animation to trigger.">
                        <SelectInput
                            options={targetActionAnimationNames}
                            value={node.actionsData.animationName}
                            onChange={(e) => setActionsData("animationName", e)}
                        />
                    </InputGroup>
                    <InputGroup name="Animation Type" info="Select the action to perform for the animation (e.g., Loop, Play, Stop).">
                        <SelectInput
                            options={animationTypes}
                            value={node.actionsData.animationValue}
                            onChange={(e) => setActionsData("animationValue", e)}
                        />
                    </InputGroup> */}
                </>
            )}

            {/* Additional inputs based on selected actions */}
            {node.actionsAfterClick?.some(action => action.value === 4) && (
                <>
                    <InputGroup name="Transform Target" info="Select the target object for the transformation.">
                        <SelectInput
                            options={targetNames}
                            value={node.actionsData.transformTarget}
                            onChange={(e) => setActionsData("transformTarget", e)}
                        />
                    </InputGroup>
                    <InputGroup name="Transform Type" info="Select the type of transformation to apply (e.g., Rotate, Scale, Translate).">
                        <SelectInput
                            options={transformTypes}
                            value={node.actionsData.transformType}
                            onChange={(e) => setActionsData("transformType", e)}
                        />
                    </InputGroup>
                    <InputGroup name="Transform Value" info="Enter the values for the transformation (e.g., x, y, z).">
                        <StringInput
                            value={node.actionsData.transformValue || "0, 0, 0"}
                            onChange={(e) => setActionsData("transformValue", e)}
                        />
                    </InputGroup>
                    <NumericInputGroup
                        name="Transform Times: "
                        info="Define how many times the button can be clicked to apply the transform. After the set limit, other 'After Click Action' tasks will be triggered."
                        min={1}
                        smallStep={1}
                        mediumStep={2}
                        largeStep={3}
                        value={node.actionsData.transformTimes || 1}
                        displayPrecision={0}
                        onChange={(e) => setActionsData("transformTimes", e)}

                    />
                    <NumericInputGroup
                        name="Transform Speed: "
                        info="Define the speed of the transformation."
                        min={0.0001}
                        smallStep={0.0001}
                        mediumStep={0.001}
                        largeStep={0.01}
                        value={node.actionsData.transformSpeed || 0.01}
                        displayPrecision={0.0001}
                        onChange={(e) => setActionsData("transformSpeed", e)}
                    />
                </>
            )}


            {node.actionsAfterClick?.some(action => action.value === 5) && (
                <>

                    <InputGroup name="Visibiltity Target" info="Select the target object for the visibility change.">
                        <SelectInput
                            options={targetNames}
                            value={node.actionsData.visibilityTarget || ""}
                            onChange={(e) => setActionsData("visibilityTarget", e)}
                        />
                    </InputGroup>
                    <InputGroup name="Visibility Type" info="Select the type of visibility to apply (e.g., Activate, Deactivate).">
                        <SelectInput
                            options={visibilityTypes}
                            value={node.actionsData.visibilityType || "activate"}
                            onChange={(e) => setActionsData("visibilityType", e)}
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