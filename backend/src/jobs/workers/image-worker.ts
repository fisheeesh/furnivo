import { Worker } from "bullmq";
import sharp from "sharp";
import path from "path";
import { redis } from "../../config/redis-client";

//* Create a worker to process the image optimization job
const imageWorker = new Worker("imageQueue", async (job) => {
    const { filePath, fileName, width, height, quality } = job.data

    //* We have to tell sharp that where to store by passing the path cus sharp only do optimization
    const optimizeImagePath = path.join(
        __dirname,
        "../../../",
        "uploads/optimize",
        fileName
    )

    await sharp(filePath)
        .resize(width, height)
        .webp({ quality: quality })
        .toFile(optimizeImagePath)
}, { connection: redis })

imageWorker.on("completed", (job) => {
    console.log(`Job: ${job.id} completed`)
})

imageWorker.on("failed", (job: any, err) => {
    console.log(`Job: ${job.id} failed`, err)
})