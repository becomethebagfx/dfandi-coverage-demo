"""Generate realistic DF&I subcontractor demo data.

Outputs `src/data/contractors.json` with ~90 fictional subs spread across the
US, biased toward UPS/FedEx/logistics hub states. Each contractor has 3-6
compliance documents with a realistic expiration spread so the dashboard shows
genuine red/amber/green tiers.
"""
import json
import random
from datetime import date, timedelta
from pathlib import Path

random.seed(20260618)
TODAY = date(2026, 6, 18)

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src" / "data" / "contractors.json"
OUT.parent.mkdir(parents=True, exist_ok=True)

# (state code, name, major hub city, lat, lng, weight)
STATES = [
    ("AL", "Alabama",          "Birmingham",    33.52, -86.81, 2),
    ("AK", "Alaska",           "Anchorage",     61.22, -149.90, 1),
    ("AZ", "Arizona",          "Phoenix",       33.45, -112.07, 3),
    ("AR", "Arkansas",         "Little Rock",   34.75, -92.29, 2),
    ("CA", "California",       "Los Angeles",   34.05, -118.25, 5),
    ("CO", "Colorado",         "Denver",        39.74, -104.99, 2),
    ("CT", "Connecticut",      "Hartford",      41.76, -72.67, 1),
    ("DE", "Delaware",         "Wilmington",    39.74, -75.55, 1),
    ("FL", "Florida",          "Jacksonville",  30.33, -81.66, 5),
    ("GA", "Georgia",          "Atlanta",       33.75, -84.39, 4),
    ("HI", "Hawaii",           "Honolulu",      21.31, -157.86, 1),
    ("ID", "Idaho",            "Boise",         43.61, -116.20, 1),
    ("IL", "Illinois",         "Chicago",       41.88, -87.63, 4),
    ("IN", "Indiana",          "Indianapolis",  39.77, -86.16, 4),
    ("IA", "Iowa",             "Des Moines",    41.59, -93.62, 2),
    ("KS", "Kansas",           "Kansas City",   39.11, -94.63, 2),
    ("KY", "Kentucky",         "Louisville",    38.25, -85.76, 6),
    ("LA", "Louisiana",        "New Orleans",   29.95, -90.07, 2),
    ("ME", "Maine",            "Portland",      43.66, -70.26, 1),
    ("MD", "Maryland",         "Baltimore",     39.29, -76.61, 2),
    ("MA", "Massachusetts",    "Boston",        42.36, -71.06, 2),
    ("MI", "Michigan",         "Detroit",       42.33, -83.05, 3),
    ("MN", "Minnesota",        "Minneapolis",   44.98, -93.27, 2),
    ("MS", "Mississippi",      "Jackson",       32.30, -90.18, 2),
    ("MO", "Missouri",         "St. Louis",     38.63, -90.20, 3),
    ("MT", "Montana",          "Billings",      45.78, -108.50, 1),
    ("NE", "Nebraska",         "Omaha",         41.26, -95.94, 1),
    ("NV", "Nevada",           "Las Vegas",     36.17, -115.14, 2),
    ("NH", "New Hampshire",    "Manchester",    42.99, -71.46, 1),
    ("NJ", "New Jersey",       "Newark",        40.74, -74.17, 4),
    ("NM", "New Mexico",       "Albuquerque",   35.08, -106.65, 1),
    ("NY", "New York",         "Buffalo",       42.89, -78.88, 3),
    ("NC", "North Carolina",   "Charlotte",     35.23, -80.84, 3),
    ("ND", "North Dakota",     "Fargo",         46.88, -96.79, 1),
    ("OH", "Ohio",             "Columbus",      39.96, -82.99, 4),
    ("OK", "Oklahoma",         "Oklahoma City", 35.47, -97.52, 2),
    ("OR", "Oregon",           "Portland",      45.52, -122.68, 2),
    ("PA", "Pennsylvania",     "Pittsburgh",    40.44, -79.99, 4),
    ("RI", "Rhode Island",     "Providence",    41.82, -71.41, 1),
    ("SC", "South Carolina",   "Columbia",      34.00, -81.04, 2),
    ("SD", "South Dakota",     "Sioux Falls",   43.55, -96.73, 1),
    ("TN", "Tennessee",        "Memphis",       35.15, -90.05, 5),
    ("TX", "Texas",            "Dallas",        32.78, -96.80, 6),
    ("UT", "Utah",             "Salt Lake City",40.76, -111.89, 2),
    ("VT", "Vermont",          "Burlington",    44.48, -73.21, 1),
    ("VA", "Virginia",         "Richmond",      37.54, -77.43, 2),
    ("WA", "Washington",       "Seattle",       47.61, -122.33, 3),
    ("WV", "West Virginia",    "Charleston",    38.35, -81.63, 1),
    ("WI", "Wisconsin",        "Milwaukee",     43.04, -87.91, 2),
    ("WY", "Wyoming",          "Cheyenne",      41.14, -104.82, 1),
    ("DC", "District of Columbia","Washington", 38.91, -77.04, 1),
]
TARGET_COUNT = 90  # ~90 contractors total

