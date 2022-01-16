export const exportFile = (data, name) => {
  const a = document.createElement("a");
  const type = name.split(".").pop();
  a.href = URL.createObjectURL(
    new Blob([JSON.stringify(data)], {
      type: `text/${type === "txt" ? "plain" : type}`,
    }),
  );
  a.download = name;
  a.click();
  a.remove();
};
