import BaseModal from "./BaseModel";

class WorkspaceModal extends BaseModal {
  constructor() {
    super();

    this.modalName = "workspace";
  }

  add(data) {
    return super.add({
      settings: {},
      collectionKey: `${data.name.replace(/ /g, "-")}-${this.getUniqId()}`,
      ...data,
    });
  }

  getInitialValues() {
    return {
      name: "",
      icon: "ri-user-line",
      settings: {
        general: {
          defaultApp: "HOME",
          color: "color-1",
        },
        home: {
          userName: "",
          clockType: "12hr",
          showGreeting: true,
          imageType: "UNSPLASH",
          imageConfig: {
            customImageUrls: [],
            unsplashCategories: ["nature"],
            updateInterval: "DAY-1",
          },
        },
        bookmark: {
          openInNewTab: true,
        },
      },
    };
  }
}

export default new WorkspaceModal();
