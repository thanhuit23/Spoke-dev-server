import EditorNodeMixin from "./EditorNodeMixin";
import Mesh, { ImageAlphaMode } from "../objects/IframeImage";
import spokeLogoSrc from "../../assets/spoke-icon.png";
import { RethrownError } from "../utils/errors";
import { getObjectPerfIssues, maybeAddLargeFileIssue } from "../utils/performance";

/**
 * ImageButtonNode
 * Represents an interactive image with triggers and actions for user interactions.
 * Inherits functionality from Mesh and EditorNodeMixin.
 */
export default class ImageButtonNode extends EditorNodeMixin(Mesh) {
    // Static properties
    static componentName = "image-button";
    static nodeName = "Image Button";
    static initialElementProps = {
        src: new URL(spokeLogoSrc, location).href
    };

    /**
     * Deserialize the node from JSON.
     * @param {Object} editor - The editor instance.
     * @param {Object} json - The JSON data for deserialization.
     * @param {Function} loadAsync - Asynchronous loader callback.
     * @param {Function} onError - Error handling callback.
     * @returns {Promise<ImageButtonNode>} The deserialized node.
     */
    static async deserialize(editor, json, loadAsync, onError) {
        const node = await super.deserialize(editor, json);

        const component = json.components.find(c => c.name === ImageButtonNode.componentName);
        const props = component && component.props ? component.props : {};
        const { src, projection, controls, alphaMode, alphaCutoff, ...triggerProps } = props;

        if (json.components.some(c => c.name === "billboard")) {
            node.billboard = true;
        }

        loadAsync(
            (async () => {
                await node.load(src, onError);
                node.controls = controls || false;
                node.alphaMode = alphaMode !== undefined ? alphaMode : ImageAlphaMode.Blend;
                node.alphaCutoff = alphaCutoff !== undefined ? alphaCutoff : 0.5;
                node.projection = projection;
            })()
        );

        Object.assign(node, {
            href: triggerProps.href || "",
            triggerType: triggerProps.triggerType || "",
            triggerTarget: triggerProps.triggerTarget || "",
            triggerName: triggerProps.triggerName || "",
            triggerValue: triggerProps.triggerValue || "",
            actionsAfterClick: triggerProps.actionsAfterClick || [],
            actionsData: triggerProps.actionsData || {
                audio: "",
                animationTarget: "",
                animationName: "",
                animationValue: ""
            }
        });

        return node;
    }

    /**
     * Constructor for ImageButtonNode.
     * Initializes properties to default values.
     * @param {Object} editor - The editor instance.
     */
    constructor(editor) {
        super(editor);

        this._canonicalUrl = "";

        // Interaction properties
        this.href = "";
        this.triggerType = "link";
        this.triggerTarget = "";
        this.triggerName = "";
        this.triggerValue = "";
        this.actionsAfterClick = [];
        this.actionsData = {
            audio: "",
            animationTarget: "",
            animationName: "",
            animationValue: ""
        };

        // Image display properties
        this.controls = false;
        this.billboard = false;
        this.alphaMode = ImageAlphaMode.Blend;
        this.alphaCutoff = 0.5;
        this.projection = "flat";
    }

    // Getter and setter for `src`
    get src() {
        return this._canonicalUrl;
    }

    set src(value) {
        this.load(value).catch(console.error);
    }

    /**
     * Handles property changes.
     */
    onChange() {
        this.onResize();
    }

    /**
     * Loads texture from a source URL.
     * @param {string} src - The source URL.
     * @returns {Promise<Texture>} The loaded texture.
     */
    loadTexture(src) {
        return this.editor.textureCache.get(src);
    }

