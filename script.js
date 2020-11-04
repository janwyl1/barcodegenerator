/* When page has loaded */
$( document ).ready(function() {

    /* See JsBarcode library - https://lindell.me/JsBarcode/ */
    /* Generates a barcode based on val, assigns it to svg with corresponding barcodeID */
    function generateBarcode(barcodeID, val) {
        JsBarcode("#barcode" + barcodeID, val, {
        format: "CODE39",
        lineColor: "#000",
        width: 1.5, 
        height: 40,
        displayValue: true
        });
    }

    /* Clear all input fields */
    function clearAllInputs() {
      $('.barcode-inpt').each(function(){
        if ($(this).val() !== "") {
          $(this).val("");
        }
      })
    }
    
    /* Clear all Barcode SVG's */
    function clearAllSvgs() {
      $('.barcode').each(function(){
          $(this).empty();
      })
    }

    /* Generate date and time string */
    function getDateTime(){
      var currentDate = "Generated: " + new Date().toLocaleString('en-GB')
      return currentDate;
    }

    /* Print generated date and time */
    function generatePrintDate(){
      var datetime = getDateTime();
      console.log(datetime);
      $('.print-date').text(datetime)
    }

    /* Remove special characters from string (CODE39 barcode format can support some special characters, but Telepath can't) */
    function removeSpecialChars(str) {
      return str.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    }


    
    /* ATTACH EVENT LISTENERS */
    /* Generate barcode when input field is changed. Remove special characters */
    $('.barcode-inpt').change(function(e){
      e.preventDefault();
      var inptVal = $(this).val();
      if (inptVal !== "") {
            var cleanVal = removeSpecialChars(inptVal);
            generateBarcode($(this)[0].id.slice(-1), cleanVal); 
            generatePrintDate();
      }   
    });

    /* Clear input and svg's when clear is clicked */
    $('#btn-clear').click(function(e){
        e.preventDefault();
        clearAllInputs();
        clearAllSvgs();
    });

    /* Trigger print dialogue when print is clicked */
    $('#btn-print').click(function(e){
        window.print() 
    });
    
    /* HANDLE FORM VALIDATION */

    /* Validate a postcode */
    $.validator.addMethod("ukPostcode", function(value, element) {
      // GOV.UK Postcode Regex 
      // Source: https://stackoverflow.com/questions/164979/regex-for-matching-uk-postcodes 
      // Source2: https://www.gov.uk/government/publications/bulk-data-transfer-for-sponsors-xml-schema
      return this.optional( element ) || /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z])))) [0-9][A-Za-z]{2})$/.test( value );
    }, 'Please enter a valid postcode.');

    $.validator.addMethod("ukPhoneNum", function(value, element) {
      // Source: https://stackoverflow.com/questions/11518035/regular-expression-for-gb-based-and-only-numeric-phone-number
      return this.optional( element ) || /^(((\+44\s?\d{4}|\(?0\d{4}\)?)\s?\d{3}\s?\d{3})|((\+44\s?\d{3}|\(?0\d{3}\)?)\s?\d{3}\s?\d{4})|((\+44\s?\d{2}|\(?0\d{2}\)?)\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$/.test( value );
    }, 'Please enter a valid phone number.');

    
    /* Validate an NHS Number */
    $.validator.addMethod("mod11", function(value, element) {
      // Source: https://github.com/spikeheap/nhs-number-validator
      // Generate valid NHS numbers: http://danielbayley.uk/nhs-number/
      function multiplyByPosition(digit, index) {
        // multiple each digit by 11  minus its position (indexed from 1)
        return digit * (11 - (index+1));
      }
      function addTogether(previousValue, currentValue){
        return previousValue + currentValue;
      }
      function validate(nhsNumber){
        // pre-flight checks
        if(
          nhsNumber === undefined ||
          nhsNumber === null ||
          isNaN(Number(nhsNumber)) ||
          nhsNumber.toString().length !== 10
        ){
          return false;
        }
        // convert numbers to strings, for internal consistency
        if(Number.isInteger(nhsNumber)){
          nhsNumber = nhsNumber.toString();
        }
        // Step 1: Multiply each of the first 9 numbers by (11 - position indexed from 1)
        // Step 2: Add the results together
        // Step 3: Divide the total by 11 to get the remainder
        var nhsNumberAsArray = nhsNumber.split('');
        var remainder = nhsNumberAsArray.slice(0,9)
                                  .map(multiplyByPosition)
                                  .reduce(addTogether, 0) % 11;
        var checkDigit = 11 - remainder;
        // replace 11 for 0
        if(checkDigit === 11){
          checkDigit = 0;
        }
        var providedCheckDigit = nhsNumberAsArray[9];
        // Do the check digits match?
        return checkDigit === Number(providedCheckDigit);
      }
      // Return result to $.validator
      return this.optional( element ) || validate(value);
    }, 'Please enter a valid NHS number.');

    /* Initialize Validator */
    $("#barcode-form").validate({
      rules: {
          nhsNum: {
              mod11: true
          },
          postcode: {
            ukPostcode: true
          },
          phoneNum: {
            ukPhoneNum: true
          }
      },
      // messages: {
      //   nhsNum: "NHS Number may be invalid",
      //   firstName: "Must be a valid first name"
      // },
      highlight: function(element) {
        jQuery(element).closest('.form-control').addClass('is-invalid');
      },
      unhighlight: function(element) {
          jQuery(element).closest('.form-control').removeClass('is-invalid');
      },
      errorElement: 'span',
      errorClass: 'invalid-feedback',
      errorPlacement: function(error, element) {
          if(element.parent('.input-group').length) {
              error.insertAfter(element.parent());
          } else {
              error.insertAfter(element);
          }
      }
  });
});