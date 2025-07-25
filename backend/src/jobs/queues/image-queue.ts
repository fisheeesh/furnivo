//* Management for image optimization
import { Queue } from 'bullmq'
import { redis } from '../../config/redis-client'

const ImageQueue = new Queue('imageQueue', { connection: redis })

export default ImageQueue