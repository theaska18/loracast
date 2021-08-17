<?php
function initLogout_allow(){
	if(_this()->pagesession->cek()){
		$session=_this()->pagesession->get();
		$id=$session->user_id;
		_this()->query->set("UPDATE app_user SET login_flag=false WHERE user_id=".$id);
		$session->destroy();
	}
	_this()->jsonresult->end();
}