import React, { Component } from "react";
import PropTypes from "prop-types";
import NodeEditor from "./NodeEditor";
import InputGroup from "../inputs/InputGroup";
import { PlayCircle } from "styled-icons/fa-solid/PlayCircle";
import SelectInput from "../inputs/SelectInput";
import StringInput from "../inputs/StringInput";


const triggerTypes = [
    {
        label: "Object",
        value: "object"
    },
    {
        label: "NPC",
        value: "npc"
    },
    {
        label: "Teleport",
        value: "teleport"
    }
];
export default class InteractiveAreaNodeEditor extends Component {
    static propTypes = {
        editor: PropTypes.object,
        node: PropTypes.object
    };

    static iconComponent = PlayCircle;

    static description = "Creates a circular interactive area, the trigger will be activated if the user enters the interactive area.";


    onChangeTriggerTarget = triggerTarget => {
        this.props.editor.setPropertySelected("triggerTarget", triggerTarget);
    };

    onChangeProperty = (property, value) => {
        this.props.editor.setPropertySelected(property, value);
    };

    render() {
        const node = this.props.node;

        return (
            <NodeEditor description={InteractiveAreaNodeEditor.description} {...this.props}>
                <InputGroup name="Trigger Type">
                    <SelectInput
                        options={triggerTypes}
                        value={node.triggerType}
                        onChange={value => {
                            this.onChangeProperty("triggerType", value);
                        }}
                    />
                </InputGroup>
                <InputGroup name="Trigger Target">
                    <StringInput value={node.triggerTarget} onChange={this.onChangeTriggerTarget} />
                </InputGroup>
            </NodeEditor>
        );
    }
}
