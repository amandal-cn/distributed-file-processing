import fs from 'fs';
import path from 'path';
import { generateFiles } from './DataGenerator';

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
        groups.push(filenames.slice(i, i + 5));
    }

    console.log(groups);
    // Return groups
    return groups;
};

export const generateTasks = (job_id: string, num_files: number, num_entries_per_file: number) => {
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
    return tasks;
}

// Call the function and log the output
// console.log(generateTasks("job2", 7, 100));