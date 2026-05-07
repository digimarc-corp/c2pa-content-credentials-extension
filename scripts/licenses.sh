#!/bin/bash

echo "Extracting third-party licenses..."

license-checker > provisory.txt

sed '/ILAT_DTL_C2PA_Validator_Browser_Extension@1.0.0/{N;d;}' provisory.txt | grep -v -e "email:" -e "url:" -e "path:" -e "licenseFile:" -e "noticeFile:" | tr -d '│├─' | tr -d '└' > filtered.txt
sed -i '' '$ d' filtered.txt #remove last empty line


# Start the Markdown file with the header
echo "# Third-Party Software
 
The C2PA Content Credentials Extension builds upon the great work of many open source projects and we would like to thank them here.
 
In particular, the extension embeds and makes extensive use of the open source [C2PA-JS Library](https://github.com/contentauth/c2pa-js) from the Content Authenticity Initiative (ContentAuth), released under [MIT License](https://github.com/contentauth/c2pa-js/blob/main/LICENSE).
 
## Other Third-Party Software" > THIRD_PARTY_LICENSES.md

# Start the HTML file with the header
cat > src/assets/THIRD_PARTY_LICENSES.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Third-Party Software Licenses</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: #fff;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #1d1d1d;
      border-bottom: 3px solid #47cad1;
      padding-bottom: 10px;
      margin-bottom: 30px;
    }
    h2 {
      color: #1d1d1d;
      margin-top: 40px;
      margin-bottom: 20px;
      font-size: 1.5em;
    }
    h3 {
      color: #555;
      margin-top: 25px;
      margin-bottom: 12px;
      font-size: 1.1em;
    }
    p {
      margin: 12px 0;
    }
    a {
      color: #0e686c;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    ul {
      list-style: none;
      margin: 8px 0;
      padding-left: 0;
    }
    li {
      position: relative;
      margin: 4px 0;
      padding-left: 18px;
    }
    li::before {
      content: "•";
      position: absolute;
      left: 0;
      color: #555;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Third-Party Software</h1>
    <p>The C2PA Content Credentials Extension builds upon the great work of many open source projects and we would like to thank them here.</p>
    <p>In particular, the extension embeds and makes extensive use of the open source <a href="https://github.com/contentauth/c2pa-js">C2PA-JS Library</a> from the Content Authenticity Initiative (ContentAuth), released under <a href="https://github.com/contentauth/c2pa-js/blob/main/LICENSE">MIT License</a>.</p>
    <h2>Other Third-Party Software</h2>
EOF

echo "Converting to Markdown and HTML..."

# Convert to markdown and html format
is_html_list_open=false

while IFS= read -r line; do
    if [[ $line == " "* && ! $line =~ (licenses:|repository:|publisher:) ]]; then
    if [[ $is_html_list_open == true ]]; then
      echo "    </ul>" >> src/assets/THIRD_PARTY_LICENSES.html
    fi

        # Remove leading spaces and add a Markdown subtitle for the package name
        package_name=$(echo $line | sed -e 's/^  *//')
        echo "### $package_name" >> THIRD_PARTY_LICENSES.md
        echo "    <h3>$package_name</h3>" >> src/assets/THIRD_PARTY_LICENSES.html
        echo "    <ul>" >> src/assets/THIRD_PARTY_LICENSES.html
    is_html_list_open=true
    elif [[ $line == *"repository:"* ]]; then
        # Extract the repository URL and format it as a Markdown link
        repo=$(echo $line | awk '{print $NF}')
        echo "- **Repository**: [$repo]($repo)" >> THIRD_PARTY_LICENSES.md
        echo "      <li><strong>Repository</strong>: <a href=\"$repo\">$repo</a></li>" >> src/assets/THIRD_PARTY_LICENSES.html
    elif [[ $line =~ (license:|licenses:) ]]; then
        # Handle license line
        value=$(echo $line | cut -d ':' -f 2- | sed -e 's/^  *//')
        echo "- **License**: $value" >> THIRD_PARTY_LICENSES.md
        echo "      <li><strong>License</strong>: $value</li>" >> src/assets/THIRD_PARTY_LICENSES.html
    elif [[ $line != "" ]]; then
        # Format other lines in bold
        key=$(echo $line | cut -d ':' -f 1 | sed -e 's/^  *//')
        value=$(echo $line | cut -d ':' -f 2- | sed -e 's/^  *//')
        # Capitalize the first letter of the key
        key_capitalized="$(tr '[:lower:]' '[:upper:]' <<< ${key:0:1})${key:1}"
        echo "- **${key_capitalized}**: ${value}" >> THIRD_PARTY_LICENSES.md
        echo "      <li><strong>${key_capitalized}</strong>: ${value}</li>" >> src/assets/THIRD_PARTY_LICENSES.html
    fi
done < filtered.txt

# Close the HTML file
if [[ $is_html_list_open == true ]]; then
    echo "    </ul>" >> src/assets/THIRD_PARTY_LICENSES.html
fi
cat >> src/assets/THIRD_PARTY_LICENSES.html << 'EOF'
  </div>
</body>
</html>
EOF

# Remove the temporary files
rm provisory.txt filtered.txt

echo "✓ THIRD_PARTY_LICENSES.md and src/assets/THIRD_PARTY_LICENSES.html updated"
