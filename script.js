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
    })

    /* Clear input and svg's when clear is clicked */
    $('#btn-clear').click(function(e){
        e.preventDefault();
        clearAllInputs();
        clearAllSvgs();
    })

    /* Trigger print dialogue when print is clicked */
    $('#btn-print').click(function(e){
        window.print() 
    })


    

    // /* Initialize Validator */
    $("#barcode-form").validate({
      rules: {
          nhsNum: {
              minlength: 10
          }
      },
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