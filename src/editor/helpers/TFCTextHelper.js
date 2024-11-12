import { Mesh, PlaneGeometry, MeshBasicMaterial, DoubleSide } from "three";
import { addIsHelperFlag } from "./utils";
import { createTextTexture } from "./tfl/ui/common/text";

export default class TFCTextHelper extends Mesh {
    constructor(property) {
        super();

        this.property = property;
        this.name = "TFCTextHelper";

        addIsHelperFlag(this);
        this.update();
    }

    dispose() {
        this.geometry.dispose();
        this.material.dispose();
    }

    async update() {
        this.dispose();

        let fontColorText = "#" + this.property.color.getHexString();
        let backgroundColorText = "#" + this.property.backgroundColor.getHexString();
        if (this.property.transparency) {
            backgroundColorText = "";
        }

        const textProperty = {
            text: this.property.text,
            fontName: this.property.fontName,
            fontUrl: this.property.fontUrl,
            fontSize: this.property.fontSize,
            fontColorText: fontColorText,
            backgroundColorText: backgroundColorText,
            lineHeight: this.property.lineHeight,
            lineSpace: this.property.lineSpace,
            fixedWidth: this.property.width,
            paddingLeft: this.property.paddingLeft,
            paddingTop: this.property.paddingTop,
            paddingRight: this.property.paddingRight,
            paddingBottom: this.property.paddingBottom,
            textAlign: this.property.align,
            autoOverflowWrap: this.property.autoOverflowWrap,
            wordBreak: this.property.wordBreak
        };
        const textTexture = await createTextTexture(textProperty);
        const texture = textTexture[0];
        const textureProperty = textTexture[1];
        
        // 평면 객체 생성
        this.geometry = new PlaneGeometry(textureProperty.textWidth / textureProperty.fontRatio, textureProperty.textHeight / textureProperty.fontRatio);
        this.material = new MeshBasicMaterial({map: texture, transparent: true, side: DoubleSide});
        this.matrixNeedsUpdate = true;
    }
}

