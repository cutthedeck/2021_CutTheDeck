
<?php
  //Local Server Information

$host = "s-cdbr-east-03.cleardb.com";
$db = "heroku_db7456015fa7985";
$user = "b22b4e7921bc73";
$pass = "7c90e440";

  //Check if connection was successful
  try {
    $handle = new PDO("mysql:host=$host;dbname=$db", "$username", "$password");
    $handle->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "connected";
  } catch(PDOException $e) {
    die("Oops. Something went wrong in the database.");
  }
  // tables in database are Stats, user, categories
?>
