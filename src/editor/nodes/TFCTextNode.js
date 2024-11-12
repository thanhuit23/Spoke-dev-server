import EditorNodeMixin from "./EditorNodeMixin";
import { Color, Object3D } from "three";
import TFCTextHelper from "../helpers/TFCTextHelper";

export default class TFCTextNode extends EditorNodeMixin(Object3D) {
  // GLTF 컴포넌트 이름 (/workspaces/hubs/src/gltf-component-mappings.js에 등록된 컴포넌트)
  static componentName = "tfc-text";

  // Spoke에 노출되는 Element 이름
  static nodeName = "Text";

  // 생성자
  constructor(editor) {
    super(editor);

    // Property
    this.text = "Text";
    this.fontName = "Gulim";
    this.fontUrl = "";
    this.fontSize = 16;
    this.color = new Color("#000000");
    this.backgroundColor = new Color("#FFFFFF");
    this.transparency = true;
    this.lineHeight = 16; // this.fontSize
    this.lineSpace = 2;
    this.width = 0;
    this.paddingLeft = 0;
    this.paddingTop = 0;
    this.paddingRight = 0;
    this.paddingBottom = 0;
    this.align = "left";
    this.autoOverflowWrap = false;
    this.wordBreak = "normal";

    // 이전 값
    this.prevState = new Map();
    this.setPrevState(this);

    this.helper = new TFCTextHelper(this);
    this.add(this.helper);

    //this.update();
  }

  // 저장
  serialize() {
    return super.serialize({
      [TFCTextNode.componentName] : {
        text: this.text,
        fontName: this.fontName,
        fontUrl: this.fontUrl,
        fontSize: this.fontSize,
        color: this.color,
        backgroundColor: this.backgroundColor,
        transparency: this.transparency,
        lineHeight: this.lineHeight,
        lineSpace: this.lineSpace,
        width: this.width,
        paddingLeft: this.paddingLeft,
        paddingTop: this.paddingTop,
        paddingRight: this.paddingRight,
        paddingBottom: this.paddingBottom,
        align: this.align,
        autoOverflowWrap: this.autoOverflowWrap,
        wordBreak: this.wordBreak
      }
    });
  }

  // 로드
  static async deserialize(editor, json) {
    const node = await super.deserialize(editor, json);

    const props = json.components.find(c => c.name === TFCTextNode.componentName).props;
    
    Object.keys(props).forEach(key => {
        if (["color", "backgroundColor"].includes(key)) {
          node[key] = new Color(props[key]);
        } else {
          node[key] = props[key];
        }
    });

    return node;
  }

  // 복사
  copy(source) {
    super.copy(source, false);

    this.remove(this.helper);

    this.text = source.text;
    this.fontName = source.fontName;
    this.fontUrl = source.fontUrl;
    this.fontSize = source.fontSize;
    this.color = source.color.clone();
    this.backgroundColor = source.backgroundColor.clone();
    this.transparency = source.transparency;
    this.lineHeight = source.lineHeight;
    this.lineSpace = source.lineSpace;
    this.width = source.width;
    this.paddingLeft = source.paddingLeft;
    this.paddingTop = source.paddingTop;
    this.paddingRight = source.paddingRight;
    this.paddingBottom = source.paddingBottom;
    this.align = source.align;
    this.autoOverflowWrap = source.autoOverflowWrap;
    this.wordBreak = source.wordBreak;

    // 이전 값
    this.setPrevState(source);

    for (let i = 0; i < source.children.length; i++) {
      const child = source.children[i];
      if (child === source.helper) {
        this.helper = new TFCTextHelper(this);
        this.add(this.helper);
      } else {
        this.add(child.clone());
      }
    }

    return this;
  }

