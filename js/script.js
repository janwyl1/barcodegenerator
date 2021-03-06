$( document ).ready(function() {

    /* See JsBarcode library - https://lindell.me/JsBarcode/ */
    /* Generates a barcode based on val, assigns it to <svg> with corresponding barcodeID */
    function generateBarcode(barcodeID, val) {
        JsBarcode("#barcode" + barcodeID, val, {
        format: "CODE39",
        lineColor: "#000",
        width: 1.5, 
        height: 40,
        displayValue: true
        });
    }

    function clearAllInputs() {
      $('.barcode-inpt').each(function(){
        if ($(this).val() !== "") {
          $(this).val("");
        }
      })
    }

    function clearAllSvgs() {
      $('.barcode').each(function(){
          $(this).empty();
      })
    }

    function clearValidationMsgs() {
      $('.form-control').removeClass('is-invalid');
      $('.form-control').removeClass('is-valid');
    }


    function getDateTime(){
      var currentDate = "Generated: " + new Date().toLocaleString('en-GB')
      return currentDate;
    }

    function generatePrintDate(){
      var datetime = getDateTime();
      $('.print-date').text(datetime)
    }

    function clearPrintDate() {
      $('.print-date').empty(); 
    }
    
    /* Remove special chars from string (CODE39 barcode format can support some special characters, but Telepath can't) */
    function removeSpecialChars(str) {
      return str.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    }

    function removeSpaces(str) {
      return str.replace(/ /gi, '')
    }

    
    /* ATTACH EVENT LISTENERS */
    $('.barcode-inpt').keyup(function(e){
      e.preventDefault();
      
      var el = $(this)[0];
      if (el.name === "nhsNum" || el.name === "phoneNum" || el.name === "dob") { 
        $(this).val(removeSpaces($(this).val()));
      }

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
        clearValidationMsgs();
        clearPrintDate();
    });

    /* Trigger print dialogue when print is clicked */
    $('#btn-print').click(function(e){
        e.preventDefault();
        window.print() 
    });
    
    /* HANDLE FORM VALIDATION */

    /* Validate a postcode using  GOV.UK Postcode Regex - it's not perfect but should be fine for our use case
      Source: https://stackoverflow.com/questions/164979/regex-for-matching-uk-postcodes (I added ? after the spaces as per ctwheels answer to make spaces optional)
      Source2: https://www.gov.uk/government/publications/bulk-data-transfer-for-sponsors-xml-schema
    */
    $.validator.addMethod("ukPostcode", function(value, element) {
      return this.optional( element ) || /^([Gg][Ii][Rr] ?0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z])))) ?[0-9][A-Za-z]{2})$/.test( value );
    }, 'Please enter a valid postcode.');

    /* Validate a phone number 
      Source: https://stackoverflow.com/questions/11518035/regular-expression-for-gb-based-and-only-numeric-phone-number
    */
    $.validator.addMethod("ukPhoneNum", function(value, element) {
      return this.optional( element ) || /^(((\+44\s?\d{4}|\(?0\d{4}\)?)\s?\d{3}\s?\d{3})|((\+44\s?\d{3}|\(?0\d{3}\)?)\s?\d{3}\s?\d{4})|((\+44\s?\d{2}|\(?0\d{2}\)?)\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$/.test( value );
    }, 'Please enter a valid phone number.');

    /* Validate a date of birth
      Source: https://stackoverflow.com/questions/24380305/validate-date-in-dd-mm-yyyy-format-using-jquery-validate
    */
    $.validator.addMethod("dateOfBirth", function(value, element) {
      return this.optional( element ) || /^(?=\d)(?:(?:31(?!.(?:0?[2469]|11))|(?:30|29)(?!.0?2)|29(?=.0?2.(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00)))(?:\x20|$))|(?:2[0-8]|1\d|0?[1-9]))([-.\/])(?:1[012]|0?[1-9])\1(?:1[6-9]|[2-9]\d)?\d\d(?:(?=\x20\d)\x20|$))?(((0?[1-9]|1[012])(:[0-5]\d){0,2}(\x20[AP]M))|([01]\d|2[0-3])(:[0-5]\d){1,2})?$/.test( value );
    }, 'Please enter a valid date of birth.');
      
    /* Validate a name */
    $.validator.addMethod("ptString", function(value, element) {
      function minMaxCharLength(str) {
        if (str.length > 0){
          return true;
        }
        return false;
      }

      var strNoSpecialChars = removeSpecialChars(value);
      var cleanStr = removeSpaces(strNoSpecialChars);
      return this.optional( element ) || minMaxCharLength(cleanStr);
    }, 'Please enter a name.');

    /* Validate an NHS Number 
      Source: https://github.com/spikeheap/nhs-number-validator
      Generate valid NHS numbers: http://danielbayley.uk/nhs-number/
    */
    $.validator.addMethod("mod11", function(value, element) {
      function multiplyByPosition(digit, index) {
        return digit * (11 - (index+1));
      }
      function addTogether(previousValue, currentValue){
        return previousValue + currentValue;
      }
      function validate(nhsNumber){
        if(
          nhsNumber === undefined ||
          nhsNumber === null ||
          isNaN(Number(nhsNumber)) ||
          nhsNumber.toString().length !== 10
        ){
          return false;
        }
        if(Number.isInteger(nhsNumber)){
          nhsNumber = nhsNumber.toString();
        }
        var nhsNumberAsArray = nhsNumber.split('');
        var remainder = nhsNumberAsArray.slice(0,9)
                                  .map(multiplyByPosition)
                                  .reduce(addTogether, 0) % 11;
        var checkDigit = 11 - remainder;
        if(checkDigit === 11){
          checkDigit = 0;
        }
        var providedCheckDigit = nhsNumberAsArray[9];
        return checkDigit === Number(providedCheckDigit);
      }
      return this.optional( element ) || validate(value); // Return result to $.validator
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
          },
          dob: {
            dateOfBirth: true
          },
          firstName: {
            ptString: true
          },
          surname: {
            ptString: true
          },
          address1: {
            ptString: true
          }
      },
      messages: {
        nhsNum: "Warning: Invalid NHS Number (Mod11 check failed)",
        postcode: "Warning: Invalid Postcode (Not valid UK postcode)",
        phoneNum: "Warning: Invalid Phone Number (Not valid UK phone number)",
        dob: "Warning: Invalid Date",
        firstName: "Warning: Invalid first name",
        surname: "Warning: Invalid surname",
        address1: "Warning: Invalid address"
      },
      highlight: function(element) {
        jQuery(element).closest('.form-control').addClass('is-invalid');
        jQuery(element).closest('.form-control').removeClass('is-valid');
      },
      unhighlight: function(element) {
          jQuery(element).closest('.form-control').removeClass('is-invalid');
          jQuery(element).closest('.form-control').addClass('is-valid');
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