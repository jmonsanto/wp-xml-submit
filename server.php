<?php

// Pre set array just to check the $_POST requests
$arr = ['username', 'password', 'xml', 'url'];

// Check the post array if all required elements are there
foreach ($arr as $xml_key) {
  if (empty($xml_key)) {
    echo $xml_key . " is required!";
    exit;
  }
}

// Make request to Worldpay via CURL NOTE: Study CURL requests in detail
$ch = curl_init($_POST['url']);
      curl_setopt($ch, CURLOPT_POST, 1);
      curl_setopt($ch, CURLOPT_POSTFIELDS, $_POST['xml']);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
      curl_setopt($ch, CURLOPT_NOPROGRESS, 0);
      curl_setopt($ch, CURLOPT_USERPWD, $_POST['username'] . ":" . $_POST['password']);

$response = curl_exec($ch);

// Check here if response went through -- if not, show message so we can debug
if ($response == false) {
  echo "Failed to make contact with Worldpay! Check everything man!";
} else {
  echo $response;
}

?>
