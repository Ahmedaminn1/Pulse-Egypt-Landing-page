import urllib.request
import re

url = "https://plusegypt.com/"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        
    # The structure in WP usually puts the image before the title or near it in a widget.
    # Let's just find the project images again and display them all so I can match manually.
    pattern = r'<img[^>]+src="([^"]+wp-content/uploads/2025/11/[^"]+)"[^>]*>'
    matches = re.findall(pattern, html)
    print("All 2025/11 images in order of appearance:")
    for m in matches:
        print(m)
except Exception as e:
    print(f"Error: {e}")
