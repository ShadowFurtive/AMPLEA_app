#!/bin/bash

> output_data.txt

for ((i=1; i<=15; i++)); do
    echo "Executing test $i"
    python3 test_file.py >> output_data.txt
    echo "Ended test $i"
done

echo "Finished and saved in output_data.txt."
