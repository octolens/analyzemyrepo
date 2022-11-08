import domtoimage from "dom-to-image";

export default async function renderToImage(elementId: string) {
  const node = document.getElementById(elementId) as HTMLElement;
  const dataURL = await domtoimage.toJpeg(node, {
    width: 200,
    height: 200,
  });
  return dataURL;
}
