// Thanh add
import React, { Component } from "react";
import PropTypes from "prop-types";
import NodeEditor from "./NodeEditor";
import InputGroup from "../inputs/InputGroup";
import StringInput from "../inputs/StringInput";
import SelectInput from "../inputs/SelectInput";
import BooleanInput from "../inputs/BooleanInput";
import ImageInput from "../inputs/ImageInput";
import { Square } from "styled-icons/fa-solid/Square";

import useSetPropertySelected from "./useSetPropertySelected";
import AttributionNodeEditor from "./AttributionNodeEditor";

const triggerTypes = [
    {
        label: "Scenario",
        value: "scenario"
    },
    {
        label: "Link",
        value: "link"
    },
    {
        label: "Iframe",
        value: "iframe"
    },
    {
        label: "Animation",
        value: "animation"
    }
];

const actions = [
    {
        label: "Hide",
        value: 1
    },
    {
        label: "Animation",
        value: 2
    },
    {
        label: "Audio",
        value: 3
    }
]

const animationTypes = [
    {
        label: "Loop",
        value: "loop"
    },
    {
        label: "Play",
        value: "play"
    },
    {
        label: "Stop",
        value: "stop"
    }
];


// export default class ImageButtonNodeEditor extends Component {
//     static propTypes = {
//         editor: PropTypes.object,
//         node: PropTypes.object,
//         multiEdit: PropTypes.bool
//     };

//     static iconComponent = Square;

//     static description = "Dynamically load an image to overlay the entire webpage onto your hub's scene.";

//     onChangeActionsAfterClick = actionsAfterClick => {
//         console.log("actionsAfterClick", actionsAfterClick);
//         this.props.editor.setPropertySelected("actionsAfterClick", actionsAfterClick || []);
//     };

//     onChangeSrc = src => {
//         this.props.editor.setPropertySelected("src", src);
//     };

//     onChangeHref = href => {
//         this.props.editor.setPropertySelected("href", href);
//     };

//     onChangeTriggerTarget = triggerTarget => {
//         this.props.editor.setPropertySelected("triggerTarget", triggerTarget);
//     };

//     onChangeTriggerValue = triggerValue => {
//         this.props.editor.setPropertySelected("triggerValue", triggerValue);
//     };

//     onChangeTriggerType = triggerType => {
//         this.props.editor.setPropertySelected("triggerType", triggerType);
//     };

//     isAnimationPropertyDisabled() {
//         const { multiEdit, editor, node } = this.props;

//         if (multiEdit) {
//             return editor.selected.some(selectedNode => selectedNode.src !== node.src);
//         }

//         return false;
//     }

//     render() {
//         const node = this.props.node;

//         return (
//             <NodeEditor description={ImageButtonNodeEditor.description} {...this.props}>
//                 <InputGroup name="Image Url">
//                     <ImageInput value={node.src} onChange={this.onChangeSrc} />

//                 </InputGroup>
//                 <InputGroup name="Trigger Type">
//                     <SelectInput
//                         options={triggerTypes}
//                         value={node.triggerType}
//                         onChange={this.onChangeTriggerType}
//                     />
//                 </InputGroup>
//                 {(node.triggerType === "link" || node.triggerType === "iframe") && (
//                     <InputGroup name="Link Href" info="Allows the image to function as a link for the given url.">
//                         <StringInput value={node.href} onChange={this.onChangeHref} />
//                     </InputGroup>
//                 )}
//                 <InputGroup name="Trigger Target">
//                     <StringInput value={node.triggerTarget} onChange={this.onChangeTriggerTarget} />
//                 </InputGroup>
//                 <InputGroup name="Trigger Value">
//                     <StringInput value={node.triggerValue} onChange={this.onChangeTriggerValue} />
//                 </InputGroup>
//                 <InputGroup name="Action After Click">
//                     <SelectInput
//                         disabled={this.isAnimationPropertyDisabled()}
//                         options={actions}
//                         value={node.actionsAfterClick}
//                         onChange={this.onChangeActionsAfterClick}
//                         className="basic-multi-select"
//                         classNamePrefix="select"
//                         isMulti
//                     />
//                 </InputGroup>

