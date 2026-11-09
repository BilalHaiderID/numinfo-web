# numinfo-web – Phone Number Lookup Tool

A modern and responsive phone number lookup web application featuring a professional dark-themed interface.

## Features

- Mobile number lookup
- Number range searching
- Real-time search progress
- Pakistani mobile operator detection
- CNIC-based gender field (odd final digit = Male, even final digit = Female)
- Formatted information cards
- Raw JSON API response
- Responsive dark UI
- Copy API response

## Technologies

- HTML5
- CSS3
- JavaScript
- Fetch API
- GitHub Pages

## Project Structure

```text
NumInfo/
├── index.html
├── style.css
└── script.js
```

## Deployment

Hosted using GitHub Pages.

## Usage

1. Open the website.
2. Enter a mobile number or supported range.
3. Click Search.
4. View the returned information and API response.

When a valid 13-digit CNIC is returned, the result card derives gender from
the final CNIC digit using Pakistan's standard parity convention. This is
provided for authorized testing and should not be treated as a substitute for
verified identity information.

## Disclaimer

This project is intended for authorized testing and educational purposes. Use only synthetic or otherwise authorized data. Do not use it to access or disclose private subscriber information.

## License

MIT License (add a LICENSE file if you intend to distribute this project under MIT terms).
