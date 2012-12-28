<?php

function getPostJSON() {
    $post_body = file_get_contents('php://input');
    return json_decode($post_body);
}

?>
