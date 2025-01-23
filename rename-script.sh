#!/bin/bash

# Find files containing 'packer' (case-insensitive) and process each one
find src -type f -iname "*packer*" | while read -r file; do
    dir=$(dirname "$file")
    base=$(basename "$file")

    # Preserve case while replacing 'packer' with 'terrapack'
    if [[ $base =~ [Pp][Aa][Cc][Kk][Ee][Rr] ]]; then
        # Get the case pattern of 'packer' in the filename
        packer_part=$(echo "$base" | grep -o '[Pp][Aa][Cc][Kk][Ee][Rr]')

        # Create terrapack with matching case
        if [[ $packer_part == [A-Z]* ]]; then
            replacement="Terrapack"
        elif [[ $packer_part == [A-Z]* ]]; then
            replacement="TERRAPACK"
        else
            replacement="terrapack"
        fi

        # Create new filename
        newname="$dir/$(echo "$base" | sed "s/$packer_part/$replacement/")"

        # Rename file if new name is different
        if [ "$file" != "$newname" ]; then
            mv -i "$file" "$newname"
            echo "Renamed: $file → $newname"
        fi
    fi
done