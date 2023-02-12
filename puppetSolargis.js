import puppeteer from "puppeteer";
import path from "path";

(async () => {
  const downloadPath = path.resolve("./Documents/SolargisDownloads");
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();

  await page.goto("https://solargis.com/maps-and-gis-data/download/france");

  const client = await page.target().createCDPSession();
  await client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath:
      "C:\\Users\\eabid\\Documents\\Programming projects\\SolarGIS-Analyzer-Project\\SolarGIS-Analyzer-Backend\\solar-analyzer-backend\\images",
  });

  const href =
    "/file?url=download/France/France_GHI_mid-size-map_156x200mm-300dpi_v20200903.png&bucket=globalsolaratlas.info";
  let aGHI = await page.$(
    'a[href="/file?url=download/France/France_GHI_mid-size-map_156x200mm-300dpi_v20200903.png&bucket=globalsolaratlas.info"]'
  );
  let mapDownloadLinks = await page.$$(".js-map-preview");
  console.log(mapDownloadLinks);
  const GHI_MED_MAP_LINK_NUM = 4;
  await mapDownloadLinks[GHI_MED_MAP_LINK_NUM].click();
  // added 1 sec sleep because all links in mapDownloadLinks (except first one) don't download correctly unless pause is added before browser.close call
  await sleep(1000);

  console.log("Link click results awaited");
  await browser.close();
})();

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
