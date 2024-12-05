import EditorNodeMixin from "./EditorNodeMixin";
import PhysicalSpotLight from "../objects/PhysicalSpotLight";
import SpokeSpotLightHelper from "../helpers/SpokeSpotLightHelper";
import { BoxBufferGeometry, MeshBasicMaterial, Mesh } from "three";

export default class InteractiveSpotLightNode extends EditorNodeMixin(PhysicalSpotLight) {
    static componentName = "interactive-spot-light";

    static nodeName = "Interactive Spot Light";

    static ignoreRaycast = true;

    static async deserialize(editor, json) {
        const node = await super.deserialize(editor, json);

        const {
            color,
            intensity,
            range,
            innerConeAngle,
            outerConeAngle,
            castShadow,
            shadowMapResolution,
            shadowBias,
            shadowRadius,
            interactiveRadius
        } = json.components.find(c => c.name === "interactive-spot-light").props;

        node.color.set(color);
        node.intensity = intensity;
        node.range = range;
        node.innerConeAngle = innerConeAngle;
        node.outerConeAngle = outerConeAngle;
        node.castShadow = castShadow;
        node.shadowBias = shadowBias || 0;
        node.shadowRadius = shadowRadius === undefined ? 1 : shadowRadius;
        node.interactiveRadius = interactiveRadius === undefined ? 1 : interactiveRadius;
        node.onUpdateInteractiveCube();

        if (shadowMapResolution) {
            node.shadowMapResolution.fromArray(shadowMapResolution);
        }

        return node;
    }

    constructor(editor) {
        // Create a 3D cube with a size of interactiveRadius
        const geometry = new BoxBufferGeometry();
        geometry.scale(1, 1, 5);
        const material = new MeshBasicMaterial();
        material.transparent = true;
        material.opacity = 0.5;
        super(editor, geometry, material);
        this.name = "Interactive Spot Light";
        this.interactiveCube = new Mesh(geometry, material);
        this.interactiveCube.layers.set(1);
        this.add(this.interactiveCube);
        this.helper = new SpokeSpotLightHelper(this);
        this.helper.visible = false;
        this.add(this.helper);
    }

    onUpdateInteractiveCube() {
        this.interactiveCube.scale.set(this.interactiveRadius, this.interactiveRadius, 5);
    }

    onAdd() {
        this.helper.update();
    }

    onChange() {
        this.helper.update();
        this.onUpdateInteractiveCube();
    }

    onSelect() {
        this.helper.visible = true;
        this.interactiveCube.visible = true;
    }

    onDeselect() {
        this.helper.visible = false;
        this.interactiveCube.visible = false;
    }

    copy(source, recursive = true) {
        super.copy(source, false);

        if (recursive) {
            this.remove(this.helper);
            this.remove(this.interactiveCube);
            this.remove(this.target);

            for (let i = 0; i < source.children.length; i++) {
                const child = source.children[i];
                if (child === source.helper) {
                    this.helper = new SpokeSpotLightHelper(this);
                    this.add(this.helper);
                } else if (child === source.target) {
                    this.target = child.clone();
                    this.add(this.target);
                } else {
                    this.add(child.clone());
                }
            }
        }

        return this;
    }

    serialize() {
        return super.serialize({
            "interactive-spot-light": {
                color: this.color,
                intensity: this.intensity,
                range: this.range,
                innerConeAngle: this.innerConeAngle,
                outerConeAngle: this.outerConeAngle,
                castShadow: this.castShadow,
                shadowMapResolution: this.shadowMapResolution.toArray(),
                shadowBias: this.shadowBias,
                shadowRadius: this.shadowRadius,
                interactiveRadius: this.interactiveRadius
            }
        });
    }

    prepareForExport() {
        super.prepareForExport();
        this.remove(this.helper);
        this.remove(this.interactiveCube);
        this.addGLTFComponent("interactive-spot-light", {
            color: this.color,
            intensity: this.intensity,
            range: this.range,
            innerConeAngle: this.innerConeAngle,
            outerConeAngle: this.outerConeAngle,
            castShadow: this.castShadow,
            shadowMapResolution: this.shadowMapResolution.toArray(),
            shadowBias: this.shadowBias,
            shadowRadius: this.shadowRadius,
            interactiveRadius: this.interactiveRadius
        });
        this.replaceObject();
    }
}
