import { parseActivePathname } from "../../routes/url-parser";
import DetailPagePresenter from "./detail-presenter";

export default class DetailPage {
  #presenter = null;
  async render() {
    return `
      <section class="container">
        <h2 class="detail-title">Detail Cerita</h2>
        <div id="story-detail" class="story-detail-container"></div>
      </section>
    `;
  }

  async afterRender() {
    const parsedPath = parseActivePathname();
    console.log("Parsed Path di DetailPage:", parsedPath);
    const { id } = parsedPath;
    const detailContainer = document.getElementById("story-detail");

    console.log("Detail Container:", detailContainer);
    console.log("Story ID yang diteruskan ke API:", id); 

    DetailPagePresenter.init({
      id,
      container: detailContainer,
    });
  }
}