//                 <AttributionNodeEditor name="Attribution" {...this.props} />
//             </NodeEditor>
//         );
//     }
// }

export default function ImageButtonNodeEditor(props) {
    const { editor, node } = props;
    const onChangeSrc = useSetPropertySelected(editor, "src");
    const onChangeHref = useSetPropertySelected(editor, "href");
    const onChangeTriggerTarget = useSetPropertySelected(editor, "triggerTarget");
    const onChangeTriggerName = useSetPropertySelected(editor, "triggerName");
    const onChangeTriggerValue = useSetPropertySelected(editor, "triggerValue");
    const onChangeTriggerType = useSetPropertySelected(editor, "triggerType");
    const onChangeActionsAfterClick = useSetPropertySelected(editor, "actionsAfterClick");
    const onChangeActionsData = useSetPropertySelected(editor, "actionsData");
    const setActionsData = (key, value) => {
        node.actionsData[key] = value;
        onChangeActionsData(node.actionsData);
        console.log("actionsData", node.actionsData);
    }


    return (
        <NodeEditor description={ImageButtonNodeEditor.description} {...props}>
            <InputGroup name="Image Url" info="Specify the URL for the image to display.">
                <ImageInput value={node.src} onChange={onChangeSrc} />
            </InputGroup>
            <InputGroup name="Trigger Type" info="Select the action triggered by interacting with the image.">
                <SelectInput
                    options={triggerTypes}
                    value={node.triggerType}
                    onChange={onChangeTriggerType}
                />
            </InputGroup>

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
                <InputGroup name="Scenario Target" info="Specify the target scenario to trigger.">
                    <StringInput value={node.triggerTarget} onChange={onChangeTriggerTarget} />
                </InputGroup>
            )}
            {node.triggerType === "scenario" && (
                <InputGroup name="Scenario Value" info="Define the value associated with the scenario.">
                    <StringInput value={node.triggerValue} onChange={onChangeTriggerValue} />
                </InputGroup>
            )}

            {node.triggerType === "animation" && (
                <InputGroup name="Animation Target" info="Specify the target object for the animation.">
                    <StringInput value={node.triggerTarget} onChange={onChangeTriggerTarget} />
                </InputGroup>
            )}
            {node.triggerType === "animation" && (
                <InputGroup name="Animation Name" info="Enter the name of the animation to trigger.">
                    <StringInput value={node.triggerName} onChange={onChangeTriggerName} />
                </InputGroup>
            )}
            {node.triggerType === "animation" && (
                <InputGroup name="Animation Value" info="Select the action to perform for the animation (e.g., Loop, Play, Stop).">
                    <SelectInput
                        options={animationTypes}
                        value={node.triggerValue}
                        onChange={onChangeTriggerValue}
                    />
                </InputGroup>
            )}

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

            {node.actionsAfterClick && node.actionsAfterClick.some(action => action.value === 3) && (
                <InputGroup name="Audio Url" info="Provide the URL of the audio to play after clicking.">
                    <StringInput
                        value={node.actionsData.audio}
                        onChange={(e) => setActionsData("audio", e)}
                    />
                </InputGroup>
            )}

            {node.actionsAfterClick && node.actionsAfterClick.some(action => action.value === 2) && (
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
            <AttributionNodeEditor name="Attribution" {...props} />
        </NodeEditor>
    );
}

ImageButtonNodeEditor.propTypes = {
    editor: PropTypes.object,
    node: PropTypes.object,
    multiEdit: PropTypes.bool
};

ImageButtonNodeEditor.iconComponent = Square;

ImageButtonNodeEditor.description = "Dynamically load an image to overlay the entire webpage onto your hub's scene.";