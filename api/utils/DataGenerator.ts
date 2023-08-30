import fs from 'fs';
import path from 'path';

export function generateFiles (job_id: string, num_files: number, num_entries_per_file: number) {
    console.log(`generating ${num_files} files for job ${job_id}`);

    // Create job directory if does not exist
    const dir = `data/${job_id}`;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    // Generate files
    for(let fileIndex = 0; fileIndex < num_files; fileIndex++) {

        // Generate an array of random numbers
        const numbers: number[] = [];
        for(let numIndex = 0; numIndex < num_entries_per_file; numIndex++) {
            const num: number = Math.floor(Math.random() * 10000); // use your preferred range here
            numbers.push(num);
        }

        // Write to file
        const filename: string = `file_${fileIndex+1}.json`;
        const filepath: string = path.join(dir, filename);
        const data: object = { "entries": numbers };

        fs.writeFile(filepath, JSON.stringify(data, null, 2), (err) => {
            if (err) throw err;
            console.log(`Data written to file: ${filepath}`);
        });
    }
}

// Call the function
// generateFiles('job1', 7, 100);