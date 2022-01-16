import { exportFile } from "utils/download";

export const exportBookmark = (bookmarkToExport) => {
  const dataToExport = {
    bookmarkList: bookmarkToExport,
  };

  exportFile(dataToExport, `bookmarks-${Date.now()}.json`);
};
