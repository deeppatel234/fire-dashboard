import BaseModal from "./BaseModel";

class WorkspaceModal extends BaseModal {
  constructor() {
    super();

    this.modalName = "workspace";
  }

  insert(data) {
    return super.insert({
      settings: {},
      ...data,
      collectionKey: `${data.name}-${this.getUniqId()}`,
    });
  }
}

export default new WorkspaceModal();
