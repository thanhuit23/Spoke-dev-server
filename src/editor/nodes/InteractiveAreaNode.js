import EditorNodeMixin from "./EditorNodeMixin";
import { Mesh, MeshBasicMaterial, CylinderGeometry, MeshLambertMaterial, DoubleSide, BackSide, FrontSide, Object3D } from "three";
import loadTexture from "../utils/loadTexture";
import interactiveIconUrl from "../../assets/circle.png";

// let interactiveHelperTexture = null;

export default class InteractiveAreaNode extends EditorNodeMixin(Mesh) {
    static componentName = "interactive-area";

    static nodeName = "Media Control 2";

    static async load() {
        // interactiveHelperTexture = await loadTexture(interactiveIconUrl);
    }

    static async deserialize(editor, json) {
        const node = await super.deserialize(editor, json);

        const { triggerType, triggerTarget } = json.components.find(c => c.name === InteractiveAreaNode.componentName).props;

        node.triggerType = triggerType === undefined ? "" : triggerType;
        node.triggerTarget = triggerTarget === undefined ? "" : triggerTarget;

        return node;
    }

    constructor(editor) {
        const geometry = new CylinderGeometry(1, 1, 3, 32);
        const material = new MeshBasicMaterial({ color: 0xffffff });
        material.transparent = true;
        material.opacity = 0.2;
        material.side = DoubleSide;
        super(editor, geometry, material);
        this.name = "Interactive Area";
        this.interactiveArea = new Mesh(geometry, material);
        this.interactiveArea.layers.set(1);
        this.add(this.interactiveArea);
    }

    serialize() {
        return super.serialize({
            [InteractiveAreaNode.componentName]: {
                triggerType: this.triggerType,
                triggerTarget: this.triggerTarget
            }
        });
    }

    copy(source, recursive = true) {
        if (recursive) {
            this.remove(this.interactiveArea);
        }

        super.copy(source, recursive);

        if (recursive) {
            const interactiveAreaIndex = source.children.findIndex(child => child === source.interactiveArea);

            if (interactiveAreaIndex !== -1) {
                this.interactiveArea = this.children[interactiveAreaIndex];
            }
        }

        this.triggerType = source.triggerType;
        this.triggerTarget = source.triggerTarget;

        return this;
    }

    prepareForExport() {
        super.prepareForExport();
        this.remove(this.interactiveArea);
        this.addGLTFComponent(InteractiveAreaNode.componentName, {
            triggerType: this.triggerType,
            triggerTarget: this.triggerTarget
        });
        this.addGLTFComponent("networked", {
            id: this.uuid
        });
        this.replaceObject();
    }
}

