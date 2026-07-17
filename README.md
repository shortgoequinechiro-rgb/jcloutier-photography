# J. Cloutier Photography

The production website for Jessie Cloutier's fine-art Western photography:
[jcloutierphotography.com](https://jcloutierphotography.com/).

## Site architecture

- Static HTML, CSS, and JavaScript with no build step.
- Hosted by GitHub Pages from the `main` branch.
- The custom domain is configured by `CNAME`.
- Web images in this repository are optimized display copies. Full-resolution
  print files must stay outside the public repository.

## Local preview

Run a static server from this directory:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000/`.

## Forms and print orders

The contact form is delivered to `jclophotography@yahoo.com` through
FormSubmit. The first real submission requires a one-time activation click in
Jessie's inbox.

The website currently supports print inquiries. When Jessie's Pixieset store
is public, update the print calls to action to its verified public storefront
URL after checking the products, pricing, payout details, shipping, and the
customer checkout flow.

## Deployment

Changes merged to `main` deploy automatically through GitHub Pages. After a
merge, verify the homepage, galleries, print page, contact page, sitemap, and
custom-domain HTTPS in production.