NAME_PREFIXES = [
    "Bluegrass", "Sun Belt", "Heartland", "Cornerstone", "Iron Rail",
    "North Star", "Coastal", "Summit", "Anchor", "Beacon", "Atlas",
    "Patriot", "Frontier", "Cardinal", "Buckeye", "Lone Star", "Gulf Coast",
    "Sierra", "Pacific", "Allegheny", "Triangle", "Apex", "Capital",
    "Mid-Continent", "Tri-State", "Riverbend", "Granite", "Hawkeye",
    "Mountain", "Diamond", "Crescent", "Liberty", "Phoenix", "Rocky Mountain",
    "Empire", "Old Dominion", "Big Sky", "Sooner", "Volunteer", "Bayou",
    "Steel City", "Crossroads", "Hilltop", "Cypress", "Rust Belt",
]
NAME_CORE = [
    "Conveyor", "Material Systems", "Integration", "Fabrication",
    "Industrial", "Mechanical", "Electrical", "Controls",
    "Sortation", "Installation", "Rigging", "Builders",
]
NAME_SUFFIX = ["LLC", "Inc.", "Co.", "Group", "Services", "Solutions", "Partners"]

FIRST_NAMES = ["Mike", "Sarah", "James", "Rachel", "Tony", "Karen", "David",
               "Carlos", "Megan", "Brian", "Diane", "Travis", "Holly", "Eric",
               "Stephanie", "Marcus", "Kim", "Anthony", "Joel", "Maria",
               "Greg", "Lisa", "Ryan", "Heather", "Jamal", "Cathy"]
LAST_NAMES = ["Miller", "Davis", "Reed", "Hancock", "Garcia", "O'Brien",
              "Patel", "Nguyen", "Chen", "Bennett", "Underwood", "Hahn",
              "Park", "Vargas", "Cole", "Stafford", "Mendoza", "Whittaker",
              "Bauer", "Singh", "Caldwell", "Perez", "McLean", "Holloway"]

CAPABILITIES = [
    "Mechanical Install", "Electrical Install", "Controls / PLC",
    "Conveyor Install", "Rigging", "Crane Operator", "Welding",
    "Sheet Metal", "Site Survey",
]

DOC_TYPES_REQUIRED = ["General Liability", "Workers Comp", "W9"]
DOC_TYPES_COMMON = ["Auto Liability", "OSHA 30"]
DOC_TYPES_OPTIONAL = ["Umbrella", "State Contractor License", "Drug Screening"]


def make_company(state_code):
    pre = random.choice(NAME_PREFIXES)
    core = random.choice(NAME_CORE)
    suf = random.choice(NAME_SUFFIX)
    # blend in the state initials for some companies
    if random.random() < 0.25:
        return f"{pre} {core} {suf}"
    return f"{pre} {state_code} {core} {suf}"


def jitter(lat, lng):
    return round(lat + random.uniform(-0.6, 0.6), 4), round(lng + random.uniform(-0.6, 0.6), 4)


def slug(s):
    return "".join(c.lower() if c.isalnum() else "-" for c in s).strip("-")


def expiry_for_class(cls):
    """Random expiration date for a desired risk class. Anchored on TODAY."""
    if cls == "expired":
        return TODAY - timedelta(days=random.randint(2, 200))
    if cls == "critical":   # <30d
        return TODAY + timedelta(days=random.randint(1, 29))
    if cls == "warning":    # 30-89d
        return TODAY + timedelta(days=random.randint(30, 89))
    if cls == "upcoming":   # 90-179d
        return TODAY + timedelta(days=random.randint(90, 179))
    return TODAY + timedelta(days=random.randint(180, 540))


# Distribution targets across all documents
DOC_CLASS_WEIGHTS = [
    ("expired", 0.08),
    ("critical", 0.10),
    ("warning", 0.15),
    ("upcoming", 0.25),
    ("ok", 0.42),
]
def pick_class():
    r = random.random()
    acc = 0
    for cls, w in DOC_CLASS_WEIGHTS:
        acc += w
        if r <= acc:
            return cls
    return "ok"


