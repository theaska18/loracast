Ext.Ajax.request({
	url : url + 'cmd?m=SETTING&f=getTenant',
	method : 'GET',
	before:function(){
		Ext.getCmp('SETTING.panel').setLoading(true);
	},
	success : function(response) {
		Ext.getCmp('SETTING.panel').setLoading(false);
		var r = ajaxSuccess(response);
		if (r.r == 'S') {
			Ext.getCmp('SETTING.f1').setValue(r.d.tenant_id);
			Ext.getCmp('SETTING.f2').setValue(r.d.tenant_name);
			Ext.getCmp('SETTING.f3').setValue(r.d.tenant_desc);
			Ext.getCmp('SETTING.f4').setValue(r.d.address);
			Ext.getCmp('SETTING.f5').setValue(r.d.city);
			Ext.getCmp('SETTING.f6').setValue(r.d.phone_number);
			Ext.getCmp('SETTING.f7').setValue(r.d.fax_number);
			Ext.getCmp('SETTING.f8').setFoto(r.d.logo);
			Ext.getCmp('SETTING.f2').focus();
			Ext.getCmp('SETTING.panel').qSetForm()
		}
	},
	failure : function(jqXHR, exception) {
		Ext.getCmp('SETTING.panel').setLoading(false);
		ajaxError(jqXHR, exception);
	}
});