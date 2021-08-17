Ext.Ajax.request({
	url : url + 'cmd?m=PROFILE&f=getProfile',
	params:{i:_employee_id},
	method : 'GET',
	before:function(){Ext.getCmp('PROFILE.main').setLoading('Loading...');},
	success : function(response) {
		Ext.getCmp('PROFILE.main').setLoading(false);
		var r = ajaxSuccess(response);
		if (r.r == 'S') {
			var o=r.d.o;
			Ext.getCmp('PROFILE.foto').initial=o.f2+' '+o.f3+' '+o.f4;
			if(o.f15 != undefined)
				Ext.getCmp('PROFILE.foto').setFoto(o.f15);
			else
				Ext.getCmp('PROFILE.foto').setNull();
			Ext.getCmp('PROFILE.number').setReadOnly(true);
			Ext.getCmp('PROFILE.panel').qReset();
			Ext.getCmp('PROFILE.number').setValue(o.f1);
			Ext.getCmp('PROFILE.firstName').setValue(o.f2);
			Ext.getCmp('PROFILE.secondName').setValue(o.f3);
			Ext.getCmp('PROFILE.lastName').setValue(o.f4);
			Ext.getCmp('PROFILE.gender').setValue(o.f5);
			Ext.getCmp('PROFILE.religion').setValue(o.f6);
			Ext.getCmp('PROFILE.birthPlace').setValue(o.f7);
			Ext.getCmp('PROFILE.birthDate').setValue(o.f8);
			Ext.getCmp('PROFILE.address').setValue(o.f9);
			Ext.getCmp('PROFILE.email').setValue(o.f10);
			Ext.getCmp('PROFILE.phone1').setValue(o.f11);
			Ext.getCmp('PROFILE.phone2').setValue(o.f12);
			Ext.getCmp('PROFILE.fax1').setValue(o.f13);
			Ext.getCmp('PROFILE.fax2').setValue(o.f14);
			Ext.getCmp('PROFILE.pid').setValue(_employee_id);
			Ext.getCmp('PROFILE.panel').qSetForm();
		}
	},
	failure : function(jqXHR, exception) {
		Ext.getCmp('PROFILE.main').setLoading(false);
		ajaxError(jqXHR, exception,true);
	}
});