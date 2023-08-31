from multiprocessing import Pool
import pika
import redis
import sys
import logging
import json

from constants import REDIS_HOST, REDIS_PORT, RABBITMQ_HOST, NUM_BUSY_WORKERS, TASK_QUEUE_NAME, MAX_WORKERS
from task_handlers import process_task, aggregate_results
from utils.logger import init_logger
from utils.redis_utils import completed_tasks_key, get_num_completed_tasks, get_total_num_tasks, \
    result_aggregation_key, clean_up, job_status_key, get_num_entries_per_file, result_path_key

logger = init_logger(__name__, logging.DEBUG)


def start_worker(_):
    connection = pika.BlockingConnection(pika.ConnectionParameters(RABBITMQ_HOST))
    channel = connection.channel()
    redis_client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0)

    channel.queue_declare(queue=TASK_QUEUE_NAME, durable=True)

    def aggregate_if_ready(job_id):        
        total_num_tasks = get_total_num_tasks(redis_client, job_id)
        num_completed_tasks = get_num_completed_tasks(redis_client, job_id)
        num_entries_per_file = get_num_entries_per_file(redis_client, job_id)
        
        logger.info(f"total_num_of_tasks: {total_num_tasks}, num_completed_tasks: {num_completed_tasks}, job: {job_id}")
        if total_num_tasks != num_completed_tasks:
            return
        
        # get the lock for aggregation
        if redis_client.setnx(result_aggregation_key(job_id), "true"):
            logger.info(f"Acquired lock. Aggregating result for job: {job_id}");
        else:
            logger.info(f"Aggregation is already running.")
        
        try:
            redis_client.set(job_status_key(job_id), "AGGREGATING")
            logger.info(f"successfully set job status to AGGREGATING for job: {job_id}")
            result_path = aggregate_results(job_id, num_entries_per_file)
            redis_client.set(job_status_key(job_id), "COMPLETED")
            redis_client.set(result_path_key(job_id), result_path)
        except Exception as e:
            logger.error(f"Error aggregating result for job {job_id} - {str(e)}")
            redis_client.delete(result_aggregation_key(job_id))
            redis_client.set(job_status_key(job_id), "FAILED")
        finally:
            clean_up(redis_client, job_id)
    
    def callback(ch, method, properties, body):        
        # decode body
        task = json.loads(body.decode())
        
        logger.info(f"starting task {task['task_id']} for job {task['job_id']}")

        redis_client.set(job_status_key(task['job_id']), "PROCESSING")

        # set the worker as busy
        redis_client.incr(NUM_BUSY_WORKERS)
        
        try:
            logger.info(f"processing task: {task['task_id']}")
            # process task
            process_task(task)
            
            # ack the task
            ch.basic_ack(delivery_tag=method.delivery_tag)
            
            job_id = task['job_id']
            
            # increase the number of completed tasks
            redis_client.incr(completed_tasks_key(job_id))
            
            logger.info(f"completed task {task['task_id']} for job {task['job_id']}")
            
            aggregate_if_ready(task['job_id'])
            
            logger.info(f"completed task: {task['task_id']}")
            
            # set the worker as idle
            redis_client.decr(NUM_BUSY_WORKERS)
            
        except Exception as e:
            logger.error(f"Error processing task {task['task_id']} for job {task['job_id']} - {str(e)}")
            redis_client.decr(NUM_BUSY_WORKERS)


    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue='task_queue', on_message_callback=callback)

    logger.info(" [*] Waiting for messages. To exit press CTRL+C")
    channel.start_consuming()


if __name__ == "__main__":
    # set the num of busy workers to 0
    redis_client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0)
    redis_client.set(NUM_BUSY_WORKERS, 0)
    
    # start workers
    max_workers = int(sys.argv[1])
    redis_client.set(MAX_WORKERS, max_workers)    
    with Pool(max_workers) as p:
        p.map(start_worker, range(max_workers))