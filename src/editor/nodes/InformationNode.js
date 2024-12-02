import EditorNodeMixin from "./EditorNodeMixin";
import { Object3D, PlaneBufferGeometry, MeshBasicMaterial, Mesh, DoubleSide } from "three";
// import linkIconUrl from "../../assets/link-icon.png";
import infoIconUrl from "../../assets/info.png";
import loadTexture from "../utils/loadTexture";

let linkHelperTexture = null;

export default class InformationNode extends EditorNodeMixin(Object3D) {
    static componentName = "information";

    static nodeName = "Information";

    static async load() {
        linkHelperTexture = await loadTexture(infoIconUrl);
    }

    static async deserialize(editor, json) {
        const node = await super.deserialize(editor, json);

        const { information_url, information_title, information_text, information_image } = json.components.find(c => c.name === "information").props;

        node.information_url = information_url;
        node.information_title = information_title;
        node.information_text = information_text;
        node.information_image = information_image;

        return node;
    }

    constructor(editor) {
        const geometry = new PlaneBufferGeometry();
        // Create a plane size 2x5
        geometry.scale(1, 1, 1);        
        const material = new MeshBasicMaterial();
        material.map = linkHelperTexture;
        material.side = DoubleSide;
        material.transparent = true;
        super(editor, geometry, material);
        this.name = "Information";
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

        this.information_url = source.information_url;
        this.information_title = source.information_title;
        this.information_text = source.information_text;
        this.information_image = source.information_image;

        return this;
    }

    serialize() {
        return super.serialize({
            information: {
                information_url: this.information_url,
                information_title: this.information_title,
                information_text: this.information_text,
                information_image: this.information_image
            }
        });
    }

    prepareForExport() {
        super.prepareForExport();
        this.remove(this.helper);
        this.addGLTFComponent("information", {
            information_url: this.information_url,
            information_title: this.information_title,
            information_text: this.information_text,
            information_image: this.information_image
        });
        this.addGLTFComponent("networked", {
            id: this.uuid
        });
        this.replaceObject();
    }
}
