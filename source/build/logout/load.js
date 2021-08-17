Ext.getCmp('main.confirm').confirm({
	msg : 'Apakah Akan Keluar Dari Halaman?',
	onY : function() {
		Ext.getBody().mask('Keluar Dari Halaman');
		Ext.Ajax.request({
			url : url + 'cmd?m=LOGOUT&f=initLogout&a=t',
			method : 'GET',
			success : function(response) {
				location.replace(url);
			},
			failure : function(jqXHR, exception) {
				location.replace(url);
			}
		});
	}
});
return false;