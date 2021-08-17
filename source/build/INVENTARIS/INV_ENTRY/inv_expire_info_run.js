if(_access('INV_EXPIRE_INFO_show_alert')==false){
	Ext.Ajax.request({
		url : url + 'cmd?m=INV_EXPIRE_INFO&f=getMinStok',
		method : 'GET',
		success : function(response) {
			var r = ajaxSuccess(response);
			if (r.r == 'S') {
				var o=r.d;
				if(r.d>0){
					_notice('INV_EXPIRE_INFO',r.d);
					_notif('Barang Expired','Terdapat Barang Expired.');
				}
			}
		},
		failure : function(jqXHR, exception) {
			ajaxError(jqXHR, exception,true);
		}
	});
}