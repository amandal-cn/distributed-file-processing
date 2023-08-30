import json
from pathlib import Path
import os

def sum_by_index(files):
    entries = []
    for fpath in files:
        with open(fpath, "r") as fp:
            data = json.load(fp)
            entries.append(data['entries'])
    result = entries[0]
    for entry in entries[1:]:
        result = [result[i] + entry[i] for i in range(len(entry))]
    return result

def process_task(task):
    job_id = task['job_id']
    task_id = task['task_id']
    
    files = [f"data/{job_id}/{filename}" for filename in task['files']]
    result = sum_by_index(files)
    
    dir_path = Path(f"data/{job_id}/tasks")
    dir_path.mkdir(parents=True, exist_ok=True)

    with open(f"data/{job_id}/tasks/{task_id}.json", "w") as fp:
        json.dump({"entries": result}, fp)
    
    
def aggregate_results(job_id, num_entries_per_file):
    files = [f"data/{job_id}/tasks/{filename}" for filename in os.listdir(f"data/{job_id}/tasks")]
    result = None
    for i in range(0, len(files), 5):
        print(f"processing: {files[i:i+5]}")
        temp_result = sum_by_index(files[i:i+5])
        if result is None:
            result = temp_result
        else:
            result = [result[i] + temp_result[i] for i in range(len(temp_result))]
    
    if result is None:
        raise Exception("Error aggregating result")

    # compute mean
    result = [r/num_entries_per_file for r in result]
    result_path = f"data/{job_id}/aggregate_result.json"
    with open(result_path, "w") as fp:
        json.dump({"entries": result}, fp)
        
    return result_path
