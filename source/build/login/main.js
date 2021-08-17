/*
	import cmp.ipanel
*/
new Ext.Panel({
	layout:{
		type:'vbox',
		align:'center',
		pack: "center",
	},
	border:false,
	bodyStyle:"background-image: url('"+url+"vendor/images/bg-big.png'),url('"+url+"vendor/images/bg-big-bottom.png');background-position: left top, right bottom;background-repeat: no-repeat, no-repeat;",
	items:[
		{
			xtype:'panel',
			title : 'Login - '+_tenant_name,
			id:'LOGIN',
			width:iif((window.innerWidth || document.body.clientWidth)<350,window.innerWidth || document.body.clientWidth,350),
			bodyStyle:"padding: 10px 30px 30px 30px;background-image: url('"+url+"vendor/images/bg-big.png'),url('"+url+"vendor/images/bg-big-bottom.png');background-position: left top, right bottom;background-repeat: no-repeat, no-repeat;",
			items:[
				{
					xtype:'ipanel',
					bodyStyle : 'background:transparent !important;',
					style:'background:transparent !important;',
					layout:'form',
					fbar: [
						{
							text: 'Login',
							iconCls:'fa fa-user',
							id:'LOGIN.btnLogin',
							handler: function() {
								var param={username:Ext.getCmp('LOGIN.f1').getValue(),password:Ext.getCmp('LOGIN.f2').getValue()};
								Ext.getCmp('LOGIN').setLoading(true);
								Ext.Ajax.request({
									url : url + 'fn/login/login',
									method : 'POST',
									params:param,
									success : function(response) {
										var r = ajaxSuccess(response);
										if (r.r == 'S') {
											// location.replace(url+'cpanel?session='+r.d);
											location.replace(url+'page/'+r.d);
										}else{
											Ext.getCmp('LOGIN').setLoading(false);
										}
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('LOGIN').setLoading(false);
										ajaxError(jqXHR, exception);
									}
								});
							}
						}
					],
					items:[
						{
							html:"<div style='width: 100px;height: 100px;background-image: url("+url+"upload/"+_tenant_logo+");background-size: 100px 100px;margin:auto;'></div>",
							bodyStyle : 'background:transparent !important;',
							style:'background:transparent !important;',
							border:false
						},{
							xtype:'itextfield',
							labelAlign:'top',
							selectOnFocus: true,
							emptyText:'Username',
							id:'LOGIN.f1',
							press:{enter:function(){_click('LOGIN.btnLogin');}},
							allowBlank: false
						},{
							xtype:'itextfield',
							labelAlign:'top',
							emptyText:'Password',
							inputType: 'password' ,
							press:{enter:function(){_click('LOGIN.btnLogin');}},
							id:'LOGIN.f2',
							allowBlank: false
						}
					]
				}
			]
		}
	]
});