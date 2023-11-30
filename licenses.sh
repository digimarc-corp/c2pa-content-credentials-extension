#!/bin/bash

echo "Extracting third-party licenses..."

license-checker > provisory.txt

license-checker --summary > THIRD_PARTY_LICENSES_SUMMARY.txt

sed '/ILAT_DTL_C2PA_Validator_Browser_Extension@1.0.0/{N;d;}' provisory.txt | grep -v -e "email:" -e "url:" -e "path:" -e "licenseFile:" -e "noticeFile:" | tr -d '│├─' | tr -d '└' > filtered.txt
sed -i '' '$ d' filtered.txt #remove last empty line


# Start the Markdown file with the header
echo "# Third-Party Software
 
The C2PA Content Credentials Extension builds upon the great work of many open source projects and we would like to thank them here.
 
In particular, the extension embeds and makes extensive use of the open source [C2PA-JS Library](https://github.com/contentauth/c2pa-js) by Adobe released under [MIT License](https://github.com/contentauth/c2pa-js/blob/main/LICENSE).
 
## Other Third-Party Software" > THIRD_PARTY_LICENSES.md



echo "Converting to Markdown..."

# Convert to markdown format
while IFS= read -r line; do
    if [[ $line == " "* && ! $line =~ (licenses:|repository:|publisher:) ]]; then
        # Remove leading spaces and add a Markdown subtitle for the package name
        package_name=$(echo $line | sed -e 's/^  *//')
        echo "### $package_name" >> THIRD_PARTY_LICENSES.md
    elif [[ $line == *"repository:"* ]]; then
        # Extract the repository URL and format it as a Markdown link
        repo=$(echo $line | awk '{print $NF}')
        echo "- **Repository**: [$repo]($repo)" >> THIRD_PARTY_LICENSES.md
    else
        # Format other lines in bold
        key=$(echo $line | cut -d ':' -f 1 | sed -e 's/^  *//')
        value=$(echo $line | cut -d ':' -f 2- | sed -e 's/^  *//')
        # Capitalize the first letter of the key
        key_capitalized="$(tr '[:lower:]' '[:upper:]' <<< ${key:0:1})${key:1}"
        echo "- **${key_capitalized}**: ${value}" >> THIRD_PARTY_LICENSES.md
    fi
done < filtered.txt

# Remove the temporary files
rm provisory.txt filtered.txt

echo "THIRD_PARTY_LICENSES.md updated"
