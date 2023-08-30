import * as amqp from 'amqplib';
import { Task } from '../types/Task';

export async function enqueue(task: Task, queue: string) {
  let conn: amqp.Connection;
  try {
    conn = await amqp.connect('amqp://localhost');
    const channel = await conn.createChannel();
    const msg = JSON.stringify(task);
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
    console.log(" [x] Sent '%s'", msg);
  } catch (error) {
    console.error(error);
  } finally {
    setTimeout(()=>{
      if(conn) conn.close();
    }, 500);
  }
}
