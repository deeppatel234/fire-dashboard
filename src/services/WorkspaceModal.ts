import BaseModal from "./BaseModel";

class WorkspaceModal extends BaseModal {
  constructor() {
    super();

    this.modalName = "workspace";
  }

  put(data) {
    return super.put({
      settings: {},
      collectionKey: `${data.name}-${this.getUniqId()}`,
      ...data,
    });
  }
}

export default new WorkspaceModal();
