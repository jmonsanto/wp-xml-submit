// TODO: IF selecting the blank dropdown reset the textarea
$(function() {

  // LISTENERS
  $("#xml-select").on("change", function() {
    filename = function(val) {
      if (!val) return false;
      return val + ".xml"
    }

    load_xml(filename(this.value));
  });

  $("#xml-submit").on("click", function() {
    xml = $("#xml-area").val();
    username = $("#wp-username").val();
    password = $("#wp-password").val();
    submitUrl = $("#xml-submit-url").val();

    if (xml && username && password && submitUrl) {
      $("#xml-response-div .response").isLoading({
        text: "Sending XML request to server...",
        position: "overlay"
      });
      submit_xml_to_wp(xml, username, password, submitUrl)
    } else {
      alert("Please supply a username, password and choose a submit URL!")
    }
  });

  function load_xml(filename) {
    if (!filename) return false;
    // TODO: Change the value of the xml values before displaying it into textarea
    $.ajax({
      type: "GET",
      url: "xml/" + filename,
      dataType: "text",
      cache: false,
      success: function(result) {
        $("#xml-area").text(result)
      },
      error: function(xhr, ajaxOptions, thrownError) {
        console.log("Error " + xhr.status + " : " + thrownError);
      }
    });
  }

  function submit_xml_to_wp(xml, username, password, url) {
    data = {xml: xml, username: username, password: password, url: url};

    $.ajax({
      type: "POST",
      url: "server.php",
      data: data,
      dataType: "text",
      success: function(result) {
        // TODO: Refactor
        xml = $.parseXML(result);
        xmlDoc = $(xml);
        $("#xml-response").text(result);
        $("#wp-response-link").attr("href", xmlDoc.find("reference")
                                                  .text()
                                                  .concat(get_append_string()));
        $("#wp-response-link").text(xmlDoc.find("reference")
                                          .text()
                                          .concat(get_append_string()));
        $("#xml-response-div .response").isLoading("hide");
      },
      error: function(xhr, ajaxOptions, thrownError) {
        alert("Error " + xhr.status + " : " + thrownError);
      }
    });
  }

  function get_append_string() {
    return $("#wp-additional-query-string").val();
  }
});
