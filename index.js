const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");
const replaceTemplate = require("./module/replaceTemplate");
///////////////////////////////////////
//// files

// blocking code, synchronous way
// const texting = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(texting);

// const textOut = `This is what we know about the avocado: ${texting}.\nCreated on ${Date.now()}`;

// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("file written");

// non-blocking code, asynchronous way
//   fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//     fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//       console.log(data2);
//       fs.readFile("./txt/append.txt", "utf-8", (err, data) => {
//         console.log(data);

//         fs.writeFile("./txt/final.txt", `${data2}\n${data}`, "utf-8", (err) => {
//           console.log("file has written");
//         });
//       });
//     });
//   });
// console.log("Will read file");

///////////////////////////////////////
// SERVER

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const DataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  console.log(req.url);
  const { query, pathname } = url.parse(req.url, true);

  // overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    const cardHtml = DataObj.map((el) => replaceTemplate(tempCard, el));
    const output = tempOverview.replace("(%PRODUCTCARD%)", cardHtml.join(""));

    res.end(output);
    // product page
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = DataObj[query.id];
    const output = replaceTemplate(tempProduct, product);

    res.end(output);
    // api page
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  } else {
    // not found page
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page not found!</h1>");
  }
});
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to request on port 8000");
});