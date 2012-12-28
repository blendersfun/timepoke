<?php

require_once('login.php');
require_once('createDB.php');

/*
 * The ajax interface.
 */

// from: http://www.dzone.com/snippets/php-headers-serve-json
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');

switch ($_GET['action']) {
case 'login': action_login(); break;
case 'createUserAndLogin': action_create_user_and_login(); break;
case 'checkCachedCredentials': action_check_cached_credentials(); break;
case 'destroyDB': action_destroyDB(); break;
default:
    echo json_encode(array( "foo" => "No action found" ));
}

?>
