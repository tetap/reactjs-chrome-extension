document.addEventListener("paste", async (event) => {
  const clipboardData = event.clipboardData || (window as any).clipboardData;
  const newData = [];
  const items = clipboardData.items || [];
  for (let i = 0; i < items.length; i++) {
    const file = items[i].getAsFile() as File;
    console.log(file);
    if (!file) {
      newData.push(file);
      continue;
    }
    const isImage = file.type.startsWith("image");
    if (!isImage) {
      newData.push(file);
      continue;
    }
    // 文件转base64
    const src = await getImageBase64(file).catch(() => null);
    if (!src) {
      newData.push(file);
      continue;
    }
    // 获取图片
    const image = await loadImage(src).catch(() => null);
    if (!image) {
      newData.push(file);
      continue;
    }
    // 生成水印
    const result = await generateWatermark(image, file.type);
    console.log("result", result);
  }
});

function getImageBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
      reader.onload = null;
      reader.onerror = null;
    };
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
      reader.onload = null;
      reader.onerror = null;
    };
    reader.readAsDataURL(file);
  });
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  const image = new Image();
  image.src = src;
  if (image.complete) return image;
  return new Promise((resolve, reject) => {
    image.onload = () => {
      resolve(image);
    };
    image.onerror = () => {
      reject("Failed to load image");
    };
  });
}

async function generateWatermark(image: HTMLImageElement, mime: string) {
  const { width, height } = image;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);
  ctx.fillStyle = "rgba(0,0,0,0.2)"; // 设置绘制的颜色
  ctx.font = "40px"; // 设置字体的大小
  ctx.textBaseline = "top";
  const {
    width: textWidth,
    actualBoundingBoxAscent,
    actualBoundingBoxDescent,
  } = ctx.measureText("测试水印");
  const textHeight = actualBoundingBoxAscent + actualBoundingBoxDescent;
  const watermark = document.createElement("canvas");
  const { newWidth, newHeight } = getRotatedRectSize(
    textWidth + 30,
    textWidth + 30,
    -30
  );
  watermark.width = newWidth;
  watermark.height = newHeight;
  const watermarkCtx = watermark.getContext("2d");
  watermarkCtx.translate(watermark.width / 2, watermark.height / 2);
  watermarkCtx.rotate((-Math.PI / 180) * -30);
  watermarkCtx.translate(-(watermark.width / 2), -(watermark.height / 2));
  watermarkCtx.fillStyle = "rgba(0,0,0,0.2)"; // 设置绘制的颜色
  watermarkCtx.font = "40px"; // 设置字体的大小
  watermarkCtx.textBaseline = "top";
  watermarkCtx.fillText("测试水印", watermark.width / 2, watermark.height / 2);
  const pattern = ctx.createPattern(watermark, "repeat");
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, width, height);
  const dst = canvas.toDataURL(mime);
  canvas.remove();
  return dst;
}

function getRotatedRectSize(width, height, angle) {
  // 将角度转换为弧度
  const radians = (angle * Math.PI) / 180;

  // 计算旋转后的宽度和高度
  const newWidth =
    Math.abs(width * Math.cos(radians)) + Math.abs(height * Math.sin(radians));
  const newHeight =
    Math.abs(width * Math.sin(radians)) + Math.abs(height * Math.cos(radians));

  return { newWidth, newHeight };
}
