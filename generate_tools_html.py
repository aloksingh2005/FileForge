"""
Generate complete index.html tool listings for FileForge
This script generates the HTML for all tool cards organized by category
"""

# Complete tool data with proper categorization
tools_data = {
    "file-processing": {
        "title": "📁 File Processing",
        "description": "Convert, compress, merge PDFs and images - all in your browser",
        "tools": [
            # Existing ready tools
            ("tools/pdf/merge.html", "📑", "PDF Merge", "Combine multiple PDF files into one document", "Ready"),
            ("tools/pdf/compress.html", "🗜️", "PDF Compress", "Reduce PDF file size without losing quality", "Ready"),
            ("tools/image/compressor.html", "📦", "Image Compressor", "Reduce image file sizes while maintaining quality", "Ready"),
            ("tools/image/converter.html", "🔄", "Image Converter", "Convert between PNG, JPEG, WEBP, BMP formats", "Ready"),
            ("tools/converters/image-to-pdf.html", "🖼️", "Image to PDF", "Convert multiple images into a single PDF document", "Ready"),
            ("tools/image/background-remover.html", "🎭", "Background Remover", "Remove backgrounds from images automatically", "Ready"),
            # Now marking as Ready (previously Coming Soon)
            ("tools/pdf/pdf-to-image.html", "🖼️", "PDF to Images", "Extract pages from PDF as PNG/JPG images", "Ready"),
            ("tools/pdf/split-pdf.html", "✂️", "PDF Split", "Split PDF into multiple files or extract pages", "Ready"),
            ("tools/pdf/rotate-pdf.html", "🔄", "PDF Rotate", "Rotate pages in PDF documents (90°, 180°, 270°)", "Ready"),
            # Additional PDF tools
            ("tools/pdf/add-page-numbers.html", "🔢", "Add Page Numbers", "Add page numbers to PDF documents", "Ready"),
            ("tools/pdf/add-text.html", "📝", "Add Text to PDF", "Add custom text to PDF pages", "Ready"),
            ("tools/pdf/add-image.html", "🖼️", "Add Image to PDF", "Add images to PDF documents", "Ready"),
            ("tools/pdf/remove-pages.html", "🗑️", "Remove PDF Pages", "Remove specific pages from PDF", "Ready"),
            ("tools/pdf/reorder-pages.html", "🔀", "Reorder PDF Pages", "Reorder pages in PDF documents", "Ready"),
        ]
    },
    "generators": {
        "title": "🔧 Generator Tools",
        "description": "Generate QR codes, passwords, fake data, and more",
        "tools": [
            ("tools/generators/qr-code.html", "📱", "QR Code Generator", "Create QR codes from text, URLs, or contact info", "Ready"),
            ("tools/generators/password.html", "🔑", "Password Generator", "Generate secure random passwords with custom options", "Ready"),
            ("tools/generators/uuid.html", "🆔", "UUID Generator", "Generate unique identifiers (UUIDs v4)", "Ready"),
            ("tools/generators/lorem.html", "📝", "Lorem Ipsum", "Generate placeholder text for designs and mockups", "Ready"),
            ("tools/generators/hash.html", "🔐", "Hash Generator", "Generate MD5, SHA-1, SHA-256, SHA-512 hashes", "Ready"),
            ("tools/generators/barcode.html", "📊", "Barcode Generator", "Generate barcodes in various formats", "Ready"),
            ("tools/generators/otp.html", "🔑", "OTP Generator", "Generate one-time passwords", "Ready"),
            ("tools/generators/fake-name.html", "👤", "Fake Name Generator", "Generate realistic fake names", "Ready"),
            ("tools/generators/fake-email.html", "📧", "Fake Email Generator", "Generate fake email addresses", "Ready"),
            ("tools/generators/fake-address.html", "🏠", "Fake Address Generator", "Generate fake addresses", "Ready"),
            ("tools/generators/phone-number.html", "📱", "Phone Number Generator", "Generate phone numbers for testing", "Ready"),
            ("tools/generators/username.html", "👤", "Username Generator", "Generate creative usernames", "Ready"),
            ("tools/generators/credit-card.html", "💳", "Credit Card Generator", "Generate test credit card numbers (for testing only)", "Ready"),
            ("tools/generators/json-dummy-data.html", "📋", "JSON Dummy Data", "Generate dummy JSON data", "Ready"),
            ("tools/generators/html-boilerplate.html", "📄", "HTML Boilerplate", "Generate HTML template code", "Ready"),
            ("tools/generators/meta-tags.html", "🏷️", "Meta Tags Generator", "Generate SEO meta tags", "Ready"),
            ("tools/generators/open-graph.html", "🔖", "Open Graph Generator", "Generate Open Graph meta tags", "Ready"),
            ("tools/generators/twitter-card.html", "🐦", "Twitter Card Generator", "Generate Twitter card meta tags", "Ready"),
            ("tools/generators/robots-txt.html", "🤖", "Robots.txt Generator", "Generate robots.txt file", "Ready"),
            ("tools/generators/sitemap.html", "🗺️", "Sitemap Generator", "Generate XML sitemap", "Ready"),
            ("tools/generators/favicon.html", "🎨", "Favicon Generator", "Create favicons from images", "Ready"),
            ("tools/generators/css-gradient.html", "🌈", "CSS Gradient Generator", "Generate CSS gradients with live preview", "Ready"),
            ("tools/generators/color-palette.html", "🎨", "Color Palette Generator", "Generate beautiful color palettes", "Ready"),
            ("tools/generators/css-box-shadow.html", "💎", "CSS Box Shadow", "Generate CSS box shadow effects", "Ready"),
            ("tools/generators/css-border-radius.html", "📐", "CSS Border Radius", "Generate CSS border radius", "Ready"),
            ("tools/generators/css-button.html", "🔘", "CSS Button Generator", "Generate CSS button styles", "Ready"),
            ("tools/generators/tailwind-class.html", "💨", "Tailwind Class Generator", "Generate Tailwind CSS classes", "Ready"),
            ("tools/generators/gradient.html", "🌈", "Gradient Generator", "Generate beautiful gradients", "Ready"),
        ]
    },
    "calculators": {
        "title": "🔢 Calculators",
        "description": "Quick and handy calculators for everyday use",
        "tools": [
            ("tools/calculators/simple.html", "🔢", "Simple Calculator", "Basic arithmetic calculator", "Ready"),
            ("tools/calculators/scientific.html", "🔬", "Scientific Calculator", "Advanced scientific calculations", "Ready"),
            ("tools/calculators/tip.html", "💵", "Tip Calculator", "Calculate tips and split bills easily", "Ready"),
            ("tools/calculators/discount.html", "🏷️", "Discount Calculator", "Calculate discounts and final prices", "Ready"),
            ("tools/calculators/percentage.html", "📊", "Percentage Calculator", "Calculate percentages, increases, and decreases", "Ready"),
            ("tools/calculators/bmi.html", "⚖️", "BMI Calculator", "Calculate Body Mass Index", "Ready"),
            ("tools/calculators/bmr.html", "🔥", "BMR Calculator", "Calculate Basal Metabolic Rate", "Ready"),
            ("tools/calculators/calorie.html", "🍎", "Calorie Calculator", "Calculate daily calorie needs", "Ready"),
            ("tools/calculators/age.html", "🎂", "Age Calculator", "Calculate age from date of birth", "Ready"),
            ("tools/calculators/date-difference.html", "📅", "Date Difference", "Calculate difference between dates", "Ready"),
            ("tools/calculators/time.html", "⏰", "Time Calculator", "Add and subtract time durations", "Ready"),
            ("tools/calculators/loan.html", "💳", "Loan Calculator", "Calculate loan payments and interest", "Ready"),
            ("tools/calculators/emi.html", "🏦", "EMI Calculator", "Calculate EMI for loans", "Ready"),
            ("tools/calculators/sip.html", "📈", "SIP Calculator", "Calculate SIP investment returns", "Ready"),
            ("tools/calculators/compound-interest.html", "💰", "Compound Interest", "Calculate compound interest", "Ready"),
            ("tools/calculators/gst.html", "💸", "GST Calculator", "Calculate GST inclusive/exclusive amounts", "Ready"),
            ("tools/calculators/currency.html", "💱", "Currency Converter", "Convert between currencies", "Ready"),
            ("tools/calculators/speed-distance-time.html", "🏃", "Speed/Distance/Time", "Calculate speed, distance, or time", "Ready"),
            ("tools/calculators/unit-cost.html", "💰", "Unit Cost Calculator", "Compare unit costs", "Ready"),
        ]
    },
    "converters": {
        "title": "🔄 Converters",
        "description": "Convert between different formats and encodings",
        "tools": [
            ("tools/converters/base64.html", "🔤", "Base64 Encoder/Decoder", "Encode and decode Base64 strings", "Ready"),
            ("tools/converters/case.html", "🔡", "Case Converter", "Convert text between different cases", "Ready"),
            ("tools/converters/color.html", "🎨", "Color Converter", "Convert between HEX, RGB, HSL color formats", "Ready"),
            ("tools/converters/url.html", "🔗", "URL Encoder/Decoder", "Encode and decode URL strings", "Ready"),
            ("tools/converters/binary-decimal.html", "🔢", "Binary/Decimal Converter", "Convert between binary and decimal", "Ready"),
            ("tools/converters/hex-rgb.html", "🎨", "Hex to RGB Converter", "Convert hex colors to RGB", "Ready"),
            ("tools/converters/hex-ascii.html", "🔤", "Hex/ASCII Converter", "Convert between hex and ASCII", "Ready"),
            ("tools/converters/text-binary.html", "🔢", "Text/Binary Converter", "Convert text to binary and back", "Ready"),
            ("tools/converters/roman-numeral.html", "🏛️", "Roman Numeral Converter", "Convert numbers to/from Roman numerals", "Ready"),
            ("tools/converters/temperature.html", "🌡️", "Temperature Converter", "Convert Celsius, Fahrenheit, Kelvin", "Ready"),
            ("tools/converters/unit-converter.html", "📏", "Unit Converter", "Convert various units of measurement", "Ready"),
            ("tools/converters/file-size.html", "📏", "File Size Converter", "Convert between file size units", "Ready"),
            ("tools/converters/json-to-csv.html", "📊", "JSON to CSV", "Convert JSON data to CSV format", "Ready"),
            ("tools/converters/csv-to-json.html", "📋", "CSV to JSON", "Convert CSV data to JSON format", "Ready"),
            ("tools/converters/json-formatter.html", "📦", "JSON Minifier/Formatter", "Minify or beautify JSON", "Ready"),
            ("tools/converters/html-to-text.html", "📄", "HTML to Text", "Extract plain text from HTML", "Ready"),
            ("tools/converters/text-to-html.html", "📝", "Text to HTML", "Convert plain text to HTML", "Ready"),
            ("tools/converters/markdown-html.html", "📝", "Markdown to HTML", "Convert Markdown to HTML", "Ready"),
            ("tools/converters/yaml-json.html", "📋", "YAML/JSON Converter", "Convert between YAML and JSON", "Ready"),
            ("tools/converters/xml-json.html", "📋", "XML/JSON Converter", "Convert XML to JSON", "Ready"),
            ("tools/converters/jpg-png.html", "🖼️", "JPG/PNG Converter", "Convert between JPG and PNG", "Ready"),
            ("tools/converters/webp-converter.html", "⚡", "WebP Converter", "Convert images to/from WebP", "Ready"),
        ]
    },
    "design": {
        "title": "🎨 Design Tools",
        "description": "Image editing, color tools, and design utilities",
        "tools": [
            ("tools/image/image-resizer.html", "📐", "Image Resizer", "Resize images to custom dimensions", "Ready"),
            ("tools/image/image-cropper.html", "✂️", "Image Cropper", "Crop images to desired size", "Ready"),
            ("tools/image/image-rotator.html", "🔄", "Image Rotator", "Rotate images by any angle", "Ready"),
            ("tools/image/grayscale.html", "⚫", "Grayscale Converter", "Convert images to grayscale", "Ready"),
            ("tools/image/blur-image.html", "💫", "Blur Image", "Apply blur effect to images", "Ready"),
            ("tools/image/brightness-contrast.html", "🌟", "Brightness/Contrast", "Adjust image brightness and contrast", "Ready"),
            ("tools/image/meme-generator.html", "😂", "Meme Generator", "Create memes with top/bottom text", "Ready"),
            ("tools/image/image-to-base64.html", "📋", "Image to Base64", "Convert images to Base64 string", "Ready"),
            ("tools/image/base64-to-image.html", "🖼️", "Base64 to Image", "Convert Base64 string to image", "Ready"),
            ("tools/dev/color-picker.html", "🎨", "Color Picker", "Pick and preview colors", "Ready"),
            ("tools/dev/browser-info.html", "🌐", "Browser Info", "View detailed browser information", "Ready"),
        ]
    },
    "text": {
        "title": "📝 Text Tools",
        "description": "Text manipulation, counting, and formatting tools",
        "tools": [
            ("tools/text/word-counter.html", "📊", "Word Counter", "Count words, characters, sentences", "Ready"),
            ("tools/text/char-counter.html", "🔢", "Character Counter", "Count characters, words, and lines", "Ready"),
            ("tools/text/sentence-counter.html", "📝", "Sentence Counter", "Count sentences in text", "Ready"),
            ("tools/text/paragraph-counter.html", "📄", "Paragraph Counter", "Count paragraphs in text", "Ready"),
            ("tools/text/text-compare.html", "🔄", "Text Compare", "Compare two texts line by line", "Ready"),
            ("tools/text/find-replace.html", "🔎", "Find & Replace", "Find and replace text", "Ready"),
            ("tools/text/text-sorter.html", "🔤", "Text Sorter", "Sort lines of text alphabetically", "Ready"),
            ("tools/text/text-reverser.html", "🔄", "Text Reverser", "Reverse text or lines", "Ready"),
            ("tools/text/remove-duplicates.html", "🗑️", "Remove Duplicate Lines", "Remove duplicate lines from text", "Ready"),
            ("tools/text/duplicate-finder.html", "🔍", "Duplicate Line Finder", "Find duplicate lines", "Ready"),
            ("tools/text/remove-spaces.html", "␣", "Remove Extra Spaces", "Remove extra whitespace", "Ready"),
            ("tools/text/line-break-remover.html", "📝", "Line Break Remover", "Remove line breaks from text", "Ready"),
            ("tools/text/slug-generator.html", "🔗", "Slug Generator", "Generate URL-friendly slugs", "Ready"),
            ("tools/text/html-formatter.html", "💻", "HTML Formatter", "Format and beautify HTML code", "Ready"),
            ("tools/text/html-minifier.html", "📦", "HTML Minifier", "Minify HTML code", "Ready"),
            ("tools/text/json-viewer.html", "👁️", "JSON Viewer", "View JSON with syntax highlighting", "Ready"),
            ("tools/text/regex-tester.html", "🔧", "Regex Tester", "Test regular expressions", "Ready"),
            ("tools/text/markdown-preview.html", "📖", "Markdown Preview", "Preview Markdown in real-time", "Ready"),
            ("tools/text/keyword-density.html", "📊", "Keyword Density Checker", "Analyze keyword frequency", "Ready"),
            ("tools/text/readability-checker.html", "📖", "Readability Checker", "Check text readability score", "Ready"),
            ("tools/text/toc-generator.html", "📑", "TOC Generator", "Generate table of contents from headings", "Ready"),
        ]
    },
    "dev": {
        "title": "👨‍💻 Developer Tools",
        "description": "Tools for developers - JWT, timestamps, IP lookup, and more",
        "tools": [
            ("tools/dev/jwt-decoder.html", "🔐", "JWT Decoder", "Decode and inspect JWT tokens", "Ready"),
            ("tools/dev/timestamp.html", "⏰", "Timestamp Converter", "Convert timestamps and dates", "Ready"),
            ("tools/dev/unix-time.html", "⏰", "Unix Time Converter", "Convert Unix timestamps", "Ready"),
            ("tools/dev/ip-lookup.html", "🌐", "IP Address Lookup", "Get IP address and location info", "Ready"),
            ("tools/dev/screen-resolution.html", "🖥️", "Screen Resolution", "View current screen resolution", "Ready"),
            ("tools/dev/storage-viewer.html", "💾", "LocalStorage Viewer", "View and manage localStorage", "Ready"),
            ("tools/dev/cookie-viewer.html", "🍪", "Cookie Viewer", "View and manage cookies", "Ready"),
        ]
    }
}

