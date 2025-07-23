import { Worker } from "bullmq";
import { Redis } from "ioredis";
import sharp from "sharp";
import path from "path";

const connection = new Redis({
    host: process.env.REDIS_HOST,
    port: 6379,
    // password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: null,
})

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
}, { connection })

imageWorker.on("completed", (job) => {
    console.log(`Job: ${job.id} completed`)
})

imageWorker.on("failed", (job: any, err) => {
    console.log(`Job: ${job.id} failed`, err)
})