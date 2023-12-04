import fs from "fs";

export const getHtmlPage = async (app: string) => {
  const skeleton = await fs
    .readFileSync(__dirname + "/../assets/index.html")
    .toString();

  return skeleton.replace("{{params.app}}", app);
};