# Generate HTML for tool cards
def generate_tool_card(tool):
    href, icon, name, desc, status = tool
    status_class = "tool-status" if status == "Ready" else "tool-status coming-soon"
    return f"""        <a href="{href}" class="tool-card-compact">
          <div class="tool-header">
            <div class="tool-icon">{icon}</div>
            <div class="tool-info">
              <div class="tool-name">{name}</div>
              <div class="tool-desc">{desc}</div>
              <span class="{status_class}">{status}</span>
            </div>
          </div>
        </a>
"""

# Generate complete category section
def generate_category_html(category_key, category_data):
    tools_html = "\n".join([generate_tool_card(tool) for tool in category_data["tools"]])
    
    return f"""    <div class="tab-content" data-category="{category_key}">
      <div class="category-header">
        <h2 class="category-title">{category_data["title"]}</h2>
        <p class="category-description">{category_data["description"]}</p>
      </div>

      <div class="tools-grid">
{tools_html}      </div>
    </div>
"""

# Generate all categories
print("<!-- GENERATED TOOL SECTIONS - DO NOT MANUALLY EDIT -->")
print()

for category_key, category_data in tools_data.items():
    print(generate_category_html(category_key, category_data))
    
# Print statistics
print("\n<!-- STATISTICS:")
for category_key, category_data in tools_data.items():
    print(f"  {category_data['title']}: {len(category_data['tools'])} tools")
total = sum(len(cat["tools"]) for cat in tools_data.values())
print(f"  TOTAL: {total} tools")
print("-->")
