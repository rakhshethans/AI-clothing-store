# Beta readiness and privacy behaviour

Implemented: no account, analytics provider, ad pixel, payments, image upload endpoint, AI service
or marketing collection. Local saved IDs and feedback can be cleared through Privacy. Photos are
temporary object URLs, removed on explicit removal/refresh/page close. Original upload file metadata
is not sent to a server. The application does not claim to strip EXIF or persist an anonymised image.
Server does not deliberately log requests or write usage data; hosting infrastructure may differ.

Prototype is ready for local usability demonstrations, not production compliance certification.
Before a real public beta:
- Identify operator/contact and write a notice for the actual processing, purposes and lawful bases.
- Review ICO fee assessment; reserve current required fee if payable.
- Inventory storage/access technologies, affiliate consent requirements and provider agreements.
- Verify image licences, processors, transfers, retention/deletion and rights handling.
- Make advertising/affiliate relationships clear before interaction; avoid misleading price/stock claims.
- Assess Online Safety Act scope for actual cross-site search and any future creator publishing,
  including children's access. An adult-targeting label alone does not settle this.
- Provide reporting/takedowns and moderation before enabling public UGC. No DMs/comments initially.
- Run actual production access-control tests before accounts, private jobs or stored uploads.

Official references to recheck at launch:
https://ico.org.uk/for-organisations/advice-for-small-organisations/
https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/
https://www.ofcom.org.uk/online-safety/illegal-and-harmful-content/guide-for-services
https://www.asa.org.uk/advice-online/affiliate-marketing.html
https://www.gov.uk/government/publications/price-transparency-cma209

Application-level upload validation: JPEG/PNG/WebP only, <=5 MB, valid decoded image, <=20 million
pixels. This is local reference display, not a production upload pipeline or malware scanner.
