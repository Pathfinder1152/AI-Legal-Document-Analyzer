import requests

# Test the user documents endpoint
url = "http://localhost:8000/api/documents/user/"
print(f"Testing endpoint: {url}")

try:
    response = requests.get(url)
    
    # Print status code
    print(f"Status code: {response.status_code}")
    
    # Print response headers
    print("Headers:")
    for header, value in response.headers.items():
        print(f"  {header}: {value}")
    
    # Print response body
    print("\nResponse body:")
    if response.headers.get('content-type') == 'application/json':
        print(response.json())
    else:
        print(response.text[:500])  # Print first 500 chars to avoid overwhelming output
        
except Exception as e:
    print(f"Error occurred: {e}")
