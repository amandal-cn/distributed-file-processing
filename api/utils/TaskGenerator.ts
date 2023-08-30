import fs from 'fs';
import { generateFiles } from './DataGenerator';
import { set } from "./Redis";
import { enqueue } from './RabbitMQ';

const groupFiles = (job_id: string): string[][] => {
    // Directory Path
    const dir = `data/${job_id}`;

    // Read all the file names synchronously
    let filenames: string[] = [];
    try {
        filenames = fs.readdirSync(dir);
    } catch (err) {
        console.error(err);
        return [];
    }

    // Group file names by 5
    const groups: string[][] = [];
    for(let i = 0; i < filenames.length; i += 5) {
        console.log(`filenames: ${i}`, filenames)
        groups.push(filenames.slice(i, i + 5));
    }
    console.log("filenames: ", filenames)
    console.log(groups);
    // Return groups
    return groups;
};

export const generateTasks = async(job_id: string, num_files: number, num_entries_per_file: number) => {
    set(`status-${job_id}`, "GENERATING_FILES");
    generateFiles(job_id, num_files, num_entries_per_file);
    const groups = groupFiles(job_id);
    const tasks = [];
    for(let i = 0; i < groups.length; i += 1) {
        tasks.push({
            job_id: job_id,
            task_id: `task-${i}`,
            files: groups[i]
        })
    }
    set(`num_tasks-${job_id}`, tasks.length);

    set(`status-${job_id}`, "ENQUEUEING_TASKS");
    // send tasks to queue
    for(let i = 0; i < tasks.length; i += 1) {
        enqueue(tasks[i], "task_queue");
    }

    set(`status-${job_id}`, "PROCESSING");

    return tasks;
}

// Call the function and log the output
// console.log(generateTasks("job2", 14, 100));