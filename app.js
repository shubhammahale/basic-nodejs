const express = require("express");
const bodyParser = require("body-parser");
const https = require("https"); // or 'https' for https:// URLs
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// app.post("/user", (req, res, next) => {
//   res.send("<h1>User:" + req.body.username + "</h1>");
// });

const downloadFile = () => {
  return new Promise(async (resolve, reject) => {
    console.log("inside promise");
    let res = "";

    await https.get(
      "https://na.artifactory.swg-devops.com/artifactory/hyc-abell-devops-team-dev-generic-local/VA-Scan-Results/20220630-4353-14/va_scan_summary.json",
      {
        headers: {
          "X-JFrog-Art-Api":
            "AKCp8mZcek4fFnYh7Uk8cM997hocaVJj1skufUoQNn2ypSF1KMhjJUMehRu5up91carZNXAAS",
        },
      },
      function (response) {
        console.log("here");
        response.on("data", (d) => {
          console.log("ondata.....");
          res += d;
          // console.log("RES:", d.toString());
        });

        response.on("end", () => {
          // console.log("DONE:", res);
          return resolve(res);
        });
      }
    );

    // console.log("RESSSS:", res);
    // return reject(error);
  });
};

app.get("/", async (req, res, next) => {
  const ress = await downloadFile();
  console.log("route:", ress);
  res.send({
    data: "Route works!",
    length: JSON.parse(ress).length,
    fileData: JSON.parse(ress),
  });
});

app.listen(5000);

// const decompress = require("decompress");

// async function unzipFile() {
//   try {
//     const files = await decompress("scripts.zip", "dist", {
//       map: (file) => {
//         file.path = `script-${file.path}`;
//         return file;
//       },
//     });
//     console.log(files);
//   } catch (error) {
//     console.log(error);
//   }
// }

// unzipFile();
