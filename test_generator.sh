#!/bin/bash

> output_data.txt

# Execute the test_file.py 15 times and save the output in the output_data.txt

for ((i=1; i<=15; i++)); do
    echo "Executing test $i"
    python3 test_file.py >> output_data.txt
    echo "Ended test $i"
    echo "----------------------------------------------"
done

echo "Finished and saved in output_data.txt."
