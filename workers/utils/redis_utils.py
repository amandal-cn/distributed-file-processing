def completed_tasks_key(job_id):
    return f"completed_tasks-{job_id}"

def total_num_tasks_key(job_id):
    return f"num_tasks-{job_id}"

def result_aggregation_key(job_id):
    return f"result-aggregation-{job_id}"

def result_path_key(job_id):
    return f"result_path-{job_id}"

def job_status_key(job_id):
    return f"status-{job_id}"

def num_entries_per_file_key(job_id):
    return f"num_entries_per_file-{job_id}"

def get_num_completed_tasks(redis_client, job_id):
    if redis_client.exists(completed_tasks_key(job_id)):
        num_completed_tasks = redis_client.get(completed_tasks_key(job_id))
        return int(num_completed_tasks.decode())

def get_total_num_tasks(redis_client, job_id):
    if redis_client.exists(total_num_tasks_key(job_id)):
        num_tasks = redis_client.get(total_num_tasks_key(job_id))
        return int(num_tasks.decode())

def get_num_entries_per_file(redis_client, job_id):
    num_entries_per_file = redis_client.get(num_entries_per_file_key(job_id))
    return int(num_entries_per_file.decode())

def clean_up(redis_client, job_id):
    pass