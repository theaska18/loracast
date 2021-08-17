<?php
if (! defined ('BASEPATH'))exit ('No direct script access allowed');
class Jsonresult {
	public $r = 'S', $m = '', $t = 0, $d = array ();
	public function error() {$this->r = 'E';return $this;}
	public function warning() {$this->r = 'W';return $this;}
	public function privilege() {$this->r = 'P';return $this;}
	public function session() {$this->r = 'F';return $this;}
	public function setMessage($message) {$this->m = $message;return $this;}
	public function setMessageSave($string1, $string2) {$this->m = $string1 . " '" . $string2 . "' Successfully Saved.";return $this;}
	public function setMessageEdit($string1, $string2) {$this->m = $string1 . " '" . $string2 . "' Successfully Updated. ";return $this;}
	public function setMessageDelete($string1, $string2) {$this->m = $string1 . " '" . $string2 . "' Successfully Deleted. ";return $this;}
	public function setMessageExist($string1, $string2) {$this->m = $string1 . " '" . $string2 . "' Not Found.";return $this;}
	public function setMessageNotExist() {$this->m = 'Data Not Found.';return $this;}
	public function setData($data) {$this->d = $data;return $this;}
	public function setTotal($data) {$this->t = $data;return $this;}
	public function end() {
		if($this->r=='S'){echo json_encode ( $this );}
		else{
			if (strtolower(filter_input(INPUT_SERVER, 'HTTP_X_REQUESTED_WITH')) === 'xmlhttprequest') {echo json_encode ( $this );
			}else{if($this->m !=''){echo $this->m;}else{echo 'Error.';}}
		}
		exit ();
	}
}
?>