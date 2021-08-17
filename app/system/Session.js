Ext.define('App.system.Session', {
	extend : 'App.cmp.Window',
	title : 'Login - Session Has Expired.',
	closable : false,
	id:'session',
	modal : true,
	iconCls: 'fa fa-user',
	closeAction:'destroy',
	fbar: [{
		text: 'Login',
		iconCls:'fa fa-user',
		id:'a8.input.btnLogin',
		handler: function() {
			var param={username:Ext.getCmp('session.f1').getValue(),password:Ext.getCmp('session.f2').getValue()}
			Ext.getCmp('session').setLoading('Check Login');
			Ext.Ajax.request({
				url : url + 'fn/login/login',
				method : 'POST',
				params:param,
				success : function(response) {
					Ext.getCmp('session').setLoading(false);
					var r = ajaxSuccess(response);
					if (r.r == 'S') {
						if(_user_code != Ext.getCmp('session.f1').getValue()){location.replace(url+'cpanel?session='+r.d);}
						storage_auth();
						_session_id=r.d;
						window.history.pushState({canBeAnything:true},"Ayam",url+'cpanel?session='+r.d);
						Ext.getCmp('session').close();
						for(var i=0,iLen=_listAjaxSession.length; i<iLen;i++){Ext.Ajax.request(_listAjaxSession[i].request.options);}
						_listAjaxSession=[];
						_execAjaxSession=false;
					}
				},
				failure : function(jqXHR, exception) {
					Ext.getCmp('session').setLoading(false);
					ajaxError(jqXHR, exception);
				}
			});
		}
	},{
		text: 'Halaman Login',
		iconCls:'fa fa-file-o',
		handler: function() {Ext.getCmp('main.confirm').confirm({msg : 'Apakah Kamu Ingin Ke Halaman Login?',onY : function(){location.replace(url+'admin');}});}
	}],
	initComponent:function(){
		var $this=this;
		$this.items=[
			Ext.create('IPanel',{
				bodyStyle : 'padding: 5px 10px',
				width: 350,
				items:[
					{
						xtype:'itextfield',
						fieldLabel:'Username',
						id:'session.f1',
						press:{enter:function(){_click('a8.input.btnLogin');}},
						allowBlank: false
					},{
						xtype:'itextfield',
						fieldLabel:'Password',
						inputType: 'password' ,
						press:{enter:function(){_click('a8.input.btnLogin');}},
						id:'session.f2',
						allowBlank: false
					}
				]
			})
		]
		$this.callParent();
	}
});