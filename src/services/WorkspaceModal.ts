import BaseModal from "./BaseModel";

class WorkspaceModal extends BaseModal {
  constructor() {
    super();

    this.modalName = "workspace";
  }

  add(data) {
    return super.add({
      settings: {},
      collectionKey: `${data.name}-${this.getUniqId()}`,
      ...data,
    });
  }
}

export default new WorkspaceModal();
