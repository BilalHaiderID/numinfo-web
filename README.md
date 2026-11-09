# numinfo-web – Phone Number Lookup Tool

A modern and responsive phone number lookup web application featuring a professional dark-themed interface.

## Features

- Mobile number lookup
- Number range searching
- Real-time search progress
- Pakistani mobile operator detection
- Operator and gender fields in the API response
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
├── script.js
└── api/
    └── index.js
```

## Deployment

The frontend can be hosted on GitHub Pages, but GitHub Pages cannot execute
the included `/api/index.js` serverless function. Deploy the repository to
Vercel (or another serverless host), then set `API_ORIGIN` in `script.js` to
that deployment's origin when keeping the frontend on GitHub Pages. The
simplest setup is deploying the complete repository to Vercel.

## Usage

1. Open the website.
2. Enter a mobile number or supported range.
3. Click Search.
4. View the returned information and API response.

### JSON API

```text
GET https://YOUR-API-DOMAIN.example/api/?number=03408870790
```

The endpoint returns only `number`, `name`, `operator`, and `gender`. It does
not return upstream address or CNIC fields. `/api?number=...` remains
compatible as an alternate URL on the serverless host.

## Disclaimer

This project is intended for authorized testing and educational purposes. Use only synthetic or otherwise authorized data. Do not use it to access or disclose private subscriber information.

## License

MIT License (add a LICENSE file if you intend to distribute this project under MIT terms).
