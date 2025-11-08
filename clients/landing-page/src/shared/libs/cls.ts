const cls = (...classes: Array<string | boolean | undefined>) => {
  const newClasses = [];
  for (const c of classes) {
    if (typeof c === "string") {
      newClasses.push(c.trim());
    }
  }
  return newClasses.join(" ");
};
export default cls;
