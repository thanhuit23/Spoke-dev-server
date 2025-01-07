import EditorNodeMixin from "./EditorNodeMixin";
import Mesh, { ImageAlphaMode } from "../objects/IframeImage";
import spokeLogoSrc from "../../assets/spoke-icon.png";
import { RethrownError } from "../utils/errors";
import { getObjectPerfIssues, maybeAddLargeFileIssue } from "../utils/performance";

export default class ImageButtonNode extends EditorNodeMixin(Mesh) {
    static componentName = "image-button";

    static nodeName = "Image Button";

    static initialElementProps = {
        src: new URL(spokeLogoSrc, location).href
    };

    static async deserialize(editor, json, loadAsync, onError) {
        const node = await super.deserialize(editor, json);

        const { src, projection, controls, alphaMode, alphaCutoff } = json.components.find(c => c.name === ImageButtonNode.componentName).props;

        if (json.components.find(c => c.name === "billboard")) {
            node.billboard = true;
        }

        loadAsync(
            (async () => {
                await node.load(src, onError);
                node.controls = controls || false;
                node.alphaMode = alphaMode === undefined ? ImageAlphaMode.Blend : alphaMode;
                node.alphaCutoff = alphaCutoff === undefined ? 0.5 : alphaCutoff;
                node.projection = projection;
            })()
        );

        const { href, triggerType, triggerTarget, triggerName, triggerValue, actionsAfterClick, actionsData } = json.components.find(c => c.name === ImageButtonNode.componentName).props;
        node.href = href === undefined ? "" : href;
        node.triggerType = triggerType === undefined ? "" : triggerType;
        node.triggerTarget = triggerTarget === undefined ? "" : triggerTarget;
        node.triggerName = triggerName === undefined ? "" : triggerName;
        node.triggerValue = triggerValue === undefined ? "" : triggerValue;
        node.actionsAfterClick = actionsAfterClick === undefined ? [] : actionsAfterClick;
        node.actionsData = actionsData === undefined ? {
            audio: "",
            animationTarget: "",
            animationName: "",
            animationValue: ""
        } : actionsData;

        return node;
    }

    constructor(editor) {
        super(editor);

        this._canonicalUrl = "";

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

        this.controls = false;
        this.billboard = false;
        this.alphaMode = ImageAlphaMode.Blend;
        this.alphaCutoff = 0.5;
        this.projection = "flat";
    }

    get src() {
        return this._canonicalUrl;
    }

    set src(value) {
        this.load(value).catch(console.error);
    }

    onChange() {
        this.onResize();
    }

    loadTexture(src) {
        return this.editor.textureCache.get(src);
    }

    async load(src, onError) {
        const nextSrc = src || "";

        if (nextSrc === this._canonicalUrl && nextSrc !== "") {
            return;
        }

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

            const perfEntries = performance.getEntriesByName(accessibleUrl);

            if (perfEntries.length > 0) {
                const imageSize = perfEntries[0].encodedBodySize;
                maybeAddLargeFileIssue("image", imageSize, this.issues);
            }
        } catch (error) {
            this.showErrorIcon();

            const imageError = new RethrownError(`Error loading image ${this._canonicalUrl}`, error);

            if (onError) {
                onError(this, imageError);
            }

            console.error(imageError);

            this.issues.push({ severity: "error", message: "Error loading image." });
        }

        this.editor.emit("objectsChanged", [this]);
        this.editor.emit("selectionChanged");
        this.hideLoadingCube();

        return this;
    }

    copy(source, recursive = true) {
        super.copy(source, recursive);

        this.controls = source.controls;
        this.billboard = source.billboard;
        this.alphaMode = source.alphaMode;
        this.alphaCutoff = source.alphaCutoff;

        this._canonicalUrl = source._canonicalUrl;

        this.href = source.href;
        this.triggerType = source.triggerType;
        this.triggerTarget = source.triggerTarget;
        this.triggerName = source.triggerName;
        this.triggerValue = source.triggerValue;
        this.actionsAfterClick = source.actionsAfterClick;
        this.actionsData = source.actionsData;

        return this;
    }

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

        this.addGLTFComponent("networked", {
            id: this.uuid
        });

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
                actionsData: this.exportData
            });
        }

        this.replaceObject();
    }

    getRuntimeResourcesForStats() {
        if (this._texture) {
            return { textures: [this._texture], meshes: [this._mesh], materials: [this._mesh.material] };
        }
    }
}