import EditorNodeMixin from "./EditorNodeMixin";
import { Mesh, MeshBasicMaterial, PlaneBufferGeometry } from "three";

export default class LearningFrameNode extends EditorNodeMixin(Mesh) {
  // GLTF 컴포넌트 이름 (/workspaces/hubs/src/gltf-component-mappings.js에 등록된 컴포넌트)
  static componentName = "tfc-learning-frame";

  // Spoke에 노출되는 Element 이름
  static nodeName = "Learning Frame";

  // 생성자
  constructor(editor) {
    // 평면 객체 생성
    const geometry = new PlaneBufferGeometry();
    const material = new MeshBasicMaterial();

    super(editor, geometry, material);

    // 파라미터 (inflatorWrapper로 전달되는 파라미터)
    this.source = "";
  }

  // 저장
  serialize() {
    return super.serialize({
      [LearningFrameNode.componentName] : {
        source: this.source
      }
    });
  }

  // 로드
  static async deserialize(editor, json) {
    const node = await super.deserialize(editor, json);

    const { source } = json.components.find(c => c.name ===  LearningFrameNode.componentName).props;

    node.source = source === undefined ? "" : source;

    return node;
  }

  // 복사
  copy(source, recursive = true) {
    super.copy(source, recursive);

    this.source = source.source;

    return this;
  }

  // 추출 - 허브로 내보내기
  prepareForExport() {
    super.prepareForExport();

    this.addGLTFComponent(LearningFrameNode.componentName, {
        source: this.source
    });
  }
}

