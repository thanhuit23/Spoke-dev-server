import EditorNodeMixin from "./EditorNodeMixin";
import { Object3D, PlaneBufferGeometry, MeshBasicMaterial, Mesh, DoubleSide } from "three";
import linkIconUrl from "../../assets/link-icon.png";
import loadTexture from "../utils/loadTexture";

let linkHelperTexture = null;

export default class AnimationControlNode extends EditorNodeMixin(Object3D) {
    static componentName = "animationcontrol";

    static nodeName = "Animation Control";

    static async load() {
        linkHelperTexture = await loadTexture(linkIconUrl);
    }

    static async deserialize(editor, json) {
        const node = await super.deserialize(editor, json);

        const { animation_name } = json.components.find(c => c.name === "animationcontrol").props;

        node.animation_name = animation_name;

        return node;
    }

    constructor(editor) {
        const geometry = new PlaneBufferGeometry();
        // Create a plane size 2x5
        geometry.scale(1.25, 0.5, 1);        
        const material = new MeshBasicMaterial();
        material.map = linkHelperTexture;
        material.side = DoubleSide;
        material.transparent = true;
        super(editor, geometry, material);
        this.name = "Animation Control";
        this.helper = new Mesh(geometry, material);
        this.helper.layers.set(1);
        this.add(this.helper);
        
    }

    copy(source, recursive = true) {
        if (recursive) {
            this.remove(this.helper);
        }

        super.copy(source, recursive);

        if (recursive) {
            const helperIndex = source.children.findIndex(child => child === source.helper);

            if (helperIndex !== -1) {
                this.helper = this.children[helperIndex];
            }
        }

        this.animation_name = source.animation_name;

        return this;
    }

    serialize() {
        return super.serialize({
            animationcontrol: {
                animation_name: this.animation_name
            }
        });
    }

    prepareForExport() {
        super.prepareForExport();
        this.remove(this.helper);
        this.addGLTFComponent("animationcontrol", {
            animation_name: this.animation_name
        });
        this.addGLTFComponent("animation-mixer");
        this.addGLTFComponent("networked", {
            id: this.uuid
        });
        this.replaceObject();
    }
}
