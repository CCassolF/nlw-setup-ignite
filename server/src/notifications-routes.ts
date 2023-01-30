import WebPush from "web-push"
import { FastifyInstance } from "fastify"
import { z } from "zod";

const publicKey = 'BIEtOvfoLb5o7oBaeNgwxRkJ1mIdh6nGoR5pNUp3anbwxhOp4sHApJIr5BPOq5UYFrCxqneprgJvmHMHjmi6y50';
const privateKey = '7kpzKdZJO9T1uC2ZtWT8bcyQ4sDVH0d2IzL1T4YAYvs';

WebPush.setVapidDetails('http://localhost:3333', publicKey, privateKey)

export async function notificationsRoutes(app: FastifyInstance) {
  app.get('/push/public_key', () => {
    return {
      publicKey,
    }
  })

  app.post('/push/register', (request, reply) => {
    console.log(request.body)

    return reply.status(201).send
  })

  app.post('/push/send', async (request, reply) => {
    const sendPushBody = z.object({
      subscription: z.object({
        endpoint: z.string(),
        keys: z.object({
          p256dh: z.string(),
          auth: z.string(),
        })
      })
    })

    const { subscription } = sendPushBody.parse(request.body)

    setTimeout(() => {
      WebPush.sendNotification(subscription, 'HELLO DO BACKEND')
    }, 5000)

    return reply.status(201).send()
  })
}
