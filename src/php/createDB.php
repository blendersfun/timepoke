<?php

$dbLocation = "../store/timepokeDB";
$dbDir = "../db/";
$tables = array(
    "users.sql",
    "activities.sql",
    "sessions.sql",
    "notes.sql"
);

function action_destroyDB() {
    $result = destroyDB();
    if ($result == true) {
        echo json_encode(array( "success" => true ));
    }
    else {
        echo json_encode(array( "error" => $result ));
    }
}

function createOrOpenDB() {
    
    global $dbLocation, $dbDir, $tables;

    // open the db
    $error = "";
    $dbref = @sqlite_open($dbLocation, 0777, $error);
    if (!$dbref) {
        echo json_encode(array( "error" => $error ));
        return false;
    }
    $query = "SELECT name FROM sqlite_master WHERE type='table';";
    $result = sqlite_array_query($dbref, $query);
    $tableCount = count($result);
    
    // if no tables exist, create the schema
    if ($tableCount == 0) {
        foreach ($tables as $table) {
            $query = file_get_contents($dbDir . $table);
            $result = sqlite_array_query($dbref, $query);
        }
    }
    
    return $dbref;
}

function destroyDB() {
    global $dbLocation;
    
    $fh = fopen($dbLocation,'w');
    fclose($fh);
    return true;
}

?>
