#!/bin/bash
cd /home/kavia/workspace/code-generation/modern-task-management-system-131725/task_manager_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