    /**
     * Loads image data and handles errors.
     * @param {string} src - The image source URL.
     * @param {Function} onError - Callback for error handling.
     * @returns {Promise<ImageButtonNode>} The loaded node.
     */
    async load(src, onError) {
        const nextSrc = src || "";
        if (nextSrc === this._canonicalUrl && nextSrc !== "") return;

        this._canonicalUrl = nextSrc;
        this.issues = [];
        this._mesh.visible = false;

        this.hideErrorIcon();
        this.showLoadingCube();

        try {
            const { accessibleUrl, meta } = await this.editor.api.resolveMedia(src);
            this.meta = meta;
            this.updateAttribution();

            await super.load(accessibleUrl);
            this.issues = getObjectPerfIssues(this._mesh, false);

            const imageSize = performance.getEntriesByName(accessibleUrl).find(entry => entry)?.encodedBodySize;
            if (imageSize) maybeAddLargeFileIssue("image", imageSize, this.issues);
        } catch (error) {
            this.handleLoadError(error, onError);
        }

        this.finalizeLoad();
        return this;
    }

    /**
     * Handles errors during the loading process.
     * @param {Error} error - The error that occurred.
     * @param {Function} onError - Callback for error handling.
     */
    handleLoadError(error, onError) {
        this.showErrorIcon();
        const imageError = new RethrownError(`Error loading image ${this._canonicalUrl}`, error);
        if (onError) onError(this, imageError);
        console.error(imageError);
        this.issues.push({ severity: "error", message: "Error loading image." });
    }

    /**
     * Finalizes the loading process by updating the editor state.
     */
    finalizeLoad() {
        this.editor.emit("objectsChanged", [this]);
        this.editor.emit("selectionChanged");
        this.hideLoadingCube();
    }

    /**
     * Copies properties from another instance.
     * @param {ImageButtonNode} source - The source instance to copy.
     * @param {boolean} recursive - Whether to copy recursively.
     * @returns {ImageButtonNode} The current instance.
     */
    copy(source, recursive = true) {
        super.copy(source, recursive);
        Object.assign(this, {
            controls: source.controls,
            billboard: source.billboard,
            alphaMode: source.alphaMode,
            alphaCutoff: source.alphaCutoff,
            _canonicalUrl: source._canonicalUrl,
            href: source.href,
            triggerType: source.triggerType,
            triggerTarget: source.triggerTarget,
            triggerName: source.triggerName,
            triggerValue: source.triggerValue,
            actionsAfterClick: source.actionsAfterClick,
            actionsData: source.actionsData
        });
        return this;
    }

    /**
     * Serializes the node to JSON.
     * @returns {Object} The serialized JSON.
     */
    serialize() {
        const components = {
            [ImageButtonNode.componentName]: {
                src: this._canonicalUrl,
                controls: this.controls,
                alphaMode: this.alphaMode,
                alphaCutoff: this.alphaCutoff,
                projection: this.projection,
                href: this.href,
                triggerType: this.triggerType,
                triggerTarget: this.triggerTarget,
                triggerName: this.triggerName,
                triggerValue: this.triggerValue,
                actionsAfterClick: this.actionsAfterClick,
                actionsData: this.actionsData
            }
        };

        if (this.billboard) {
            components.billboard = {};
        }

        return super.serialize(components);
    }

    /**
     * Prepares the node for export by adding GLTF components.
     */
    prepareForExport() {
        super.prepareForExport();

        const imageData = {
            src: this._canonicalUrl,
            controls: this.controls,
            alphaMode: this.alphaMode,
            projection: this.projection
        };

        if (this.alphaMode === ImageAlphaMode.Mask) {
            imageData.alphaCutoff = this.alphaCutoff;
        }

        this.addGLTFComponent("image", imageData);
        this.addGLTFComponent("networked", { id: this.uuid });

        if (this.billboard && this.projection === "flat") {
            this.addGLTFComponent("billboard", {});
        }

        if (this.href && this.projection === "flat") {
            this.addGLTFComponent(ImageButtonNode.componentName, {
                href: this.href,
                triggerType: this.triggerType,
                triggerTarget: this.triggerTarget,
                triggerName: this.triggerName,
                triggerValue: this.triggerValue,
                actionsAfterClick: this.actionsAfterClick,
                actionsData: this.actionsData
            });
        }

        this.replaceObject();
    }

    /**
     * Retrieves runtime resources for performance statistics.
     * @returns {Object} The resources used by the node.
     */
    getRuntimeResourcesForStats() {
        if (this._texture) {
            return { textures: [this._texture], meshes: [this._mesh], materials: [this._mesh.material] };
        }
    }
}
