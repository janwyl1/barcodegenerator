
# Patient Barcode Generator
Generates 'Code 39' barcodes for easier data entry
 

### The Problem
+ Receiving approx. 1000 requests per day for patients that are outside of our catchment area, and therefore don't appear in any of our systems
+ These patients would need to be registered manually in our legacy Laboratory Information Management System (Telepath) in order to process Pathology requests
+ The registration process requires entering the same pieces of information multiple times
+ Staff can enter the patient details into a web form to generate a barcode. Print it to pdf or paper, and then scan the barcodes to save time and reduce typing errors.

This web form will be used in conjunction with a PSL program (PowerTerm Script Language), allowing users to enter the information into the web form, scan it once at the beginning of the process, and the rest of the process will be completed automatically.

Form validation helps to reduce errors e.g. confirming if the NHS number is correct using the Mod11 check.

It's client-side only, no personal information is stored persistently or transmitted anywhere.
 

### How to use it
1. Download Files
2. Unzip
3. Open 'index.html'


### Demo
[Live demo version](https://janwyl1.github.io/barcodegenerator)
  

### Credits

+  [JsBarcode library by lindell](https://lindell.me/JsBarcode/)
+  [NHS Number Validator](https://github.com/spikeheap/nhs-number-validator)
+  [NHS Number Generator / Validator](http://danielbayley.uk/nhs-number/) (for testing)
+  [jQuery Validate Plugin](https://jqueryvalidation.org)
+  [Bootstrap 4](https://getbootstrap.com/)