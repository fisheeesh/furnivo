import { Worker } from "bullmq";
import { redis } from "../../config/redis-client";

const cacheWorker = new Worker("cache-invalidation", async (job) => {
    const { } = job
}, {
    connection: redis,
    concurrency: 5 //* Process 5 jobs concurrently
})

cacheWorker.on("completed", (job) => {
    console.log(`Job: ${job.id} completed`)
})

cacheWorker.on("failed", (job: any, err) => {
    console.log(`Job: ${job.id} failed`, err)
})