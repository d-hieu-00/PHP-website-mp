<?php

class userModel extends database{
    public function test(){
        $this->Query("call createUser");
    }
}

?>