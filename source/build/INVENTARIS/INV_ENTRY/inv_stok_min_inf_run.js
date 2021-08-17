if(_access('INV_STOK_MIN_INF_show_alert')==false){
	Ext.Ajax.request({
		url : url + 'cmd?m=INV_STOK_MIN_INF&f=getMinStok',
		method : 'GET',
		success : function(response) {
			var r = ajaxSuccess(response);
			if (r.r == 'S') {
				var o=r.d;
				if(r.d>0){
					_notice('INV_STOK_MIN_INF',r.d);
					_notif('Minimal Stok','Terdapat Barang di bawah Minimal Stok.');
				}
			}
		},
		failure : function(jqXHR, exception) {
			ajaxError(jqXHR, exception,true);
		}
	});
}