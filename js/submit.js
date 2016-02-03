// TODO: IF selecting the blank dropdown reset the textarea
$(function() {

  var redirUrl = "";

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

  $("#wp-additional-query-string").on("input", function() {
    // Combine link and string here
    value = redirUrl + this.value;
    update_redirect_url(value);
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
        xml = process_xml(result)
        set_redir_url(xml);
        supply_xml_response(result);
        supply_wp_response(xml);
      },
      error: function(xhr, ajaxOptions, thrownError) {
        alert("Error " + xhr.status + " : " + thrownError);
      },
      complete: function() {
        $("#xml-response-div .response").isLoading("hide");
      }
    });
  }

  // Fetch the value in the additional query string field
  function get_append_string() {
    return $("#wp-additional-query-string").val();
  }

  // Returns an XML document
  function process_xml(obj) {
    xml = $.parseXML(obj);
    return $(xml);
  }

  // Supplies the wp response link in the view, needs the valid xml doc
  function supply_wp_response(xml) {
    link = $("#wp-response-link");
    link.attr("href", xml.find("reference").text().concat(get_append_string()));
    link.text(xml.find("reference").text().concat(get_append_string()));
  }

  // Supplies the xml response in the view, needs the valid xml doc
  function supply_xml_response(result) {
    $("#xml-response").text(result);
  }

  // Update the redirection url on update
  function update_redirect_url(query_str) {
    $("#wp-response-link").html(query_str);
    $("#wp-response-link").attr("href", query_str);
  }

  // Manually updates the global var redirUrl
  function set_redir_url(xml) {
    redirUrl = xml.find("reference").text();
  }
});
