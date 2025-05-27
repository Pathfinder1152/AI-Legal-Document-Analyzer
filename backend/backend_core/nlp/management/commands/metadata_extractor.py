import os
import re
from datetime import datetime
from PyPDF2 import PdfReader
from docx import Document
from striprtf.striprtf import rtf_to_text
from dateutil.parser import parse
from typing import Dict, List, Optional
from collections import defaultdict


class UKLegalMetadataExtractor:

    @staticmethod
    def extract_metadata(text: str) -> Dict:
        metadata = {}

        metadata['case_number'] = UKLegalMetadataExtractor._extract_case_number(text)
        metadata['neutral_citation'] = UKLegalMetadataExtractor._extract_citation(text)
        metadata['court'] = UKLegalMetadataExtractor._extract_court(text)
        metadata['judges'] = UKLegalMetadataExtractor._extract_judges(text)
        metadata['hearing_date'] = UKLegalMetadataExtractor._extract_hearing_date(text)
        metadata['parties'] = UKLegalMetadataExtractor._extract_parties(text)
        metadata['representatives'] = UKLegalMetadataExtractor._extract_representatives(text)
        metadata['extracted_at'] = datetime.utcnow().isoformat() + "Z"
        
        return metadata

    @staticmethod
    def _extract_case_number(text: str) -> Optional[str]:
        matches = re.findall(r'Case\s*No:\s*([A-Za-z0-9\-\/,\s]+)', text[:3000], re.IGNORECASE)
        if matches:
            case_number = matches[0].strip()
            return case_number.split('\n')[0]  # Truncate after the first newline
        return None
    
    @staticmethod
    def _extract_citation(text: str) -> Optional[str]:
        match = re.search(r'Neutral Citation Number:\s*(\[[0-9]{4}\]\s*[A-Z]+\s+\w+\s+\d+)', text)
        if match:
            citation = match.group(1).strip()
            return citation.split('\n')[0]  # Truncate after the first newline
        return None

    @staticmethod
    def _extract_court(text: str) -> Optional[str]:
        match = re.search(r'IN\s+THE\s+(.+?\sCOURT)', text, re.IGNORECASE)
        return match.group(1).strip() if match else None

    @staticmethod
    def _extract_judges(text: str) -> Optional[List[str]]:
        before_match = re.search(r'Before\s*:?\s*(.*?)(?:\n{2,}|-{3,}|Between)', text, re.IGNORECASE | re.DOTALL)
        if before_match:
            raw_names = before_match.group(1).strip().replace('\n', ' ')
            raw_names = re.sub(r'-+', '', raw_names)  # Remove unnecessary dashes
            
            # Handle cases where titles and roles span multiple lines
            raw_names = re.sub(r'\s{2,}', ' ', raw_names)  # Normalize extra spaces
            raw_names = re.sub(r'\s+and\s+', ' and ', raw_names, flags=re.IGNORECASE)  # Normalize "and"

            # Split by common delimiters (e.g., commas, "and", "&")
            judges = re.split(r',| and | & ', raw_names)
            judges = [j.strip() for j in judges if j.strip()]

            # Combine titles and roles correctly
            combined_judges = []
            for judge in judges:
                if "Lord Chief Justice" in judge or "Justice" in judge:
                    combined_judges.append(judge)
                elif combined_judges:
                    combined_judges[-1] += f", {judge}"  # Append to the previous judge
                else:
                    combined_judges.append(judge)

            return combined_judges
        return None

    @staticmethod
    def _extract_hearing_date(text: str) -> Optional[str]:
        match = re.search(r'Hearing\s+dates?:\s*([\d\-\–\s\w]+)', text, re.IGNORECASE)
        if match:
            hearing_date = match.group(1).strip()
            return hearing_date.split('\n')[0]  # Truncate after the first newline
        return None

    @staticmethod
    def _extract_parties(text: str) -> Dict[str, str]:
        parties = {}
        between_section = re.search(r'Between\s*:?\s*(.*?)\n\n', text, re.DOTALL | re.IGNORECASE)
        if between_section:
            lines = between_section.group(1).strip().split('\n')
            for line in lines:
                match = re.match(r'(.*)\s+(Claimant|Defendant|Respondent|Appellant|Interested Parties|Prosecution)', line, re.IGNORECASE)
                if match:
                    name = match.group(1).strip()
                    role = match.group(2).strip().title()
                    parties[role] = name
        return parties

    @staticmethod
    def _extract_representatives(text: str) -> Dict[str, str]:
        reps = {}
        first_page = text[:2000]

        lines = re.findall(r'(.*?)\s+for\s+([\w\s&,.()\'-]+)', first_page, re.IGNORECASE)
        for rep, party in lines:
            clean_party = re.sub(r'\s+', ' ', party.strip().title())  # Clean up extra spaces
            reps.setdefault(clean_party, []).append(rep.strip())

        return {party: "; ".join(set(reps)) for party, reps in reps.items()}

def extract_text_from_file(file_path: str) -> str:
    ext = os.path.splitext(file_path)[-1].lower()
    if ext == ".pdf":
        with open(file_path, "rb") as f:
            reader = PdfReader(f)
            return "\n".join([page.extract_text() for page in reader.pages if page.extract_text()])
    elif ext == ".docx":
        doc = Document(file_path)
        return "\n".join([p.text for p in doc.paragraphs])
    elif ext == ".rtf":
        with open(file_path, "r", encoding="utf-8") as f:
            return rtf_to_text(f.read())
    else:
        raise ValueError("Unsupported file format.")

def extract_case_data(file_path: str) -> dict:
    text = extract_text_from_file(file_path)
    metadata = UKLegalMetadataExtractor.extract_metadata(text)
    return {
        "file_name": os.path.basename(file_path),
        "metadata": metadata,
        "full_text": text.strip()
    }
