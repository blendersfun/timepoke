<?php

require_once("common.php");
require_once("createDB.php");

function action_login () {
    $dbref = createOrOpenDB();
    $input = getPostJSON();
    
    $user = $input->user;
    $passHash = md5($input->pass);
    $passed = check_credentials($dbref, $user, $passHash);
    
    sqlite_close($dbref);
    $json_result = array( "loginResult" => $passed );
    if ($passed) {
        $json_result["user"] = $user;
        $json_result["passHash"] = $passHash;
    }
    echo json_encode($json_result);
}

function action_create_user_and_login () {
    $dbref = createOrOpenDB();
    $input = getPostJSON();
    
    $user = $input->user;
    $passHash = md5($input->pass);
    
    // try to find username
    $query = "select * from users where username = '$user'";
    $result = sqlite_array_query($dbref, $query);
    //print_r($result);
    $resultCount = count($result);
    
    if ($resultCount == 0) {
        $query = "insert into users (username, password) values ('$user', '$passHash')";
        $result = sqlite_array_query($dbref, $query);
        //print_r($result);
        
        $passed = check_credentials($dbref, $user, $passHash);
        if (!$passed) {
            sqlite_close($dbref);
            echo json_encode(array( "error" => "USER_CREATE_FAIL" ));
            return;
        }
    }
    else {
        sqlite_close($dbref);
        echo json_encode(array( "error" => "USER_EXISTS" ));
        return;
    }
    
    sqlite_close($dbref);
    $json_result = array( "loginResult" => $passed );
    if ($passed) {
        $json_result["user"] = $user;
        $json_result["passHash"] = $passHash;
    }
    echo json_encode($json_result);
}

function action_check_cached_credentials () {
    $dbref = createOrOpenDB();
    $passed = check_cached_credentials($dbref);
    
    echo json_encode(array( "passed" => $passed ));
}

function check_cached_credentials ($dbref) {
    $user = $_COOKIE["user"];
    $passHash = $_COOKIE["passHash"];
    
    return check_credentials($dbref, $user, $passHash);
}

function check_credentials ($dbref, $user, $passHash) {
    $query = "select * from users where username = '$user' and password = '$passHash'";
    $result = sqlite_array_query($dbref, $query);
    $resultCount = count($result);
    
    return $resultCount == 1;
}

?>
