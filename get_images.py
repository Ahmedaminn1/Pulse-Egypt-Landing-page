import urllib.request
import re

url = "https://plusegypt.com/"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        
    # Find all images in wp-content/uploads
    pattern = r'src="([^"]+wp-content/uploads/[^"]+\.(png|jpg|jpeg|webp))"'
    matches = set(re.findall(pattern, html))
    
    for match in matches:
        print(match[0])
except Exception as e:
    print(f"Error: {e}")
