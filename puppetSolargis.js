import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";

export default class solarGISExtractor {
  downloadPath =
    "C:\\Users\\eabid\\Documents\\Programming projects\\SolarGIS-Analyzer-Project\\SolarGIS-Analyzer-Backend\\solar-analyzer-backend\\images";

  async getMapFromSolarGIS(mapName) {
    const downloadPath = path.resolve("./Documents/SolargisDownloads");
    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();

    await page.goto("https://solargis.com/maps-and-gis-data/download/usa");

    const client = await page.target().createCDPSession();
    await client.send("Page.setDownloadBehavior", {
      behavior: "allow",
      downloadPath: downloadPath,
    });

    const href =
      "/file?url=download/France/France_GHI_mid-size-map_156x200mm-300dpi_v20200903.png&bucket=globalsolaratlas.info";
    let aGHI = await page.$(
      'a[href="/file?url=download/France/France_GHI_mid-size-map_156x200mm-300dpi_v20200903.png&bucket=globalsolaratlas.info"]'
    );
    let mapDownloadLinks = await page.$$(".js-map-preview");
    console.log(mapDownloadLinks);
    let GHI_MED_MAP_LINK_NUM = 2;
    if (mapDownloadLinks.length === 12) {
      GHI_MED_MAP_LINK_NUM = 4;
    }
    await mapDownloadLinks[GHI_MED_MAP_LINK_NUM].click();
    // added 1 sec sleep because all links in mapDownloadLinks (except first one) don't download correctly unless pause is added before browser.close call
    await this.sleep(1000);

    console.log("Link click results awaited");
    await browser.close();

    return this.getFilePath(mapName);
  }

  getFilePath(mapName) {
    let files = fs.readdirSync(this.downloadPath);
    let selectedFile;
    files.forEach((fileName) => {
      if (
        fileName.toLowerCase().startsWith(mapName) &&
        !fileName.endsWith("crdownload")
      ) {
        selectedFile = fileName;
      }
    });

    return this.downloadPath + selectedFile;
  }

  sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}
