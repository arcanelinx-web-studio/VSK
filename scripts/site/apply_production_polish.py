from __future__ import annotations

import base64
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
INDEX = ROOT / "index.html"
HEADERS = ROOT / "_headers"


def replace_once(text: str, old: str, new: str) -> str:
    if new in text:
        return text
    if old not in text:
        raise RuntimeError(f"Expected marker not found: {old[:100]!r}")
    return text.replace(old, new, 1)


text = INDEX.read_text(encoding="utf-8")

if 'href="styles-v5.css"' not in text:
    text = replace_once(
        text,
        '  <link rel="stylesheet" href="styles-v4.css" />',
        '  <link rel="stylesheet" href="styles-v4.css" />\n  <link rel="stylesheet" href="styles-v5.css" />',
    )

seo = """  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="en_IN" />
  <meta property="og:site_name" content="VSK Electro-Mech Solutions" />
  <meta property="og:title" content="VSK Electro-Mech Solutions | SPM, Retrofit & Precision Engineering" />
  <meta property="og:description" content="Special purpose machines, CNC/PLC retrofit, industrial automation and precision manufacturing from Bengaluru, India." />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="VSK Electro-Mech Solutions | SPM, Retrofit & Precision Engineering" />
  <meta name="twitter:description" content="Special purpose machines, CNC/PLC retrofit, industrial automation and precision manufacturing from Bengaluru, India." />"""
if 'property="og:site_name"' not in text:
    text = replace_once(text, '  <meta name="theme-color" content="#07111d" />', '  <meta name="theme-color" content="#07111d" />\n' + seo)

business = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "VSK Electro-Mech Solutions",
    "description": "Special purpose machine manufacturing, CNC and PLC retrofit, machine reconditioning, industrial automation and precision CNC machined components.",
    "foundingDate": "2011",
    "telephone": ["+91-98803-36714", "+91-73531-00095"],
    "email": "vsk.electromech@gmail.com",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "No. 8, 11th Cross, 4th Phase, Ganapathinagar, Peenya Industrial Area",
        "addressLocality": "Bengaluru",
        "addressRegion": "Karnataka",
        "postalCode": "560058",
        "addressCountry": "IN",
    },
    "areaServed": {"@type": "Country", "name": "India"},
    "knowsAbout": [
        "Special Purpose Machines",
        "CNC retrofit",
        "PLC and HMI systems",
        "Machine reconditioning",
        "Industrial automation",
        "Precision CNC machining",
    ],
}
jsonld = json.dumps(business, ensure_ascii=False, separators=(",", ":"))
jsonld_tag = f'  <script type="application/ld+json">{jsonld}</script>'
if 'type="application/ld+json"' not in text:
    text = replace_once(text, '</head>', jsonld_tag + '\n</head>')

text = text.replace(
    '<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">',
    '<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Open navigation">',
)

text = text.replace(
    'The enquiry is structured for engineering review. Nothing is stored on this website — you choose whether to send it by email or WhatsApp.',
    'Describe the machine, component or production requirement. The form prepares a structured draft for engineering review; you can review it before your email app or WhatsApp sends anything.',
)

trust = '<div class="enquiry-trust" aria-label="Enquiry privacy and process"><div><span>NO ACCOUNT</span><strong>Start directly from the requirement</strong></div><div><span>YOU REVIEW FIRST</span><strong>No enquiry is sent automatically</strong></div><div><span>DIRECT TO VSK</span><strong>Email or WhatsApp from your device</strong></div></div>'
if 'class="enquiry-trust"' not in text:
    text = text.replace('<form class="enquiry-form"', trust + '<form class="enquiry-form"', 1)

text = text.replace(
    '<form class="enquiry-form" data-enquiry-form novalidate>',
    '<form class="enquiry-form" data-enquiry-form novalidate aria-label="Engineering enquiry">',
)

text = text.replace(
    '<input name="phone" type="tel" inputmode="numeric" autocomplete="tel" pattern="[0-9]{10}" maxlength="10" required /><small class="field-help">10-digit Indian mobile number</small>',
    '<input name="phone" type="tel" inputmode="numeric" autocomplete="tel" pattern="[0-9]{10}" maxlength="10" aria-describedby="phone-help phone-error" required /><small class="field-help" id="phone-help">10-digit Indian mobile number</small><small class="field-error" id="phone-error" data-phone-error></small>',
)

technical = '<div class="field-row technical-context"><label><span>Machine / component <em class="field-optional">optional</em></span><input name="machine" type="text" autocomplete="off" placeholder="e.g. grinding machine, seal, fixture" /></label><label><span>Controller / system <em class="field-optional">optional</em></span><input name="controller" type="text" autocomplete="off" placeholder="e.g. Fanuc, Siemens, PLC, servo" /></label></div><label><span>Plant / city <em class="field-optional">optional</em></span><input name="location" type="text" autocomplete="address-level2" placeholder="Where the machine or requirement is located" /></label>'
marker = '</select></label><label><span>Describe the application *'
if 'name="machine"' not in text:
    text = text.replace(marker, '</select></label>' + technical + '<label><span>Describe the application *', 1)

assurance = '<div class="contact-assurance"><span><strong>Urgent machine-service requirement?</strong> Call <a href="tel:+919880336714">+91 98803 36714</a>.</span><span>The website does not upload or store your form details.</span></div>'
if 'class="contact-assurance"' not in text:
    text = text.replace('</form><div class="contact-direct">', '</form>' + assurance + '<div class="contact-direct">', 1)

mobile_dock = '<nav class="mobile-contact-dock" aria-label="Quick contact"><a class="dock-secondary" href="tel:+919880336714"><span>Call</span><strong>VSK</strong></a><a class="dock-secondary" href="https://wa.me/919880336714?text=Hello%20VSK%2C%20I%20have%20an%20engineering%20requirement." target="_blank" rel="noopener noreferrer"><span>WhatsApp</span><strong>Message</strong></a><a class="dock-primary" href="#contact"><span>Engineering</span><strong>Enquire</strong></a></nav>'
if 'class="mobile-contact-dock"' not in text:
    text = text.replace('</main>\n\n  <footer', '</main>\n\n  ' + mobile_dock + '\n\n  <footer', 1)

if 'src="ux-v2.js"' not in text:
    text = text.replace('  <script src="motion.js" defer></script>', '  <script src="motion.js" defer></script>\n  <script src="ux-v2.js" defer></script>', 1)

INDEX.write_text(text, encoding="utf-8")

# Permit only the exact inline JSON-LD data block. All executable JavaScript
# remains restricted to same-origin external files.
digest = base64.b64encode(hashlib.sha256(jsonld.encode("utf-8")).digest()).decode("ascii")
hash_token = f"'sha256-{digest}'"
headers = HEADERS.read_text(encoding="utf-8")
if hash_token not in headers:
    headers = headers.replace("script-src 'self';", f"script-src 'self' {hash_token};", 1)
HEADERS.write_text(headers, encoding="utf-8")
