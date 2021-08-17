<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed'); 
class Session {
    public function __construct() {
		ini_set('session.gc_maxlifetime',(86400*30));
		session_set_cookie_params((86400*30));
		session_start();}
    public function set( $key, $value ) {$_SESSION[$key] = $value;return $this;}
    public function get( $key ){return isset( $_SESSION[$key] ) ? $_SESSION[$key] : null;}
    public function regenerateId( $delOld = false ){session_regenerate_id( $delOld );return $this;}
    public function delete( $key ){unset( $_SESSION[$key] );return $this;}
}
?>