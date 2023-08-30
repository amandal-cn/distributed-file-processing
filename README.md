# Distributed File Processing

This repository holds a comprehensive system designed for distributed file processing. It includes a User Interface (UI) for easy system interaction, an Application Programming Interface (API) for seamless integration with other software, a queue system for efficient task management, and dedicated workers for concurrent execution of tasks

# For Developers

### Setup Environment

```bash
./scripts/setup.sh
```

### Build and Run

```bash
./scripts/build-run.sh
```

# UI

![Home Page](docs/images/home-page.png)

- One job is divided into multiple tasks where each task contains at most 5 files. For example - for 50 files, 10 tasks will be created
- For now, you should start workers once only after starting the api server.

# Flow Diagram

![Architecture Diagram](docs/images/arch-diagram.png)