  // 추출 - 허브로 내보내기
  prepareForExport() {
    super.prepareForExport();
    
    this.remove(this.helper);

    let colorText = "#" + this.color.getHexString();
    let backgroundColorText = "#" + this.backgroundColor.getHexString();
    if (this.transparency) {
      backgroundColorText = "";
    }

    // inflatorWrapper로 전달되는 Property
    this.addGLTFComponent(TFCTextNode.componentName, {
      text: this.text,
      fontName: this.fontName,
      fontUrl: this.fontUrl,
      fontSize: this.fontSize,
      color: colorText,
      backgroundColor: backgroundColorText,
      lineHeight: this.lineHeight,
      lineSpace: this.lineSpace,
      width: this.width,
      paddingLeft: this.paddingLeft,
      paddingTop: this.paddingTop,
      paddingRight: this.paddingRight,
      paddingBottom: this.paddingBottom,
      align: this.align,
      autoOverflowWrap: this.autoOverflowWrap,
      wordBreak: this.wordBreak
    });

    // 객체 삭제
    this.replaceObject();
  }

  // 이전 값 저장
  setPrevState(source) {
    this.prevState.set("text", source.text);
    this.prevState.set("fontName", source.fontName);
    this.prevState.set("fontUrl", source.fontUrl);
    this.prevState.set("fontSize", source.fontSize);
    this.prevState.set("color", source.color.getHexString());
    this.prevState.set("backgroundColor", source.backgroundColor.getHexString());
    this.prevState.set("transparency", source.transparency);
    this.prevState.set("lineHeight", source.lineHeight);
    this.prevState.set("lineSpace", source.lineSpace);
    this.prevState.set("width", source.width);
    this.prevState.set("paddingLeft", source.paddingLeft);
    this.prevState.set("paddingTop", source.paddingTop);
    this.prevState.set("paddingRight", source.paddingRight);
    this.prevState.set("paddingBottom", source.paddingBottom);
    this.prevState.set("align", source.align);
    this.prevState.set("autoOverflowWrap", source.autoOverflowWrap);
    this.prevState.set("wordBreak", source.wordBreak);
  }

  // Transform이 변경되어도 onChange가 호출되기 때문에 Property가 변경될 때만 처리하기 위해 이전 값과 비교
  isChange() {
    let result = false;
    if (this.prevState.get("text") != this.text) {
      result = true;
    }
    if (this.prevState.get("fontName") != this.fontName) {
      result = true;
    }
    if (this.prevState.get("fontUrl") != this.fontUrl) {
      result = true;
    }
    if (this.prevState.get("fontSize") != this.fontSize) {
      result = true;
    }
    if (this.prevState.get("color") != this.color.getHexString()) {
      result = true;
    }
    if (this.prevState.get("backgroundColor") != this.backgroundColor.getHexString()) {
      result = true;
    }
    if (this.prevState.get("transparency") != this.transparency) {
      result = true;
    }
    if (this.prevState.get("lineHeight") != this.lineHeight) {
      result = true;
    }
    if (this.prevState.get("lineSpace") != this.lineSpace) {
      result = true;
    }
    if (this.prevState.get("width") != this.width) {
      result = true;
    }
    if (this.prevState.get("paddingLeft") != this.paddingLeft) {
      result = true;
    }
    if (this.prevState.get("paddingTop") != this.paddingTop) {
      result = true;
    }
    if (this.prevState.get("paddingRight") != this.paddingRight) {
      result = true;
    }
    if (this.prevState.get("paddingBottom") != this.paddingBottom) {
      result = true;
    }
    if (this.prevState.get("align") != this.align) {
      result = true;
    }
    if (this.prevState.get("autoOverflowWrap") != this.autoOverflowWrap) {
      result = true;
    }
    if (this.prevState.get("wordBreak") != this.wordBreak) {
      result = true;
    }

    if (result) {
      // 이전 값
      this.setPrevState(this);
    }
    return result;
  }

  // 변경
  onChange() {
    if (this.isChange()) {
      this.helper.update();
    }
  }

  // 추가
  onAdd() {
    this.helper.update();
  }
  
  // 제거
  onRemove() {
    this.helper.dispose();
  }
}

