export default async function getImageDimensions(file: string): Promise<{ w: number; h: number }> {
  return new Promise(function (resolved) {
    const t2 = new Date().getTime();
    const i = new Image();
    i.onload = function () {
      //console.log('newtime', t2 - new Date().getTime());
      resolved({ w: i.width, h: i.height });
    };
    i.src = file;
  });
}
