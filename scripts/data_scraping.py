from bs4 import BeautifulSoup

# Load the HTML file
with open("D:\ai-legal-document-analysis\data\raw\Computer_Misuse_Act.html", "r", encoding="utf-8") as file:
    soup = BeautifulSoup(file, "html.parser")

# Extract case names and links
cases = []
for item in soup.find_all("a"):  # Find all links
    case_name = item.text.strip()
    case_link = item["href"] if "href" in item.attrs else None
    cases.append({"name": case_name, "link": case_link})

# Display extracted data
for case in cases:
    print(f"Case: {case['name']} - Link: {case['link']}")
