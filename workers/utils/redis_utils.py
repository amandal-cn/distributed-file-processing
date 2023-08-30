def completed_tasks_key(job_id):
    return f"completed_tasks-{job_id}"

def total_num_tasks_key(job_id):
    return f"num_tasks-{job_id}"

def result_aggregation_status_key(job_id):
    return f"result-aggregation-{job_id}"

def job_status_key(job_id):
    return f"status-{job_id}"

def get_num_completed_tasks(redis_client, job_id):
    num_completed_tasks = redis_client.get(completed_tasks_key(job_id))
    return num_completed_tasks.decode()

def get_total_num_tasks(redis_client, job_id):
    num_tasks = redis_client.get(total_num_tasks_key(job_id))
    return num_tasks.decode()

def get_aggregate_result_status(redis_client, job_id):
    if redis_client.exists(result_aggregation_status_key(job_id)):    
        status = redis_client.get(result_aggregation_status_key(job_id))
        return status.decode()

def clean_up(redis_client, job_id):
    pass