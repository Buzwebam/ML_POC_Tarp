const childProcess = require('child_process');
const { spawnSync } = require('child_process');
const { readFile } = require('fs/promises');
const { appendFile } = require('fs/promises');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
  const upload = multer({
    dest: './uploads/',
    limits: { fieldSize: 1024 * 1024 * 5 }, // 5MB
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png|pdf|doc|docx)$/)) {
        return cb(new Error('Only upload files with jpg, jpeg, png, pdf, doc, docx extension.'));
      }
      cb(null, true);
    },
    storage: multer.diskStorage({
      destination: './uploads/',
      filename(req, file, cb) {
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}${ext}`;
        cb(null, filename);
      },
    }),
  });

module.exports = function (app) {

    app.post("/run/yolo/file", upload.single("file"), uploadFiles);

function uploadFiles(req, res) {
    console.log(req.file);
    try {
        const imagePath = `"${req.file.path}"`;
      const command = `yolo task=detect mode=predict conf=0.25 save=True model="C:/Users/Game_Dev_25/runs/detect/train5/weights/best.pt" source=${imagePath}`;     
        const output = childProcess.execSync(command).toString();

        const savedPath = output.match(/Results saved to (.*)$/gm)[0].replace("Results saved to ", "").trim().replace('\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])', "").replace(/\x1b\[1m/g, "").replace(/\x1b\[0m/g, "");

        var file = path.resolve('.\\', savedPath, path.basename(imagePath)).replace(/"/g, "");
        const newFilePath = path.join(path.dirname(file), path.basename(file, path.extname(file)) + '.jpg');
        console.log(newFilePath);
        res.sendfile(newFilePath);
    } catch (error) {
      console.error(`exec error: ${error}`);
      res.status(500).send(`Error executing command: ${error}`);
    }
}
app.get('/run/yolo/onPath', async (req, res) => {
    try {
        const imagePath = `"C:/Users/Game_Dev_25/Pictures/3.png"`;
      const command = `yolo task=detect mode=predict conf=0.25 save=True model="C:/Users/Game_Dev_25/runs/detect/train5/weights/best.pt" source=${imagePath}`;     
        const output = childProcess.execSync(command).toString();

        const savedPath = output.match(/Results saved to (.*)$/gm)[0].replace("Results saved to ", "").trim().replace('\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])', "").replace(/\x1b\[1m/g, "").replace(/\x1b\[0m/g, "");

        var file = path.resolve('.\\', savedPath, path.basename(imagePath)).replace(/"/g, "");
        console.log(file);
        res.sendfile(file);
    } catch (error) {
      console.error(`exec error: ${error}`);
      res.status(500).send(`Error executing command: ${error}`);
    }
  });
  app.get('/run-yolo', (req, res) => {
    const imagePath = 'C:/Users/Game_Dev_25/Pictures/1.png';
    const threshold = 0.25;
    const savePath = 'C:/Users/Game_Dev_25/Pictures/1_annotated.png';
  
    const command = `yolo task=detect mode=predict conf=0.25 save=True model="C:/Users/Game_Dev_25/runs/detect/train5/weights/best.pt"  source ="${imagePath}""`;
  
    childProcess.exec(command, (error) => {
      if (error) {
        console.error(`exec error: ${error}`);
        res.status(500).send(`Error running YOLO: ${error}`);
      } else {
        res.send(`Predicted image saved to: ${savePath}`);
      }
    });
  });
}
