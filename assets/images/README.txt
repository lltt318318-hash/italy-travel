这个目录用来放真实的图片素材（jpg / png / webp）。

当前网站的所有视觉效果都用 CSS 渐变实现，确保在没有图片的情况下也能正常展示。
后续如果要替换为真实的意大利风景图片，可以：

1. 把图片放入此目录，例如 italy-travel/assets/images/rome.jpg
2. 在 HTML 中把对应 `.card-art` 区域替换为 `<img src="./assets/images/rome.jpg" alt="罗马">`
3. 也可以在 styles.css 中给某个 class 增加 `background-image: url("../images/rome.jpg");`

注意：参考的网络图片不能未经处理直接使用，请按任务书要求进行修改、裁剪、调色等二次加工。
