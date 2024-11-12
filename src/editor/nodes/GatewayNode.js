import EditorNodeMixin from "./EditorNodeMixin";
import { Mesh, MeshBasicMaterial, PlaneBufferGeometry } from "three";

export default class GatewayNode extends EditorNodeMixin(Mesh) {
  // GLTF 컴포넌트 이름 (/workspaces/hubs/src/gltf-component-mappings.js에 등록된 컴포넌트)
  static componentName = "tfc-gateway";

  // Spoke에 노출되는 Element 이름
  static nodeName = "Gateway";

  // 생성자
  constructor(editor) {
    // 평면 객체 생성
    const geometry = new PlaneBufferGeometry();
    const material = new MeshBasicMaterial();
    // X축 90도 회전
    geometry.rotateX(-Math.PI / 2);

    super(editor, geometry, material);

    // 파라미터 (inflatorWrapper로 전달되는 파라미터)
    this.linkUrl = "";
  }

  // 저장
  serialize() {
    return super.serialize({
      [GatewayNode.componentName] : {
        linkUrl: this.linkUrl
      }
    });
  }

  // 로드
  static async deserialize(editor, json) {
    const node = await super.deserialize(editor, json);

    const { linkUrl } = json.components.find(c => c.name === GatewayNode.componentName).props;

    node.linkUrl = linkUrl === undefined ? "" : linkUrl;

    return node;
  }

  // 복사
  copy(source, recursive = true) {
    super.copy(source, recursive);

    this.linkUrl = source.linkUrl;

    return this;
  }

  // 추출 - 허브로 내보내기
  prepareForExport() {
    super.prepareForExport();

    this.addGLTFComponent(GatewayNode.componentName, {
      linkUrl: this.linkUrl
    });
  }
}