def make_documents(contractor_id, state_code):
    docs = []
    chosen = list(DOC_TYPES_REQUIRED)
    for t in DOC_TYPES_COMMON:
        if random.random() < 0.75:
            chosen.append(t)
    for t in DOC_TYPES_OPTIONAL:
        if random.random() < 0.45:
            chosen.append(t)
    random.shuffle(chosen)
    chosen = chosen[:random.randint(3, 6)]
    for i, t in enumerate(chosen):
        cls = pick_class()
        exp = expiry_for_class(cls)
        # Issuance: most policies are annual; lic. multi-year
        if t == "State Contractor License":
            tenure = random.choice([365 * 2, 365 * 3])
        elif t == "W9":
            tenure = 365 * 4
        else:
            tenure = 365
        issued = exp - timedelta(days=tenure)
        coverage_options = {
            "General Liability":          ["$1,000,000 / $2,000,000", "$2,000,000 / $4,000,000", "$5,000,000 / $5,000,000"],
            "Workers Comp":               ["Statutory", "$1,000,000", "$2,000,000"],
            "Auto Liability":             ["$1,000,000 CSL", "$2,000,000 CSL"],
            "Umbrella":                   ["$5,000,000", "$10,000,000"],
        }
        coverage = random.choice(coverage_options.get(t, [""])) if t in coverage_options else None
        authority_options = {
            "State Contractor License": [f"{state_code} Contractors Licensing Board"],
            "OSHA 30":                  ["OSHA Outreach Training Program"],
            "Drug Screening":           ["Quest Diagnostics", "Concentra", "LabCorp"],
        }
        authority = random.choice(authority_options[t]) if t in authority_options else None
        docs.append({
            "id": f"{contractor_id}-doc-{i+1}",
            "type": t,
            "issued_date": issued.isoformat(),
            "expires_date": exp.isoformat(),
            "coverage_limit": coverage,
            "issuing_authority": authority,
            "pdf_url": f"#{contractor_id}-{slug(t)}.pdf",
        })
    return docs


def assign_state_counts():
    """Weighted sampling to produce ~TARGET_COUNT contractors with hub bias."""
    weights = [s[5] for s in STATES]
    chosen = random.choices(range(len(STATES)), weights=weights, k=TARGET_COUNT)
    counts = {i: 0 for i in range(len(STATES))}
    for c in chosen:
        counts[c] += 1
    return counts


def make_contractor(state, idx):
    code, name, city, lat, lng, _w = state
    company = make_company(code)
    contact = f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"
    domain = slug(company).replace("--", "-").replace("llc", "").strip("-")[:30]
    email = f"{slug(contact).replace('-','.')}@{domain or 'subcontractor'}.com"
    phone_area = random.randint(205, 989)
    phone = f"({phone_area}) {random.randint(200,999)}-{random.randint(1000,9999)}"
    lat2, lng2 = jitter(lat, lng)
    caps = random.sample(CAPABILITIES, k=random.randint(2, 5))
    cid = f"sub-{code.lower()}-{idx:02d}"
    return {
        "id": cid,
        "company": company,
        "contact_name": contact,
        "email": email,
        "phone": phone,
        "address": {
            "street": f"{random.randint(100, 9999)} {random.choice(['Industrial','Commerce','Logistics','Distribution','Forge','Mill','Foundry'])} {random.choice(['Way','Park Dr','Blvd','Ave','Rd'])}",
            "city": city,
            "state": code,
            "state_name": name,
            "zip": f"{random.randint(10000, 99999)}",
            "lat": lat2,
            "lng": lng2,
        },
        "capabilities": caps,
        "documents": make_documents(cid, code),
        "notes": random.choice([
            "Long-standing partner; preferred for large installs.",
            "New addition Q1 2026; small projects to date.",
            "Specializes in food and beverage facility work.",
            "Has crews available for short-notice mobilization.",
            "Strong on parcel sortation site work.",
            "Used on UPS Worldport and FedEx Memphis projects.",
            "Travel-willing; small but excellent crew.",
            "Prefer for retrofits where shutdown windows are tight.",
            "",
        ]),
    }


def main():
    counts = assign_state_counts()
    contractors = []
    for i, state in enumerate(STATES):
        for k in range(counts[i]):
            contractors.append(make_contractor(state, k + 1))
    random.shuffle(contractors)
    OUT.write_text(json.dumps(contractors, indent=2), encoding="utf-8")
    # stats
    total = len(contractors)
    state_set = sorted({c["address"]["state"] for c in contractors})
    cls_count = {"expired": 0, "critical": 0, "warning": 0, "upcoming": 0, "ok": 0}
    for c in contractors:
        for d in c["documents"]:
            days = (date.fromisoformat(d["expires_date"]) - TODAY).days
            if days < 0:
                cls_count["expired"] += 1
            elif days < 30:
                cls_count["critical"] += 1
            elif days < 90:
                cls_count["warning"] += 1
            elif days < 180:
                cls_count["upcoming"] += 1
            else:
                cls_count["ok"] += 1
    print(f"wrote {OUT} with {total} contractors across {len(state_set)} states")
    print(f"document spread: {cls_count}")


if __name__ == "__main__":
    main()
