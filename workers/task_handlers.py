def process_avg_task(task):
    pass

def process_sum_task(task):
    pass

def process_task(task):
    if task['type'] == "sum":
        process_sum_task(task)
    elif task['type'] == "average":
        process_avg_task(task)

def aggregate_results(job_id):
    pass
    