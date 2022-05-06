import chalk from "chalk";
import chalkTable from "chalk-table";
import { XMLParser } from "fast-xml-parser";

import settings from "./settings.json" assert { type: "json" };

const sitemapURL = "https://" + settings.sitemap.host + settings.sitemap.path,
  xmlParser = new XMLParser(),
  sitemapResponse = await fetch(sitemapURL);

if (!sitemapResponse.ok)
  throw Error(`Could not get sitemap XML from ${sitemapURL}`);

const sitemapXML = xmlParser.parse(await sitemapResponse.text()),
  allURLs = sitemapXML.urlset.url.map(
    (url: { loc: string }) => url.loc
  ) as string[];

console.debug(`Found ${sitemapXML.urlset.url.length} URLs in the XML sitemap`);

console.debug(`Looking for URLs ${settings.sitemap.pathPrefixes.join(", ")}`);

const urls = allURLs.filter((url) =>
  settings.sitemap.pathPrefixes.some((targetPath) =>
    new URL(url).pathname.startsWith(targetPath)
  )
);

console.info(`Found ${chalk.bold(urls.length)} URLs to check...\n\n`);

const output: { url: string; status: string; redirect: string }[] = [];

for (const url of urls) {
  const targetURL = new URL(url);
  targetURL.host = settings.targetHost;

  const {
    status,
    headers,
    redirected,
    url: resultURL,
  } = await fetch(targetURL.toString());

  const statusOutput =
    status === 200
      ? chalk.green(status)
      : [301, 302].includes(status)
      ? chalk.blue(status)
      : chalk.red(status);

  output.push({
    url: targetURL.pathname,
    status: statusOutput,
    redirect: redirected ? new URL(resultURL).pathname : "",
  });
}

const table = chalkTable(
  {
    leftPad: 2,
    columns: [
      { field: "url", name: chalk.magenta("URL") },
      { field: "status", name: chalk.green("Status") },
      { field: "redirect", name: chalk.yellow("Redirect") },
    ],
  },
  output
);

console.table(table);
process.exit();
