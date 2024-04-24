import express from "express";
import Ffmpeg from "fluent-ffmpeg";

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.post("/process", (req, res) => {
  const inputFilePath = req.body.inputFilePath as string;
  const outputFilePath = req.body.outputFilePath as string;
  
  if (!inputFilePath || !outputFilePath) {
    res.status(400).send(`Missing required parameters: inputFilePath and outputFilePath.`);
    return;
  }

  // Convert video to 360p
  Ffmpeg()
  .input(inputFilePath)
    .outputOption('-vf', 'scale=-1:360')
    .on('end', () => {
      res.status(200).send(`Video processing finished successfully.`);
    })
    .on('error', (err) => {
      console.log(`An error occured during video processing: ${err.message}`);
      res.status(500).send(`Failed to process video.`);
    })
    .save(outputFilePath);
});

app.listen(port, () => {
  console.log(`🚀 Video Processing Service is listening at port :${port}`)
})